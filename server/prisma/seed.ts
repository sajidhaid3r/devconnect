import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      username: "alice_dev",
      passwordHash,
      fullName: "Alice Sharma",
      bio: "Full-stack developer. React + Node.",
      location: "Bengaluru, India",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      username: "bob_codes",
      passwordHash,
      fullName: "Bob Verma",
      bio: "Backend engineer. PostgreSQL enthusiast.",
      location: "Pune, India",
    },
  });

  const reactSkill = await prisma.skill.upsert({ where: { name: "React" }, update: {}, create: { name: "React" } });
  const nodeSkill = await prisma.skill.upsert({ where: { name: "Node.js" }, update: {}, create: { name: "Node.js" } });

  await prisma.userSkill.upsert({
    where: { userId_skillId: { userId: alice.id, skillId: reactSkill.id } },
    update: {},
    create: { userId: alice.id, skillId: reactSkill.id },
  });
  await prisma.userSkill.upsert({
    where: { userId_skillId: { userId: bob.id, skillId: nodeSkill.id } },
    update: {},
    create: { userId: bob.id, skillId: nodeSkill.id },
  });

  const existingProject = await prisma.project.findFirst({
    where: { ownerId: alice.id, title: "DevConnect" },
  });
  if (!existingProject) {
    await prisma.project.create({
      data: {
        ownerId: alice.id,
        title: "DevConnect",
        description: "Developer networking & portfolio platform — my internship final project.",
        techStack: ["React", "Node.js", "PostgreSQL", "Prisma"],
        repoUrl: "https://github.com/example/devconnect",
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "building-realtime-notifications-abc12" },
    update: {},
    create: {
      authorId: alice.id,
      title: "Building a Real-Time Notification System with Socket.io",
      slug: "building-realtime-notifications-abc12",
      contentMarkdown: "## Intro\n\nHow I wired up Socket.io for connection & endorsement notifications...",
      excerpt: "How I wired up Socket.io for connection & endorsement notifications.",
      published: true,
    },
  });

  console.log("Seed complete:", { alice: alice.username, bob: bob.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# DevConnect — Database Schema

Entity-relationship overview (see `server/prisma/schema.prisma` for the full source of truth).

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ BLOGPOST : writes
    USER ||--o{ USERSKILL : has
    SKILL ||--o{ USERSKILL : "listed in"
    USER ||--o{ ENDORSEMENT : gives
    USER ||--o{ ENDORSEMENT : receives
    SKILL ||--o{ ENDORSEMENT : "endorsed for"
    USER ||--o{ CONNECTION : requests
    USER ||--o{ CONNECTION : "is requested by"
    USER ||--o{ NOTIFICATION : receives

    USER {
        string id PK
        string email UK
        string username UK
        string passwordHash
        string githubId UK
        string fullName
        string bio
        string avatarUrl
        string location
    }
    PROJECT {
        string id PK
        string ownerId FK
        string title
        string description
        string techStack
        string repoUrl
        string liveUrl
    }
    BLOGPOST {
        string id PK
        string authorId FK
        string title
        string slug UK
        string contentMarkdown
        boolean published
    }
    SKILL {
        string id PK
        string name UK
    }
    USERSKILL {
        string id PK
        string userId FK
        string skillId FK
    }
    ENDORSEMENT {
        string id PK
        string skillId FK
        string fromUserId FK
        string toUserId FK
    }
    CONNECTION {
        string id PK
        string requesterId FK
        string addresseeId FK
        string status
    }
    NOTIFICATION {
        string id PK
        string userId FK
        string type
        boolean read
    }
```

**Key design decisions:**
- `Endorsement` has a unique constraint on `(skillId, fromUserId, toUserId)` — one endorsement per skill per pair.
- `Connection` has a unique constraint on `(requesterId, addresseeId)` and a `status` enum (`PENDING`/`ACCEPTED`/`REJECTED`), so duplicate requests are rejected at the database layer, not just in application code.
- `Project.techStack` is a native Postgres array column (no join table needed for a simple tag list).
- Cascading deletes (`onDelete: Cascade`) mean deleting a user cleans up their projects, posts, endorsements, connections, and notifications automatically.

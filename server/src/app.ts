import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import blogRoutes from "./routes/blogRoutes";
import connectionRoutes from "./routes/connectionRoutes";
import skillRoutes from "./routes/skillRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Sanitize CLIENT_ORIGIN to strip trailing slashes or whitespace
const allowedOrigin = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .trim()
  .replace(/\/$/, "");

// Security baseline
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

const isDev = process.env.NODE_ENV !== "production";

// General API limiter — skip in dev to avoid friction during local development
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isDev ? 10_000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
});
app.use("/api", apiLimiter);

// Tighter auth limiter — skip in dev entirely
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isDev ? 10_000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: { success: false, data: null, message: "Too many auth attempts. Try again later." },
});
app.use(["/api/auth/login", "/api/v1/auth/login"], authLimiter);
app.use(["/api/auth/register", "/api/v1/auth/register"], authLimiter);

// Health check
const healthHandler = (_req: express.Request, res: express.Response) =>
  res.json({ success: true, data: { status: "up" }, message: "DevConnect API" });

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);
app.get("/api/v1/health", healthHandler);

// API Routers (mounted under /api and /api/v1 for full client & spec compatibility)
const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/blog", blogRoutes);
apiRouter.use("/connections", connectionRoutes);
apiRouter.use("/skills", skillRoutes);
apiRouter.use("/notifications", notificationRoutes);
apiRouter.use("/dashboard", dashboardRoutes);

app.use("/api", apiRouter);
app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;


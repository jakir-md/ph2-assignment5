import expressSession from "express-session";
import express, { Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { EnvVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFoundHandler";
import { router } from "./app/routes";

const app = express();

app.use(
  expressSession({
    secret: EnvVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: EnvVars.FRONT_END_URL,
    credentials: true,
  })
);
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to digiWallet.",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

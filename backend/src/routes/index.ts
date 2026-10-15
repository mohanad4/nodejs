import { Router } from "express";
import authRouter from "./Auth";

import UsersRouter from "./users";

// Every router mounted here is served under /api (see app.ts)
const apiRouter = Router();

apiRouter.use("/users", UsersRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;

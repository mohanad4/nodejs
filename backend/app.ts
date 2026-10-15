import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./src/middleware/errorHandler";
import { notFound } from "./src/middleware/notFound";
import apiRouter from "./src/routes";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 7000;
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.set("etag", false);


// Must come after all routes: notFound catches unmatched URLs, errorHandler catches thrown errors
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is xrunning on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./src/middleware/error.middleware.js";

import dataroutes from "./src/routes/data.routes.js";
import reportroutes from "./src/routes/report.routes.js";
import aianalizeroutes from "./src/routes/ai.routes.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/api/data", dataroutes);
app.use("/api/report", reportroutes);
app.use("/api/ai", aianalizeroutes);

app.get("/", (req, res) => {
  res.send("scamShield service is running");
});

app.use(errorHandler);

export default app;

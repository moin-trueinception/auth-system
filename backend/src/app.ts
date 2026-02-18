import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {setupSwagger} from "./config/swager";
import authRoute from "./routes/authRoute";
import profileRoute from "./routes/profileRoute";   
import { setup } from "swagger-ui-express";

dotenv.config();

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

export default app;
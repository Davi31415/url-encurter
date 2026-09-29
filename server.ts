import express, { type Request, type Response } from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(routes)

app.listen(port, () => {
  console.log(`carroça rodando na porta ${port}`);
});

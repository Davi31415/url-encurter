import express, { type Request, type Response } from "express";
import pool from "./db.js";
import generateShortCode from "./random_pass.js";
import type { RowDataPacket } from "mysql2/promise";

const app = express();
const routes = express.Router();

interface UrlRow extends RowDataPacket {
  long_url: string;
  short_url: string;
}

routes.post("/shorten", async (req: Request, res: Response) => {
  const { url } = req.body;

  const [rows1] = await pool.query<UrlRow[]>("SELECT * FROM urls WHERE long_url = ?", [url]);
  const urlexist = rows1[0];
  if (urlexist) {
    return res.status(400).json({ message: "URL já está registrada no banco!", short_url: urlexist.short_url });
  }

  const shortCode = generateShortCode();
  const [rows2] = await pool.query<UrlRow[]>("SELECT * FROM urls WHERE short_url = ?", [shortCode]);
  if (rows2.length > 0) {
    return res.status(500).json({ message: "Colisão de código curto, muito raro! Tente novamente." });
  }
  
  await pool.query("INSERT INTO urls (long_url, short_url) VALUES (?, ?)", [url, shortCode]);

  return res.status(201).json({ message: "URL encurtada com sucesso!", short_url: shortCode });
});

routes.get("/redirect/:short_url", async (req: Request, res: Response) => {
  const { short_url } = req.params;
  const [rows] = await pool.query<UrlRow[]>("SELECT * FROM urls WHERE short_url = ?", [short_url]);
  const url_coisada = rows[0];
  if (url_coisada) {
    return res.redirect(url_coisada.long_url);
  }
  return res.status(404).json({ message: "URL não encontrada." });
});

export default routes;
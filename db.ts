import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error("Algumas variáveis de ambiente do banco de dados não estão definidas. Por favor, verifique o arquivo .env.");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
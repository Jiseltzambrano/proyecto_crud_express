import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const puerto = process.env.MIPUERTO || 3003;

app.get("/", (req, res) => {
    res.send("API Rest Full con express");
});

app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
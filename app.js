import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const puerto = process.env.MIPUERTO || 3003;
// Middleware body-parce
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API Rest Full con express");
});

app.get("/api/aprendices", (req, res) => {
    res.status(200).json({'Mensaje': 'Lista Aprendices'})
})

app.post("/api/aprendices", (req, res) => {
    const datosaprendiz  = req.body;
    const edad = req.body.edad;
    if(edad < 18){
        return res.status(400).json({'Mensaje': "El aprendiz es menor de edad"})
    }
    else if(edad >= 18){
        return res.status(400).json({'Mensaje': "El aprendiz es mayor de edad"})
    }
    
    res.status(201).json({'Mensaje': "crear aprendiz",datos: datosaprendiz})
    
})

app.put("/api/aprendices/:id", (req, res) => {
    res.status(200).json({'Mensaje': 'Actualizar Aprendiz'})
})

app.delete("/api/aprendices", (req, res) => {
    res.status(200).json({'Mensaje': 'Eliminado'})
})



app.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
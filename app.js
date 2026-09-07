const express = require ('express');
require ('dotenv').config();

// Middleware body-parce
const sistemaArchivo = require("fs")
const ruta = require ("path")          
//importar multer
const multer = require("multer")
//almacenamiento 
const almacen = multer.diskStorage({
    destination:(req,file,cb)=>{cb(null, "misimagenes/")},
    filename:(req,file,cb)=>{
        const extension = ruta.extname(file.originalname)
        cb(null, `${Date.now()}${extension}`)
    }
})
const subir = multer({storage: almacen});
const app = express();
const puerto = process.env.MIPUERTO || 3003;
app.use(express.json())
app.use(express.urlencoded({extended : true}))
const rutaMiArchivo = ruta.join(__dirname,"datos.json")

app.use(express.json());
app.get("/", (req, res) => {
    res.send("API Rest Full con express");
});

app.get("/api/aprendices", (req, res) => {
    //res.status(200).json({'Mensaje': 'Lista Aprendices'})+
        sistemaArchivo.readFile(rutaMiArchivo,"utf-8",(error, datos) => {
        if (error) res.status(500).json({mensaje:"No se puede leer el archivo"})
        else{
            const listaAprendices = JSON.parse(datos)
            res.status(200).json({Listado: listaAprendices})
        }
    })
})

app.post("/api/aprendices", subir.single("imagen"), (req, res) => {
       const datosAprendiz = req.body 
       datosAprendiz.imagen = req.file? `/misimagenes/${req.file.filename}`: "sin imagen"
        sistemaArchivo.readFile(rutaMiArchivo,"utf-8",(error, datos) => {
        if (error) res.status(500).json({mensaje:"No se puede leer el archivo"})
            const listaAprendices = JSON.parse(datos)
    
        listaAprendices.push(datosAprendiz)

        sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2),(error)=>{
         if (error) res.status(500).json({error:"no se pueden escribir en file"})
        res.status(200).json({mensaje: "creado", Datos : datosAprendiz})
        })
    })
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
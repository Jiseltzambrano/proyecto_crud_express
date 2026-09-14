const express = require('express');
const app = express();
const port = process.env.MIPUERTO || 3003; 
//importar mis midellaware
const registromidelware = require("./middleware/registromiddleware")
// Librería fs y path
const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaMiArchivo = ruta.join(__dirname, "datos.json");

// Importar middleware de validaciones
const { validarAprendiz } = require("./validaciones/validaciones");

// Importar y configurar multer
const multer = require("multer");
const manejadorErrores = require('./middleware/manejadoErrores');
const almacen = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, "misImagenes/");
  },
  filename: (req, file, cb) => {
    const extension = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});
const subir = multer({ storage: almacen });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//usar nuestro midellware
app.use(registromidelware)
app.use(manejadorErrores)
app.use('/misImagenes', express.static(ruta.join(__dirname, 'misImagenes')));

// GET: Obtener todos los aprendices
app.get('/api/aprendices', (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos) => {
    if (error) return res.status(500).json({ error: "No se puede leer el archivo" });
    const listaAprendices = JSON.parse(Datos);
    res.status(200).json({ Listado: listaAprendices });
  });
});

// POST: Crear un aprendiz (ID autoincremental iniciando en 1)
app.post('/api/aprendices', subir.single("imagen"), validarAprendiz, (req, res) => {
  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos) => {
    if (error) return res.status(500).json({ error: "No se puede leer el archivo" });
    
    const listaAprendices = JSON.parse(Datos);

    // Si la lista tiene elementos, toma el id del último registro y le suma 1; si está vacía, empieza en 1
    const nuevoId = listaAprendices.length > 0 
      ? Number(listaAprendices[listaAprendices.length - 1].id || 0) + 1 
      : 1;

    // Crear el nuevo objeto aprendiz
    const nuevoAprendiz = {
      id: nuevoId,
      nombre: req.body.nombre,
      edad: Number(req.body.edad),
      correo: req.body.correo,
      clave: String(Math.floor(10000 + Math.random() * 90000)), // Clave aleatoria de 5 dígitos
      imagen: req.file ? `/misImagenes/${req.file.filename}` : "sin Imagen"
    };

    listaAprendices.push(nuevoAprendiz);
    
    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
      if (error) return res.status(500).json({ error: "No se puede escribir en el archivo" });
      res.status(201).json({ Mensaje: "Creado", Datos: nuevoAprendiz });
    });
  });
});

// PUT: Actualizar por ID
app.put('/api/aprendices/:id', subir.single("imagen"), (req, res) => {
  const idBuscado = Number(req.params.id);

  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos) => {
    if (error) return res.status(500).json({ error: "No se puede leer el archivo" });

    let listaAprendices = JSON.parse(Datos);
    const indice = listaAprendices.findIndex(item => Number(item.id) === idBuscado);

    if (indice === -1) {
      return res.status(404).json({ error: "Aprendiz no encontrado con ese ID" });
    }

    const aprendizActual = listaAprendices[indice];

    listaAprendices[indice] = {
      id: aprendizActual.id, // Conserva el ID original
      nombre: req.body.nombre || aprendizActual.nombre,
      edad: req.body.edad ? Number(req.body.edad) : aprendizActual.edad,
      correo: req.body.correo || aprendizActual.correo,
      clave: aprendizActual.clave, // Conserva la clave original
      imagen: req.file ? `/misImagenes/${req.file.filename}` : aprendizActual.imagen
    };

    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaAprendices, null, 2), (error) => {
      if (error) return res.status(500).json({ error: "No se puede escribir en el archivo" });
      res.status(200).json({ Mensaje: "Aprendiz actualizado", Datos: listaAprendices[indice] });
    });
  });
});

// DELETE: Eliminar por ID
app.delete('/api/aprendices/:id', (req, res) => {
  const idBuscado = Number(req.params.id);

  sistemaArchivo.readFile(rutaMiArchivo, "utf-8", (error, Datos) => {
    if (error) return res.status(500).json({ error: "No se puede leer el archivo" });

    let listaAprendices = JSON.parse(Datos);
    const listaFiltrada = listaAprendices.filter(item => Number(item.id) !== idBuscado);

    if (listaAprendices.length === listaFiltrada.length) {
      return res.status(404).json({ error: "Aprendiz no encontrado con ese ID" });
    }

    sistemaArchivo.writeFile(rutaMiArchivo, JSON.stringify(listaFiltrada, null, 2), (error) => {
      if (error) return res.status(500).json({ error: "No se puede escribir en el archivo" });
      res.status(200).json({ Mensaje: "Aprendiz eliminado exitosamente" });
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:${port}`);
});
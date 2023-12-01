var rutasObra = require("express").Router();
var {
  mostrarObras,
  nuevaObra,
  borrarObra,
  modificarObra,
  buscarObraPorID,
  llamarDatosObra,
  calificarObra, 
  buscarObra,
  obtenerCalificacionActual,
  obtenerIdObraActual
  
} = require("../BD/obrasBD");
var subirArchivo = require("../middlewares/subirArchivo");
var fs = require("fs");
var { autorizado, admin } = require("../middlewares/funcionesPassword");
const obras = require("../modelos/obras");
const obrasController = require('../controladores/obrasController');
const { mostrarComentariosPorId, nuevoComentario } = require("../BD/comentariosBD");


rutasObra.get("/mostrarobras", async (req, res) => {
    try {
      const obrasSnapshot = await mostrarObras();
      const tipo = req.session.usuario || undefined;
      res.status(200).json({ obrasSnapshot, tipo });
    } catch (error) {
      console.error("Error al obtener las obras:", error);
      res.status(500).json("Error interno del servidor");
    }
  });
  
  // Ruta para crear una nueva obra
  rutasObra.post("/nuevaobra", subirArchivo(), async (req, res) => {
    try {
      req.body.foto = req.file.originalname;
      const error = await nuevaObra(req.body);
      if (error === 0) {
        res.status(200).json("Obra registrada");
      } else {
        res.status(400).json("Error al registrar la obra");
      }
    } catch (error) {
      console.error("Error al crear una nueva obra:", error);
      res.status(500).json("Error interno del servidor");
    }
  });
  
  // Ruta para editar una obra
  rutasObra.post("/editarObra", subirArchivo(), async (req, res) => {
    try {
      const obraAct = await buscarObraPorID(req.body.id);
      if (req.file) {
        req.body.foto = req.file.originalname;
        if (obraAct.foto) {
          const rutaFotoAnterior = `web/images/${obraAct.foto}`;
           fs.unlinkSync(rutaFotoAnterior); 
        }
      }
      const error = await modificarObra(req.body);
      if (error === 0) {
        res.status(200).json("Obra actualizada");
      } else {
        res.status(400).json("Error al actualizar la obra");
      }
    } catch (error) {
      console.error("Error al editar obra:", error);
      res.status(500).json("Error interno del servidor");
    }
  });
  
  // Ruta para borrar una obra por su ID
  rutasObra.get("/borrarObra/:id", async (req, res) => {
    try {
      const obra = await buscarObraPorID(req.params.id);
      if (obra) {
        const foto = obra.foto;
        fs.unlinkSync(`web/images/${foto}`); 
        await borrarObra(req.params.id);
      }
      res.status(200).json("Obra eliminada");
    } catch (error) {
      console.error("Error al borrar obra:", error);
      res.status(500).json("Error interno del servidor");
    }
  });
  
  module.exports = router;
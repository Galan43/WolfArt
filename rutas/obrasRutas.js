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
const { mostrarComentariosPorId, nuevoComentario, mostrarComentarios } = require("../BD/comentariosBD");



rutasObra.get("/obras/mostrarobras", async (req, res) => {
    try {
    var obrasSnapshot = await mostrarObras();
    const tipo = req.session.usuario || undefined; 
    res.render("obras/mostrarObras", { obrasSnapshot, tipo });
    } catch (error) {
    console.error("Error al obtener las obras:", error);
    res.status(500).send("Error interno del servidor");
    }
});

rutasObra.get("/obras/donaciones", (req,res) => {
  res.render("obras/donaciones");
});

rutasObra.get("/obras/nuevaobra", admin, (req, res) => {
  res.render("obras/nuevaObra");
});

rutasObra.post("/obras/nuevaobra", subirArchivo(), async (req, res) => {
  req.body.foto = req.file.originalname;
  var error = await nuevaObra(req.body);  
  res.redirect("/obra/obras/mostrarobras");
});

rutasObra.get("/obras/editarObra/:id", async (req, res) => {
  var obra = await buscarObraPorID(req.params.id);
  res.render("obras/modificarObra", { obra });
});

rutasObra.post("/obras/editarObra", subirArchivo(), async (req, res) => {
  try {
    const obraAct = await buscarObraPorID(req.body.id);
    if (req.file) {
      req.body.foto = req.file.originalname;
      if (obraAct.foto) {
        const rutaFotoAnterior = `web/images/${obraAct.foto}`;
        fs.unlinkSync(rutaFotoAnterior);
      }
    }
    var error = await modificarObra(req.body);
    res.redirect("/obra/obras/mostrarobras");
  } catch (error) {
    console.error("Error al editar obra:", error);
    res.status(500).send("Error interno del servidor");
  }
});

rutasObra.get("/obras/borrarObra/:id", async (req, res) => {
  try {
    var obra = await buscarObraPorID(req.params.id);
    if (obra) {
      var foto = obra.foto;
      fs.unlinkSync(`web/images/${foto}`);
      await borrarObra(req.params.id);
    }
    res.redirect("/obra/obras/mostrarobras");
  } catch (error) {
    console.error("Error al borrar obra:", error);
    res.status(500).send("Error interno del servidor");
  }
});

rutasObra.get('/obras', async (req, res) => {
  try {
    const obras = await llamarDatosObra();
    const tipo = req.session.usuario || undefined; 
    res.render('pag/pag-obras', { obras, user: res.locals.user, tipo });
  } catch (error) {
    console.log('Error al obtener las obras: ' + error);
    res.status(500).send('Error al obtener las obras');
  }
});

rutasObra.get('/detallesobra/:id', async (req, res) => {
  const obraId = req.params.id;

  try {
    const obra = await buscarObraPorID(obraId);
    if (!obra) {
      res.status(404).send('Obra no encontrada');
      return;
    } 
    const usuarioId = req.session.usuarioId;
    const comentarios = await mostrarComentariosPorId(obraId);

    const tipo = req.session.usuario || undefined;
    res.render('pag/pag-detalles', { obra, comentarios, tipo, usuarioId }); 
  } catch (error) {
    console.error('Error al obtener los detalles de la obra: ' + error);
    res.status(500).send('Error al obtener los detalles de la obra');
  }
});

rutasObra.post("/buscarObra", async (req, res) => {
  try {
    const terminoBusqueda = req.body.search;
    console.log(terminoBusqueda);
    const obra = await buscarObra(terminoBusqueda);

    if (obra) {
      // Redirige a la página de detalles de la obra
      res.redirect(`/obra/detallesobra/${obra.id}`);
    } else {
      const error = "No se encontró la obra";
      console.error(error);
      res.status(404).send(`<script>alert("${error}"); window.location.href="/";</script>`);
    }
  } catch (err) {
    const error = "Error al buscar la obra";
    console.error(error);
    res.status(500).send(`<script>alert("${error}"); window.location.href="/";</script>`);
  }
});


rutasObra.post('/obras/calificar/:idObra', async (req, res) => {
  try {
    const idObra = req.params.idObra;
    const calificacion = req.body.calificacion;
    await calificarObra(idObra, calificacion, res);
      } catch (error) {
    console.error('Error al calificar la obra:', error);
    res.status(500).send('Error interno del servidor');
  }
});

rutasObra.post("/agregarComentario", autorizado, async (req, res) => {
  try {
    req.body.usuario = req.session.usuario;
    var error = await nuevoComentario(req.body);
    res.redirect(req.get('referer'));
  } catch (err) {  
    console.error("Error al agregar el comentario:", err);
    res.send(`<script>alert("${error}"); window.location.href="/obra/obras/";</script>`);
  }
});


rutasObra.get("/comentarios", admin, async (req, res) => {
  try {
    // Agregar un console.log para verificar el estado de los datos antes de la consulta
    console.log("Verificando datos antes de la consulta a Firestore:");
    const tipo = req.session.usuario || undefined; 
    const comentarios = await mostrarComentarios();
    console.log("Comentarios recuperados:", comentarios);


    res.render('obras/mostrarComentarios', { comentarios, tipo });
  } catch (err) {
    console.error('Error al recuperar comentarios:', err);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = rutasObra;

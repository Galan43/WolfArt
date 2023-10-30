var rutasObra = require("express").Router();
var {
  mostrarObras,
  nuevaObra,
  borrarObra,
  modificarObra,
  buscarObraPorID,
  llamarDatosObra
} = require("../BD/obrasBD");
var subirArchivo = require("../middlewares/subirArchivo");
var fs = require("fs");
var { autorizado, admin } = require("../middlewares/funcionesPassword");
const obras = require("../modelos/obras");

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
    res.redirect("/obra/obras/mostrarobra");
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
    res.redirect("/obra/obras/");
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
    const tipo = req.session.usuario || undefined;
    res.render('pag/pag-detalles', { obra, tipo });
  } catch (error) {
    console.error('Error al obtener los detalles de la obra: ' + error);
    res.status(500).send('Error al obtener los detalles de la obra');
  }
});



module.exports = rutasObra;

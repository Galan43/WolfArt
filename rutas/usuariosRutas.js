var ruta = require("express").Router();
var fs=require("fs");
var {  mostrarUsuarios, nuevoUsuario,buscarPorID, modificarUsuario,  borrarUsuario,buscarPorUsuario,verificarPassword} = require("../BD/usuariosBD");
var subirArchivo=require("../middlewares/subirArchivo")
var {autorizado, admin}=require("../middlewares/funcionesPassword")


ruta.get("/usuarios", autorizado, async (req, res) => {
  var tipo;
  var usuarios = await mostrarUsuarios();
  
  if (req.session.usuario) {
    tipo = req.session.usuario; 
    
    if (tipo === "admin") {
      res.render("usuarios/mostrarAdmin", { usuarios, tipo });
    } else {
      res.render("usuarios/mostrarUsuario", { usuarios, tipo });
    }
  } else {
    tipo = undefined;
    res.render("usuarios/mostrarUsuario", { usuarios, tipo });
  }
});


ruta.get("/nuevousuario", async (req, res) => {
  res.render("usuarios/nuevo");
});



ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
  req.body.foto=req.file.originalname;
  var error = await nuevoUsuario(req.body);
  res.redirect("/login");
});

ruta.get("/editar/:id", async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await buscarPorID(userId);
    
    if (!user) {
      console.error("Usuario no encontrado");
      res.status(404).send("Usuario no encontrado");
      return;
    }
    
    res.render("usuarios/modificar", { user }); 
  } catch (error) {
    console.error("Error al cargar la página de edición:", error);
    res.status(500).send("Error interno del servidor");
  }
});

ruta.post("/editar", subirArchivo(), async (req, res) => {
  try {
    const usuarioAct = await buscarPorID(req.body.id);
    if (req.file) {
      req.body.foto = req.file.originalname;

      if (usuarioAct.foto) {
        const rutaFotoAnterior = `web/images/${usuarioAct.foto}`;
        fs.unlinkSync(rutaFotoAnterior);
      } else {
        req.body.foto = req.body.fotoViejo;
      }
    }
    await modificarUsuario(req.body);
    res.redirect("/usuarios"); 
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});
// borrar usuario admin
ruta.get("/borrar/:id", async (req, res) => {
  var usuario=await buscarPorID(req.params.id)
  if(usuario){
  var foto= usuario.foto;
  fs.unlinkSync(`web/images/${foto}`);
  await borrarUsuario(req.params.id);
  }
  res.redirect("/usuarios");
});

// borrar usuarios --------------------------------
ruta.get("/borrarCuenta", async (req, res) => {
  const usuarioId = req.session.usuarioId;
  if (usuarioId) {
    res.render("pag/pag-borrarCuenta", { tipo: req.session.usuario, usuarioId });
    await borrarUsuario(req.params.id);
  } else {
    res.redirect("/login"); 
  }
});



ruta.get("/borrarCuenta/:id", async (req, res) => {
  const usuarioId = req.params.id;
  try {
    const usuario = await buscarPorID(usuarioId);
    if (usuario) {
      const foto = usuario.foto;
      if (foto) {
        fs.unlinkSync(`web/images/${foto}`);
        console.log("Imagen del usuario eliminada");
      }
      await borrarUsuario(usuarioId);
      res.redirect("/login");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al intentar borrar la cuenta:", error);
    res.status(500).send("Error al intentar borrar la cuenta");
  }
});


ruta.get("/renderizarMenuUsuarios", async (req, res) => {
  try {
    const tipo = req.session.usuario || undefined;
    const usuarioId = req.session.usuarioId; 
    
    if (usuarioId) {
      const usuario = await buscarPorID(usuarioId); 
      
      res.render("templates/menuUsuarios", { usuario, tipo });
    } else {
      res.render("templates/menuUsuarios", { usuario: null, tipo }); 
    }
  } catch (error) {
    console.error("Error al renderizar el menú de usuarios:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Modificar usuario
ruta.get("/modificarCuenta", async (req, res) => {
  const usuarioId = req.session.usuarioId;
  
  if (usuarioId) {
    try {
      const tipo = req.session.usuario || undefined; 
      const usuario = await buscarPorID(usuarioId);
      
      if (!usuario) {
        console.error("Usuario no encontrado");
        res.status(404).send("Usuario no encontrado");
        return;
      }
      
      res.render("pag/modificarCuenta", { usuarioId, tipo, user: usuario });
    } catch (error) {
      console.error("Error al cargar la página de modificación:", error);
      res.status(500).send("Error interno del servidor al intentar cargar la página de modificación");
    }
  } else {
    res.redirect("/login"); 
  }
});


ruta.get("/modificarUsuario/:id", async (req, res) => {
  const usuarioId = req.params.id;
  try {
    const usuario = await buscarPorID(usuarioId);
    if (usuario) {
      const tipo = req.session.usuario || undefined; 

      res.render("pag/modificarCuenta", { user: usuario, tipo: tipo, usuarioId: usuarioId }); 
      // Asegúrate de pasar 'usuarioId' al renderizar la plantilla 'modificarCuenta'
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al intentar cargar la página de modificación:", error);
    res.status(500).send("Error interno del servidor al intentar cargar la página de modificación");
  }
});

ruta.post("/ModificarMiCuenta/:id", subirArchivo(), async (req, res) => {
  try {
    const usuarioAct = await buscarPorID(req.body.id);
    
    if (!usuarioAct) {
      console.error("Usuario no encontrado");
      res.status(404).send("Usuario no encontrado");
      return;
    }

    if (req.file) {
      req.body.foto = req.file.originalname;

      if (usuarioAct.foto) {
        const rutaFotoAnterior = `web/images/${usuarioAct.foto}`;
        fs.unlinkSync(rutaFotoAnterior);
      } else {
        req.body.foto = req.body.fotoViejo;
      }
    }
    usuarioAct.nombre = req.body.nombre;
    usuarioAct.usuario = req.body.usuario;
    usuarioAct.password = req.body.password || usuarioAct.password; 

    // Actualiza la foto si se sube una nueva
    if (req.file) {
      usuarioAct.foto = req.file.originalname;
    }

    await modificarUsuario(usuarioAct); 

    res.redirect("/login");
  } catch (error) {
    console.error("Error al modificar la cuenta:", error);
    res.status(500).send("Error interno del servidor");
  }
});


ruta.get("/", async (req, res) =>{
  res.render("usuarios/index");
});

ruta.get("/login", async (req,res) =>{
  res.render("usuarios/login");
});

ruta.post("/login", async (req, res) => {
  var { usuario, password } = req.body;
  var usuarioEnt = await buscarPorUsuario(usuario);

  if (usuarioEnt) {
    var passwordCorrect = await verificarPassword(password, usuarioEnt.password, usuarioEnt.salt);
    if (passwordCorrect) {
      req.session.usuarioId = usuarioEnt.id;
      if (usuarioEnt.admin) {
        req.session.admin = usuarioEnt.admin;
        req.session.usuario = usuarioEnt.usuario; 
        res.redirect("/usuarios"); 
      } else {
        req.session.usuario = usuarioEnt.usuario;
        res.redirect("/obra/obras/"); 
      }
    } else {
      console.log("Usuario o contraseña incorrectos");
      res.render("usuarios/login");
    }
  } else {
    console.log("Usuario o contraseña incorrectos");
    res.render("usuarios/login");
  }
});


ruta.get("/logout", (req,res)=>{
req.session=null;
res.redirect("/login");
});




// Rutas Comentarios


module.exports = ruta;

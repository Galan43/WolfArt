var ruta = require("express").Router();
var fs=require("fs");
var {  mostrarUsuarios, nuevoUsuario,buscarPorID, modificarUsuario,  borrarUsuario,buscarPorUsuario,verificarPassword} = require("../BD/usuariosBD");
var subirArchivo=require("../middlewares/subirArchivo")
var {autorizado, admin}=require("../middlewares/funcionesPassword")

// Ruta para obtener usuarios
ruta.get("api/usuarios", async (req, res) => {
	try {
	  const usuarios = await mostrarUsuarios();
	  if (usuarios.length > 0)
		res.status(200).json(usuarios);
	  else
		res.status(400).json("No hay usuarios");
	} catch (error) {
	  console.error("Error al obtener usuarios:", error);
	  res.status(500).json("Error interno del servidor");
	}
  });
  
  // Ruta para crear un nuevo usuario
  ruta.post("api/nuevousuario", subirArchivo(), async (req, res) => {
	try {
	  req.body.foto = req.file.originalname;
	  const error = await nuevoUsuario(req.body);
	  if (error === 0) {
		res.status(200).json("Usuario registrado");
	  } else {
		res.status(400).json("Datos incorrectos");
	  }
	} catch (error) {
	  console.error("Error al crear un nuevo usuario:", error);
	  res.status(500).json("Error interno del servidor");
	}
  });

  
  // Ruta para editar un usuario
  ruta.post("api/editar", subirArchivo(), async (req, res) => {
	try {
	  const error = await modificarUsuario(req.body);
	  if (error === 0) {
		res.status(200).json("Usuario actualizado");
	  } else {
		res.status(400).json("Error al actualizar el usuario");
	  }
	} catch (error) {
	  console.error("Error al editar usuario:", error);
	  res.status(500).json("Error interno del servidor");
	}
  });
  
  // Ruta para borrar un usuario por su ID
  ruta.get("api/borrarUsuario/:id", async (req, res) => {
	try {
	  const error = await borrarUsuario(req.params.id);
	  if (error === 0) {
		res.status(200).json("Usuario borrado");
	  } else {
		res.status(400).json("Error al eliminar usuario");
	  }
	} catch (error) {
	  console.error("Error al borrar usuario:", error);
	  res.status(500).json("Error interno del servidor");
	}
  });

  module.exports = ruta;
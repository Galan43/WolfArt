var conexion = require("./conexion").conexionComen;
var Comentario = require("../modelos/comentarios");

async function nuevoComentario(datos) {
    var review = new Comentario(null, datos);
    var error = 1;
    if (review.bandera == 0) {
        try {
            console.log(review.obtenerDatos);
            await conexion.doc().set(review.obtenerDatos);
            console.log("Comentario insertado a la base de datos");
            error = 0;
        } catch (err) {
            console.log("Error al capturar el nuevo comentario: " + err);
        }
    }
    return error;
}

async function mostrarComentariosPorId(obraId) {
    var comentarios = [];
    try {
        var comentariosSnapshot = await conexion.where("obra", "==", obraId).get();
        comentariosSnapshot.forEach((comentario) => {
            var comment = new Comentario(comentario.id, comentario.data());
            if (comment.bandera == 0) {
                comentarios.push(comment.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al recuperar comentarios de la base de datos: " + err);
    }
    return comentarios;
}

async function mostrarComentarios() {
    var comentarios = []; 
    try {
        var comentariosSnapshot = await conexion.get();
        comentariosSnapshot.forEach((comentario) => {
            var comment = new Comentario(comentario.id, comentario.data());
            if (comment.bandera == 0) {
                comentarios.push(comment.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al recuperar los comentarios de la base de datos: " + err);
    }
    return comentarios;
}

module.exports = {
    nuevoComentario,
    mostrarComentariosPorId,
    mostrarComentarios
};
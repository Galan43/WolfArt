const conexionObra = require("./conexion").conexionObra;
const Obras = require("../modelos/obras");

async function mostrarObras() {
  var obras = [];
  try {
    var obrasSnapshot = await conexionObra.get();

    // Verifica si obrasSnapshot es válido antes de intentar iterar sobre él
    if (obrasSnapshot && obrasSnapshot.forEach) {
      obrasSnapshot.forEach((obra) => {
        var obraData = new Obras(obra.id, obra.data());
        if (obraData.bandera == 0) {
          obras.push(obraData.obtenerDatos());
        }
      });
    }
  } catch (err) {
    console.log("Error al recuperar obras de la base de datos: " + err);
  }
  return obras;
}


async function buscarObraPorID(id) {
  var obra = "";
  try {
    var obraSnapshot = await conexionObra.doc(id).get();
    var obraData = new Obras(obraSnapshot.id, obraSnapshot.data());
    if (obraData.bandera == 0) {
      obra = obraData.obtenerDatos();
    }
  } catch (err) {
    console.log("Error al recuperar la obra: " + err);
  }
  return obra;
}

async function nuevaObra(datos) {
  var obraData = new Obras(null, datos);
  var error = 1;
  if (obraData.bandera == 0) {
    try {
      await conexionObra.doc(obraData.nombre).set(obraData.obtenerDatos());
      console.log("Obra insertada en la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al insertar la obra: " + err);
    }
  }
  return error;
}

async function modificarObra(datos) {
  var error = 1;
  var respuestaBuscar = await buscarObraPorID(datos.id);
  
  if (respuestaBuscar !== "") {
    var obraActual = await conexionObra.doc(datos.id).get();
    var datosObra = obraActual.data();

    // Verificar si se proporcionan nuevos valores en el formulario
    const nuevosDatos = {
      nombre: datos.nombre !== undefined ? datos.nombre : datosObra.nombre,
      artista: datos.artista !== undefined ? datos.artista : datosObra.artista,
      descripcion: datos.descripcion !== undefined ? datos.descripcion : datosObra.descripcion,
      anio: datos.anio !== undefined ? datos.anio : datosObra.anio,
      foto: datos.foto !== undefined ? datos.foto : datosObra.foto,
      calificacion: datos.calificacion !==undefined ? datos.calificacion : datosObra.calificacion
    };

    var obra = new Obras(datos.id, nuevosDatos);

    if (obra.bandera === 0) {
      try {
        await conexionObra.doc(obra.id).set(obra.obtenerDatos());
        console.log("Obra modificada");
        error = 0;
      } catch (err) {
        console.log("Error al modificar la obra: " + err);
      }
    }
  }
  
  return error;
}

async function borrarObra(id) {
  var error = 1;
  var obra = await buscarObraPorID(id);
  if (obra != "") {
    try {
      await conexionObra.doc(id).delete();
      console.log("Obra eliminada de la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al eliminar la obra de la base de datos: " + err);
    }
  }
  return error;
}


async function llamarDatosObra() {
  try {
    const obras = await mostrarObras(); 
    return obras;
  } catch (error) {
    console.error('Error al obtener las obras: ' + error);
    throw error;
  }
}

async function calificarObra(idObra, calificacion, res) {
  try {
    const obra = await buscarObraPorID(idObra);

    if (obra) {
      if (typeof calificacion === 'string') {
        obra.calificacion = calificacion; 
        await conexionObra.doc(idObra).set(obra); 
        console.log("Calificación registrada");
        res.redirect(`/obra/detallesobra/${obra.id}`);      
        } 
      }
  } catch (err) {
    console.log("Error al calificar la obra: " + err);
    res.status(500).send('Error interno del servidor');
  }
}

async function obtenerCalificacionActual(idObra) {
  try {
    const obra = await buscarObraPorID(idObra);

    if (obra) {
      return obra.calificacion;
    } else {
      console.log("Obra no encontrada");
      return null; 
    }
  } catch (err) {
    console.error("Error al obtener la calificación actual: " + err);
    return null;
  }
}

function obtenerIdObraActual(req) {
  return req.query.id; 
}


async function buscarObra(id) {
  try {
    console.log("Buscando obra con ID:", id);
    var obraData = await conexionObra.doc(id).get();
    if (obraData.exists) {
      console.log("Obra encontrada:", obraData.data());
      return new Obras(obraData.id, obraData.data());
    } else {
      console.log("No se encontró la obra");
      return null;
    }
  } catch (err) {
    console.error("Error al buscar la obra: " + err);
    throw err; k
  }
}

module.exports = {
  mostrarObras,
  buscarObraPorID,
  modificarObra,
  borrarObra,
  nuevaObra,
  llamarDatosObra,
  calificarObra,
  buscarObra,
  obtenerCalificacionActual,
  obtenerIdObraActual,
};

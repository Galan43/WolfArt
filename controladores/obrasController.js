const obrasController = {
    calificarObraController: async (req, res) => {
      try {
        const idObra = req.params.idObra;
        const calificacion = parseInt(req.body.calificacion);
  
        if (!isNaN(calificacion)) {
          const resultado = await calificarObra(idObra, calificacion);
  
          if (resultado === 0) {
            res.send('Calificación registrada con éxito');
          } else if (resultado === 1) {
            res.status(404).send('Obra no encontrada');
          } else if (resultado === 2) {
            res.status(500).send('Error al calificar la obra');
          } else if (resultado === 3) {
            res.status(400).send('Calificación no válida');
          }
        } else {
          res.status(400).send('La calificación debe ser un número');
        }
      } catch (error) {
        console.error('Error al calificar la obra:', error);
        res.status(500).send('Error interno del servidor');
      }
    },
  };
  
  module.exports = obrasController;
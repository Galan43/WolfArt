document.addEventListener("DOMContentLoaded", function () {
    const calificacionSelect = document.getElementById("calificacion");

    calificacionSelect.addEventListener("change", function () {
        const calificacion = parseInt(this.value); // Convierte el valor a un número entero
        console.log("Calificación seleccionada:", calificacion);

        // Llama a la función para enviar la calificación al servidor
        enviarCalificacionAlServidor(idObra, calificacion);
    });
});

// Otras funciones y código...

function enviarCalificacionAlServidor(idObra, calificacion) {
    // Aquí puedes realizar acciones para enviar la calificación al servidor
    // Puedes utilizar fetch, axios u otra librería para hacer la solicitud al servidor
    // y enviar los datos necesarios (idObra, calificacion) al endpoint correspondiente.
    // Por ejemplo:
    
    fetch(`/obra/obras/calificar/${idObra}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calificacion }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al calificar la obra: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // Muestra la respuesta del servidor en la consola
        // Puedes realizar otras acciones según la respuesta del servidor
    })
    .catch(error => {
        console.error('Error al calificar la obra:', error);
        // Puedes manejar el error y mostrar un mensaje al usuario si es necesario
    });
}

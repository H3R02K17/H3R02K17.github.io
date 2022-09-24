const API_CONTACTO = SERVER + 'sitio_publico/api_contactos.php?action=';

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('form_contactos').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que obtiene las categorias
    fetch(API_CONTACTO + 'contactanos', {
        method: 'post',
        body: new FormData(document.getElementById('form_contactos'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se muestra un mensaje de exito y se cargan las reservaciones
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 6000,
                        timerProgressBar: true,
                        title: 'Comentario enviado',
                        text: response.message,
                        icon: 'success',
                        color: '#ffffff',
                        background: '#70393b',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                    document.getElementById('email_contacto').value = '';
                    document.getElementById('nombre_contacto').value = '';
                    document.getElementById('telefono_contacto').value = '';
                    document.getElementById('comentario_contacto').value = '';
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});
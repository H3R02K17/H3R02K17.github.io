// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + "sitio_privado/api_login.php?action=";


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Petición para consultar si está logueado el usuario
    fetch(API_USUARIOS + 'existenciaUsuarioRecuperar', {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.estado) {
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.estado + " " + request.statusText);
        }
    });
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar contraseña.
document.getElementById('recuperar_contra_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_USUARIOS + 'correoRecuperacion', {
        method: 'post',
        body: new FormData(document.getElementById('recuperar_contra_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, "renovar_contra.html");
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});
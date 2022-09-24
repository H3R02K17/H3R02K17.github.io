// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + "sitio_privado/api_login.php?action=";

//se declara una variable para hacer funcionar el modal de QR
var modal_generador = new bootstrap.Modal(document.getElementById('generadorQR'), {
    keyboard: false
})

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
    verificarRecuperar();
    bloquearPegar("nueva_contra");
    bloquearPegar("nueva_contra_confirmar");
});

function verificarRecuperar() {
    // Petición para consultar si está logueado el usuario
    fetch(API_USUARIOS + 'verificacionRecuperar', {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.recuperacion == 2) {
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.estado + " " + request.statusText);
        }
    });
}

function reenviarEmail() {
    // Petición para consultar si está logueado el usuario
    fetch(API_USUARIOS + 'reenviarEmail', {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + " " + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar contraseña.
document.getElementById('renovar_contra_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_USUARIOS + 'renovarContra', {
        method: 'post',
        body: new FormData(document.getElementById('renovar_contra_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, "index.html");
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

//Al dar clic en generar QR, se manda a llamar a la API para generar una IMG QR
function generarQR() {
    fetch(API_USUARIOS + 'generarQR', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    document.getElementById("imagen_contenedor_qr").setAttribute("src", SERVER + "images/qr/" + response.qr_code);
                    // Se muestra un mensaje de exito
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 8000,
                        timerProgressBar: true,
                        title: 'Código generado',
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
                    modal_generador.show();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena() {
    var image = document.getElementById("ocultar"),
        tipo = document.getElementById("nueva_contra");
    if (tipo.type == "password") {
        tipo.type = "text";
        image.src = "../../recursos/icons/mostrar.png";
    } else {
        tipo.type = "password";
        image.src = "../../recursos/icons/ocultar.png";
    }
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena2() {
    var image = document.getElementById("ocultar2"),
        tipo = document.getElementById("nueva_contra_confirmar");
    if (tipo.type == "password") {
        tipo.type = "text";
        image.src = "../../recursos/icons/mostrar.png";
    } else {
        tipo.type = "password";
        image.src = "../../recursos/icons/ocultar.png";
    }
}

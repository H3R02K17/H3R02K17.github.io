// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_REGISTRAR = SERVER + 'sitio_privado/api_registro.php?action=';

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let today = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let day = ('0' + today.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = today.getFullYear() - 18;
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let date = `${year}-${month}-${day}`;
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('fecha').setAttribute('max', date);
    // Petición para consultar si existen usuarios registrados.
    fetch(API_REGISTRAR + 'verificarPrimerUso', {
        method: "get",
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.session) {
                    location.href = 'dashboard.html';
                } else if (response.estado) {
                    sweetAlert(3, response.message, 'index.html');
                } else {
                    sweetAlert(4, 'Debe crear un usuario administrador para comenzar', null);
                }
            });
        } else {
            console.log(request.estado + " " + request.statusText);
        }
    });
    //Var se crea para variables globales
    //let es variables locales
    bloquearPegar("contrasenia");
    bloquearPegar("confirmar_contrasenia");
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de registrar.
document.getElementById('registrar_usuario_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para registrar el primer usuario del sitio privado.
    fetch(API_REGISTRAR + 'registroUsuario', {
        method: 'post',
        body: new FormData(document.getElementById('registrar_usuario_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, 'index.html');
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.estadoText);
        }
    });
});

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena() {
    var image = document.getElementById("ocultar"),
        tipo = document.getElementById("contrasenia");
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
        tipo = document.getElementById("confirmar_contrasenia");
    if (tipo.type == "password") {
        tipo.type = "text";
        image.src = "../../recursos/icons/mostrar.png";
    } else {
        tipo.type = "password";
        image.src = "../../recursos/icons/ocultar.png";
    }
}
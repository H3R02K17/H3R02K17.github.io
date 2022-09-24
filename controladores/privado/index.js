// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_LOGIN = SERVER + 'sitio_privado/api_login.php?action=';

var modalActualizar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
}),
    modalTwoFactorVerify = new bootstrap.Modal(document.getElementById('two_factor'), {
        keyboard: false
    });
//Evento que se ejecuta cuando se carga la página web
document.addEventListener('DOMContentLoaded', function () {
    // Petición para consultar si existen usuarios registrados.
    fetch(API_LOGIN + 'verificarPrimerUso', {
        method: 'get',
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.session) {
                    location.href = 'dashboard.html';
                } else if (response.estado) {
                    Swal.fire({
                        title: 'Bienvenido a Koffi Soft',
                        text: 'Debe iniciar sesión para continuar',
                        imageUrl: '../../recursos/gif/koffi_soft.gif',
                        imageWidth: 220,
                        imageHeight: 220,
                        imageAlt: 'Custom image',
                        confirmButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                    bloquearPegar('contrasenia');
                    bloquearPegar('contrasenia1');
                    bloquearPegar('confirmar_contrasenia');
                    bloquearPegar('confirmar_nueva_contrasenia');
                } else if (response.error) {
                    sweetAlert(2, response.exception, null);
                } else {
                    sweetAlert(3, response.exception, 'registrarse.html');
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de iniciar sesión.
document.getElementById('inicio_sesion_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para revisar si el administrador se encuentra registrado.
    fetch(API_LOGIN + 'logIn', {
        method: 'post',
        body: new FormData(document.getElementById('inicio_sesion_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    console.log(response.cambio_contra);
                    if (response.cambio_contra == 1 && response.estado == 1 && response.two_factor == 2) {
                        //Si las credenciales son las correctas y la contraseña no lleva mas de 90 dias activa mostrará un mensaje de credenciales correctas y nos redirecciona al main
                        sweetAlert(1, response.message, 'dashboard.html');
                    } else if (response.cambio_contra == 2 && response.estado == 1) {
                        modalActualizar.show();
                    } else if (response.two_factor == 1) {
                        modalTwoFactorVerify.show();
                    }
                } else {
                    //Si alguna de las credenciales es incorrecta mostrará un mensaje de error diciendo que credencial es la mala
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
    var image = document.getElementById('ocultar');
    var tipo = document.getElementById('contrasenia');
    if (tipo.type == 'password') {
        tipo.type = 'text';
        image.src = '../../recursos/icons/mostrar.png';
    } else {
        tipo.type = 'password';
        image.src = '../../recursos/icons/ocultar.png';
    }
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena1() {
    var image = document.getElementById('ocultar1'),
        tipo = document.getElementById('contrasenia1');
    if (tipo.type == 'password') {
        tipo.type = 'text';
        image.src = '../../recursos/icons/mostrar.png';
    } else {
        tipo.type = 'password';
        image.src = '../../recursos/icons/ocultar.png';
    }
}
//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena2() {
    var image = document.getElementById('ocultar2'),
        tipo = document.getElementById('confirmar_contrasenia');
    if (tipo.type == 'password') {
        tipo.type = 'text';
        image.src = '../../recursos/icons/mostrar.png';
    } else {
        tipo.type = 'password';
        image.src = '../../recursos/icons/ocultar.png';
    }
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena3() {
    var image = document.getElementById('ocultar3'),
        tipo = document.getElementById('confirmar_nueva_contrasenia');
    if (tipo.type == 'password') {
        tipo.type = 'text';
        image.src = '../../recursos/icons/mostrar.png';
    } else {
        tipo.type = 'password';
        image.src = '../../recursos/icons/ocultar.png';
    }
}

function actualizarCampos() {
    document.getElementById('contrasenia1').value = ''
    document.getElementById('confirmar_contrasenia').value = ''
    document.getElementById('confirmar_nueva_contrasenia').value = ''
    document.getElementById('usuario').value = ''
    document.getElementById('contrasenia').value = ''
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar contraseña.
document.getElementById('actualizar_contra_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_LOGIN + 'actualizarContra90dias', {
        method: 'post',
        body: new FormData(document.getElementById('actualizar_contra_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    modalActualizar.hide();
                    // Se muestra un mensaje de exito y se cargan las reservaciones
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 8000,
                        timerProgressBar: true,
                        title: 'Actualización exitosa',
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
                    actualizarCampos();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de iniciar sesión.
document.getElementById('two_factor').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Petición para revisar si el administrador se encuentra registrado.
    fetch(API_LOGIN + 'twoFactorAuthent', {
        method: 'post',
        body: new FormData(document.getElementById('two_factor_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    //Si las credenciales son las correctas y la contraseña no lleva mas de 90 dias activa mostrará un mensaje de credenciales correctas y nos redirecciona al main
                    sweetAlert(1, response.message, 'dashboard.html');
                } else {
                    sweetAlert(2, response.exception)
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

var modalActualizar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
}),
    modalTwoFactor = new bootstrap.Modal(document.getElementById('twoFactor'), {
        keyboard: false
    });

let two_factor = false;

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    obtenerDatosUsuario();
    bloquearPegar('contrasenia');
    bloquearPegar('confirmar_contrasenia');
    bloquearPegar('confirmar_nueva_contrasenia');
    peticiones_user('knownTwoFactor', twoFactor);
});

function obtenerDatosUsuario() {
    fetch(API_USUARIOS + 'obtenerUsuario', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se revisa si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
                if (response.session) {
                    let imagen_perfil = '';
                    let existencia_imagen = '';
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se direcciona a la página web principal.
                    if (response.estado) {
                        if (response.imagen_usuario == null) {
                            existencia_imagen = `<img id="imagen_principal" src="../../recursos/icons/user2.png" alt="imagen"></img>`
                        } else {
                            existencia_imagen = `<img id="imagen_principal" src="${SERVER}images/usuario/${response.imagen_usuario}" alt="imagen"></img>`;
                        }
                        imagen_perfil += `
                        <h4>Hola, ${response.empleado}</h4>
                        <h4>¡Bienvenido!</h4>
                        <div class="mb-3">
                            <div class="imagen_perfil">
                                ${existencia_imagen}
                            </div>
                            <div class="input_imagen">
                                <label for="imagen_usuario" class="form-label">Adjuntar Imagen</label>
                                <input class="form-control form-control-sm" id="imagen_usuario" name="imagen_usuario" type="file" onchange="imagenPerfil(event)">
                            </div>
                        </div>
                        `;
                        document.getElementById('imagen_perfil').innerHTML = imagen_perfil;
                        //Cargamos los datos en los input de perfil
                        document.getElementById('nombre').value = response.empleado;
                        document.getElementById('apellido').value = response.apellido;
                        document.getElementById('dui').value = response.dui;
                        document.getElementById('nit').value = response.nit;
                        let fecha = response.fecha_nacimiento.split(' ');
                        document.getElementById('fecha_nacimiento').value = fecha[0];
                        document.getElementById('tipo_usuario').value = response.tipo_usuario;
                        document.getElementById('telefono').value = response.telefono;
                        document.getElementById('correo').value = response.usuario;
                        document.getElementById('imagen_usuario').required = false;
                    } else {
                        sweetAlert(3, response.exception, 'index.html');
                    }
                } else {
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

document.getElementById('perfil_form').addEventListener('submit', function (event){
    event.preventDefault();
    fetch(API_USUARIOS + 'actualizarPerfil', {
        method: 'post',
        body: new FormData(document.getElementById('perfil_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, null);
                    obtenerDatosUsuario();
                    cargarContenidoOnline();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});


//Función para validar la vista preliminar de una imagen
function imagenPerfil(event){
    let leer_img = new FileReader(),
        imagen = document.getElementById('imagen_principal');
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            imagen.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

// Variable contador para saber si esta activo la opción de editar
var contador = 1;
//Quitar la propiedad readonly al input de telefono para poder modificarse
function habilitarMtelefono() {
    if (contador == 1) {
        document.getElementById('telefono').removeAttribute("readonly");
        document.getElementById('lbtelefono').innerHTML = "<b><u>Teléfono:</u> *</b>";
        document.getElementById('lbtelefono').style.color = "#4c070a";
        contador = 0;
    } else {
        document.getElementById('telefono').setAttribute("readonly", true);
        document.getElementById('lbtelefono').innerHTML = "<b>Teléfono:</b>";
        document.getElementById('lbtelefono').style.color = "#4a1f0e";
        contador = 1;
    }
}

// Variable contador para saber si esta activo la opción de editar
var contador2 = 1;
//Quitar la propiedad readonly al input de correo para poder modificarse
function habilitarMusuario() {
    if (contador2 == 1) {
        document.getElementById('correo').removeAttribute("readonly");
        document.getElementById('lbusuario').innerHTML = "<b><u>Correo:</u> *</b>";
        document.getElementById('lbusuario').style.color = "#4c070a";
        contador2 = 0;
    } else {
        document.getElementById('correo').setAttribute("readonly", true);
        document.getElementById('lbusuario').innerHTML = "<b>Correo:</b>";
        document.getElementById('lbusuario').style.color = "#4a1f0e";
        contador2 = 1;
    }
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena() {
    var image = document.getElementById('ocultar'),
        tipo = document.getElementById('contrasenia');
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

//Función para abir modal actualizar
function abrirModalActualizarContra() {
    modalActualizar.show();
    document.getElementById('contrasenia').value = ''
    document.getElementById('confirmar_contrasenia').value = ''
    document.getElementById('confirmar_nueva_contrasenia').value = ''
}

//Función para cargar los datos del usuario en los inputs
function twoFactor(response){
    document.getElementById('generateQR').innerText = (response.dataset.two_factor ? 'Desactivar' : 'Activar') + ' autenticación en 2 pasos'
    two_factor = response.dataset.two_factor;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('generateQR').addEventListener('click', () => {
    if (two_factor) {
        peticiones_user('deactivate2fa', deactivate2fa, true);
    } else {
        peticiones_user('activate2fa', activate2fa, true);
    }

});

function activate2fa(response){
    //Se declara e inicializa al elemento de Bootstrap
    var modal = new bootstrap.Modal(document.getElementById('twoFactor'));
    modal.show();
    document.getElementById('imgQR').setAttribute('src', response.dataset);
    document.getElementById('generateQR').innerText = 'Desactivar autenticación en 2 pasos';
    two_factor = true;
}

function deactivate2fa() {
    document.getElementById('imgQR').setAttribute('src', '');
    document.getElementById('generateQR').innerText = 'Activar autenticación en 2 pasos';
    two_factor = false;
}

function peticiones_user(action, func, error){
    fetch(API_USUARIOS + action, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si existe una sesión, de lo contrario se revisa si la respuesta es satisfactoria.
                if (response.estado) {
                    if (error) Swal.fire({
                        toast: true,
                        position: 'bottom-end',
                        timer: 8000,
                        timerProgressBar: true,
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
                    if (func) func(response);
                } else {
                    sweetAlert(2, response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar contraseña.
document.getElementById('actualizar_contra_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_USUARIOS + 'actualizarContra', {
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
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});
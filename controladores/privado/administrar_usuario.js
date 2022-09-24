const API_ADMIN_USUARIOS = SERVER + 'sitio_privado/api_admin_usuarios.php?action=';
const ENDPOINT_TIPO = SERVER + 'sitio_privado/api_admin_usuarios.php?action=readTipoUsuario';
const ENDPOINT_EMPLEADO = SERVER + 'sitio_privado/api_admin_usuarios.php?action=readEmpleado';
const ENDPOINT_ESTADO = SERVER + 'sitio_privado/api_admin_usuarios.php?action=readEstado';


var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_usuario'), {
    keyboard: false
}),
    modal_modificar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
}),
    modal_eliminar = new bootstrap.Modal(document.getElementById('eliminar'), {
    keyboard: false
}),
    modal_empleado = new bootstrap.Modal(document.getElementById('agregar_empleado'), {
    keyboard: false
})

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_ADMIN_USUARIOS);
    readRowsEmp(API_ADMIN_USUARIOS);
    //Se bloquea pegar en estos input
    bloquearPegar("contrasenia");
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset){
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.idusuario_empleado}</td>
                <td>${row.usuario_empleado}</td>
                <td>${row.tipo_usuario}</td>
                <td>${row.estado_usuario}</td>
                <td>${row.intentos}</td>
                <td>
                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                        <!-- Boton Modal Modificar -->
                        <button onclick="openUpdate(${row.idusuario_empleado})" type="button" class="btn btn-info editar" id="btn_modal"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt=""></button>
                        <!-- Boton Modal Eliminar -->
                        <button onclick="openDelete(${row.idusuario_empleado})" type="button" class="btn btn-danger eliminar" id="btn_modal"
                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbusuarios').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_ADMIN_USUARIOS, 'search-form');
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_ADMIN_USUARIOS, 'search-form');
});

//Funcion para insertar datos
function openCreate() {
    document.getElementById('usuarioC').value = '';
    document.getElementById('nombreC').value = '';
    document.getElementById('imagen_principal').value = '';
    document.getElementById('contrasenia').value = '';
    document.getElementById('confirmar_contrasenia').value = '';
    fillSelect(ENDPOINT_TIPO, "un tipo", 'tipo', null);
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createUsuario';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_ADMIN_USUARIOS, action, 'agregar_form', modal_agregar);
});

//funcion para tener una visualizacion de la imagen
function preliminar(event){
    let leer_img = new FileReader();
    let id_img = document.getElementById("imagen_principal");
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

//Funcion para tener visualizacion de la imagen en modificar
function preliminar2(event){
    let leer_img = new FileReader(),
        id_img = document.getElementById("imagen_principal_modificar");
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

//Funcion para actualizar datos
function openUpdate(idusuario_empleado){
    //Se abre el modal de modificar
    modal_modificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idusuario_empleado", idusuario_empleado);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ADMIN_USUARIOS + "readOne", {
        method: "post",
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById("idusuarioM").value = response.dataset.idusuario_empleado;
                    document.getElementById("usuarioM").value = response.dataset.usuario_empleado;
                    document.getElementById('imagen_usuarioM').required = false;
                    fillSelect(ENDPOINT_ESTADO, "un estado", 'estadoM', response.dataset.idestado_usuario);
                    fillSelect(ENDPOINT_TIPO, "un tipo", 'tipoM', response.dataset.idtipo_usuario);
                    document.getElementById("empleadoM").value = response.dataset.nombre_empleado;
                    document.getElementById("idempleadoM").value = response.dataset.idempleado;
                    if (response.dataset.imagen_empleado != null) {
                        document.getElementById('imagen_principal_modificar').setAttribute("src", SERVER + "images/usuario/" + response.dataset.imagen_empleado);
                    }
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('modificar_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'updateUsuario';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_ADMIN_USUARIOS, action, 'modificar_form', modal_modificar);
});

//Funcion para eliminar un registro
function openDelete(idusuario_empleado){
    //Se abre el modal de eliminar
    modal_eliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idusuario_empleado", idusuario_empleado);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ADMIN_USUARIOS + "readOne", {
        method: "post",
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById("idusuarioD").value = response.dataset.idusuario_empleado;
                    document.getElementById("usuarioD").value = response.dataset.usuario_empleado;
                    document.getElementById('imagen_usuarioM').required = false;
                    fillSelect(ENDPOINT_TIPO, "un tipo", 'tipoD', response.dataset.idtipo_usuario);
                    fillSelect(ENDPOINT_EMPLEADO, "un empleado", 'empleadoD', response.dataset.idempleado);
                    if (response.dataset.imagen_empleado != null) {
                        document.getElementById('imagen_principal_eliminar').setAttribute("src", SERVER + "images/usuario/" + response.dataset.imagen_empleado);
                    }
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('eliminar_form').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_ADMIN_USUARIOS, 'eliminarUsuario', 'eliminar_form', modal_eliminar);
});


//Funcion para llenar la tabla empleados dentro del modal

function readRowsEmp(api){
    fetch(api + 'readAlls', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    data = response.dataset;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTableEmp(data);
            });
        } else {
            console.log(request.estado + '' + request.statusText);
        }
    });
}

function searchRowsEmp(api, form){
    fetch(api + 'searchEmp', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTableEmp(response.dataset);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTableEmp(dataset){
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr onclick="openPlaceEmp(${row.idempleado},'${row.nombre_empleado}')">
                <td>${row.nombre_empleado}</td>
                <td>${row.apellido_empleado}</td>
                <td>${row.dui_empleado}</td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows-emple').innerHTML = content;
}

var tipoac = null;

function valorTipoac0() {
    tipoac = 0;
}

function valorTipoac1() {
    tipoac = 1;
}

function openPlaceEmp(id, nombre){
    if (tipoac == 1) {
        document.getElementById('idempleadoC').value = id;
        document.getElementById('nombreC').value = nombre;
        Swal.fire({
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            title: 'Empleado seleccionado',
            icon: 'success',
            color: '#ffffff',
            background: '#70393b',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            stopKeydownPropagation: false
        });
        modal_empleado.hide();
        modal_agregar.show();
    }
    else if (tipoac == 0) {
        document.getElementById('idempleadoM').value = id;
        document.getElementById('empleadoM').value = nombre;
        Swal.fire({
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            title: 'Empleado seleccionado',
            icon: 'success',
            color: '#ffffff',
            background: '#70393b',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            stopKeydownPropagation: false
        });
        modal_empleado.hide();
        modal_modificar.show();
    }
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form-emp').addEventListener('submit', function (event){
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRowsEmp(API_ADMIN_USUARIOS, 'search-form-emp');
});

function openAbrir() {
    modal_empleado.show();;
    modal_agregar.hide();
}
//Funcion para insertar datos
function openCerrar() {
    modal_empleado.hide();
    modal_agregar.show();;
}

//Variable que servira para contador del pagination
var valor = 0;

//Método para contador
function ContadorPagination(navegar){
    const data = new FormData();
    if (navegar == 1) {
        valor += 10;
        data.append('contador', valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
    else if (navegar == 2 && valor >= 10) {
        valor = valor - 10;
        data.append('contador', valor);
        console.log(valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
}

function navegacionTabla(data){
    fetch(API_ADMIN_USUARIOS + 'readAllContador', {
        method: 'post',
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    data = response.dataset;
                    let content = '';
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                        <tr>
                            <td>${row.idusuario_empleado}</td>
                            <td>${row.usuario_empleado}</td>
                            <td>${row.tipo_usuario}</td>
                            <td>${row.estado_usuario}</td>
                            <td>${row.intentos}</td>
                            <td>
                                <div
                                    class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                    <!-- Boton Modal Modificar -->
                                    <button onclick="openUpdate(${row.idusuario_empleado})" type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#modificar" id="btn_modal"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img
                                    src="../../recursos/icons/modificar.png" alt=""></button>
                                    <!-- Boton Modal Eliminar -->
                                    <button onclick="openDelete(${row.idusuario_empleado})" type="button" class="btn btn-danger eliminar" data-bs-toggle="modal" data-bs-target="#eliminar" id="btn_modal"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img
                                    src="../../recursos/icons/eliminar.png" alt=""></button>
                                </div>
                            </td>
                        </tr>`;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbusuarios').innerHTML = content;
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: response.exception,
                        icon: 'info',
                        color: '#ffffff',
                        background: '#70393b',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                }
            });
        } else {
            console.log(request.estado + '' + request.statusText);
        }
    });
}

//Método para mostrar y ocultar la contraseña del login
function mostrarContrasena() {
    var image = document.getElementById("ocultar");
    var tipo = document.getElementById("contrasenia");
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
    var image = document.getElementById("ocultar2");
    var tipo = document.getElementById("confirmar_contrasenia");
    if (tipo.type == "password") {
        tipo.type = "text";
        image.src = "../../recursos/icons/mostrar.png";
    } else {
        tipo.type = "password";
        image.src = "../../recursos/icons/ocultar.png";
    }
}
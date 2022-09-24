// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_OBSERVACION = SERVER + 'sitio_privado/api_observacion.php?action=';
const ENDPOINT_TIPOOBSERVACION = SERVER + 'sitio_privado/api_observacion.php?action=obtenerTipoObservaciones';

//se declara una variable para hacer funcionar el modal de modificar
var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_observacion'), {
    keyboard: false
})
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_OBSERVACION);
    readTipo(API_OBSERVACION);
    readEstado(API_OBSERVACION);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    var realizado = '',
    estado = '',
    tipo = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        if (row.idestado_observacion == '1') {
            estado = `<a id="btn_realizado" href="#" class="btn"> ${row.estado_observacion}</a>`
            realizado = "disabled checked";
        }
        if (row.idestado_observacion == '2') {
            estado = `<a id="btn_pendiente" href="#" class="btn"> ${row.estado_observacion}</a>`;
            realizado = '';
        }
        if (row.idtipo_observacion == '2') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
        }
        if (row.idtipo_observacion == '3') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
        }
        if (row.idtipo_observacion == '4') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
        }
        if (row.idtipo_observacion == '5') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
        }
        if (row.idtipo_observacion == '1') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
        }
        if (row.idtipo_observacion == '2') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
        }
        if (row.idtipo_observacion == '3') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
        }
        if (row.idtipo_observacion == '4') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
        }
        if (row.idtipo_observacion == '5') {
            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
        }
        if (row.imagen_empleado == null) {
            content += `
                <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div class="titulo_observacion">
                        <div class="datos_observacion">
                            <div class="imagen_empleado">
                                <img src="../../recursos/icons/user2.png">
                            </div>
                            <div class="datos_empleado">
                                <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                <h6>${row.fecha_observacion}</h6>
                            </div>
                        </div>
                    <div class="cambiar_estado">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                        </div>
                    </div>
                    </div>
                        <div class="row btn_margin">
                            <div class="col-auto">${estado}</div>
                            <div class="col-auto">${tipo}</div>
                        </div>
                    <div>
                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                        </div>
                    </div>
                </div>
                `;
        } else {
            content += `
            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="titulo_observacion">
                    <div class="datos_observacion">
                        <div class="imagen_empleado">
                            <img src="${SERVER}images/usuario/${row.imagen_empleado}">
                        </div>
                        <div class="datos_empleado">
                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                            <h6>${row.fecha_observacion}</h6>
                        </div>
                    </div>
                <div class="cambiar_estado">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                        <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                    </div>
                </div>
                </div>
                    <div class="row btn_margin">
                        <div class="col-auto">${estado}</div>
                        <div class="col-auto">${tipo}</div>
                    </div>
                    <div>
                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                    </div>
                </div>
            </div>`;
        }
    });
    document.getElementById('observaciones_empleados').innerHTML = content;

}
function openCreate() {
    // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js
    fillSelect(ENDPOINT_TIPOOBSERVACION, 'un tipo observación', 'tipo_observacion', null);

}
document.getElementById('agregar_observacion_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    let action = 'create';
    saveRow(API_OBSERVACION, action, 'agregar_observacion_form', modal_agregar);
});


// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('thesearch').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    fetch(API_OBSERVACION + 'search', {
        method: 'post',
        body: new FormData(document.getElementById('thesearch'))
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
                        timer: 3000,
                        timerProgressBar: true,
                        title: '¡Busqueda Exitosa!',
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
                    contenido = '';
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        var realizado = '',
                        tipo = '',
                        estado = '';
                        if (row.idestado_observacion == '1') {
                            estado = `<a id="btn_realizado" href="#" class="btn"> ${row.estado_observacion}</a>`;
                            realizado = "disabled checked";
                            if (row.idtipo_observacion == '1') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '2') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '3') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '4') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '5') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                        }
                        if (row.idestado_observacion == '2') {
                            estado = `<a id="btn_pendiente" href="#" class="btn"> ${row.estado_observacion}</a>`;
                            if (row.idtipo_observacion == '1') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '2') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '3') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '4') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                            else if (row.idtipo_observacion == '5') {
                                tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                            }
                        }
                        if (row.imagen_empleado == null) {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="../../recursos/icons/user2.png">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        } else {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="${SERVER}images/usuario/${row.imagen_empleado}">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('observaciones_empleados').innerHTML = contenido;
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: response.exception,
                        icon: 'error',
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
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});


//Funcion para actualizar datos
function openUpdate(id) {
    // Se define un objeto con los datos del registro seleccionado.
    console.log(id);
    const data = new FormData();
    data.append("id", id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_OBSERVACION + "update", {
        method: "post",
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.exception, null);
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('estado').disabled = true;
                    readRows(API_OBSERVACION);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

//JQUERY SE DEBE CAMBIAR :C
function seleccionar() {
    $('input[type="checkbox"]').on('change', function () {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false);
    });
}

function readIngrediente(api) {
    fetch(api + 'cargarIngredientes', {
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
                fillIngredientes(data);
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function readTipo(api) {
    fetch(api + 'readAllTipos', {
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
                fillTipo(data);
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function readEstado(api) {
    fetch(api + 'readAllEstados', {
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
                fillEstado(data);
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTipo(dataset) {
    let contentEstado = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        contentEstado += `
        <div class="form-check">
            <input onclick="seleccionar(); busquedaxTipo(${row.idtipo_observacion})" class="form-check-input" type="checkbox" name="tipo" value="${row.idtipo_observacion}"
                id="flexCheckDefault" >
            <label class="form-check-label" for="flexCheckDefault">
                ${row.tipo_observacion}
            </label>
        </div>
        `;
    });
    document.getElementById('tipoobservacioncard').innerHTML = contentEstado;

}
// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillEstado(dataset) {
    let contentTipo = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        contentTipo += `
        <div class="form-check">
        <input onclick="seleccionar(); busquedaxEstado(${row.idestado_observacion})" id="estado1" type="checkbox" name="estado" class="form-check-input" value="${row.idestado_observacion}"
            >
        <label class="form-check-label" for="flexCheckDefault">
            ${row.estado_observacion}
        </label>
        </div>
        `;

    });
    document.getElementById('estadoObservacioncard').innerHTML = contentTipo;

}
//funcion de filtrado de busqueda por el tipo de observación
function busquedaxTipo(id) {
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js.
    const data = new FormData();
    data.append('idtipo', id);
    fetch(API_OBSERVACION + 'readOneTipos', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria.
                if (response.estado) {
                    var contenido = '',
                    realizado = '',
                    tipo = '',
                    estado = '';
                    data = response.dataset;
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        if (row.idestado_observacion == '1') {
                            estado = `<a id="btn_realizado" href="#" class="btn"> ${row.estado_observacion}</a>`
                            realizado = "disabled checked";
                        }
                        if (row.idestado_observacion == '2') {
                            estado = `<a id="btn_pendiente" href="#" class="btn"> ${row.estado_observacion}</a>`;
                            realizado = '';
                        }
                        if (row.idtipo_observacion == '2') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '3') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '4') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '5') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '1') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '2') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '3') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '4') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '5') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.imagen_empleado == null) {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="../../recursos/icons/user2.png">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        } else {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="${SERVER}images/usuario/${row.imagen_empleado}">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('observaciones_empleados').innerHTML = contenido;
                    ;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//funcion de filtrado de busqueda por el tipo de observación
function busquedaxEstado(id) {
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js.
    const data = new FormData();
    data.append('idestado', id);
    fetch(API_OBSERVACION + 'readOneEstados', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria.
                if (response.estado) {
                    var contenido = '';
                    data = response.dataset;
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        var realizado = '';
                        var estado;
                        var tipo;
                        tipo = '';
                        estado = '';
                        if (row.idestado_observacion == '1') {
                            estado = `<a id="btn_realizado" href="#" class="btn"> ${row.estado_observacion}</a>`
                            realizado = "disabled checked";
                        }
                        if (row.idestado_observacion == '2') {
                            estado = `<a id="btn_pendiente" href="#" class="btn"> ${row.estado_observacion}</a>`;
                            realizado = '';
                        }
                        if (row.idtipo_observacion == '2') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '3') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '4') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '5') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`
                        }
                        if (row.idtipo_observacion == '1') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '2') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '3') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '4') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.idtipo_observacion == '5') {
                            tipo = `<a id="btn_tipo" href="#" class="btn"> ${row.tipo_observacion}</a>`;
                        }
                        if (row.imagen_empleado == null) {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="../../recursos/icons/user2.png">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        } else {
                            contenido += `
                            <div id="container_empleado" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="titulo_observacion">
                                    <div class="datos_observacion">
                                        <div class="imagen_empleado">
                                            <img src="${SERVER}images/usuario/${row.imagen_empleado}">
                                        </div>
                                        <div class="datos_empleado">
                                            <p>${row.nombre_empleado} ${row.apellido_empleado}</p>
                                            <h6>${row.fecha_observacion}</h6>
                                        </div>
                                    </div>
                                    <div class="cambiar_estado">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="estado" ${realizado} onclick="openUpdate(${row.idobservacion})">
                                            <label class="form-check-label" for="estado">${row.estado_observacion}</label>
                                        </div>
                                    </div>
                                    </div>
                                        <div class="row btn_margin">
                                            <div class="col-auto">${estado}</div>
                                            <div class="col-auto">${tipo}</div>
                                        </div>
                                    <div>
                                        <textarea class="form-control container_observacion" rows="5" maxlength="500" readonly>${row.observacion}</textarea>
                                    </div>
                                </div>
                            </div>
                            `;
                        }
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('observaciones_empleados').innerHTML = contenido;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}
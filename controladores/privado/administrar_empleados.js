// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'sitio_privado/api_administrar_empleados.php?action=';
const ENDPOINT_TIPO = SERVER + 'sitio_privado/api_administrar_empleados.php?action=readTipoEmpleado';
const ENDPOINT_ESTADO = SERVER + 'sitio_privado/api_administrar_empleados.php?action=readEstado';

//Declarando los modal para cerrar.
var modal_observacion = new bootstrap.Modal(document.getElementById('agregar_observacion'), {
    keyboard: false
})
var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_empleado'), {
    keyboard: false
})
var modal_modificar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
})
var modal_eliminar = new bootstrap.Modal(document.getElementById('eliminar'), {
    keyboard: false
})
var modal_observaciones_personales = new bootstrap.Modal(document.getElementById('ver_observaciones_personales'), {
    keyboard: false
})
var modal_observaciones_generales = new bootstrap.Modal(document.getElementById('ver_observaciones'), {
    keyboard: false
})

//Evento que se ejecuta cuando se carga la página web
document.addEventListener('DOMContentLoaded', function () {
    // se inicializa la funcion readRows
    readRows(API_EMPLEADOS);
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
    document.getElementById('fechaC').setAttribute('max', date);
    document.getElementById('fechaM').setAttribute('max', date);
    document.getElementById('fechaD').setAttribute('max', date);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        let boton_visible = '';
        if (row.idestado_empleado == 1){
            boton_visible +=`
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_empleado}<img src="../../recursos/icons/mostrar2.png"></button>
            `;
        }else{
            boton_visible +=`
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_empleado}<img src="../../recursos/icons/ocultar2.png"></button>
            `;
        }
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombre_empleado}</td>
                <td>${row.apellido_empleado}</td>
                <td>${row.tipo_empleado}</td>
                <td>${row.telefono_empleado}</td>
                <td>${row.correo_empleado}</td>
                <td>
                    <div class="centrar_estadoemp">
                        ${boton_visible} 
                    </div>
                </td>
                <td>
                    <!-- MODALES MODIFICAR Y ELIMINAR -->
                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                        <!-- Boton Modal Modificar -->
                        <button onclick="openUpdate(${row.idempleado})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt=""></button>
                        <!-- Boton Modal Eliminar -->
                        <button onclick="openDelete(${row.idempleado})" type="button" class="btn btn-danger eliminar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                        <!-- Boton Modal Agregar Observacion -->
                        <button onclick="openCreateObserva(${row.idempleado},'${row.nombre_empleado}')" type="button" class="btn btn-morado" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Agregar Observación"><img src="../../recursos/icons/agregar_observacion.png" alt=""></button>
                        <!-- Boton Modal Ver Observaciones Personales-->
                        <button onclick="openObservaPerso(${row.idempleado})" type="button" class="btn btn-warning btn_observaciones" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver Observaciones Personales"><img src="../../recursos/icons/observaciones_personales.png" alt=""></button>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}

// Función para preparar el formulario al momento de insertar un registro.
function openCreate() {
    //Se abre el modal de agregar
    modal_agregar.show();
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('dui').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('fechaC').value = '';
    document.getElementById('nit').value = '';
    fillSelect(ENDPOINT_TIPO, 'un tipo', 'tipo', null);
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(idempleado) {
    //Se abre el modal de modificar
    modal_modificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idempleado", idempleado);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_EMPLEADOS + "readOne", {
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
                    document.getElementById("idempleadoM").value = response.dataset.idempleado;
                    document.getElementById("nombreM").value = response.dataset.nombre_empleado;
                    document.getElementById("apellidosM").value = response.dataset.apellido_empleado;
                    document.getElementById("duiM").value = response.dataset.dui_empleado;
                    document.getElementById("nitM").value = response.dataset.nit_empleado;
                    document.getElementById("telefonoM").value = response.dataset.telefono_empleado;
                    document.getElementById("correoM").value = response.dataset.correo_empleado;
                    let fecha = response.dataset.fecha_nacimiento_empleado.split(' ');
                    document.getElementById("fechaM").value = fecha[0];
                    fillSelect(ENDPOINT_TIPO, "un tipo", 'tipoM',response.dataset.idtipo_empleado);
                    fillSelect(ENDPOINT_ESTADO, "un estado", 'estadoM',response.dataset.idestado_empleado);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Función para preparar el formulario al momento de modificar un registro.
function openDelete(idempleado) {
    //Se abre el modal de eliminar
    modal_eliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('idempleado', idempleado);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_EMPLEADOS + 'readOne', {
        method: 'post',
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById("idempleadoD").value = response.dataset.idempleado;
                    document.getElementById("nombreD").value = response.dataset.nombre_empleado;
                    document.getElementById("apellidosD").value = response.dataset.apellido_empleado;
                    document.getElementById("duiD").value = response.dataset.dui_empleado;
                    document.getElementById("nitD").value = response.dataset.nit_empleado;
                    document.getElementById("telefonoD").value = response.dataset.telefono_empleado;
                    document.getElementById("correoD").value = response.dataset.correo_empleado;
                    let fecha = response.dataset.fecha_nacimiento_empleado.split(' ');
                    document.getElementById("fechaD").value = fecha[0];
                    fillSelect(ENDPOINT_TIPO, "un tipo", 'tipoD',response.dataset.idtipo_empleado);
                    fillSelect(ENDPOINT_ESTADO, "un estado", 'estadoD',response.dataset.idestado_empleado);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function openObservaPerso(id) {
    //Se abre el modal de observaciones personales
    modal_observaciones_personales.show();
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_EMPLEADOS + 'readObservacionPersonal', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr> 
                                <th scope="row">${row.idobservacion_empleado}</th>
                                <td>${row.nombre_empleado}</td>
                                <td>${row.observacion_empleado}</td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows-personal').innerHTML = content;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function openObservaGene() {
    //Abrimos el modal de observaciones generales
    modal_observaciones_generales.show();
    const data = new FormData();
    // Petición para obtener los datos del registro solicitado.
    fetch(API_EMPLEADOS + 'readObservacionGeneral', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr> 
                                <th scope="row">${row.idobservacion_empleado}</th>
                                <td>${row.nombre_empleado}</td>
                                <td>${row.observacion_empleado}</td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows-general').innerHTML = content;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function openCreateObserva(id, nombre) {
    modal_observacion.show();
    document.getElementById('observacion').value = '';
    document.getElementById('idempleado').value = id;
    document.getElementById('nombre_observacion').value = nombre;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('observacion_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createObservacion';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_EMPLEADOS, action, 'observacion_form', modal_observacion);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createEmpleado';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_EMPLEADOS, action, 'agregar_form', modal_agregar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('modificar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'updateEmpleado';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_EMPLEADOS, action, 'modificar_form', modal_modificar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('eliminar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'deleteEmpleado';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_EMPLEADOS, action, 'eliminar_form', modal_eliminar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_EMPLEADOS, 'search-form');
});


//Variable que servira para contador del pagination
var valor = 0;

//Método para contador
function ContadorPagination(navegar) {
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

function navegacionTabla(data) {
    fetch(API_EMPLEADOS + 'readAllContador', {
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
                        let boton_visible = '';
                        if (row.idestado_empleado == 1){
                            boton_visible +=`
                                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_empleado}<img src="../../recursos/icons/mostrar2.png"></button>
                            `;
                        }else{
                            boton_visible +=`
                                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_empleado}<img src="../../recursos/icons/ocultar2.png"></button>
                            `;
                        }
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.nombre_empleado}</td>
                                <td>${row.apellido_empleado}</td>
                                <td>${row.tipo_empleado}</td>
                                <td>${row.telefono_empleado}</td>
                                <td>${row.correo_empleado}</td>
                                <td>
                                    <div class="centrar_estadoemp">
                                        ${boton_visible} 
                                    </div>
                                </td>
                                <td>
                                    <!-- MODALES MODIFICAR Y ELIMINAR -->
                                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                        <!-- Boton Modal Modificar -->
                                        <button onclick="openUpdate(${row.idempleado})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt=""></button>
                                        <!-- Boton Modal Eliminar -->
                                        <button onclick="openDelete(${row.idempleado})" type="button" class="btn btn-danger eliminar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                                        <!-- Boton Modal Agregar Observacion -->
                                        <button onclick="openCreateObserva(${row.idempleado},'${row.nombre_empleado}')" type="button" class="btn btn-morado" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Agregar Observación"><img src="../../recursos/icons/agregar_observacion.png" alt=""></button>
                                        <!-- Boton Modal Ver Observaciones Personales-->
                                        <button onclick="openObservaPerso(${row.idempleado})" type="button" class="btn btn-warning btn_observaciones" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver Observaciones Personales"><img src="../../recursos/icons/observaciones_personales.png" alt=""></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbody-rows').innerHTML = content;
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


// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_INVENTARIO = SERVER + 'sitio_privado/api_administrar_inventario.php?action=';
const ENDPOINT_PROVEEDOR = SERVER + 'sitio_privado/api_administrar_inventario.php?action=readProveedor';
const ENDPOINT_ESTADO = SERVER + 'sitio_privado/api_administrar_inventario.php?action=readEstado';
const ENDPOINT_CAREGORIA = SERVER + 'sitio_privado/api_administrar_inventario.php?action=readCategoria';

var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_ingrediente'), {
    keyboard: false
})
var modal_modificar = new bootstrap.Modal(document.getElementById('modificar_ingrediente'), {
    keyboard: false
})
var modal_eliminar = new bootstrap.Modal(document.getElementById('eliminar_ingrediente'), {
    keyboard: false
})

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    // se inicializa la funcion readRows
    readRows(API_INVENTARIO);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        let boton_visible = '';
        if (row.idestado_ingrediente == 1) {
            boton_visible += `
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/menu_comida.png"></button>
            `;
        } else {
            boton_visible += `
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/eliminar.png"></button>
            `;
        }
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.ingrediente}</td>
                <td>${row.fecha_caducidad}</td>
                <td>${row.existencia_ingrediente}</td>
                <td>${row.categoria_ingrediente}</td>
                <td>${row.nombre_proveedor}</td>
                <td>${row.precio_ingrediente}</td>
                <td>
                    <div class="centrar_estadoemp">
                        ${boton_visible} 
                    </div>
                </td>
                <td>
                    <!-- Boton modal Modificar -->
                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                        <button onclick="openUpdate(${row.idingrediente})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt="modificar"></button>
                        <!--Boton Modal Eliminar-->
                        <button onclick="openDelete(${row.idingrediente})" type="button" class="btn btn-danger eliminar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt="eliminar"></button>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbingrediente').innerHTML = content;
}

function openCreate() {
    modal_agregar.show();
    document.getElementById('nombre_ingredienteC').value = '';
    document.getElementById('fecha_caducidadC').value = '';
    document.getElementById('existenciasC').value = '';
    document.getElementById('precioC').value = '';
    fillSelect(ENDPOINT_PROVEEDOR, "un proveedor", 'proveedorC', null);
    fillSelect(ENDPOINT_CAREGORIA, "una categoria", 'categoria_ingredienteC', null);
}

function openUpdate(idingrediente) {
    //Se abre el modal de modificar
    modal_modificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idingredienteM", idingrediente);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_INVENTARIO + "readOne", {
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
                    document.getElementById("idingredienteM").value = response.dataset.idingrediente;
                    document.getElementById("nombre_ingredienteM").value = response.dataset.ingrediente;
                    document.getElementById("existenciasM").value = response.dataset.existencia_ingrediente;
                    document.getElementById("precioM").value = response.dataset.precio_ingrediente;
                    let fecha = response.dataset.fecha_caducidad.split(' ');
                    document.getElementById("fecha_caducidadM").value = fecha[0];
                    fillSelect(ENDPOINT_PROVEEDOR, "un proveedor", 'proveedorM', response.dataset.idproveedor);
                    fillSelect(ENDPOINT_CAREGORIA, "una categoria", 'categoria_ingredienteM', response.dataset.idcategoria_ingrediente);
                    fillSelect(ENDPOINT_ESTADO, "una estado", 'estado_ingredienteM', response.dataset.idestado_ingrediente);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

function openDelete(idingrediente) {
    //Se abre el modal de modificar
    modal_eliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idingredienteM", idingrediente);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_INVENTARIO + "readOne", {
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
                    document.getElementById("idingredienteD").value = response.dataset.idingrediente;
                    document.getElementById("nombre_ingredienteD").value = response.dataset.ingrediente;
                    document.getElementById("existenciasD").value = response.dataset.existencia_ingrediente;
                    document.getElementById("precioD").value = response.dataset.precio_ingrediente;
                    let fecha = response.dataset.fecha_caducidad.split(' ');
                    document.getElementById("fecha_caducidadD").value = fecha[0];
                    fillSelect(ENDPOINT_PROVEEDOR, "un proveedor", 'proveedorD', response.dataset.idproveedor);
                    fillSelect(ENDPOINT_CAREGORIA, "una categoria", 'categoria_ingredienteD', response.dataset.idcategoria_ingrediente);
                    fillSelect(ENDPOINT_ESTADO, "una estado", 'estado_ingredienteD', response.dataset.idestado_ingrediente);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_INVENTARIO, 'search-form');
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createIngre';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_INVENTARIO, action, 'agregar_form', modal_agregar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('modificar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'updateIngre';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_INVENTARIO, action, 'modificar_form', modal_modificar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('eliminar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'deleteIngre';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_INVENTARIO, action, 'eliminar_form', modal_eliminar);
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
    fetch(API_INVENTARIO + 'readAllContador', {
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
                        if (row.idestado_ingrediente == 1) {
                            boton_visible += `
                                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/menu_comida.png"></button>
                            `;
                        } else {
                            boton_visible += `
                                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/eliminar.png"></button>
                            `;
                        }
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.ingrediente}</td>
                                <td>${row.fecha_caducidad}</td>
                                <td>${row.existencia_ingrediente}</td>
                                <td>${row.categoria_ingrediente}</td>
                                <td>${row.nombre_proveedor}</td>
                                <td>${row.precio_ingrediente}</td>
                                <td>
                                    <div class="centrar_estadoemp">
                                        ${boton_visible} 
                                    </div>
                                </td>
                                <td>
                                    <!-- Boton modal Modificar -->
                                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                        <button onclick="openUpdate(${row.idingrediente})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt="modificar"></button>
                                        <!--Boton Modal Eliminar-->
                                        <button onclick="openDelete(${row.idingrediente})" type="button" class="btn btn-danger eliminar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt="eliminar"></button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbingrediente').innerHTML = content;
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
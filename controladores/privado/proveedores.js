const API_DISTRIBUIDOR = SERVER + 'sitio_privado/api_proveedores.php?action=';

var modalAgregar = new bootstrap.Modal(document.getElementById('agregar_proveedor'), {
    keyboard: false
})

var modalModificar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
})

var modalEliminar = new bootstrap.Modal(document.getElementById('eliminar'), {
    keyboard: false
})

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_DISTRIBUIDOR);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.nombre_proveedor}</td>
                <td>${row.direccion_proveedor}</td>
                <td>${row.telefono_proveedor}</td>
                <td>
                <div
                    class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                    <button onclick="openUpdate(${row.idproveedor})" type="button" class="btn btn-info editar"
                    id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar">
                    <img src="../../recursos/icons/modificar.png"alt=""></button>

                    <!--Boton Modal Eliminar-->
                    <button onclick="openDelete(${row.idproveedor})" type="button" class="btn btn-danger eliminar"
                    id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar">
                    <img src="../../recursos/icons/eliminar.png" alt=""></button>
                </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbproveedor').innerHTML = content;
}

//Funcion para insertar datos
function openCreate() {
    modalAgregar.show();
    document.getElementById('proveedorC').value = ''
    document.getElementById('direccion_proveedor').value = ''
    document.getElementById('telefono_proveedor').value = ''
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createProveedor';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_DISTRIBUIDOR, action, 'agregar_form', modalAgregar);
});

//Funcion para actualizar datos
function openUpdate(idproveedor){
    modalModificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idproveedor", idproveedor);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_DISTRIBUIDOR + "readOne", {
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
                    document.getElementById("idproveedorM").value = response.dataset.idproveedor;
                    document.getElementById("proveedorM").value = response.dataset.nombre_proveedor;
                    document.getElementById("direccion_proveedorM").value = response.dataset.direccion_proveedor;
                    document.getElementById("telefono_proveedorM").value = response.dataset.telefono_proveedor;
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
document.getElementById('modificar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'updateProveedor';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_DISTRIBUIDOR, action, 'modificar_form', modalModificar);
});

//Funcion para eliminar un registro
function openDelete(idproveedor){
    modalEliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idproveedor", idproveedor);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_DISTRIBUIDOR + "readOne", {
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
                    document.getElementById("idproveedorD").value = response.dataset.idproveedor;
                    document.getElementById("proveedorD").value = response.dataset.nombre_proveedor;
                    document.getElementById("direccion_proveedorD").value = response.dataset.direccion_proveedor;
                    document.getElementById("telefono_proveedorD").value = response.dataset.telefono_proveedor;
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
document.getElementById('eliminar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'eliminarProveedor';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_DISTRIBUIDOR, action, 'eliminar_form', modalEliminar);
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_DISTRIBUIDOR, 'search-form');
});
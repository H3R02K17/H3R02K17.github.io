const API_CATEGORIA = SERVER + 'sitio_privado/api_categoria_producto.php?action=';

var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_categoria'), {
    keyboard: false
})

var modal_modificar = new bootstrap.Modal(document.getElementById('modificar_categoria'), {
    keyboard: false
})

var modal_eliminar = new bootstrap.Modal(document.getElementById('eliminar_categoria'), {
    keyboard: false
})
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_CATEGORIA);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td><img src ="${SERVER}images/categoria/${row.imagen_categoria_producto}"</td>
                <td>${row.categoria_producto}</td>
                <td>
                <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                    <!-- Boton Modal Modificar -->
                    <button onclick="openUpdate(${row.idcategoria_producto})" type="button" class="btn btn-info editar" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar" id="btn_modal">
                    <img src="../../recursos/icons/modificar.png" alt=""></button>
                    <!-- Boton Modal Eliminar -->
                    <button onclick="openDelete(${row.idcategoria_producto})" type="button" class="btn btn-danger eliminar" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar" id="btn_modal">
                    <img src="../../recursos/icons/eliminar.png" alt=""></button>
                </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbcategoria').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('thesearch').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_CATEGORIA, 'thesearch');
});

//Funcion para insertar datos
function openCreate() {
    modal_agregar.show();
    document.getElementById('categoriaC').value = '';
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'createCategoria';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIA, action, 'agregar_form', modal_agregar);
});

//funcion para tener una visualizacion de la imagen
function preliminar(event) {
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
function preliminar2(event) {
    let leer_img = new FileReader();
    let id_img = document.getElementById("imagen_principal_modificar");
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

//Funcion para actualizar datos
function openUpdate(idcategoria_producto){
    //Abrimos el modal de actualizar
    modal_modificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idcategoria_producto", idcategoria_producto);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_CATEGORIA + "readOne", {
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
                    document.getElementById("idcategoriaM").value = response.dataset.idcategoria_producto;
                    document.getElementById("categoriaM").value = response.dataset.categoria_producto;
                    document.getElementById('imagen_categoriaM').required = false;
                    document.getElementById('imagen_principal_modificar').setAttribute("src",SERVER +"images/categoria/"+response.dataset.imagen_categoria_producto);
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
    let action = 'updateCategoria';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIA, action, 'modificar_form', modal_modificar);
});

//Funcion para eliminar un registro
function openDelete(idcategoria_producto){
    //Se abre el modal de eliminar
    modal_eliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idcategoria_producto", idcategoria_producto);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_CATEGORIA + "readOne", {
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
                    document.getElementById("idcategoriaD").value = response.dataset.idcategoria_producto;
                    document.getElementById("categoriaD").value = response.dataset.categoria_producto;
                    document.getElementById('imagen_categoriaD').required = false;
                    document.getElementById('imagen_principal_eliminar').setAttribute("src",SERVER +"images/categoria/"+response.dataset.imagen_categoria_producto);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

document.getElementById('eliminar_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función para eliminar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_CATEGORIA, 'eliminarCategoria', 'eliminar_form', modalEliminar);
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
    fetch(API_CATEGORIA + 'readAllContador', {
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
                                <td><img src ="${SERVER}images/categoria/${row.imagen_categoria_producto}"</td>
                                <td>${row.categoria_producto}</td>
                                <td>
                                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                        <!-- Boton Modal Modificar -->
                                        <button onclick="openUpdate(${row.idcategoria_producto})" type="button" class="btn btn-info editar" data-bs-toggle="modal" data-bs-target="#modificar_categoria" id="btn_modal">
                                        <img src="../../recursos/icons/modificar.png" alt=""></button>
                                        <!-- Boton Modal Eliminar -->
                                        <button onclick="openDelete(${row.idcategoria_producto})" type="button" class="btn btn-danger eliminar" data-bs-toggle="modal" data-bs-target="#eliminar_categoria"id="btn_modal">
                                        <img src="../../recursos/icons/eliminar.png" alt=""></button>
                                    </div>
                                </td>
                            </tr>`;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbcategoria').innerHTML = content;
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
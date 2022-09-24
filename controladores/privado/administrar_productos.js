// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_privado/api_productos.php?action=';
const ENDPOINT_ESTADO = SERVER + 'sitio_privado/api_productos.php?action=obtenerEstadoProducto';
const ENDPOINT_CATEGORIAS = SERVER + 'sitio_privado/api_productos.php?action=obtenerCategoriaProducto';
const ENDPOINT_INGREDIENTES = SERVER + 'sitio_privado/api_productos.php?action=obtenerIngredienteModificar';

//se declara una variable para hacer funcionar el modal de modificar
var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_producto'), {
    keyboard: false
})
//se declara una variable para hacer funcionar el modal de modificar
var modal_modificar = new bootstrap.Modal(document.getElementById('modificar'), {
    keyboard: false
})

var modal_eliminar = new bootstrap.Modal(document.getElementById('eliminar'), {
    keyboard: false
})

var modal_ingrediente = new bootstrap.Modal(document.getElementById('veringrediente'), {
    keyboard: false
})

var modalmodificarIngredientes = new bootstrap.Modal(document.getElementById('modificar_ingredientes'), {
    keyboard: false
})

var modalAgregarIngrediente = new bootstrap.Modal(document.getElementById('agregar_ingrediente_modificar'), {
    keyboard: false
})
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_PRODUCTOS);
    readIngrediente(API_PRODUCTOS);
    // Se restauran los elementos del formulario.
    document.getElementById('form_agregarP').reset();
    document.getElementById('form_agregarIP').reset();
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
            <td><img src="${SERVER}images/productos/${row.imagen_principal}"></td>
                <td>${row.nombre_producto}</td>
                <td>${row.estado_producto}</td>
                <td>${row.categoria_producto}</td>
                <td>${row.descripcion}</td>
                <td>${row.existencias}</td>
                <td>${row.porcentaje_descuento}%</td>
                <td>$${row.precio_producto}</td>
                <td>
                    <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                        <!-- Boton para activar modal modificar -->
                        <button type="button" class="btn btn-info editar" onclick="openUpdate(${row.idproducto}) "id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt=""></button>
                        <!-- Boton para activar modal eliminar -->
                        <button type="button" class="btn btn-danger eliminar" onclick="openDelete(${row.idproducto})" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                        <!-- Boton para activar ver ingredientes -->
                        <button type="button" class="btn btn-warning btn_ingredientes" onclick="openIngredientes(${row.idproducto})" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver ingrediente"><img src="../../recursos/icons/ingredientes.png" alt=""></button>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbproductos').innerHTML = content;
}

/*Para cargar todos los registros de ingredientes*/ 
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

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readIngrediente().
function fillIngredientes(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td><input onclick="openLlenarArrayIngrediente(${row.idingrediente})" type="checkbox" id="ingrediente_checkbox${row.idingrediente}" name="ingrediente_checkbox"></td>
                <td>${row.ingrediente}</td>
                <td>${row.categoria_ingrediente}</</td>
        </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbingredientes').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('thesearch').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_PRODUCTOS, 'thesearch');
});

function openCreate() {
    modal_agregar.show();
    // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js
    fillSelect(ENDPOINT_CATEGORIAS, 'una categoria', 'categoria_agregar', null);
    fillSelect(ENDPOINT_ESTADO, 'un estado', 'estado', null);
}

document.getElementById('form_agregarP').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    let action = 'create';
    saveRow(API_PRODUCTOS, action, 'form_agregarP', modal_agregar);
});

//funcion para tener una visualizacion de la imagen
function preliminar(event) {
    let leer_img = new FileReader();
    let id_img = document.getElementById("archivo");
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

//funcion para tener una visualizacion de la imagen
function preliminar2(event) {
    let leer_img = new FileReader();
    let id_img = document.getElementById("imagen_pr");
    //Onload es un método que al cargar las imagenes seleccionadas procede a realizar una accion
    leer_img.onload = () => {
        if (leer_img.readyState == 2) {
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0])
}

//Funcion para actualizar datos
function openUpdate(id) {
    modal_modificar.show()
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("id", id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + "readOne", {
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
                    document.getElementById("id").value = response.dataset.idproducto;
                    document.getElementById("idproducto_ingrediente").value = response.dataset.idproducto;
                    document.getElementById("nombreM").value = response.dataset.nombre_producto;
                    document.getElementById("descripcionM").value = response.dataset.descripcion;
                    document.getElementById("precioM").value = response.dataset.precio_producto;
                    document.getElementById("descuentoM").value = response.dataset.porcentaje_descuento;
                    document.getElementById("existenciasM").value = response.dataset.existencias;
                    document.getElementById('archivoM').required = false;
                    fillSelect(ENDPOINT_ESTADO, 'un estado', 'estadoM', response.dataset.idestado_producto);
                    fillSelect(ENDPOINT_CATEGORIAS, 'una categoria', 'categoriaM', response.dataset.idcategoria_producto);
                    document.getElementById('imagen_pr').setAttribute("src", SERVER + "images/productos/" + response.dataset.imagen_principal);
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
document.getElementById('form_modificarP').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'updateP';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PRODUCTOS, action, 'form_modificarP', modal_modificar);
    valor = 0;
});

//Funcion para eliminar un registro
function openDelete(id) {
    //Abre el modal de eliminar
    modal_eliminar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("id", id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + "readOne", {
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
                    document.getElementById("idd").value = response.dataset.idproducto;
                    document.getElementById("nombreD").value = response.dataset.nombre_producto;
                    document.getElementById("descripcionD").value = response.dataset.descripcion;
                    document.getElementById("precioD").value = response.dataset.precio_producto;
                    document.getElementById("descuentoD").value = response.dataset.porcentaje_descuento;
                    document.getElementById("existenciasD").value = response.dataset.existencias;
                    document.getElementById('archivoD').required = false;
                    fillSelect(ENDPOINT_ESTADO, 'un estado', 'estadoD', response.dataset.idestado_producto);
                    fillSelect(ENDPOINT_CATEGORIAS, 'una categoria', 'categoriaD', response.dataset.idcategoria_producto);
                    document.getElementById('imagen_main').setAttribute("src", SERVER + "images/productos/" + response.dataset.imagen_principal);
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
document.getElementById('form_eliminarP').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    //let action = 'delete';
    let action = 'delete';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    confirmDelete(API_PRODUCTOS,  action, 'form_eliminarP', modal_eliminar);
});

// Para mostrar tabla de los ingredientes que estan registrados en un producto
function openIngredientes(id) {
    //Abrir modal de ingredientes
    modal_ingrediente.show();
    // Se define un objeto con los datos del registro a consultar su detalle.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + 'CargarLosingredientes', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria.
                if (response.status) {
                    data = response.dataset;
                    let content = '';
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                        <tr>
                            <td scope="row">${row.categoria_ingrediente}</td>
                            <td>${row.ingrediente}</td>
                            <td>${row.existencia_ingrediente}</td>
                        </tr>
                        `
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbveringre').innerHTML = content;
                } else {
                    let content = '';
                    document.getElementById('tbveringre').innerHTML = content;
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('ingrediente_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = 'cargarIngredientexProduct';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PRODUCTOS, action, 'ingrediente_form', modal_ingrediente);
});

// Para mostrar tabla de los ingredientes que estan registrados en un producto

function openIngrediento() {
    // Se define un objeto con los datos del registro a consultar su detalle.
    var valor = document.getElementById('id').value;
    const data = new FormData();
    data.append('id', valor);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + 'CargarLosingredientes', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta.
        if (request.ok) {
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria.
                if (response.status) {
                    data = response.dataset;
                    let content = '';
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                        <tr> 
                                <td scope="row">${row.categoria_ingrediente}</td>
                                <td>${row.ingrediente}</td>
                                <td>${row.existencia_ingrediente}</td>
                                <td>
                                    <div
                                        class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                        <!-- Boton para eliminar ingrediente-->
                                        <button type="submit"
                                        onclick="openDeleteingrediente(${row.idproducto_ingrediente})" class="btn btn-danger eliminar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar Ingrediente"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                                    </div>
                                </td>
                        </tr>
                        `
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbingredientesProducto').innerHTML = content;
                } else {
                    document.getElementById('tbingredientesProducto').innerHTML = content;
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Funcion para eliminar un registro
function openDeleteingrediente(id) {
    
    //document.getElementById('idi}').value = '';
    document.getElementById('idi').value = id;
    console.log(id);
    var valor = document.getElementById('idi').value;
    const data = new FormData();
    data.append("idi", valor);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + "readOneIngredientes", {
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
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de eliminar en modificar.
document.getElementById('form_modificarIP').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Modal para confirmar si desea eliminar el ingrediente
    Swal.fire({
        title: 'Advertencia',
        text: '¿Desea eliminar el registro?',
        icon: 'warning',
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        stopKeydownPropagation: false
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(API_PRODUCTOS + "deleteIngrediente", {
                method: 'post',
                body: new FormData(document.getElementById("form_modificarIP"))
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.estado) {
                            modal_eliminar.hide();
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro y se muestra un mensaje de éxito.
                            openIngrediento();
                            sweetAlert(1, response.message, null);
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.estado + ' ' + request.estadoText);
                }
            });
        }
    });
});

//Función para abrir el agregar ingrediente en modificar
function openCreateIngrediente() {
    modalAgregarIngrediente.show();
    fillSelect(ENDPOINT_INGREDIENTES, 'un ingrediente', 'ingrediente_select', null);
}

//Metodo para agregar un nuevo ingrediente en modificar
document.getElementById('form_modificarAgregarI').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_PRODUCTOS + "createIngredientexProducto", {
        method: 'post',
        body: new FormData(document.getElementById("form_modificarAgregarI"))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    modalAgregarIngrediente.hide();
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    openIngrediento();
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

//funcion para guardar ingredientes
//se crea un array para que este guarde el id de los ingredientes
var ingredientes = [];
function openLlenarArrayIngrediente(idingrediente) {
    //se declara otra variable que hará push y guarde los ingredientes
    if(ingredientes.includes(idingrediente)){
        ingredientes = ingredientes.filter(ingredientes => ingredientes !== idingrediente)
        console.log(ingredientes);
    }else{  
        ingredientes.push((idingrediente));
        console.log(ingredientes);
    }
    //prueba para verificar que sirve el guardado del id por checkbox
}

//función para llenar el input del array de ingredientes
function llenarArray() {
    var content = '';
    for (let i = 0; i < ingredientes.length; i++) {
        content += `
        <option value="${ingredientes[i]}" selected>${ingredientes[i]}</option>
        `;
    }
    document.getElementById('ingredientes_').innerHTML = content;
}

//Variable que servira para contador del pagination
var valor = 0;

//Método para contador
function ContadorPagination(navegar) {
    const data = new FormData();
    if (navegar == 1) {
        valor += 9;
        data.append('contador', valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
    else if (navegar == 2 && valor >= 9) {
        valor = valor - 9;
        data.append('contador', valor);
        console.log(valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
}

function navegacionTabla(data) {
    fetch(API_PRODUCTOS + 'readAllContador', {
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
                            <td><img src="${SERVER}images/productos/${row.imagen_principal}"></td>
                            <td>${row.nombre_producto}</td>
                            <td>${row.estado_producto}</td>
                            <td>${row.categoria_producto}</td>
                            <td>${row.descripcion}</td>
                            <td>${row.existencias}</td>
                            <td>${row.porcentaje_descuento}%</td>
                            <td>$${row.precio_producto}</td>
                            <td>
                                <div class="d-grid gap-2 d-md-block d-md-flex justify-content-center">
                                    <!-- Boton para activar modal modificar -->
                                    <button type="button" class="btn btn-info editar" onclick="openUpdate(${row.idproducto})" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt=""></button>
                                    <!-- Boton para activar modal eliminar -->
                                    <button type="button" class="btn btn-danger eliminar" onclick="openDelete(${row.idproducto})" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Eliminar"><img src="../../recursos/icons/eliminar.png" alt=""></button>
                                    <!-- Boton para activar ver ingredientes -->
                                    <button type="button" class="btn btn-warning btn_ingredientes"
                                    onclick="openShow(${row.idproducto})" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver ingrediente"><img src="../../recursos/icons/ingredientes.png" alt=""></button>
                                </div>
                            </td>
                        </tr>`;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('tbproductos').innerHTML = content;
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
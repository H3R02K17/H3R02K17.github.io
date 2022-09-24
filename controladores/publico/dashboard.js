// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_publico/api_productos.php?action=';

//Evento que se ejecuta cuando se carga la página web
document.addEventListener('DOMContentLoaded', function () {
    cargarCategorias();
    cargarProductos();
});

function cargarCategorias(){
    // Petición para solicitar los datos de las categorías.
    fetch(API_PRODUCTOS + 'cargarCategorias', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es satisfactoria, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es correcta, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    let url = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
                        url = `productos.html?id=${row.idcategoria_producto}&nombre=${row.categoria_producto}`;
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                        <!--Tarjeta de categoria-->
                        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 col-xxl-4" id="tarjetas">
                            <div class="card">
                                <div class="card-body">
                                    <!--Titulo de la categoria de producto-->
                                    <h5 class="card-title">${row.categoria_producto}</h5>
                                    <!--Imagen de la categoria de producto-->
                                    <img src="${SERVER}images/categoria/${row.imagen_categoria_producto}" class="card-img-top" alt="...">
                                    <!--Boton enlace a los productos de esta categoria-->
                                    <a href="${url}" class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver ${row.categoria_producto}">Leer más...</a>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar las categorías.
                    document.getElementById('categorias').innerHTML = content;
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                            return new bootstrap.Tooltip(tooltipTriggerEl)
                        })
                } else {
                    // Se asigna al título del contenido un mensaje de error cuando no existen datos para mostrar.
                    let title = `<i class="material-icons small">error</i><span class="red-text">${response.exception}</span>`;
                    document.getElementById('categorias').innerHTML = title;
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function cargarProductos(){
    // Petición para solicitar los datos de las categorías.
    fetch(API_PRODUCTOS + 'productosFavoritos', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es satisfactoria, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es correcta, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    var total_descuento = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        //Se obtiene el valor del descuento para luego restarlo con el precio original
                        total_descuento = row.precio_producto * (row.porcentaje_descuento / 100);
                        // Se crean y concatenan las tarjetas con los datos de cada categoría.
                        content += `
                        <!--Tarjeta de productos-->
                        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 col-xxl-3" id="tarjetas_productos">
                            <div class="card">
                                <div class="card-body">
                                    <!--Imagen del producto-->
                                    <img src="${SERVER}images/productos/${row.imagen_principal}" class="card-img-top" alt="...">
                                    <div class="container-fluid" id="detalle_producto">
                                        <div class="row">
                                            <!--Nombre del producto-->
                                            <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8" id="nombre_producto">
                                                <h6 class="card-title">${row.nombre_producto}</h6>
                                            </div>
                                            <!--Precio del producto que funciona como enlace a su apartado de descripción-->
                                            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                                                <a href="detalle_producto.html?id=${row.idproducto}" class="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Ver Detalle de ${row.nombre_producto}">$${(row.precio_producto - total_descuento).toFixed(2)}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar las categorías.
                    document.getElementById('productos_favoritos').innerHTML = content;
                    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                            return new bootstrap.Tooltip(tooltipTriggerEl)
                        })
                } else {
                    // Se asigna al título del contenido un mensaje de error cuando no existen datos para mostrar.
                    let title = `<span>${response.exception}</span>`;
                    document.getElementById('categorias').innerHTML = title;
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

/*Funciones para cambiar la imagen de los botones al ponerle encima el mouse */
function CambiarImagen(valor1, valor2) {
    var image = document.getElementById(valor1);
    image.src = "../../recursos/icons/" + valor2;
}

function CambiarImagen2(valor1, valor2) {
    var image = document.getElementById(valor1);
    image.src = "../../recursos/icons/" + valor2 + "2.png";
}
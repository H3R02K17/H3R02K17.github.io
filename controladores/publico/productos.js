// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_publico/api_productos.php?action=';

//Variable que ayudará a almacenar el idcategoria para usarlo con pagination
var id_categoria;

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('id');
    const NAME = params.get('nombre');
    // Se llama a la función que muestra los productos de la categoría seleccionada previamente.
    readProductosCategoria(ID, NAME);
    pagination(ID);
    id_categoria = ID;
});

// Función para obtener y mostrar los productos de acuerdo a la categoría seleccionada.
function readProductosCategoria(id, categoria) {
    // Se define un objeto con los datos del registro seleccionado.
    const DATA = new FormData();
    DATA.append('idcategoria_producto', id);
    DATA.append('contador', 0);
    // Petición para solicitar los productos de la categoría seleccionada.
    fetch(API_PRODUCTOS + 'readProductosCategoria', {
        method: 'post',
        body: DATA
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    var total_descuento = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        //Se obtiene el valor del descuento para luego restarlo con el precio original
                        total_descuento = row.precio_producto * (row.porcentaje_descuento / 100);
                        // Se crean y concatenan las tarjetas con los datos de cada producto.
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
                                                <a href="detalle_producto.html?id=${row.idproducto}" class="btn">$${(row.precio_producto - total_descuento).toFixed(2)}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    // Se asigna como título la categoría de los productos.
                    document.getElementById('titulo_categoria').textContent = categoria;
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('productos').innerHTML = content;
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('titulo_categoria').innerHTML = response.exception;
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function pagination(id) {
    // Se define un objeto con el ID de la categoria seleccionada.
    const DATA2 = new FormData();
    DATA2.append('idcategorias_producto', id);
    // Petición para contar los productos de la categoría seleccionada.
    fetch(API_PRODUCTOS + 'contadorProductos', {
        method: 'post',
        body: DATA2
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let cantidad = response.dataset.cantidad_productos;
                    let pagination = (cantidad / 8);
                    var paginas = `
                    <li class="page-item disabled" id="pg_retroceder">
                        <a class="page-link" href="#" aria-label="Previous" onclick="contadorPagination(2)">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    `;
                    if (Number.isInteger(pagination)) {
                        for (let i = 1; i <= pagination; i++) {
                            paginas += `
                            <li id="activar${i-1}" class="page-item"><a class="page-link num_pag" href="#" onclick="contadorPagination2(${i-1})">${i}</a></li>
                            `;
                            maxima_pag = i;
                        }
                    } else {
                        for (let i = 1; i < pagination + 1; i++) {
                            paginas += `
                            <li id="activar${i-1}" class="page-item"><a class="page-link num_pag" href="#" onclick="contadorPagination2(${i-1})">${i}</a></li>
                            `;
                            maxima_pag = i;
                        }
                    }
                    paginas += `
                    <li class="page-item" id="pg_avanzar">
                        <a class="page-link" href="#" aria-label="Next" onclick="contadorPagination(1)">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                    `;
                    console.log(maxima_pag);
                    document.getElementById("pagination").innerHTML = paginas;
                    document.getElementById("activar0").classList.add('active');
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(2, response.contadorProductos, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Variables que serviran para contadores del pagination
//Variable a usar con pagination de flechas
var valor = 0;
//Variable a usar con pagination de flechas y que servirá para activar el pagination de numeros
var contador = 0;
//Variable a usar con pagination de flechas y que servirá para saber el máximo de paginas
var maxima_pag = 0;

//Método para contador de flechas
function contadorPagination(navegar) {
    const data = new FormData();
    //Un array que almacena cada objeto que tenga la clase "num_pag" (son los botones con números)
    [].forEach.call(document.querySelectorAll(".active"), function(clases){
        //Eliminamos la clase activa del boton pagination
        clases.classList.remove('active');
    });
    //Si es 1, es porque esta avanzando de página en pagina
    if (navegar == 1) {
        //Si no esta en la pagina 1, la fecha retroceder esta activa, eliminamos la clase desabilitado
        document.getElementById("pg_retroceder").classList.remove("disabled");
        // Su valor inicial es 0, entonces aumentará dependiendo la flecha de avance
        contador ++;
        // Si se encuentra en la última pagina, se desactiva la flecha de avanzar
        if (contador == (maxima_pag-1)) {
            document.getElementById("pg_avanzar").classList.add("disabled")
        }
        //Asignamos el contador para decirle en que página se encuentra
        document.getElementById(`activar${contador}`).classList.add('active');
        //Le decimos que traiga los siguientes 8 registros
        valor += 8;
        //Almacenamos el valor contador
        data.append('contador', valor);
        //Almacenamos el valor de la categoria en la que nos encontramos
        data.append('idcategoria_producto', id_categoria);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionSitio(data);
    }
    //Si es 2, es porque esta retrocediendo de página en pagina y que aún pueda retroceder si el valor es mayor a 8, aún le falta una página (la primera)
    else if (navegar == 2 && valor >= 8) {
        //Si no esta en la pagina 1, la fecha retroceder esta activa, eliminamos la clase desabilitado
        document.getElementById("pg_retroceder").classList.remove("disabled");
        //Si estaba en la última pagina y retrocedio, le eliminamos la clase desabilitado
        document.getElementById("pg_avanzar").classList.remove("disabled");
        // Su valor inicial es 0, entonces disminuira dependiendo la flecha de retroceso
        contador --;
        //Asignamos el contador para decirle en que página se encuentra
        document.getElementById(`activar${contador}`).classList.add('active');
        //Le decimos que traiga los anteriores 8 registros
        valor = valor - 8;
        //Si se retrocede a la pagina inicial se desactiva el boton retroceso
        if(valor == 0){
            //Si esta en la pagina 1, la fecha retroceder la inactivamos, agregamos la clase desabilitado
            document.getElementById("pg_retroceder").classList.add("disabled");
        }
        //Almacenamos el valor contador
        data.append('contador', valor);
        //Almacenamos el valor de la categoria en la que nos encontramos
        data.append('idcategoria_producto', id_categoria);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionSitio(data);
    }
}

//Método para contador con números
function contadorPagination2(navegar) {
    // Si la opción es 0, es porque es la pagina número 1, la inicial
    if (navegar == 0) {
        //Si esta en la pagina 1, la fecha retroceder la inactivamos, agregamos la clase desabilitado
        document.getElementById("pg_retroceder").classList.add("disabled");
        //Si estaba en la última pagina y retrocedio, le eliminamos la clase desabilitado
        document.getElementById("pg_avanzar").classList.remove("disabled");
        //Un array que almacena cada objeto que tenga la clase "num_pag" (son los botones con números)
        [].forEach.call(document.querySelectorAll(".active"), function(clases){
            //Eliminamos la clase activa del boton pagination
            clases.classList.remove('active');
        });
        //Si es 0, es decir que estamos en la pagina 1, así que se le activa su boton
        document.getElementById("activar0").classList.add('active');
        //Reiniciamos la variable navegar a 0
        navegar = 0;
        //Formateamos el valor del pagination con flechas para que pueda funcionar, asignando 0 para que se situe en la primera pagina
        valor = 0;
        //Reiniciamos a 0 el contador para que vuelva a contar si se ocupan las flechas
        contador = 0;
    } 
    // Si la opción es diferente de 0, es porque selecciono otra pagina
    else {
        //Si estaba en la última pagina y retrocedio, le eliminamos la clase desabilitado
        document.getElementById("pg_avanzar").classList.remove("disabled");
        //Si no esta en la pagina 1, la fecha retroceder esta activa, eliminamos la clase desabilitado
        document.getElementById("pg_retroceder").classList.remove("disabled");
        //Un array que almacena cada objeto que tenga la clase "num_pag", (son los botones con números)
        [].forEach.call(document.querySelectorAll(".active"), function(clases){
            //Eliminamos la clase activa del boton pagination
            clases.classList.remove('active');
        });
        //Le asignamos la clase activa al boton de la pagina en la que nos encontremos
        document.getElementById(`activar${navegar}`).classList.add('active');
        //Agregamos el valor de navegación, para saber en que pagina se encuentra, si decide usar las fechas, se restara o sumará en base a la posición actual
        contador = navegar;
        // Si se encuentra en la última pagina, se desactiva la flecha de avanzar
        if (contador == (maxima_pag-1)) {
            document.getElementById("pg_avanzar").classList.add("disabled")
        }
        //Formateamos el valor del pagination con flechas para que pueda funcionar, lo multiplicamos según la posición de la pagina y 8 para que traiga los productos
        //correspondientes a esa página y tenga sentido al retroceder o avanzar
        valor = (navegar * 8);
        //Multiplicamos el número de la pagina por el valor 8, para que así traiga los 8 siguientes productos dependiendo de la pagina en que se encuentre
        navegar = (navegar * 8);
    }
    const data = new FormData();
    data.append('contador', navegar);
    data.append('idcategoria_producto', id_categoria);
    // Se llama a la función que realiza la búsqueda por categoria
    navegacionSitio(data);
}


function navegacionSitio(data) {
    fetch(API_PRODUCTOS + 'readProductosCategoria', {
        method: 'post',
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    var total_descuento = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        //Se obtiene el valor del descuento para luego restarlo con el precio original
                        total_descuento = row.precio_producto * (row.porcentaje_descuento / 100);
                        // Se crean y concatenan las tarjetas con los datos de cada producto.
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
                                                <a href="detalle_producto.html?id=${row.idproducto}" class="btn">$${(row.precio_producto - total_descuento).toFixed(2)}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    // Se agregan las tarjetas a la etiqueta div mediante su id para mostrar los productos.
                    document.getElementById('productos').innerHTML = content;
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
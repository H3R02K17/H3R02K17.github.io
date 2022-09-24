// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_privado/api_productos.php?action=';
const API_RESERVACIONES = SERVER + 'sitio_privado/api_reservaciones.php?action=';
const ENDPOINT_CATEGORIAS = SERVER + 'sitio_privado/api_productos.php?action=obtenerCategoriaProducto';
const ENDPOINT_PROVEEDOR = SERVER + 'sitio_privado/api_proveedores.php?action=readAll';

document.addEventListener('DOMContentLoaded', function () {
    graficoLineaReservacionesMes();
    graficoBarraMesasReservadas();
    graficaHoras();
    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let today = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let day = ('0' + today.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = today.getFullYear();
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let date = `${year}-${month}-${day}`;
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('fecha_inicio').setAttribute('max', date);
    document.getElementById('fecha_final').setAttribute('max', date);
});

//Variable para saber que filtro eligio (Categoria o Proveedor)
var tipo,
    // Variable para mostrar en titulo de gráfica, dependiendo que tipo eligio (Categoria o Proveedor)
    tipo_frase,
    //Variable para saber que opción ha elegido
    opcion;

//Funcion para seleccionar un filtro para cargar en el select de opciones
function seleccionFiltro(opcion) {
    switch (opcion) {
        case "1":
            //Traemos todas las categorias existentes
            fillSelect(ENDPOINT_CATEGORIAS, 'una categoría', 'opciones_ventas', null);
            tipo = 1;
            tipo_frase = "su categoria";
            break;
        case "2":
            //Traemos todas las marcas existentes
            fillSelect(ENDPOINT_PROVEEDOR, 'un proveedor', 'opciones_ventas', null);
            tipo = 2;
            tipo_frase = "su proveedor";
            break;
        default:
            console.log("no entre a ningún caso");
            break;
    }
}

//Al seleccionar una opción de los 2 filtros, se guardará en una variable
function seleccionOpcion(opcion_elegida) {
    opcion = opcion_elegida;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de generar gráfica
document.getElementById('form_personalizado').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('tipo', tipo);
    data.append('opcion', opcion);
    // Petición para obtener los datos del gráfico.
    fetch(API_PRODUCTOS + 'productosVendidosFiltro', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.estado) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let cantidades = [];
                    let cantidades2 = [];
                    let nombre_producto = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        // Valores en Y
                        cantidades.push(row.monto_total);
                        cantidades2.push(row.cantidad_producto);
                        // Valores en X
                        nombre_producto.push(row.nombre_producto);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    barGraph('grafica5', nombre_producto, cantidades, 'Cantidad de productos', ('TOP 10 productos con más ingresos filtrados por ' + tipo_frase));
                    // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
                    polarGraph('grafica6', nombre_producto, cantidades2, ('TOP 10 productos con más cantidad vendidad filtrada por ' + tipo_frase));
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

// Función para mostrar la cantidad de reservaciones por mes
function graficoLineaReservacionesMes() {
    // Petición para obtener los datos del gráfico.
    fetch(API_RESERVACIONES + 'cantidadReservacionesMes', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.estado) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let cantidad = [];
                    let mes = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        cantidad.push(row.cantidad);
                        mes.push(row.nombre_mes);
                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    lineGraph('grafica1', mes, cantidad, 'Cantidad de reservaciones', 'Reservaciones realizadas mensualmente en el año actual');
                } else {
                    document.getElementById('grafica3').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mostrar las mesas mas reservadas
function graficoBarraMesasReservadas() {
    // Petición para obtener los datos del gráfico.
    fetch(API_RESERVACIONES + 'mesasReservadas', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.estado) {
                    // Se declaran los arreglos para guardar los datos a graficar.
                    let cantidad = [];
                    let mesa = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos. 
                        cantidad.push(row.cantidad);
                        mesa.push("Mesa N°" + row.numero_mesa);


                    });
                    // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                    graficaBarras('grafica_2', mesa, cantidad, 'Cantidad de reservaciones', 'TOP 5 Mesas más reservadas');
                } else {
                    document.getElementById('grafica_2').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function graficaHoras() {
    // Petición para obtener los datos del gráfico.
    fetch(API_RESERVACIONES + 'graficaHoras', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a gráficar.
                    let horas = [];
                    let cantidads = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        horas.push("Hora: " + row.hora_dia);
                        cantidads.push(row.cantidad);
                    });
                    // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
                    graficaBarras('grafica3', horas, cantidads, 'Cantidad de reservaciones hechas', 'Horas de reservaciones más solicitadas y el total de reservaciones hechas');
                } else {
                    document.getElementById('grafica3').remove();

                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
function graficaHoras() {
    // Petición para obtener los datos del gráfico.
    fetch(API_RESERVACIONES + 'graficaHoras', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a gráficar.
                    let horas = [];
                    let cantidads = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        horas.push("Hora: " + row.hora_dia);
                        cantidads.push(row.cantidad);
                    });
                    // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
                    graficaBarras('grafica3', horas, cantidads, 'Cantidad de reservaciones hechas', 'Horas de reservaciones más solicitadas y el total de reservaciones hechas');
                } else {
                    document.getElementById('grafica3').remove();

                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mostrar el inventario por un rango de fecha en especifico
function openGraficaVenta(event) {
    event.preventDefault();

    // se crean las variables para las fechas
    let fechaincio = document.getElementById('fecha_inicio').value;
    let fechafinal = document.getElementById('fecha_final').value;

    // se un if para validar q la fecha de inicio no sea mayor que la de fin
    if (fechaincio == 0 && fechafinal == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha para poder generar el reporte.', null);
    } else if (fechaincio == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha de inicio para poder generar el reporte.', null);
    } else if (fechafinal == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha de fin para poder generar el reporte.', null);
    } else if (fechaincio > fechafinal) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'La fecha de inicio debe ser menor a la fecha de fin.', null);
    } else if (fechaincio == fechafinal) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Las fechas son iguales, La fecha de inicio debe ser menor a la fecha de fin.', null);
    } else {
        // Petición para obtener los datos del registro solicitado.
        fetch(API_PRODUCTOS + 'graficoInventarioRango', {
            method: 'post',
            body: new FormData(document.getElementById('mandarfechas'))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        // Se inicializan los campos del formulario con los datos del registro seleccionado.
                        let fecha = [];
                        let cantidades_fechas = [];
                        let cantidad = [];
                        response.dataset.map(function (row) {
                            // Se agregan los datos a los arreglos.
                            fecha.push(row.fecha_entregas);
                            cantidades_fechas.push(row.fecha_cantidades);
                            cantidad.push(row.cantidad);
                        });
                        // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
                        graficaBarras('grafica7', fecha, cantidad, 'Cantidad ingresada en la fecha', 'Cantidad total de productos ingresados en inventario entre ' + fechaincio + ' y ' + fechafinal);
                        // Se llama a la función que genera y muestra un gráfico lineal. Se encuentra en el archivo components.js
                        lineGraph('grafica8', fecha, cantidades_fechas, 'Cantidad ingresada en la fecha', 'Fechas con mayor cantidad de entregas registradas entre ' + fechaincio + ' y ' + fechafinal);
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.estado + ' ' + request.statusText);
            }
        });
    }
}
const PEDIDOS = SERVER + "sitio_privado/api_pedidos.php?action=";
const OBSERVACIONES = SERVER + "sitio_privado/api_observacion.php?action=";

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    traerDatosPedidos();
    estadisticasVentas();
    obtenerObservacionesRecientes();
    // Función que obtiene los registros para llenar la tabla de pedidos recientes en dashboard.
    fetch(PEDIDOS + 'cargarPedidosRecientes', {
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
                fillTable(data);
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
    sessionStorage.setItem('boton_seleccionado', 'btn_dashboard');
    //Var se crea para variables globales
    //let es variables locales
});


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td>${row.nombre_producto}</td>
            <td>${row.cantidad_producto}</td>
            <td>${row.cantidad_descuento}</td>
            <td>${row.monto_total}</td>
        </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tabla_pedidos_recientes').innerHTML = content;
}

//Función para traer datos de total de pedidos en fecha actual, monto totales del pedido en fecha actual y monto totales del mes actual
function traerDatosPedidos() {
    fetch(PEDIDOS + 'datosPedidosMenu', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let pedidos_hoy = '';
                let monto_total = '';
                let monto_total_mensual = '';
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    pedidos_hoy += `
                        <h3>${response.total_pedidos}</h3>
                        <p>Pedidos</p>
                    `;
                    monto_total += `
                        <h3>${'$' + response.monto_total}</h3>
                        <p>Total Ventas</p>
                    `;
                    monto_total_mensual += `
                        <h3>${'$' + response.monto_total_mensual}</h3>
                        <p>Total Ventas</p>
                    `;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                //La constante y las variables las mandamos a llamar con un Id para que se concatenen
                document.getElementById('pedidos_actuales').innerHTML = pedidos_hoy;
                document.getElementById('monto_total').innerHTML = monto_total;
                document.getElementById('monto_total_mensual').innerHTML = monto_total_mensual;
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

// Función para traer los datos de monto total de las ventas de hoy, ayer y anteayer
function estadisticasVentas() {
    fetch(PEDIDOS + 'estadisticasVentas', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se declara e inicializa un objeto para obtener la fecha y hora actual.
                let hoy = new Date();
                // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
                let dia = ('0' + hoy.getDate()).slice(-2);
                // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
                var mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
                // Se declara e inicializa una variable para guardar el año
                let year = hoy.getFullYear();

                // Se le resta un día a la fecha actual, de esta forma a pesar que sea día 1, mostrara el último día del mes anterior
                const yesterday = new Date(hoy);
                yesterday.setDate(yesterday.getDate() - 1);
                let dia_ayer = ('0' + yesterday.getDate()).slice(-2);
                var mes_ayer = ('0' + (yesterday.getMonth() + 1)).slice(-2);

                // Se le resta dos días a la fecha actual, de esta forma a pesar que sea día 1, mostrara dos días del mes anterior
                const ante_ayer = new Date(hoy);
                ante_ayer.setDate(ante_ayer.getDate() - 2);
                let dia_anteayer = ('0' + ante_ayer.getDate()).slice(-2);
                var mes_anteayer = ('0' + (ante_ayer.getMonth() + 1)).slice(-2);
                // Se declara e inicializa una variable para establecer el formato de la fecha.
                let dia_actual = `${dia}-${mes}-${year}`;
                let ayer = `${dia_ayer}-${mes_ayer}-${year}`;
                let anteayer = `${dia_anteayer}-${mes_anteayer}-${year}`;
                let estadisticas_hoy = '';
                let estadisticas_ayer = '';
                let estadisticas_anteayer = '';
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    estadisticas_hoy += `
                    <div>
                        <img src="../../recursos/icons/total_ventas1.png" alt="usuario">
                    </div>
                    <div id="texto2">
                        <p>Total Ventas</p>
                        <p>${dia_actual}</p>
                    </div>
                    <div id="texto2">
                        <p>$${response.monto_total}</p>
                    </div>
                    `;
                    estadisticas_ayer += `
                    <div>
                        <img src="../../recursos/icons/total_ventas2.png" alt="usuario">
                    </div>
                    <div id="texto2">
                        <p>Total Ventas</p>
                        <p>${ayer}</p>
                    </div>
                    <div id="texto2">
                        <p>$${response.monto_total_ayer}</p>
                    </div>
                    `;
                    estadisticas_anteayer += `
                    <div>
                        <img src="../../recursos/icons/total_ventas3.png" alt="usuario">
                    </div>
                    <div id="texto2">
                        <p>Total Ventas</p>
                        <p>${anteayer}</p>
                    </div>
                    <div id="texto2">
                        <p>$${response.monto_total_anteayer}</p>
                    </div>
                    `;
                } else {
                    sweetAlert(4, response.exception, null);
                }
                //La constante y las variables las mandamos a llamar con un Id para que se concatenen
                document.getElementById('hoy').innerHTML = estadisticas_hoy;
                document.getElementById('ayer').innerHTML = estadisticas_ayer;
                document.getElementById('anteayer').innerHTML = estadisticas_anteayer;
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Función para cargar las últimas 2 observaciones realizadas
function obtenerObservacionesRecientes() {
    // Petición para obtener los datos del registro solicitado.
    fetch(OBSERVACIONES + "ultimasObservaciones", {
        method: "get"
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    data = response.dataset;
                    let content = '';
                    let imagen = '';
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    data.map(function (row) {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        if (row.imagen_empleado == null) {
                            imagen = `<img src="../../recursos/icons/user2.png" alt="usuario">`;
                        } else {
                            imagen = `<img src="${SERVER}images/usuario/${row.imagen_empleado}" alt="usuario">`;
                        }
                        content += `
                        <div class="card" id="observaciones_notificacion">
                            <div class="card-body">
                                <div>
                                    ${imagen}
                                </div>
                                <div id="texto">
                                    <p><b>${row.nombre_empleado}</b></p>
                                    <p>Ha realizado una observación</p>
                                    <p>${row.fecha_observacion}</p>
                                </div>
                            </div>
                        </div>`;
                    });
                    // Se agregan al apartado de observaciones en el dashboard
                    document.getElementById('observaciones_recientes').innerHTML = content;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + " " + request.statusText);
        }
    });
}
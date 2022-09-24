// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EMPLEADOS = SERVER + 'sitio_privado/api_administrar_empleados.php?action=';

document.addEventListener('DOMContentLoaded', function () {
    graficaVendedorMes();
    graficaVendedorIngresosMes();
});

// Función para mostrar los empleados que más vendieron por mes en un gráfico de dona.
function graficaVendedorMes() {
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPLEADOS + 'graficaUsuarioMes', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a gráficar.
                    let usuario = [];
                    let cantidad = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        usuario.push("Empleado " + row.nombre_empleado);
                        cantidad.push(row.cantidad);
                    });
                    // Se llama a la función que genera y muestra un gráfico de dona. Se encuentra en el archivo components.js
                    donutGraph('grafica1', usuario, cantidad, 'TOP 5 Empleados que más productos vendieron en el mes');
                } else {
                    document.getElementById('grafica1').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mostrar los empleados que más ingresos generaron por mes en un gráfico de pastel.
function graficaVendedorIngresosMes() {
    // Petición para obtener los datos del gráfico.
    fetch(API_EMPLEADOS + 'graficaUsuarioIngresosMes', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
                if (response.status) {
                    // Se declaran los arreglos para guardar los datos a gráficar.
                    let usuario = [];
                    let cantidad = [];
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se agregan los datos a los arreglos.
                        usuario.push("Empleado " + row.nombre_empleado);
                        cantidad.push(row.cantidad_generada);
                    });
                    // Se llama a la función que genera y muestra un gráfico de dona. Se encuentra en el archivo components.js
                    polarGraph('grafica_2', usuario, cantidad, 'TOP 5 Empleados que más ingresos generaron en el mes');
                } else {
                    document.getElementById('grafica1').remove();
                    console.log(response.exception);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
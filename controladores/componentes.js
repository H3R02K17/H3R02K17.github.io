/*
*   CONTROLADOR DE USO GENERAL EN TODAS LAS PÁGINAS WEB.
*/

/*Constante para establecer la ruta del servidor.*/
const SERVER ='https://koffi-soft.herokuapp.com/api/';

/*
*   Función para obtener todos los registros disponibles en los mantenimientos de tablas (operación read).
*   Parámetros: api (ruta del servidor para obtener los datos).
*   Retorno: ninguno.
*/
function readRows(api) {
    fetch(api + 'readAll', {
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
                    sweetAlert(2, response.exception, null);
                }
                // Se envían los datos a la función del controlador para llenar la tabla en la vista.
                fillTable(data);
            });
        } else {
            console.log(request.estado + '' + request.statusText);
        }
    });
}
/*
*   Función para obtener los resultados de una búsqueda en los mantenimientos de tablas (operación search).
*   Parámetros: api (ruta del servidor para obtener los datos) y form (identificador del formulario de búsqueda).
*   Retorno: ninguno.
*/
function searchRows(api, form) {
    fetch(api + 'search', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable(response.dataset);
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: '¡Busqueda Exitosa!',
                        text: response.message,
                        icon: 'success',
                        color: '#ffffff',
                        background: '#70393b',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        timerProgressBar: true,
                        title: response.exception,
                        icon: 'error',
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
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

/*
*   Función para crear o actualizar un registro en los mantenimientos de tablas (operación create y update).
*   Parámetros: api (ruta del servidor para enviar los datos), form (identificador del formulario) y modal (identificador de la caja de dialogo).
*   Retorno: ninguno.
*/
function saveRow(api, action, form, modal) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    modal.hide();
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    readRows(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

/*
*   Función para manejar los mensajes de notificación al usuario. Requiere el archivo sweetalert.min.js para funcionar.
*   Parámetros: type (tipo de mensaje), text (texto a mostrar) y url (ubicación para enviar al cerrar el mensaje).
*   Retorno: ninguno.
*/
function sweetAlert(type, text, url) {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
            break;
        case 5:
            title = 'Campos Vacios';
            icon = 'warning';
            break;
        case 6:
            title = 'Fechas Erroneas';
            icon = 'warning';
            break;
    }
    // Si existe una ruta definida, se muestra el mensaje y se direcciona a dicha ubicación, de lo contrario solo se muestra el mensaje.
    if (url) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            stopKeydownPropagation: false
        }).then(function () {
            location.href = url
        });
    } else {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true,
            stopKeydownPropagation: false
        });
    }
}

/*
*   Función para eliminar un registro seleccionado en los mantenimientos de tablas (operación delete). Requiere el archivo sweetalert.min.js para funcionar.
*   Parámetros: api (ruta del servidor para enviar los datos) y data (objeto con los datos del registro a eliminar)
*   Retorno: ninguno.
*/
function confirmDelete(api, action, data, modal) {
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
            fetch(api + action, {
                method: 'post',
                body: new FormData(document.getElementById(data))
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.estado) {
                            modal.hide();
                            readRows(api);
                            // Se cargan nuevamente las filas en la tabla de la vista después de borrar un registro y se muestra un mensaje de éxito.
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
}

/*
*   Función para cargar las opciones en un select de formulario.
*   Parámetros: endpoint (ruta específica del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado).
*   Retorno: ninguno.
*/
function fillSelect(endpoint, opcion, select, selected) {
    fetch(endpoint, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content += `<option disabled selected>Seleccione ${opcion}</option>`;
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += '<option>No hay opciones disponibles</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

// Función para mostrar un mensaje de confirmación al momento de cerrar sesión.
function logOut() {
    Swal.fire({
        title: 'Cerrar Sesión',
        text: '¿Está seguro de cerrar la sesión?',
        color: '#4c070a',
        imageUrl: '../../recursos/gif/koffi_soft.gif',
        imageWidth: 220,
        imageHeight: 220,
        imageAlt: 'Custom image',
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
            fetch(API_USUARIOS + 'cerrarSesion', {
                method: 'get'
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.estado) {
                            sweetAlert(1, response.message, 'index.html');
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.estado + ' ' + request.estadoText);
                }
            });
        } else {
            sweetAlert(4, 'Puede continuar con la sesión', null);
        }
    });
}


/*
*   Función para generar un gráfico de barras verticales. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
function barGraph(canvas, xAxis, yAxis, legend, titulo) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    let context = document.getElementById(canvas).getContext('2d');
    if (window.barras) {
        window.barras.clear();
        window.barras.destroy();
    }
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    window.barras = new Chart(context, {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                borderColor: ['rgb(76, 7, 10, 0.9)',
                    'rgb(108, 55, 57, 0.8)'],
                color: '#242221',
                borderWidth: 1,
                backgroundColor: ['rgb(76, 7, 10, 0.9)',
                    'rgb(108, 55, 57, 0.8)'],
                barPercentage: 1
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

//Función de barras pero que no se reinicia
function graficaBarras(canvas, xAxis, yAxis, legend, titulo) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    let context = document.getElementById(canvas).getContext('2d');
    let chart = new Chart(context);
    chart.destroy();
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    chart = new Chart(context, {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                borderColor: ['rgb(76, 7, 10, 0.9)',
                    'rgb(108, 55, 57, 0.8)'],
                color: '#242221',
                borderWidth: 1,
                backgroundColor: ['rgb(76, 7, 10, 0.9)',
                    'rgb(108, 55, 57, 0.8)'],
                barPercentage: 1
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de linea.
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
function lineGraph(canvas, xAxis, yAxis, legend, titulo) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    let context = document.getElementById(canvas).getContext('2d');
    let chart = new Chart(context);
    chart.destroy();
    const GRADIENTE = context.createLinearGradient(0, 0, 0, 464);
    // x0 = Punto inicial del degradado en el canvas horizontal (izq)
    // y0 = Punto inicial del degradado en el canvas vertical (arriba)
    // x1 = Punto final del degradado en el canvas horizontal (derecha)
    // y1 = Punto final del degradado en el canvas vertical (abajo)
    GRADIENTE.addColorStop(0, '#631215')
    GRADIENTE.addColorStop(0.5, '#631215')
    GRADIENTE.addColorStop(1, '#9b3336')
    // 0 - 1 > Transición de inicio a final

    // Se crea una instancia para generar el gráfico con los datos recibidos.
    chart = new Chart(context, {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: GRADIENTE,
                borderColor: 'rgb(117, 0, 3)',
                barPercentage: 1,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de donut. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
function donutGraph(canvas, legends, values, titulo) {
    // Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
    const image = new Image();
    image.src = '../../api/images/koffisoft_logo_grafica.png';
    const plugin = {
        id: 'custom_canvas_background_image',
        beforeDraw: (chart) => {
            if (image.complete) {
                const ctx = chart.ctx;
                const { top, left, width, height } = chart.chartArea;
                const x = left + width / 2 - image.width / 2;
                const y = top + height / 2 - image.height / 2;
                ctx.drawImage(image, x, y);
            } else {
                image.onload = () => chart.draw();
            }
        }
    };
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    let context = document.getElementById(canvas).getContext('2d');
    if (window.donut) {
        window.donut.clear();
        window.donut.destroy();
    }
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    window.donut = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                borderColor: ['rgb(76, 7, 10, 0.9)',
                'rgb(104, 126, 237, 0.9)',
                'rgb(78, 154, 152, 0.8)',
                'rgb(5, 117, 84, 0.9)',
                'rgb(237, 171, 74, 0.8)'],
                backgroundColor: ['rgb(76, 7, 10, 0.9)',
                'rgb(104, 126, 237, 0.9)',
                'rgb(78, 154, 152, 0.8)',
                'rgb(5, 117, 84, 0.9)',
                'rgb(237, 171, 74, 0.8)'],
            }]
        },
        plugins: [plugin],
        options: {
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de pastel. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
function pieGraph(canvas, legends, values, titulo) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    const context = document.getElementById(canvas).getContext('2d');
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    const chart = new Chart(context, {
        type: 'pie',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: ['rgb(76, 7, 10, 0.9)',
                'rgb(104, 126, 237, 0.9)',
                'rgb(78, 154, 152, 0.8)',
                'rgb(5, 117, 84, 0.9)',
                'rgb(237, 171, 74, 0.8)'],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de donut. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
function polarGraph(canvas, legends, values, titulo) {
    // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
    let context = document.getElementById(canvas).getContext('2d');
    if (window.polar) {
        window.polar.clear();
        window.polar.destroy();
    }
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    window.polar = new Chart(context, {
        type: 'polarArea',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: ['rgb(76, 7, 10, 0.9)',
                    'rgb(104, 126, 237, 0.9)',
                    'rgb(78, 154, 152, 0.8)',
                    'rgb(5, 117, 84, 0.9)',
                    'rgb(237, 171, 74, 0.8)'],
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 14
                    }
                }
            }
        }
    });
}

var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer; // Reconoce movimiento del mouse
    document.onkeydown = resetTimer;  // Reconoce teclas presionadas
    window.onmousedown = resetTimer;  // Reconoce toques de pantalla táctil     
    window.ontouchstart = resetTimer; // Reconoce deslizes de pantalla táctil     
    window.ontouchmove = resetTimer;  // Required by some devices 
    window.onclick = resetTimer;      // Reconoce clicks de pantalla táctil
    window.addEventListener('scroll', resetTimer, true); // Reconoce el scroll
    function logOut() {
        fetch(API_USUARIOS + 'cerrarSesion', {
            method: 'get'
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        sweetAlert(3, 'Se ha cerrado la sesión por inactividad', 'index.html');
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.estado + ' ' + request.estadoText);
            }
        });
    }
    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logOut, 300000000)
        // 1000 milisegundos = 1 segundo
        // 300000 milisegundos = 5 min
    }
};

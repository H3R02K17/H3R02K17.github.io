// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_EVENTOS = SERVER + 'sitio_privado/api_eventos.php?action=';

//se declara una variable para hacer funcionar el modal de modificar
var modal_agregar = new bootstrap.Modal(document.getElementById('agregar_evento'));

document.addEventListener('DOMContentLoaded', function () {
    eventosRealizados();
    eventosRealizando();
    cargarDatosEvento();
});

function cargarDatosEvento() {
    fetch(API_EVENTOS + 'readAll', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                let color = "";
                let fecha = "";
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    data = response.dataset;
                    //Hacemos un recorrido por cada evento
                    cargarEventos(data.map(function (row) {
                        //Verificamos el estado del evento, depende del estado tendrá un color diferente
                        if (row.idestado_evento == 1) {
                            color = "#057554";
                        } else if (row.idestado_evento == 2) {
                            color = "#6f383a";
                        } else if (row.idestado_evento == 3) {
                            color = "#edab4a";
                        }
                        //Verificamos si la fecha tiene una hora especificada o no
                        if (row.fecha_evento.includes(" 00:00:00")) {
                            let arrayfecha = row.fecha_evento.split(' ');
                            fecha = arrayfecha[0];
                        } else {
                            let arrayfecha = row.fecha_evento.split(' ');
                            fecha = arrayfecha[0] + "T" + arrayfecha[1];
                        };
                        return {
                            title: row.nombre_evento,
                            start: fecha,
                            description: row.descripcion,
                            color: color
                        }
                    }))
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Función para cargar los todos los eventos en el calendario
function cargarEventos(datos_eventos) {
    console.log(datos_eventos);
    var calendarEl = document.getElementById('calendar');
    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let actual = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let dia = ('0' + actual.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var mes = ('0' + (actual.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año
    let anio = actual.getFullYear();
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let fecha_actual = `${anio}-${mes}-${dia}`;
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }, 
        initialDate: fecha_actual,
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        selectMirror: true,
        locale: 'es',
        dateClick: function (info) {
            document.getElementById("fecha_evento").value = info.dateStr;
            document.getElementById('nombre_evento').value = '';
            document.getElementById('descripcion_evento').value = '';
            document.getElementById('hora_evento_final').value = '';
            modal_agregar.show();
        },
        dayMaxEvents: true,
        events: datos_eventos,
    });
    calendar.render();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_evento_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    let nombre_evento = document.getElementById('nombre_evento').value;
    let descripcion_evento = document.getElementById('descripcion_evento').value;
    let fecha_evento = document.getElementById('fecha_evento').value;
    let hora_evento = document.getElementById('hora_evento').value;
    if (nombre_evento.trim() == '' || descripcion_evento.trim() == '' || fecha_evento.trim() == '') {
        sweetAlert(2, "Campos vacios, por favor ingrese valores válidos", null);
    } else {
        if (hora_evento.trim() == '') {
            document.getElementById('hora_evento_final').value = "";
        } else {
            document.getElementById('hora_evento_final').value = hora_evento + ":00"
        }
        fetch(API_EVENTOS + 'agregarEventos', {
            method: 'post',
            body: new FormData(document.getElementById('agregar_evento_form'))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        // Se cierra la caja de dialogo (modal) del formulario.
                        modal_agregar.hide();
                        try {
                            eventosRealizados();
                            eventosRealizando();
                        } catch (error) {
                            sweetAlert(2, "No se pudo actualizar", null);
                        }
                        sweetAlert(1, response.message, null);
                        cargarDatosEvento();
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.estado + ' ' + request.statusText);
            }
        });
    }
});

//Actualizar el estado a realizado
function eventosRealizados() {
    fetch(API_EVENTOS + 'actualizarEstadoRealizado', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Actualizar el estado a realizando con fecha actual
function eventosRealizando() {
    fetch(API_EVENTOS + 'actualizarEstadoRealizando', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}
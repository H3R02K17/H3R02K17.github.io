// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_RESERVACIONES = SERVER + 'sitio_privado/api_reservaciones.php?action=';
const ENDPOINT_ESTADO = SERVER + 'sitio_privado/api_reservaciones.php?action=obtenerEstadosReservacion';

//Variable que almacenará el Modal de modificar
var modalModificar = new bootstrap.Modal(document.getElementById('modificar_reservacion'), {
    keyboard: false
})

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    // Se declara e inicializa un objeto para obtener la fecha y hora actual.
    let today = new Date();
    // Se declara e inicializa una variable para guardar el día en formato de 2 dígitos.
    let day = ('0' + today.getDate()).slice(-2);
    // Se declara e inicializa una variable para guardar el mes en formato de 2 dígitos.
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    // Se declara e inicializa una variable para guardar el año con la mayoría de edad.
    let year = today.getFullYear();
    // Se declara e inicializa una variable para establecer el formato de la fecha.
    let fecha_actual = `${year}-${month}-${day}`;
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('fecha_reservacion_modificar').setAttribute('min', fecha_actual);
    seleccionarFecha();
    cargarReservaciones();
});

function cargarReservaciones(){
    fetch(API_RESERVACIONES + 'obtenerReservaciones', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let contenido = '';
                    response.dataset.map(function (row) {
                        if (row.idestado_reservacion == 1) {
                            contenido += `
                            <div class="tarjeta_reservaciones">
                                <div class="imagen_reservacion">
                                    <img src="../../recursos/imgs/koffisoft_logo1.png" alt="taza">
                                </div>
                                <div class="datos_reservacion">
                                    <p><b>Datos Reservación:</b></p>
                                    <p><b>Nombre del Cliente:</b> ${row.nombre_cliente + ' ' + row.apellido_cliente}</p>
                                    <p><b>Teléfono de contacto:</b> ${row.telefono_cliente}</p>
                                    <p><b>Fecha reservación:</b> ${row.fecha_reservacion}</p>
                                </div>
                                <div class="boton_reservacion">
                                    <button onclick="openUpdate(${row.idreservacion})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt="modificar"></button>
                                </div>
                            </div>
                            `;
                        } else {
                            contenido += `
                            <div class="tarjeta_reservaciones">
                                <div class="imagen_reservacion">
                                    <img src="../../recursos/imgs/koffisoft_logo1.png" alt="taza">
                                </div>
                                <div class="datos_reservacion">
                                    <p><b>Datos Reservación:</b></p>
                                    <p><b>Nombre del Cliente:</b> ${row.nombre_cliente + ' ' + row.apellido_cliente}</p>
                                    <p><b>Teléfono de contacto:</b> ${row.telefono_cliente}</p>
                                    <p><b>Fecha reservación:</b> ${row.fecha_reservacion}</p>
                                </div>
                            </div>
                            `;
                        }
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('reservaciones_realizadas').innerHTML = contenido;
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + '' + request.statusText);
        }
    });
}

//Función para alerta inicial y pueda elegir si realizar una reservación
function seleccionarFecha() {
    document.getElementById("agregar_reservacion").disabled = false;
    document.getElementById("hora_reservacion").disabled = false;
    Swal.fire({
        //Se agregan componentes a la alerta Sweet de si/no
        title: '¿Desea realizar una reservación?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonColor: '#4c070a',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: true,
        stopKeydownPropagation: false,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                //Se agregan componentes a la alerta Sweet que poseera un input para escribir la fecha
                title: 'Escriba una fecha para reservar',
                input: 'text',
                inputLabel: 'Escriba en el formato solicitado',
                inputPlaceholder: 'yyyy-MM-dd',
                inputAttributes: {
                    maxlength: 10,
                    size: 10
                },
                showCancelButton: true,
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#4c070a',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: true,
                stopKeydownPropagation: false,
                //Validaciones del nput
                inputValidator: (value) => {
                    //Si el input esta vacio el boton agregar estará deshabilitado
                    if (!value) {
                        return 'Escribe una fecha para la reservación'
                    }
                    //Si el input no esta vacio se agregan sus valores al input del form agregar
                    else {
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
                        if (Date.parse(value) < Date.parse(date)) {
                            // Se muestra un mensaje de exito y se cargan las reservaciones
                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                timer: 5000,
                                timerProgressBar: true,
                                title: '¡Error en fechas!',
                                text: 'Formato de fechas incorrectas, la fecha ingresada es menor a la actual',
                                icon: 'error',
                                color: '#ffffff',
                                background: '#70393b',
                                showConfirmButton: false,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                allowEnterKey: true,
                                stopKeydownPropagation: false
                            });
                            document.getElementById("hora_reservacion").disabled = true;
                        } else {
                            document.getElementById("fecha_reservacion").value = value;
                        }
                    }
                }
            }).then((result) => {
                //Si preciono en el boton cancelar
                if (!result.isConfirmed) {
                    document.getElementById("agregar_reservacion").disabled = true;
                    document.getElementById("hora_reservacion").disabled = true;
                }
            })
        } else {
            //Si no desea realizar una reservación
            document.getElementById("agregar_reservacion").disabled = true;
            document.getElementById("hora_reservacion").disabled = true;
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('thesearch').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    fetch(API_RESERVACIONES + 'busquedaReservaciones', {
        method: 'post',
        body: new FormData(document.getElementById('thesearch'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se muestra un mensaje de exito y se cargan las reservaciones
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
                    contenido = '';
                    response.dataset.map(function (row) {
                        if (row.idestado_reservacion == 1) {
                            contenido += `
                            <div class="tarjeta_reservaciones">
                                <div class="imagen_reservacion">
                                    <img src="../../recursos/imgs/koffisoft_logo1.png" alt="taza">
                                </div>
                                <div class="datos_reservacion">
                                    <p><b>Datos Reservación:</b></p>
                                    <p><b>Nombre del Cliente:</b> ${row.nombre_cliente + ' ' + row.apellido_cliente}</p>
                                    <p><b>Teléfono de contacto:</b> ${row.telefono_cliente}</p>
                                    <p><b>Fecha reservación:</b> ${row.fecha_reservacion}</p>
                                </div>
                                <div class="boton_reservacion">
                                    <button onclick="openUpdate(${row.idreservacion})" type="button" class="btn btn-info editar" id="btn_modal" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Editar"><img src="../../recursos/icons/modificar.png" alt="modificar"></button>
                                </div>
                            </div>
                            `;
                        } else {
                            contenido += `
                            <div class="tarjeta_reservaciones">
                                <div class="imagen_reservacion">
                                    <img src="../../recursos/imgs/koffisoft_logo1.png" alt="taza">
                                </div>
                                <div class="datos_reservacion">
                                    <p><b>Datos Reservación:</b></p>
                                    <p><b>Nombre del Cliente:</b> ${row.nombre_cliente + ' ' + row.apellido_cliente}</p>
                                    <p><b>Teléfono de contacto:</b> ${row.telefono_cliente}</p>
                                    <p><b>Fecha reservación:</b> ${row.fecha_reservacion}</p>
                                </div>
                            </div>
                            `;
                        }
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('reservaciones_realizadas').innerHTML = contenido;
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
});

//Se crea el array que almacenará las mesas seleccionadas
var mesas = [];

//Función para agregar las mesas presionadas al array y con cambio de imagen
function anexarMesas(idmesa, idimagen) {
    //Se obtiene el id de la imagen
    var imagen = document.getElementById(idimagen);
    //Si la imagen tiene la clase activa se cambia su imagen a normal
    if (imagen.classList.contains('active')) {
        //Son las mesas que son de pareja
        if (idimagen <= 6) {
            imagen.src = "../../recursos/icons/mesa_pareja.png";
            document.getElementById(idimagen).classList.remove('active');
            //Usamos filter para eliminar el valor que se haya deseleccionado
            mesas = mesas.filter(mesas => mesas !== idmesa);
        }
        //Son las mesas de 4 personas
        else if (idimagen >= 7 && idimagen <= 27) {
            imagen.src = "../../recursos/icons/mesas.png";
            document.getElementById(idimagen).classList.remove('active');
            //Usamos filter para eliminar el valor que se haya deseleccionado
            mesas = mesas.filter(mesas => mesas !== idmesa);
        }
        //Son las mesas que son de pareja
        else if (idimagen >= 28) {
            imagen.src = "../../recursos/icons/mesa_parejav.png";
            document.getElementById(idimagen).classList.add('active');
            //Usamos filter para eliminar el valor que se haya deseleccionado
            mesas = mesas.filter(mesas => mesas !== idmesa);
        }
    }
    //Si la imagen no tenía la clase active se cambia su imagen y se agrega su valor al array
    else {
        //Son las mesas que son de pareja
        if (idimagen <= 6) {
            //Se usa push para agregar el id de la mesa al array
            mesas.push(idmesa);
            imagen.src = "../../recursos/icons/mesa_pareja_seleccion.png";
            document.getElementById(idimagen).classList.add('active');
        }
        //Son las mesas de 4 personas
        else if (idimagen >= 7 && idimagen <= 27) {
            //Se usa push para agregar el id de la mesa al array
            mesas.push(idmesa);
            imagen.src = "../../recursos/icons/mesas_seleccionadas.png";
            document.getElementById(idimagen).classList.add('active');
        }
        //Son las mesas que son de pareja
        else if (idimagen >= 28) {
            //Se usa push para agregar el id de la mesa al array
            mesas.push(idmesa);
            imagen.src = "../../recursos/icons/mesa_parejav_seleccion.png";
            document.getElementById(idimagen).classList.add('active');
        }
    }
}

//Función para agregar los valores del array a un select multiple para que puedan ser obtenidos sus valores en el sevidor
function agregarArraySelect() {
    var content = '';
    //Si el array esta vacio
    if (mesas.length === 0) {
        sweetAlert(2, "No ha seleccionado una mesa para la reservación", null);
        //Retornamos falso para evitar que continue el proceso
        return false;
    }
    //Sino se crean option con valor selected que contendra los valores del array para el select multiple
    else {
        for (let i = 0; i < mesas.length; i++) {
            content += `
            <option value="${mesas[i]}" selected>${mesas[i]}</option>
            `;
        }
        document.getElementById('mesas').innerHTML = content;
        //Retornamos true para que continue el proceso
        return true;
    }
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('reservaciones_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
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
    let fecha_reservacion = document.getElementById('fecha_reservacion').value;
    if (Date.parse(fecha_reservacion) < date) {
        sweetAlert(2, "Fecha de reservación tiene una fecha menor a la actual", null);
        document.getElementById('fecha_reservacion').reset();
    } else {
        //Método para guardar el array
        if (agregarArraySelect()) {
            //Función para agregar los los datos del form a la base
            fetch(API_RESERVACIONES + 'crearReservacion', {
                method: 'post',
                body: new FormData(document.getElementById('reservaciones_form'))
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    // Se obtiene la respuesta en formato JSON.
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.estado) {
                            //Limpiamos los campos
                            limpiarCampos();
                            cargarReservaciones();
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
    }
});

function planesPersonas(plano) {
    console.log(plano);
    switch (plano) {
        case "1":
            //Deshactivamos el boton y la visualización de los otros plano
            document.getElementById("plano1-tab").classList.remove("active");
            document.getElementById("plano1").classList.remove("show");
            document.getElementById("plano1").classList.remove("active");
            document.getElementById("plano2-tab").classList.remove("active");
            document.getElementById("plano2").classList.remove("active");
            document.getElementById("plano2").classList.remove("show");
            document.getElementById("plano3-tab").classList.remove("active");
            document.getElementById("plano3").classList.remove("show");
            document.getElementById("plano3").classList.remove("active");
            //Activamos el boton y la visualización del plano
            document.getElementById("plano1-tab").classList.add("active");
            document.getElementById("plano1").classList.add("show");
            document.getElementById("plano1").classList.add("active");
            break;
        case "2":
            //Activamos el boton y la visualización del plano
            document.getElementById("plano2-tab").classList.add("active");
            document.getElementById("plano2").classList.add("show");
            document.getElementById("plano2").classList.add("active");
            //Deshactivamos el boton y la visualización de los otros plano
            document.getElementById("plano1-tab").classList.remove("active");
            document.getElementById("plano1").classList.remove("show");
            document.getElementById("plano1").classList.remove("active");
            document.getElementById("plano3-tab").classList.remove("active");
            document.getElementById("plano3").classList.remove("show");
            document.getElementById("plano3").classList.remove("active");
            break;
        case "3":
            //Activamos el boton y la visualización del plano
            document.getElementById("plano3-tab").classList.add("active");
            document.getElementById("plano3").classList.add("show");
            document.getElementById("plano3").classList.add("active");
            //Deshactivamos el boton y la visualización de los otros plano
            document.getElementById("plano1-tab").classList.remove("active");
            document.getElementById("plano1").classList.remove("show");
            document.getElementById("plano1").classList.remove("active");
            document.getElementById("plano2-tab").classList.remove("active");
            document.getElementById("plano2").classList.remove("show");
            document.getElementById("plano2").classList.remove("active");
            break;
        default:
            console.log("no entre a ningún caso");
            break;
    }
}

function limpiarCampos() {
    document.getElementById('nombre_cliente').value = '';
    document.getElementById('apellidos_cliente').value = '';
    document.getElementById('telefono_cliente').value = '';
    document.getElementById('correo_cliente').value = '';
    document.getElementById('fecha_reservacion').value = '';
    document.getElementById('hora_reservacion').selectedIndex = -1;
    document.getElementById('cantidad_personas').selectedIndex = -1;
    document.getElementById('hora_reservacion').value = 'Seleccione la hora de la reservación';
    document.getElementById('cantidad_personas').value = 'Cantidad de personas';
    document.getElementById('mesas').innerHTML = '';
    deseleccionarMesas();
}

function deseleccionarMesas() {
    for (let i = 0; i <= (mesas.length + 1); i++) {
        anexarMesas(mesas[0], mesas[0]);
    }
}

//Función para traer las mesas reservadas en una fecha y hora exacta y ocultarlas para evitar su selección
function mesasReservadas() {
    //Un array que almacena cada objeto que tenga la clase "mesa_seleccionable", (son las imagenes con la mesa)
    [].forEach.call(document.querySelectorAll(".mesa_seleccionable"), function (clases) {
        //Eliminamos la clase activa del boton pagination
        clases.classList.remove('visually-hidden-focusable');
    });
    //Creamos una conexión con el servidor para el caso requerido
    fetch(API_RESERVACIONES + 'mesasApartadasFechaHora', {
        method: 'post',
        body: new FormData(document.getElementById('reservaciones_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    response.dataset.map(function (row) {
                        let mesa = document.getElementById(`${row.idmesa}`);
                        mesa.classList.add('visually-hidden-focusable');
                    });
                    // Se muestra un mensaje de exito y se cargan las reservaciones
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 7000,
                        timerProgressBar: true,
                        title: '¡Mesas Apartadas!',
                        text: 'Algunas mesas han sido tomadas y se han ocultado',
                        icon: 'warning',
                        color: '#ffffff',
                        background: '#70393b',
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                } else {
                    // Se muestra un mensaje de exito y se cargan las reservaciones
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        timer: 7000,
                        timerProgressBar: true,
                        title: '¡Mesas disponibles!',
                        text: 'El horario seleccionado no posee reservaciones',
                        icon: 'success',
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

//Funcion para actualizar datos
function openUpdate(idreservacion){
    modalModificar.show();
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append("idreservacion", idreservacion);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_RESERVACIONES + "leerUnaReservacion", {
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
                    document.getElementById("idreservacion").value = response.dataset.idreservacion;
                    document.getElementById("nombre_cliente_modificar").value = response.dataset.nombre_cliente;
                    document.getElementById("apellido_cliente_modificar").value = response.dataset.apellido_cliente;
                    document.getElementById("telefono_cliente_modificar").value = response.dataset.telefono_cliente;
                    document.getElementById("correo_cliente_modificar").value = response.dataset.correo_cliente;
                    let fecha = response.dataset.fecha_reservacion.split(' ');
                    document.getElementById("fecha_reservacion_modificar").value = fecha[0];
                    document.getElementById("hora_reservacion_modificar").value = fecha[1];
                    fillSelect(ENDPOINT_ESTADO, "un estado", 'estadoM', response.dataset.idestado_reservacion);
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
function actualizarReservacion(event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    fetch(API_RESERVACIONES + 'modificarReservacion', {
        method: 'post',
        body: new FormData(document.getElementById("modificar_reservacion_form"))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    sweetAlert(1, response.message, null);
                    // Se cierra la caja de dialogo (modal) del formulario.
                    modalModificar.hide();
                    cargarReservaciones();
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
};
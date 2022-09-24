const ENDPOINT_INGREDIENTE = SERVER + 'sitio_privado/api_registro_entrega.php?action=leerIngredientes';
const API_INVENTARIO = SERVER + 'sitio_privado/api_registro_entrega.php?action=';

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    fillSelect(ENDPOINT_INGREDIENTE, "un ingrediente", "nombre_ingrediente", null);
    llenarTablaInventario();
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
    document.getElementById("fecha_registro").value = date;
});

//Función para que traer los datos que se muestran en la tabala de inventario
function llenarTablaInventario() {
    fetch(API_INVENTARIO + 'obtenerDatosInventario', {
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
                        contenido += `
                        <tr onclick="llenarModificar(${row.idinventario}, ${row.idusuario_empleado},'${row.ingrediente}', ${row.cantidad}, '${row.fecha_entrega}', ${row.precio_unitario})">
                            <th>${row.idinventario}</th>
                            <td>${row.ingrediente}</td>
                            <td>${row.cantidad}</td>
                            <td>${row.fecha_entrega}</td>
                            <td>${row.usuario_empleado}</td>
                        </tr>
                        `;
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('tbinventario').innerHTML = contenido;
                } else {
                    sweetAlert(4, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    })
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar para encontrar ingrediente.
document.getElementById('buscador_ingrediente_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Se hace la petición para el caso de llenar el select según un parametro
    fetch(API_INVENTARIO + 'leerIngredientesBuscador', {
        method: 'post',
        body: new FormData(document.getElementById('buscador_ingrediente_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != null) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
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
                    content += '<option>No hay opciones disponibles</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById('nombre_ingrediente').innerHTML = content;
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    })
});

function encontrarIngredienteModificar() {
    //Se hace la petición para el caso de llenar el select según un parametro
    fetch(API_INVENTARIO + 'leerIngredientesBuscador', {
        method: 'post',
        body: new FormData(document.getElementById('buscador_ingrediente_form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        console.log(row.ingrediente);
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != null) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                    sweetAlert(1, response.message, null);
                } else {
                    content += '<option>No hay opciones disponibles</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById('nombre_ingrediente').innerHTML = content;
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    })
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar de Inventario.
document.getElementById('buscador_inventario_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_INVENTARIO, 'buscador_inventario_form');
});


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr onclick="llenarModificar(${row.idinventario}, ${row.idusuario_empleado},'${row.ingrediente}', ${row.cantidad}, '${row.fecha_entrega}', ${row.precio_unitario})">
            <th>${row.idinventario}</th>
            <td>${row.ingrediente}</td>
            <td>${row.cantidad}</td>
            <td>${row.fecha_entrega}</td>
            <td>${row.usuario_empleado}</td>
        </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbinventario').innerHTML = content;
}

function llenarModificar(idingrediente, idusuario, ingrediente, cantidad, fecha_entrega, precio_u) {
    document.getElementById("idinventario").value = idingrediente;
    document.getElementById("idusuario").value = idusuario;
    document.getElementById("buscador_ingrediente_input").value = ingrediente;
    let fecha = fecha_entrega.split(' ');
    document.getElementById("fecha_registro").value = fecha[0];
    document.getElementById("cantidad_ingrediente").value = cantidad;
    document.getElementById("precio_unitario").value = precio_u;
    encontrarIngredienteModificar();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('inventario_form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Establecemos la conexión con el servidor
    fetch(API_INVENTARIO + "agregarRegistro", {
        method: 'post',
        body: new FormData(document.getElementById("inventario_form"))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    llenarTablaInventario();
                    Swal.fire({
                        title: 'Proceso exitoso',
                        text: response.message,
                        imageUrl: '../../recursos/gif/koffi_soft.gif',
                        imageWidth: 220,
                        imageHeight: 220,
                        imageAlt: 'Custom image',
                        confirmButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

function modificarInventario(event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Establecemos la conexión con el servidor
    fetch(API_INVENTARIO + "modificarRegistro", {
        method: 'post',
        body: new FormData(document.getElementById("inventario_form"))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    llenarTablaInventario();
                    limpiarCampos();
                    fillSelect(ENDPOINT_INGREDIENTE, "un ingrediente", "nombre_ingrediente", null);
                    Swal.fire({
                        title: 'Proceso exitoso',
                        text: response.message,
                        imageUrl: '../../recursos/gif/koffi_soft.gif',
                        imageWidth: 220,
                        imageHeight: 220,
                        imageAlt: 'Custom image',
                        confirmButtonText: 'Continuar',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: true,
                        stopKeydownPropagation: false
                    });
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

//Validar que las cantidades no sean mayor a mil
document.getElementById("cantidad_ingrediente").oninput = function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
}

//Validar que el precio no sea mayor a 1000
document.getElementById("precio_unitario").oninput = function () {
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 4);
    }
}

function limpiarCampos(){
    document.getElementById('idinventario').value = '';
    document.getElementById('idusuario').value = '';
    document.getElementById('cantidad_ingrediente').value = '';
    document.getElementById('fecha_registro').value = '';
    document.getElementById('precio_unitario').value = '';
    document.getElementById('buscador_ingrediente_input').value = '';
}


//Variable que servira para contador del pagination
var valor = 0;

//Método para contador
function ContadorPagination(navegar) {
    const data = new FormData();
    if (navegar == 1) {
        valor += 5;
        data.append('contador', valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
    else if (navegar == 2 && valor >= 5) {
        valor = valor - 5;
        data.append('contador', valor);
        console.log(valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
}

function navegacionTabla(data) {
    fetch(API_INVENTARIO + 'readAllContador', {
        method: 'post',
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let contenido = '';
                    response.dataset.map(function (row) {
                        contenido += `
                        <tr onclick="llenarModificar(${row.idinventario}, ${row.idusuario_empleado},'${row.ingrediente}', ${row.cantidad}, '${row.fecha_entrega}', ${row.precio_unitario})">
                            <th>${row.idinventario}</th>
                            <td>${row.ingrediente}</td>
                            <td>${row.cantidad}</td>
                            <td>${row.fecha_entrega}</td>
                            <td>${row.usuario_empleado}</td>
                        </tr>
                        `;
                    });
                    // Se agregan las tarjetas a un apartado mediante su id para mostrarse
                    document.getElementById('tbinventario').innerHTML = contenido;
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
            console.log(request.estado + ' ' + request.statusText);
        }
    })
}

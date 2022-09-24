// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_ALERGENOS = SERVER + 'sitio_privado/api_alergenos.php?action=';
const API_PRODUCTOS = SERVER + 'sitio_privado/api_productos.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readIngrediente(API_PRODUCTOS);
});

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
                <td><input onchange="cambiarEstado(checked, ${row.idingrediente})" type="checkbox" id="ingrediente_checkbox${row.idingrediente}" name="ingrediente_checkbox"></td>
                <td>${row.ingrediente}</td>
                <td>${row.categoria_ingrediente}</</td>
        </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbingredientes').innerHTML = content;
}

function asignarAlergeno(id) {
    document.getElementById('alergenoId').value = id;
}

function cambiarEstado(value, id) {
    /*if (value == true) {
        const data = new FormData();
        data.append("id", id);
        // Petición para obtener los datos del registro solicitado.
        fetch(API_ALERGENOS + "asignar", {
            method: "post",
            body: data,
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        sweetAlert(1, response.exception, null);
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + " " + request.statusText);
            }
        });
    } else {
        const data = new FormData();
        data.append("id", id);
        // Petición para obtener los datos del registro solicitado.
        fetch(API_ALERGENOS + "desasignar", {
            method: "post",
            body: data,
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        sweetAlert(1, response.exception, null);
                    } else {
                        sweetAlert(2, response.exception, null);
                    }
                });
            } else {
                console.log(request.status + " " + request.statusText);
            }
        });
    }*/
}



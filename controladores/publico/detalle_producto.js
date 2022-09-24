// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_publico/api_productos.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('id');
    // Se llama a la función que muestra el detalle del producto seleccionado previamente.
    leerUnProducto(ID);
});


// Función para obtener y mostrar los datos del producto seleccionado.
function leerUnProducto(id) {
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('id_producto', id);
    // Petición para obtener los datos del producto solicitado.
    fetch(API_PRODUCTOS + 'leerUnProducto', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    if (response.dataset.porcentaje_descuento > 0) {
                        document.getElementById('precio_sin_descuento').classList.remove("visually-hidden");
                        let total_descuento = response.dataset.precio_producto * (response.dataset.porcentaje_descuento / 100);
                        document.getElementById('precio_sin_descuento').innerHTML += ('Precio sin descuento: <s>' + '$' + response.dataset.precio_producto + '</s>');
                        document.getElementById('precio').innerHTML += ('Precio: <b>$' + (response.dataset.precio_producto - total_descuento).toFixed(2) + '</b>');
                    }
                    else {
                        document.getElementById('precio').innerHTML += ('Precio: <b>$' + response.dataset.precio_producto + '</b>');
                    }
                    // Se colocan los datos en la tarjeta de acuerdo al producto seleccionado previamente.
                    document.getElementById('imagen_principal').setAttribute('src', SERVER + 'images/productos/' + response.dataset.imagen_principal);
                    document.getElementById('nombre_producto').textContent = response.dataset.nombre_producto;
                    document.getElementById('descripcion_producto').textContent = response.dataset.descripcion;
                    document.getElementById('estado_producto').textContent += response.dataset.estado_producto;
                    generarIngredientes(response.dataset.idproducto);
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    document.getElementById('nombre_producto').innerHTML = `<span>${response.exception}</span>`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para obtener y mostrar todos los ingredientes del producto seleccionado.
function generarIngredientes(id) {
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('id_producto', id);
    // Petición para obtener los datos del producto solicitado.
    fetch(API_PRODUCTOS + 'obtenerIngredientes', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    let content = '';
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        content += `
                        <h6>- ${row.ingrediente}</h6>
                        `;
                    });
                    document.getElementById("ingredientes").innerHTML = content;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}
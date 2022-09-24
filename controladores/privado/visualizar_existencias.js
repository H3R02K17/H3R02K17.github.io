// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_INVENTARIO = SERVER + 'sitio_privado/api_administrar_inventario.php?action=';

//Evento que se ejecuta cuando se carga la página web
document.addEventListener("DOMContentLoaded", function () {
    // se inicializa la funcion readRows
    readRows(API_INVENTARIO);
});


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        let boton_visible = '';
        if (row.idestado_ingrediente == 1){
            boton_visible +=`
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/menu_comida.png"></button>
            `;
        }else{
            boton_visible +=`
                <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/eliminar.png"></button>
            `;
        }
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td>${row.ingrediente}</td>
                <td>${row.fecha_caducidad}</td>
                <td>${row.existencia_ingrediente}</td>
                <td>${row.categoria_ingrediente}</td>
                <td>${row.nombre_proveedor}</td>
                <td>
                    <div class="centrar_estadoemp">
                        ${boton_visible} 
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbvisualizar_ingrediente').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_INVENTARIO, 'search-form');
});


//Variable que servira para contador del pagination
var valor = 0;

//Método para contador
function ContadorPagination(navegar) {
    const data = new FormData();
    if (navegar == 1) {
        valor += 10;
        data.append("contador", valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    } else if (navegar == 2 && valor >= 10) {
        valor = valor - 10;
        data.append("contador", valor);
        console.log(valor);
        // Se llama a la función que realiza la búsqueda por categoria
        navegacionTabla(data);
    }
}

function navegacionTabla(data) {
    fetch(API_INVENTARIO + "readAllContador", {
        method: "post",
        body: data,
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let data = [];
                // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    data = response.dataset;
                    let content = "";
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    data.map(function (row) {
                        let boton_visible = "";
                        if (row.idestado_ingrediente == 1) {
                            boton_visible += `
                            <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/menu_comida.png"></button>`;
                        } else {
                            boton_visible += `
                            <button type="button" class="btn btn-danger boton_estado_empleado">${row.estado_ingrediente}<img src="../../recursos/icons/eliminar.png"></button>`;
                        }
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                            <tr>
                                <td>${row.ingrediente}</td>
                                <td>${row.fecha_caducidad}</td>
                                <td>${row.existencia_ingrediente}</td>
                                <td>${row.categoria_ingrediente}</td>
                                <td>${row.nombre_proveedor}</td>
                                <td>
                                    <div class="centrar_estadoemp">
                                        ${boton_visible} 
                                    </div>
                                </td>
                            </tr>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById("tbvisualizar_ingrediente").innerHTML =
                        content;
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
            console.log(request.estado + "" + request.statusText);
        }
    });
}
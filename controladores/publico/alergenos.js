// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'sitio_publico/api_productos.php?action=';

//Variable que guardará el titulo de la categoria y sus productos
var contenido = "",
    nombre_productos = "",
    categorias = [],
    tipo_alergeno = []; //funcion para guardar los tipos de alergenos, se crea un array para que este guarde el id de los tipos de alergenos

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene las categorias
    fetch(API_PRODUCTOS + 'cargarCategorias', {
        method: 'post',
        body: new FormData(document.getElementById('form_alergenos'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.estado) {
                    //Array que almacena todas las categorias
                    categorias = response.dataset;
                    //Por cada categoria imprimimos un Titulo y su tabla que contendra los productos
                    categorias.map(function (row) {
                        contenido +=
                            `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" id="subtitulo">
                                <h4>${row.categoria_producto}</h4>
                                <!--Tabla alergenos-->
                                <table class="table table-bordered">
                                    <tbody id="${row.idcategoria_producto + "_categoria"}">
                                    </tbody>
                                </table>
                            </div>`;
                        nombre_productos = "";
                    });
                    document.getElementById("tabla_alergenos").innerHTML = contenido;
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
});

//Llamamos a una función que llenara un select de tipo multiple (el select del array de tipos de alergenos)
function tipoAlergeno(boton, idtipo_alergeno) {
    let content = "";
    changeColor(boton);
    //se declara otra variable que hará push y guarde los tipo_alergeno
    if (tipo_alergeno.includes(idtipo_alergeno)) {
        tipo_alergeno = tipo_alergeno.filter(tipo_alergeno => tipo_alergeno !== idtipo_alergeno)
    } else {
        tipo_alergeno.push((idtipo_alergeno));
    }
    for (let i = 0; i < tipo_alergeno.length; i++) {
        content += `
        <option value="${tipo_alergeno[i]}" selected>${tipo_alergeno[i]}</option>
        `;
    }
    document.getElementById('alergenos_').innerHTML = content;
    llenarProductos();
}

//Función que por cada categoría treará sus productos sin x alergeno/s
function llenarProductos() {
    //Por cada categoria que este en el array, mandaremos a llamar a la API
    for (let i = 0; i < categorias.length; i++) {
        //Por cada ciclo el valor del idcategoria cambiara (Sirve solo para saber que categoria sigue)
        document.getElementById("id_categoriaA").value = (i + 1);
        //Establecemos la conexión con la API
        fetch(API_PRODUCTOS + 'buscarProductosAlergeno', {
            method: 'post',
            body: new FormData(document.getElementById('form_alergenos'))
        }).then(function (request) {
            // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
            if (request.ok) {
                // Se obtiene la respuesta en formato JSON.
                request.json().then(function (response) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                    if (response.estado) {
                        //Esta variable se irá vaciando en cada ciclo
                        let nombre_productos = "";
                        //Por cada categoria traerá todos los productos y se hace un ciclo para que vaya almacenandolos
                        response.dataset.forEach(row => {
                            //Se irán almacenando cada nombre del producto en una varibale
                            nombre_productos +=
                                `<tr>
                                    <td>${row.nombre_producto}</td>
                                </tr>`;
                        });
                        //Se imprimen los nombres del producto en el titulo de su categoria
                        document.getElementById((i + 1) + "_categoria").innerHTML = nombre_productos;
                    } else {
                        // Se muestra un mensaje de exito y se cargan las reservaciones
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            timer: 8000,
                            timerProgressBar: true,
                            title: 'No se pudo obtener los datos',
                            text: response.exception,
                            icon: 'warning',
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
}

//Cambio de color de alergenos
function changeColor(x) {
    if (x.style.background == "rgb(80, 4, 12)") {
        x.style.background = "#f8c4a4";
    } else {
        x.style.background = "#50040c";
    }
    return false;
}

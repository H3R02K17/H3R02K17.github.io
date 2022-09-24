//Constantes utilizadas (Mayusculas)
const ENDPOINT_CATEGORIAS = SERVER + 'sitio_privado/api_productos.php?action=obtenerCategoriaProducto';
const ENDPOINT_PROVEEDOR = SERVER + 'sitio_privado/api_proveedores.php?action=readAll';
const ENDPOINT_EMPLEADO = SERVER + 'sitio_privado/api_admin_usuarios.php?action=readEmpleado';
const ENDPOINT_TIPOS_OBSERVACION = SERVER + 'sitio_privado/api_observacion.php?action=readAllTipos';
const ENDPOINT_INVENTARIO = SERVER + 'sitio_privado/api_administrar_inventario.php?action=readAll';
const API_ADMIN_USUARIOS = SERVER + 'sitio_privado/api_admin_usuarios.php?action=';
const API_OBSERVACIONES = SERVER + 'sitio_privado/api_observacion.php?action='

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    fillSelect(ENDPOINT_TIPOS_OBSERVACION, 'un tipo de observación', 'tipo_observacion', null);
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
    // Se asigna la fecha como valor máximo en el campo del formulario.
    document.getElementById('fechaF').setAttribute('max', date);
    document.getElementById('fechaI').setAttribute('max', date);
    document.getElementById('fechaF2').setAttribute('max', date);
    document.getElementById('fechaI2').setAttribute('max', date);

    // Acciones necesarias para mostrar los empleados en la tabla 
    readRowsEmp(API_ADMIN_USUARIOS);
    // Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js
    fillSelect(ENDPOINT_EMPLEADO, 'un empleado', 'empleado_select', null);
    fillSelect(ENDPOINT_TIPOS_OBSERVACION, 'un tipo de observación', 'tipo_observacion', null);
});

//Funcion para seleccionar un filtro para cargar en el select de opciones
function seleccionFiltro(opcion) {
    switch (opcion) {
        case "1":
            //Traemos todas las categorias existentes
            fillSelect(ENDPOINT_CATEGORIAS, 'una categoría', 'opciones_ventas', null);
            tipo = 1;
            tipo_frase = "una categoria";
            break;
        case "2":
            //Traemos todas las marcas existentes
            fillSelect(ENDPOINT_PROVEEDOR, 'un proveedor', 'opciones_ventas', null);
            tipo = 2;
            tipo_frase = "un proveedor";
            break;
        case "3":
            //Traemos todos los proveedores existentes
            fillSelect(ENDPOINT_EMPLEADO, 'un empleado', 'opciones_ventas', null);
            tipo = 3;
            tipo_frase = "un empleado";
            break;
        default:
            console.log("no entre a ningún caso");
            break;
    }
}

// Se asigna el valor a la variable donde 1 es igual a reporte por historial y 2 por ingrediente
function valorTipoReporte(valorReporte) {
    tiporeporte = valorReporte;
    if (tiporeporte == 3) {
        document.getElementById('ocultar_inputs').classList.remove('visually-hidden');
        document.getElementById('ocultar_inputs2').classList.remove('visually-hidden');
    } else {
        document.getElementById('ocultar_inputs').classList.add('visually-hidden');
        document.getElementById('ocultar_inputs2').classList.add('visually-hidden');
        document.getElementById('fechaI2').value = '';
        document.getElementById('fechaF2').value = '';
    }
}

// Función para abrir el reporte de registros de productos
function openReporteIngresosProducto() {
    // Se crea un if para saber cual reporte debe abrir el sistema 
    if (tiporeporte == 1) {
        // Se establece la ruta del reporte en el servidor.
        let url = SERVER + 'reports/sitio_privado/ingresos_historial.php';
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    } else if (tiporeporte == 2) {
        // Se establece la ruta del reporte en el servidor.
        let url = SERVER + 'reports/sitio_privado/ingresos_ingrediente.php';
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    } else if (tiporeporte == 3) {
        // se crean las variables para las fechas
        let fechaI = document.getElementById('fechaI2').value;
        let fechaF = document.getElementById('fechaF2').value;
        // se un if para validar q la fecha de inicio no sea mayor que la de fin
        if (fechaI == 0 && fechaF == 0) {
            //se muestra un mensaje con el error
            sweetAlert(6, 'Por favor ingrese una fecha para poder generar el reporte.', null);
        } else if (fechaI == 0) {
            //se muestra un mensaje con el error
            sweetAlert(6, 'Por favor ingrese una fecha de inicio para poder generar el reporte.', null);
        } else if (fechaF == 0) {
            //se muestra un mensaje con el error
            sweetAlert(6, 'Por favor ingrese una fecha de fin para poder generar el reporte.', null);
        } else if (fechaI > fechaF) {
            //se muestra un mensaje con el error
            sweetAlert(6, 'La fecha de inicio debe ser menor a la fecha de fin.', null);
        } else {
            console.log(fechaI);
            // Se establece la ruta del reporte en el servidor concatenando las fechas
            let url = SERVER + 'reports/sitio_privado/ingresos_rango_fecha.php?fechaI=' + fechaI + '&fechaF=' + fechaF;
            // Se abre el reporte en una nueva pestaña del navegador web.
            window.open(url);
        }
    }
}

function limpiarFormulario() {
    document.getElementById('form_pedidos_completados').reset();
    document.getElementById('form_ventas_personalizado').reset();
    document.getElementById('form_inventario_personalizado').reset();
    document.getElementById('form_ventas_producto_personalizado').reset();
    document.getElementById('form_observaciones_tipo').reset();
    //se limpia la tabla del model de los empleados a la hora de generar el reporte
    readRowsEmp(API_ADMIN_USUARIOS);
    // se limpia el buscador de empleados
    document.getElementById('search-form-emp').reset();
    // Se ocultan los campos de fecha 
    document.getElementById('ocultar_inputs').classList.add('visually-hidden');
    document.getElementById('ocultar_inputs2').classList.add('visually-hidden');
}

// Función para abrir el reporte de los pedidos completados
function openReportePedidosCompletados() {
    // se crean las variables para las fechas
    let fechaI = document.getElementById('fechaI').value;
    let fechaF = document.getElementById('fechaF').value;

    // se un if para validar q la fecha de inicio no sea mayor que la de fin
    if (fechaI == 0 && fechaF == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha para poder generar el reporte.', null);
    } else if (fechaI == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha de inicio para poder generar el reporte.', null);
    } else if (fechaF == 0) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'Por favor ingrese una fecha de fin para poder generar el reporte.', null);
    } else if (fechaI > fechaF) {
        //se muestra un mensaje con el error
        sweetAlert(6, 'La fecha de inicio debe ser menor a la fecha de fin.', null);
    } else {
        console.log(fechaI);
        // Se establece la ruta del reporte en el servidor concatenando las fechas
        let url = SERVER + 'reports/sitio_privado/pedidos_completados.php?fechaI=' + fechaI + '&fechaF=' + fechaF;
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    }
}

// Función para abrir el reporte de productos venddidos y cuanto ha recaudado.
function openReporteProductosVendidos() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/productos_vendidos.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

/* bloque de funciones para mostrar los empleados en la tabla */

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form-emp').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRowsEmp(API_ADMIN_USUARIOS, 'search-form-emp');
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTableEmp(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr onclick="openPlaceEmp(${row.idempleado},'${row.nombre_empleado}')">
                <td>${row.nombre_empleado}</td>
                <td>${row.apellido_empleado}</td>
                <td>${row.dui_empleado}</td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows-emple').innerHTML = content;
}

//Leer empleados para mostrar en la tabla de observaciones empleado
function readRowsEmp(api) {
    fetch(api + 'readAlls', {
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
                fillTableEmp(data);
            });
        } else {
            console.log(request.estado + '' + request.statusText);
        }
    });
}

//Busqueda de empleados para mostrar en la tabla de observaciones empleado
function searchRowsEmp(api, form) {
    fetch(api + 'searchEmp', {
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
                    fillTableEmp(response.dataset);
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

//Al dar clic en la tabla de empleados se le asignará un valor al texto
function openPlaceEmp(id, nombre) {
    document.getElementById('idempleado').value = id;
    document.getElementById('empleadoR').value = nombre;
    Swal.fire({
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        title: 'Empleado seleccionado',
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

// Funcion para abrir reportes de productos más vendidos con descuento.
function openReporteProductosVendidosDescuento() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/producto_descuento.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

// Funcion para abrir reportes de ingredientes de cada producto
function openReporteProductosIngrediente() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/producto_ingrediente.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

// Funcion para abrir reportes de ingredientes y su cantidad
function openReporteIngredientesCantidad() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/ingredientes_cantidad.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

// Se crea la variable para saber que tipo de reporte desea el usuario
var tiporeporte = null;
var frase_tipo_observ = null;

//Función para abrir reporte ventas personalizada
function valorReporteVentas() {
    tiporeporte = document.getElementById('reporteVentasPer').value;
}

// Función para abrir y el select de reportesventas personalizada
function openReporteProductosVendidosPer() {
    // Se crea un if para saber cual reporte debe abrir el sistema 
    if (tiporeporte == 1) {
        // Se establece la ruta del reporte en el servidor.
        let url = SERVER + 'reports/sitio_privado/ventas_dia.php';
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    } else if (tiporeporte == 2) {
        // Se establece la ruta del reporte en el servidor.
        let url = SERVER + 'reports/sitio_privado/ventas_mes.php';
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    } else if (tiporeporte == 3) {
        // Se establece la ruta del reporte en el servidor.
        let url = SERVER + 'reports/sitio_privado/ventas_anio.php';
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    }
}

//Función para abrir reporte observaciones personalizada
function valorReporteObservacionesPer(valor) {
    tiporeporte = valor;
    if (tiporeporte === null) {
        sweetAlert(2, "No ha seleccionado un tipo", null);
    } else {
        switch (tiporeporte) {
            case "1":
                frase_tipo_observ = "Accidente";
                break;
            case "2":
                frase_tipo_observ = "Atención al cliente";
                break;
            case "3":
                frase_tipo_observ = "Limpieza";
                break;
            case "4":
                frase_tipo_observ = "Producto Agotado";
                break;
            case "5":
                frase_tipo_observ = "Altercado";
                break;
            default:
                sweetAlert(2, "No ha seleccionado un tipo", null);
                break;
        }
    }
}

//Función para abrir y el select de reporte de observaciones personalizado
function openReporteObservacionesPersonalizadas() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/observaciones_tipo.php?tipo=' + tiporeporte + '&frase=' + frase_tipo_observ;
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

//Variable para saber que filtro eligio (Categoria o Proveedor)
var tipo,
    // Variable para mostrar en titulo de gráfica, dependiendo que tipo eligio (Categoria o Proveedor)
    tipo_frase,
    //Variable para saber que opción ha elegido
        opcion,
            opcion_texto;

//Funcion para seleccionar un filtro para cargar en el select de opciones
function seleccionFiltro(opcion_filtro) {
    switch (opcion_filtro) {
        case "1":
            //Traemos todas las categorias existentes
            fillSelect(ENDPOINT_CATEGORIAS, 'una categoría', 'opciones_ventas', null);
            tipo = 1;
            tipo_frase = 'categoria';
            opcion = null;
            break;
        case "2":
            //Traemos todas las marcas existentes
            fillSelect(ENDPOINT_PROVEEDOR, 'un proveedor', 'opciones_ventas', null);
            tipo = 2;
            tipo_frase = 'proveedor';
            opcion = null;
            break;
        case "3":
            //Traemos todas las marcas existentes
            fillSelect(ENDPOINT_EMPLEADO, 'un empleado', 'opciones_ventas', null);
            tipo = 3;
            tipo_frase = 'empleado';
            opcion = null;
            break;
        default:
            console.log("no entre a ningún caso");
            break;
    }
}

//Al seleccionar una opción de los 3 filtros, se guardará en una variable
function seleccionOpcion(opcion_elegida) {
    opcion = opcion_elegida;
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de generar el reporte
document.getElementById('form_ventas_producto_personalizado').addEventListener('submit', function (event) {
    event.preventDefault();
    //Validamos que haya seleccionado alguna opción después de seleccionar el filtro
    if (opcion === null || tipo === null) {
        sweetAlert(2, "No ha seleccionado todos los campos necesarios", null);
    } else {
        let combo = document.getElementById("opciones_ventas");
        let opcion_texto = combo.options[combo.selectedIndex].text;
        // Se establece la ruta del reporte en el servidor concatenando las fechas
        let url = SERVER + 'reports/sitio_privado/pedidos_vendidos.php?tipo=' + tipo + '&opcion=' + opcion + '&frase=' + tipo_frase + '&opcion_texto=' + opcion_texto;
        // Se abre el reporte en una nueva pestaña del navegador web.
        window.open(url);
    }
});

// Funcion para abrir reportes de ingredientes de cada producto
function openReservaciones() {
    // Se establece la ruta del reporte en el servidor.
    let url = SERVER + 'reports/sitio_privado/reservaciones_estado.php';
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

//fununción para mostrar el inventario por un rango de fecha en especifico
function openObservacionEmpleado(event) {
    event.preventDefault();
    // se crean las variables para las fechas
    let empleado = document.getElementById('idempleado').value;
    let nombre_empleado = document.getElementById('empleadoR').value;
    // Se establece la ruta del reporte en el servidor concatenando las fechas
    let url = SERVER + 'reports/sitio_privado/observacion_empleado.php?empleado=' + empleado + '&nombre_empleado=' + nombre_empleado;;
    // Se abre el reporte en una nueva pestaña del navegador web.
    window.open(url);
}

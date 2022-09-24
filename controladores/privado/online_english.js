// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'sitio_privado/api_login.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    /*Función menú sticky*/
    let menu = document.getElementById('menu2');
    window.onscroll = function () {
        if (window.pageYOffset >= 50) {
            menu.classList.add('sticky');
        }
        else {
            menu.classList.remove('sticky');
        }
    }
    cargarContenidoOnline();
});

window.onload = function() {
    inactivityTime();
}

function cargarContenidoOnline() {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    fetch(API_USUARIOS + 'obtenerUsuario', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se revisa si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
                if (response.session) {
                    // Se comprueba si la respuesta es satisfactoria, de lo contrario se direcciona a la página web principal.
                    if (response.estado) {
                        //Se crea la variable de Header que será llamada en varias páginas
                        let menu_lateral = '',
                        header = '', //creamos una variable que tendra el menú
                        menu_movil = '', //creamos una variable que tendra el menú movil
                        imagen = ''; //Creamos una variable que almacenará la dirección de la imagen
                        switch (response.nivel_usuario) {
                            case 1:
                                menu_lateral += `
                                    <a id="btn_dashboard" onclick="activarBoton('btn_dashboard')" onmouseout="CambiarImagen('btn_dashboard', 'dashboard2', 'area_personal.png')" onmouseover="CambiarImagen2('dashboard2', 'area_personal')" href="dashboard.html"><img id="dashboard2" src="../../recursos/icons/area_personal.png" alt="dashboard">Área Personal</a>
                                    <a id="btn_observacion" onclick="activarBoton('btn_observacion')" onmouseout="CambiarImagen('btn_observacion', 'observaciones2', 'observaciones.png')" onmouseover="CambiarImagen2('observaciones2', 'observaciones')" href="observaciones.html"><img id="observaciones2" src="../../recursos/icons/observaciones.png" alt="Observaciones">Observaciones</a>
                                    <a id="btn_calendario" onclick="activarBoton('btn_calendario')" onmouseout="CambiarImagen('btn_calendario', 'calendario2', 'calendario.png')" onmouseover="CambiarImagen2('calendario2', 'calendario')" href="calendario.html"><img id="calendario2" src="../../recursos/icons/calendario.png" alt="Calendario">Calendario Eventos</a>
                                    <a id="btn_grafica" onclick="activarBoton('btn_grafica')" onmouseout="CambiarImagen('btn_grafica', 'grafica2', 'grafica.png')" onmouseover="CambiarImagen2('grafica2', 'grafica')" href="estadistica.html"><img id="grafica2" src="../../recursos/icons/grafica.png" alt="Gráfica">Estadísticas</a>
                                    <a id="btn_reservacion" onclick="activarBoton('btn_reservacion')" onmouseout="CambiarImagen('btn_reservacion', 'reservacion2', 'reservacion.png')" onmouseover="CambiarImagen2('reservacion2', 'reservacion')" href="reservaciones.html"><img id="reservacion2" src="../../recursos/icons/reservacion.png" alt="Reservación">Reservaciones</a>
                                    <a id="btn_inventario" onclick="activarBoton('btn_inventario')" onmouseout="CambiarImagen('btn_inventario', 'inventario2', 'inventario.png')" onmouseover="CambiarImagen2('inventario2', 'inventario')" href="inventario_ingrediente.html"><img id="inventario2" src="../../recursos/icons/inventario.png" alt="Caja">Inventario</a>
                                    <a id="btn_producto" onclick="activarBoton('btn_producto')" onmouseout="CambiarImagen('btn_producto', 'producto2', 'producto.png')" onmouseover="CambiarImagen2('producto2', 'producto')" href="inventario_producto.html"><img id="producto2" src="../../recursos/icons/producto.png" alt="Taza">Productos</a>
                                    <a id="btn_categoria" onclick="activarBoton('btn_categoria')" onmouseout="CambiarImagen('btn_categoria', 'categoria2', 'categoria.png')" onmouseover="CambiarImagen2('categoria2', 'categoria')" href="administrar_categoria.html"><img id="categoria2" src="../../recursos/icons/categoria.png" alt="Taza">Categorias</a>
                                    <a id="btn_proveedor" onclick="activarBoton('btn_proveedor')" onmouseout="CambiarImagen('btn_proveedor', 'proveedor2', 'proveedores.png')" onmouseover="CambiarImagen2('proveedor2', 'proveedores')" href="administrar_proveedores.html"><img id="proveedor2" src="../../recursos/icons/proveedores.png" alt="Camion">Proveedores</a>
                                    <a id="btn_empleado" onclick="activarBoton('btn_empleado')" onmouseout="CambiarImagen('btn_empleado', 'empleado2', 'empleados.png')" onmouseover="CambiarImagen2('empleado2', 'empleados')" href="administrar_empleado.html"><img id="empleado2" src="../../recursos/icons/empleados.png" alt="Empleados">Administrar Empleados</a>
                                    <a id="btn_usuario" onclick="activarBoton('btn_usuario')" onmouseout="CambiarImagen('btn_usuario', 'usuario2', 'usuarios.png')" onmouseover="CambiarImagen2('usuario2', 'usuarios')" href="administrar_usuario.html"><img id="usuario2" src="../../recursos/icons/usuarios.png" alt="Usuarios">Administrar Usuarios</a>
                                    <a onmouseout="CambiarImagen('salir2', 'cerrar_sesion.png')" onmouseover="CambiarImagen2('salir2', 'cerrar_sesion')" id="cerrar_sesion" onclick="logOut()" href="#"><img id="salir2" src="../../recursos/icons/cerrar_sesion.png" alt="Salir" onclick="logOut()">Sign Off</a>
                                `;
                                if (response.imagen_usuario == null) {
                                    imagen = `<a href="perfil.html"><img src="../../recursos/icons/user2.png" alt="usuario_icono" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Perfil"></a>`
                                } else {
                                    imagen = `<a href="perfil.html"><img src="${SERVER}images/usuario/${response.imagen_usuario}" alt="usuario_icono" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Perfil"></a>`
                                }
                                header += `
                                    <!--Fecha se ocultara en pantallas menos a MD-->
                                    <div id="fecha" class="d-none d-md-block">
                                        <h6 id="date"></h6>
                                    </div>
                                    <div id="datos_usuario">
                                        <h6>Hola, ${response.empleado}</h6>
                                        <h6>${response.tipo_usuario}</h6>
                                    </div>
                                    <!--Imagen del usuario-->
                                    <div id="usuario_logo">
                                        ${imagen}
                                    </div>
                                    <!--Creamos la opción de idiomas que tendrá el sitio-->
                                    <div id="opciones_personalizadas">
                                        <!--Creamos la opción de modo oscuro y claro-->
                                        <div id="boton_modo">
                                            <button class="btn btn-secondary btn-sm">
                                                Light Mode
                                                <a class="switch" id="switch" onclick="ModoNocturno()">
                                                    <span>
                                                        <i><img src="../../recursos/icons/sun.png" alt=""></i>
                                                    </span>
                                                    <span>
                                                        <i><img src="../../recursos/icons/moon.png" alt=""></i>
                                                    </span>
                                                </a>
                                            </button>
                                        </div>
                                        <!--Creamos la opción de idiomas que tendrá el sitio-->
                                        <div id="boton_idioma">
                                            <div class="btn-group">
                                                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">English<img src="../../recursos/icons/england.png">
                                                </button>
                                                <ul id="opciones" class="dropdown-menu">
                                                    <a class="dropdown-item btn-sm" id="idioma" data-toggle="tooltip" data-placement="left" data-html="true" href="../privado/dashboard.html">Español<img id="imagen_idioma" src="../../recursos/icons/español.png"></a>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                menu_movil += `
                                    <div class="offcanvas-header" id="logo_menu_movil">
                                        <img src="../../recursos/imgs/koffisoft_logo2.png" alt="logo_blanco">
                                        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <div class="offcanvas-body">
                                        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="boton_enlace">
                                            <p class="text" href="#" tabindex="-1" aria-disabled="true">Opciones Principales
                                            </p>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_dashboard2" onclick="activarBoton('btn_dashboard')" onmouseout="CambiarImagen('btn_dashboard', 'dashboard', 'area_personal.png')" onmouseover="CambiarImagen2('dashboard', 'area_personal')" class="nav-link active" href="dashboard.html">Área Personal<img id="dashboard" src="../../recursos/icons/area_personal.png" alt="dashboard"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_observacion2" onclick="activarBoton('btn_observacion')" onmouseout="CambiarImagen('btn_observacion', 'observaciones', 'observaciones.png')" onmouseover="CambiarImagen2('observaciones', 'observaciones')" class="nav-link active" href="observaciones.html">Observaciones<img id="observaciones" src="../../recursos/icons/observaciones.png" alt="Observaciones"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_calendario2" onclick="activarBoton('btn_calendario')" onmouseout="CambiarImagen('btn_calendario', 'calendario', 'calendario.png')" onmouseover="CambiarImagen2('calendario', 'calendario')" class="nav-link active" href="calendario.html">Calendario Eventos<img id="calendario" src="../../recursos/icons/calendario.png" alt="Calendario"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_grafica2" onclick="activarBoton('btn_grafica')" onmouseout="CambiarImagen('btn_grafica', 'grafica', 'grafica.png')" onmouseover="CambiarImagen2('grafica', 'grafica')" class="nav-link active" href="estadistica.html">Estadísticas<img id="grafica" src="../../recursos/icons/grafica.png" alt="Gráfica"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_reservacion2" onclick="activarBoton('btn_reservacion')" onmouseout="CambiarImagen('btn_reservacion', 'reservacion', 'reservacion.png')" onmouseover="CambiarImagen2('reservacion', 'reservacion')" class="nav-link active" href="reservaciones.html">Reservaciones<img id="reservacion" src="../../recursos/icons/reservacion.png" alt="Reservación"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_inventario2" onclick="activarBoton('btn_inventario')" onmouseout="CambiarImagen('btn_inventario', 'inventario', 'inventario.png')" onmouseover="CambiarImagen2('inventario', 'inventario')" class="nav-link active" href="inventario_ingrediente.html">Inventario<img id="inventario" src="../../recursos/icons/inventario.png" alt="Caja"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_producto2" onclick="activarBoton('btn_producto')" onmouseout="CambiarImagen('btn_producto', 'producto', 'producto.png')" onmouseover="CambiarImagen2('producto', 'producto')" class="nav-link active" href="inventario_producto.html">Productos<img id="producto" src="../../recursos/icons/producto.png" alt="Taza"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_categoria2" onclick="activarBoton('btn_categoria')" onmouseout="CambiarImagen('btn_categoria', 'categoria', 'categoria.png')" onmouseover="CambiarImagen2('categoria', 'categoria')" class="nav-link active" href="administrar_categoria.html">Categorias<img id="categoria" src="../../recursos/icons/categoria.png" alt="bandeja"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_proveedor2" onclick="activarBoton('btn_proveedor')" onmouseout="CambiarImagen('btn_proveedor', 'proveedor', 'proveedores.png')" onmouseover="CambiarImagen2('proveedor', 'proveedores')" class="nav-link active" href="administrar_proveedores.html">Proveedores<img id="proveedor" src="../../recursos/icons/proveedores.png" alt="Camion"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_empleado2" onclick="activarBoton('btn_empleado')" onmouseout="CambiarImagen('btn_empleado', 'empleado', 'empleados.png')" onmouseover="CambiarImagen2('empleado', 'empleados')" class="nav-link active" href="administrar_empleado.html">Administrar Empleados<img id="empleado" src="../../recursos/icons/empleados.png" alt="Empleados"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_usuario2" onclick="activarBoton('btn_usuario')" onmouseout="CambiarImagen('btn_usuario', 'usuario', 'usuarios.png')" onmouseover="CambiarImagen2('usuario', 'usuarios')" class="nav-link active" href="administrar_usuario.html">Administrar Usuarios<img id="usuario" src="../../recursos/icons/usuarios.png" alt="Usuarios"></a>
                                            </li>
                                            <li>
                                                <p>Configuración</p>
                                            </li>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active" href="perfil.html">Perfil<img src="../../recursos/icons/user2.png" alt="perfil"></a>
                                            </li>
                                            <li class="nav-item">
                                                <!--Creamos la opción de modo oscuro y claro-->
                                                <div id="boton_modo2">
                                                    <button class="btn btn-secondary btn-sm">
                                                        Light Mode
                                                        <a class="switch2" id="switch2" onclick="ModoNocturno()">
                                                            <span>
                                                                <i><img src="../../recursos/icons/sun.png" alt=""></i>
                                                            </span>
                                                            <span>
                                                                <i><img src="../../recursos/icons/moon.png" alt=""></i>
                                                            </span>
                                                        </a>
                                                    </button>
                                                </div>
                                            </li>
                                            <li class="nav-item">
                                                <!--Creamos la opción de idiomas que tendrá el sitio-->
                                                <div id="boton_idioma2">
                                                    <div class="btn-group">
                                                        <button class="btn btn-secondary btn-sm dropdown-toggle"
                                                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            English<img src="../../recursos/icons/england.png">
                                                        </button>
                                                        <ul id="opciones" class="dropdown-menu">
                                                            <a class="dropdown-item btn-sm" id="idioma"
                                                                data-toggle="tooltip" data-placement="left" data-html="true"
                                                                href="../privado/dashboard.html">Español<img id="imagen_idioma"
                                                                    src="../../recursos/icons/español.png"></a>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="nav-item">
                                                <a onmouseout="CambiarImagen('salir', 'cerrar_sesion.png')"
                                                    onmouseover="CambiarImagen2('salir', 'cerrar_sesion')"
                                                    class="nav-link active" href="#" onclick="logOut()"><img id="salir"
                                                        src="../../recursos/icons/cerrar_sesion.png" alt="Salir">Sign 
                                                    Off</a>
                                            </li>
                                        </ul>
                                    </div>
                                `;
                                break;
                            case 2:
                                menu_lateral += `
                                    <a id="btn_dashboard" onclick="activarBoton('btn_dashboard')" onmouseout="CambiarImagen('btn_dashboard', 'dashboard2', 'area_personal.png')" onmouseover="CambiarImagen2('dashboard2', 'area_personal')" href="dashboard.html"><img id="dashboard2" src="../../recursos/icons/area_personal.png" alt="dashboard">Área Personal</a>
                                    <a id="btn_observacion" onclick="activarBoton('btn_observacion')" onmouseout="CambiarImagen('btn_observacion', 'observaciones2', 'observaciones.png')" onmouseover="CambiarImagen2('observaciones2', 'observaciones')" href="observaciones.html"><img id="observaciones2" src="../../recursos/icons/observaciones.png" alt="Observaciones">Observaciones</a>
                                    <a id="btn_inventario" onclick="activarBoton('btn_inventario')" onmouseout="CambiarImagen('btn_inventario', 'inventario2', 'inventario.png')" onmouseover="CambiarImagen2('inventario2', 'inventario')" href="inventario_ingrediente.html"><img id="inventario2" src="../../recursos/icons/inventario.png" alt="Caja">Inventario</a>
                                    <a id="btn_proveedor" onclick="activarBoton('btn_proveedor')" onmouseout="CambiarImagen('btn_proveedor', 'proveedor2', 'proveedores.png')" onmouseover="CambiarImagen2('proveedor2', 'proveedores')" href="administrar_proveedores.html"><img id="proveedor2" src="../../recursos/icons/proveedores.png" alt="Camion">Proveedores</a>
                                    <a onmouseout="CambiarImagen('salir2', 'cerrar_sesion.png')" onmouseover="CambiarImagen2('salir2', 'cerrar_sesion')" id="cerrar_sesion" onclick="logOut()" href="#"><img id="salir2" src="../../recursos/icons/cerrar_sesion.png" alt="Salir" onclick="logOut()">Sign Off</a>
                                `;
                                if (response.imagen_usuario == null) {
                                    imagen = `<a href="perfil.html"><img src="../../recursos/icons/user2.png" alt="usuario_icono" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Perfil"></a>`
                                } else {
                                    imagen = `<a href="perfil.html"><img src="${SERVER}images/usuario/${response.imagen_usuario}" alt="usuario_icono" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Perfil"></a>`
                                }
                                header += `
                                    <!--Fecha se ocultara en pantallas menos a MD-->
                                    <div id="fecha" class="d-none d-md-block">
                                        <h6 id="date"></h6>
                                    </div>
                                    <div id="datos_usuario">
                                        <h6>Hola, ${response.empleado}</h6>
                                        <h6>${response.tipo_usuario}</h6>
                                    </div>
                                    <!--Imagen del usuario-->
                                    <div id="usuario_logo">
                                        ${imagen}
                                    </div>
                                    <!--Creamos la opción de idiomas que tendrá el sitio-->
                                    <div id="opciones_personalizadas">
                                        <!--Creamos la opción de modo oscuro y claro-->
                                        <div id="boton_modo">
                                            <button class="btn btn-secondary btn-sm">
                                                Light Mode
                                                <a class="switch" id="switch" onclick="ModoNocturno()">
                                                    <span>
                                                        <i><img src="../../recursos/icons/sun.png" alt=""></i>
                                                    </span>
                                                    <span>
                                                        <i><img src="../../recursos/icons/moon.png" alt=""></i>
                                                    </span>
                                                </a>
                                            </button>
                                        </div>
                                        <!--Creamos la opción de idiomas que tendrá el sitio-->
                                        <div id="boton_idioma">
                                            <div class="btn-group">
                                                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Español<img src="../../recursos/icons/español.png">
                                                </button>
                                                <ul id="opciones" class="dropdown-menu">
                                                    <a class="dropdown-item btn-sm" id="idioma" data-toggle="tooltip" data-placement="left" data-html="true" href="#">English<img id="imagen_idioma" src="../../recursos/icons/england.png"></a>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                menu_movil += `
                                    <div class="offcanvas-header" id="logo_menu_movil">
                                        <img src="../../recursos/imgs/koffisoft_logo2.png" alt="logo_blanco">
                                        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                    </div>
                                    <div class="offcanvas-body">
                                        <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="boton_enlace">
                                            <p class="text" href="#" tabindex="-1" aria-disabled="true">Opciones Principales
                                            </p>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_dashboard2" onclick="activarBoton('btn_dashboard')" onmouseout="CambiarImagen('btn_dashboard', 'dashboard', 'area_personal.png')" onmouseover="CambiarImagen2('dashboard', 'area_personal')" class="nav-link active" href="dashboard.html">Área Personal<img id="dashboard" src="../../recursos/icons/area_personal.png" alt="dashboard"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_observacion2" onclick="activarBoton('btn_observacion')" onmouseout="CambiarImagen('btn_observacion', 'observaciones', 'observaciones.png')" onmouseover="CambiarImagen2('observaciones', 'observaciones')" class="nav-link active" href="observaciones.html">Observaciones<img id="observaciones" src="../../recursos/icons/observaciones.png" alt="Observaciones"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_inventario2" onclick="activarBoton('btn_inventario')" onmouseout="CambiarImagen('btn_inventario', 'inventario', 'inventario.png')" onmouseover="CambiarImagen2('inventario', 'inventario')" class="nav-link active" href="inventario_ingrediente.html">Inventario<img id="inventario" src="../../recursos/icons/inventario.png" alt="Caja"></a>
                                            </li>
                                            <li class="nav-item">
                                                <a id="btn_proveedor2" onclick="activarBoton('btn_proveedor')" onmouseout="CambiarImagen('btn_proveedor', 'proveedor', 'proveedores.png')" onmouseover="CambiarImagen2('proveedor', 'proveedores')" class="nav-link active" href="administrar_proveedores.html">Proveedores<img id="proveedor" src="../../recursos/icons/proveedores.png" alt="Camion"></a>
                                            </li>
                                            <li>
                                                <p>Configuración</p>
                                            </li>
                                            <li>
                                                <hr class="dropdown-divider">
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link active" href="perfil.html">Perfil<img src="../../recursos/icons/user2.png" alt="perfil"></a>
                                            </li>
                                            <li class="nav-item">
                                                <!--Creamos la opción de modo oscuro y claro-->
                                                <div id="boton_modo2">
                                                    <button class="btn btn-secondary btn-sm">
                                                        Light Mode
                                                        <a class="switch2" id="switch2" onclick="ModoNocturno()">
                                                            <span>
                                                                <i><img src="../../recursos/icons/sun.png" alt=""></i>
                                                            </span>
                                                            <span>
                                                                <i><img src="../../recursos/icons/moon.png" alt=""></i>
                                                            </span>
                                                        </a>
                                                    </button>
                                                </div>
                                            </li>
                                            <li class="nav-item">
                                                <!--Creamos la opción de idiomas que tendrá el sitio-->
                                                <div id="boton_idioma2">
                                                    <div class="btn-group">
                                                        <button class="btn btn-secondary btn-sm dropdown-toggle"
                                                            type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Español<img src="../../recursos/icons/español.png">
                                                        </button>
                                                        <ul id="opciones" class="dropdown-menu">
                                                            <a class="dropdown-item btn-sm" id="idioma"
                                                                data-toggle="tooltip" data-placement="left" data-html="true"
                                                                href="#">English<img id="imagen_idioma"
                                                                    src="../../recursos/icons/england.png"></a>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="nav-item">
                                                <a onmouseout="CambiarImagen('salir', 'cerrar_sesion.png')"
                                                    onmouseover="CambiarImagen2('salir', 'cerrar_sesion')"
                                                    class="nav-link active" href="#" onclick="logOut()"><img id="salir"
                                                        src="../../recursos/icons/cerrar_sesion.png" alt="Salir">Sign 
                                                    Off</a>
                                            </li>
                                        </ul>
                                    </div>
                                `;
                                break;
                            default:
                                fetch(API_USUARIOS + 'cerrarSesion', {
                                    method: 'get'
                                }).then(function (request) {
                                    // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                                    if (request.ok) {
                                        // Se obtiene la respuesta en formato JSON.
                                        request.json().then(function (response) {
                                            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                                            if (response.estado) {
                                                sweetAlert(3, 'El usuario no posee las credenciales para ingresar al sistema, su tipo de usuario realiza otras funciones', 'index.html');
                                            } else {
                                                sweetAlert(2, response.exception, null);
                                            }
                                        });
                                    } else {
                                        console.log(request.estado + ' ' + request.estadoText);
                                    }
                                });
                                break;
                        }
                        //La constante y las variables las mandamos a llamar con un Id para que se concatenen
                        document.getElementById('botones').innerHTML = menu_lateral;
                        document.getElementById('apartado_superior2').innerHTML = header;
                        document.getElementById('offcanvasWithBothOptions').innerHTML = menu_movil;
                        boton_seleccionado();
                        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                            return new bootstrap.Tooltip(tooltipTriggerEl)
                        })
                    } else {
                        sweetAlert(3, response.exception, 'index.html');
                    }
                } else {
                    location.href = 'index.html';
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

/*Funciones para cambiar la imagen de los botones al ponerle encima el mouse */
function CambiarImagen(btn, valor1, valor2) {
    //Validamos si ese boton ya esta activo
    if (document.getElementById(btn).classList.contains('boton_activo')) {
        
    }
    else {
        var image = document.getElementById(valor1);
        image.src = '../../recursos/icons/' + valor2;
    }
}

function CambiarImagen2(valor1, valor2) {
    var image = document.getElementById(valor1);
    image.src = '../../recursos/icons/' + valor2 + '2.png';
}

/*Funciones para activar el boton al pulsarlo*/
function activarBoton(boton){
    console.log(boton);
    sessionStorage.setItem('boton_seleccionado', boton);
}

//Función que activa el modo nocturno
function ModoNocturno() {
    document.getElementById('switch').classList.toggle('active');
    document.getElementById('switch2').classList.toggle('active');
    document.body.classList.toggle('dark');
    //Guardamos el modo nocturno
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'true');
    }
    else {
        localStorage.setItem('dark-mode', 'false');
    }
}

//Función para activar el botón de la sección en la que se encuentra el usuario del menú lateral
function boton_seleccionado() {
    switch (sessionStorage.getItem('boton_seleccionado')) {
        case 'btn_dashboard':
            document.getElementById('btn_dashboard').classList.add('boton_activo');
            document.getElementById('btn_dashboard2').classList.add('boton_activo'); 
            var imagen = document.getElementById('dashboard'),
                imagen2 = document.getElementById('dashboard2');
            imagen.src = '../../recursos/icons/area_personal2.png';
            imagen2.src = '../../recursos/icons/area_personal2.png';
            break;
        case 'btn_observacion':
            document.getElementById('btn_observacion').classList.add('boton_activo');
            document.getElementById('btn_observacion2').classList.add('boton_activo');
            var imagen = document.getElementById('observaciones'),
                imagen2 = document.getElementById('observaciones2');
            imagen.src = '../../recursos/icons/observaciones2.png';
            imagen2.src = '../../recursos/icons/observaciones2.png';
            break;
        case 'btn_calendario':
            document.getElementById('btn_calendario').classList.add('boton_activo');
            document.getElementById('btn_calendario2').classList.add('boton_activo');
            var imagen = document.getElementById('calendario'),
                imagen2 = document.getElementById('calendario2');
            imagen.src = '../../recursos/icons/calendario2.png';
            imagen2.src = '../../recursos/icons/calendario2.png';
            break;
        case 'btn_grafica':
            document.getElementById('btn_grafica').classList.add('boton_activo');
            document.getElementById('btn_grafica2').classList.add('boton_activo');
            var imagen = document.getElementById('grafica'),
                imagen2 = document.getElementById('grafica2');
            imagen.src = '../../recursos/icons/grafica2.png';
            imagen2.src = '../../recursos/icons/grafica2.png';
            break;
        case 'btn_reservacion':
            document.getElementById('btn_reservacion').classList.add('boton_activo');
            document.getElementById('btn_reservacion2').classList.add('boton_activo');
            var imagen = document.getElementById('reservacion'),
                imagen2 = document.getElementById('reservacion2');
            imagen.src = '../../recursos/icons/reservacion2.png';
            imagen2.src = '../../recursos/icons/reservacion2.png';
            break;
        case 'btn_inventario':
            document.getElementById('btn_inventario').classList.add('boton_activo');
            document.getElementById('btn_inventario2').classList.add('boton_activo');
            var imagen = document.getElementById('inventario'),
                imagen2 = document.getElementById('inventario2');
            imagen.src = '../../recursos/icons/inventario2.png';
            imagen2.src = '../../recursos/icons/inventario2.png';
            break;
        case 'btn_producto':
            document.getElementById('btn_producto').classList.add('boton_activo');
            document.getElementById('btn_producto2').classList.add('boton_activo');
            var imagen = document.getElementById('producto'),
                imagen2 = document.getElementById('producto2');
            imagen.src = '../../recursos/icons/producto2.png';
            imagen2.src = '../../recursos/icons/producto2.png';
            break;
        case 'btn_categoria':
            document.getElementById('btn_categoria').classList.add('boton_activo');
            document.getElementById('btn_categoria2').classList.add('boton_activo');
            var imagen = document.getElementById('categoria'),
                imagen2 = document.getElementById('categoria2');
            imagen.src = '../../recursos/icons/categoria2.png';
            imagen2.src = '../../recursos/icons/categoria2.png';
            break;
        case 'btn_proveedor':
            document.getElementById('btn_proveedor').classList.add('boton_activo');
            document.getElementById('btn_proveedor2').classList.add('boton_activo');
            var imagen = document.getElementById('proveedor'),
                imagen2 = document.getElementById('proveedor2');
            imagen.src = '../../recursos/icons/proveedores2.png';
            imagen2.src = '../../recursos/icons/proveedores2.png';
            break;
        case 'btn_empleado':
            document.getElementById('btn_empleado').classList.add('boton_activo');
            document.getElementById('btn_empleado2').classList.add('boton_activo');
            var imagen = document.getElementById('empleado'),
                imagen2 = document.getElementById('empleado2');
            imagen.src = '../../recursos/icons/empleados2.png';
            imagen2.src = '../../recursos/icons/empleados2.png';
            break;
        case 'btn_usuario':
            document.getElementById('btn_usuario').classList.add('boton_activo');
            document.getElementById('btn_usuario2').classList.add('boton_activo');
            var imagen = document.getElementById('usuario'),
                imagen2 = document.getElementById('usuario2');
            imagen.src = '../../recursos/icons/usuarios2.png';
            imagen2.src = '../../recursos/icons/usuarios2.png';
            break;
        default:
            console.log(sessionStorage.getItem('boton_seleccionado'));
            break;
    }
}

if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark');
    document.getElementById('switch').classList.remove('active');
    document.getElementById('switch2').classList.remove('active');
}

else {
    document.body.classList.remove('dark');
    document.getElementById('switch').classList.add('active');
    document.getElementById('switch2').classList.add('active');
}
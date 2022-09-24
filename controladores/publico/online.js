const CATEGORIA = SERVER + 'sitio_publico/api_productos.php?action=';

//Evento que se ejecuta cuando se carga la página web
document.addEventListener('DOMContentLoaded', function () {
    let menu = document.getElementById("menu");
    let menu2 = document.getElementById("menu2");
    window.onscroll = function () {
        if (window.pageYOffset >= 70) {
            menu.classList.add("sticky");
            menu2.classList.add("sticky");
        }
        else {
            menu.classList.remove("sticky");
            menu2.classList.remove("sticky");
        }
    }
    mostrarCategorias();
});

function mostrarCategorias() {
    fetch(CATEGORIA + 'cargarCategorias', {
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
                    // Se envían los datos a la función para llenar el menú de opciones
                    agregarCategoria(data);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.estado + ' ' + request.statusText);
        }
    });
}

function agregarCategoria(dataset) {
    var menu = `
    <li class="nav-item">
    <a class="nav-link active" href="index.html">Menú</a>
    </li>
    `;
    var menu_movil = `
    <p class="text" href="#" tabindex="-1" aria-disabled="true">Opciones Principales</p>
    <li>
        <hr class="dropdown-divider">
    </li>
    <li class="nav-item">
        <a onmouseover="CambiarImagen2('menu_comida', 'menu_comida')"
            onmouseout="CambiarImagen('menu_comida', 'menu_comida.png')"
            class="nav-link active" href="index.html">Menú<img id="menu_comida"
                src="../../recursos/icons/menu_comida.png" alt="cubiertos"></a>
    </li>
    `;
    document.getElementById("boton_enlace").innerHTML = menu;
    document.getElementById("boton_enlace2").innerHTML = menu_movil;
    //Por cada categoria 
    dataset.forEach(row => {
        // Se define una dirección con los datos de cada categoría para mostrar sus productos en otra página web.
        url = `productos.html?id=${row.idcategoria_producto}&nombre=${row.categoria_producto}`;
        menu = `
        <li class="nav-item">
            <a class="nav-link active" href="${url}">${row.categoria_producto}</a>
        </li>
        `;
        menu_movil = `
        <li class="nav-item">
            <a class="nav-link active" href="${url}">${row.categoria_producto}<img src="${SERVER}images/categoria/${row.imagen_categoria_producto}"></a>
        </li>
        `;
        document.getElementById("boton_enlace").innerHTML += menu;
        document.getElementById("boton_enlace2").innerHTML += menu_movil;
    });
    menu = `
    <li class="nav-item">
        <a class="nav-link active" href="promociones.html">Promociones</a>
    </li>
    `;
    menu_movil = `
    <li class="nav-item">
        <a onmouseover="CambiarImagen2('promociones', 'promociones')" onmouseout="CambiarImagen('promociones', 'promociones.png')"
            class="nav-link active" href="promociones.html">Promociones<img id="promociones" src="../../recursos/icons/promociones.png" alt="tarjeta_descuento"></a>
    </li>
    <li>
        <p>Configuración</p>
    </li>
    <li>
        <hr class="dropdown-divider">
    </li>
    <!--Creamos la opción de modo oscuro y claro-->
    <li class="nav-item">
        <!--Creamos la opción de modo oscuro y claro-->
        <div id="boton_modo2">
            <button class="btn btn-secondary btn-sm">Modo Claro <a class="switch2" id="switch2" onclick="ModoNocturno()">
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
    `;
    document.getElementById("boton_enlace").innerHTML += menu;
    document.getElementById("boton_enlace2").innerHTML += menu_movil;
}

function ModoNocturno() {
    document.getElementById('switch').classList.toggle('active');
    document.getElementById('switch2').classList.toggle('active');
    document.body.classList.toggle('dark');
    //Guardamos el modo nocturno
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('modo-oscuro', 'true');
    }
    else {
        localStorage.setItem('modo-oscuro', 'false');
    }
}

if (localStorage.getItem('modo-oscuro') === 'true') {
    document.body.classList.add('dark');
    document.getElementById('switch').classList.remove('active');
    document.getElementById('switch2').classList.remove('active');
}

else {
    document.body.classList.remove('dark');
    document.getElementById('switch').classList.add('active');
    document.getElementById('switch2').classList.add('active');
}
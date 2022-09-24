<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/categoria_producto.php');
require_once('../modelo/productos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se instancian las clases correspondientes.
    $categoria = new Categoria;
    $productos = new Productos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null, 'dataset' => null);
    // Se compara la acción a realizar según la petición del controlador.
    switch ($_GET['action']) {
            //Caso para traer los datos de todas las categorias
        case 'cargarCategorias':
            if ($result['dataset'] = $categoria->cargarCategorias()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen categorías para mostrar';
            }
            break;
            //Caso para traer los productos más comprados
        case 'productosFavoritos':
            if ($result['dataset'] = $productos->productosFavoritos()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen productos para mostrar';
            }
            break;
            //Caso para traer los productos por su categoria
        case 'readProductosCategoria':
            if (!$productos->setIdCategoria($_POST['idcategoria_producto'])) {
                $result['exception'] = 'Error al cargar los productos de la categoría seleccionada';
            } elseif (!$productos->setContador($_POST['contador'])) {
                $result['exception'] = 'Error al asignar el contador';
            } elseif ($result['dataset'] = $productos->readProductosCategoria()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No existen productos para mostrar';
            }
            break;
            //Caso para obtener los datos de un producto para el detalle
        case 'leerUnProducto':
            if (!$productos->setIdProducto($_POST['id_producto'])) {
                $result['exception'] = 'Identificador del producto incorrecto';
            } elseif ($result['dataset'] = $productos->leerUnProducto()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
            //Caso para obtener todos los ingredientes de un producto para el detalle
        case 'obtenerIngredientes':
            if (!$productos->setIdProducto($_POST['id_producto'])) {
                $result['exception'] = 'Identificador del producto incorrecto';
            } elseif ($result['dataset'] = $productos->cargarIngredientesProducto()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
            //Obtener la cuenta de cuantos productos existen de una categoria
        case 'contadorProductos':
            if (!$productos->setIdCategoria($_POST['idcategorias_producto'])) {
                $result['exception'] = 'Error al cargar los productos de la categoría seleccionada';
            } elseif ($result['dataset'] = $productos->contadorProductos()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
        // Caso para enviar el array de alergenos
        case 'buscarProductosAlergeno':
            if (!$productos->setIdCategoria($_POST['id_categoriaA'])) {
                $result['exception'] = 'Error al cargar los productos de la categoría seleccionada';
            } elseif ($result['dataset'] = $productos->obtenerProductosAlergenos($_POST['alergenos_'])) {
                $result['estado'] = 1;
                $result['message'] = 'Se obtuvieron los alergenos';
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Ocurrio un error al obtener los alergenos por su categoria';
            }
            break;
        default:
            $result['exception'] = 'Acción no disponible';
            break;
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

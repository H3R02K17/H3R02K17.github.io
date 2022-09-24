<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/administrar_inventario.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $inventario = new Inventario;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //case readall
            case 'readAll':
                if ($result['dataset'] = $inventario->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'search':
                $_POST = $inventario->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $inventario->searchRows($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
                // caso readOne para mostrar los datos de un registro en particular
            case 'readOne':
                if (!$inventario->setIdIngrediente($_POST['idingredienteM'])) {
                    $result['exception'] = 'Ingrediente incorrecto';
                } elseif ($result['dataset'] = $inventario->readOne()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Ingrediente inexistente';
                }
                break;
            case 'createIngre':
                $_POST = $inventario->validateForm($_POST);
                if (!$inventario->setIngrediente($_POST['nombre_ingredienteC'])) {
                    $result['exception'] = 'Nombre incorrecto';
                } elseif (!$inventario->setExistencias($_POST['existenciasC'])) {
                    $result['exception'] = 'Cantidad de existencias incorrecta';
                } elseif (!$inventario->setFechaCa($_POST['fecha_caducidadC'])) {
                    $result['exception'] = 'Fecha incorrecta';
                } elseif (!$inventario->setPrecio($_POST['precioC'])) {
                    $result['exception'] = 'Precio incorrecto';
                } elseif (!$inventario->setIdProveedor($_POST['proveedorC'])) {
                    $result['exception'] = 'Proveedor incorrecto';
                } elseif (!$inventario->setIdCategoria($_POST['categoria_ingredienteC'])) {
                    $result['exception'] = 'Categoria incorrecta';
                } elseif (!$inventario->setIdEstado('1')) {
                    $result['exception'] = 'Estado incorrecto';
                } elseif ($inventario->createIngre()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Ingrediente registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            case 'updateIngre':
                $_POST = $inventario->validateForm($_POST);
                if (!$inventario->setIdIngrediente($_POST['idingredienteM'])) {
                    $result['exception'] = 'Ingrediente incorrecto';
                } elseif (!$inventario->setIngrediente($_POST['nombre_ingredienteM'])) {
                    $result['exception'] = 'Nombre incorrecto';
                } elseif (!$inventario->setExistencias($_POST['existenciasM'])) {
                    $result['exception'] = 'Cantidad de existencias incorrecta';
                } elseif (!$inventario->setFechaCa($_POST['fecha_caducidadM'])) {
                    $result['exception'] = 'Fecha incorrecta';
                } elseif (!$inventario->setPrecio($_POST['precioM'])) {
                    $result['exception'] = 'Precio incorrecto';
                } elseif (!$inventario->setIdProveedor($_POST['proveedorM'])) {
                    $result['exception'] = 'Proveedor incorrecto';
                } elseif (!$inventario->setIdCategoria($_POST['categoria_ingredienteM'])) {
                    $result['exception'] = 'Categoria incorrecta';
                } elseif (!$inventario->setIdEstado($_POST['estado_ingredienteM'])) {
                    $result['exception'] = 'Estado incorrecto';
                } elseif ($inventario->updateIngre()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Ingrediente actualizado correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            case 'deleteIngre':
                $_POST = $inventario->validateForm($_POST);
                if (!$inventario->setIdIngrediente($_POST['idingredienteD'])) {
                    $result['exception'] = 'Ingrediente incorrecto';
                } elseif ($inventario->deleteIngre()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Ingrediente eliminado correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
                // inicio de los case para tipo empleado y estado empleado
            case 'readEstado':
                if ($result['dataset'] = $inventario->readEstado()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readProveedor':
                if ($result['dataset'] = $inventario->readProveedor()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readCategoria':
                if ($result['dataset'] = $inventario->readCategoria()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readAllContador':
                if (!$inventario->setContador($_POST['contador'])) {
                    $result['exception'] = 'Error al navegar entre datos';
                } elseif ($result['dataset'] = $inventario->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}

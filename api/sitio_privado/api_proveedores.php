<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/proveedores.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $distribuidor = new Proveedor;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            //case readall
            case 'readAll':
                if ($result['dataset'] = $distribuidor->readAll()) {
                    $result['estado'] = 1;
                } elseif ($result['estado'] != 1) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // caso readOne para mostrar los datos de un registro en particular
            case 'readOne':
                if (!$distribuidor->setidproveedor($_POST['idproveedor'])) {
                    $result['exception'] = 'Id del proveedor incorrecto';
                } elseif ($result['dataset'] = $distribuidor->readOne()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Categoria inexistente';
                }
                break;
            //Buscador
            case 'search':
                $_POST = $distribuidor->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $distribuidor->buscador($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            //Insertar datos a la tabla Proveedores    
            case 'createProveedor':
                $_POST = $distribuidor->validateForm($_POST);
                if (!$distribuidor->setnombre_proveedor($_POST['proveedorC'])) {
                    $result['exception'] = 'Nombre del proveedor tiene un formato incorrecto';
                } elseif (!$distribuidor->setdireccion_proveedor($_POST['direccion_proveedor'])) {
                    $result['exception'] = 'La direccion tiene caracteres no válidos';
                }  elseif (!$distribuidor->settelefono_proveedor($_POST['telefono_proveedor'])) {
                    $result['exception'] = 'El formato de teléfono ingresado es incorrecto';
                } elseif ($distribuidor->crearProveedor()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Proveedor registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            //Actualizar campo de tabla Proveedores    
            case 'updateProveedor':
                $_POST = $distribuidor->validateForm($_POST);
                if (!$distribuidor->setidproveedor($_POST['idproveedorM'])) {
                    $result['exception'] = 'ID incorrecto';
                } elseif (!$distribuidor->setnombre_proveedor($_POST['proveedorM'])) {
                    $result['exception'] = 'Nombre del proveedor tiene un formato incorrecto';
                }elseif (!$distribuidor->setdireccion_proveedor($_POST['direccion_proveedorM'])) {
                    $result['exception'] = 'La direccion tiene caracteres no válidos';
                }  elseif (!$distribuidor->settelefono_proveedor($_POST['telefono_proveedorM'])) {
                    $result['exception'] = 'El formato de teléfono ingresado es incorrecto';
                } elseif ($distribuidor->actualizarProveedor()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Proveedor registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            //Eliminar registro de la tabla Proveedores
            case 'eliminarProveedor':
                if (!$distribuidor->setidproveedor($_POST['idproveedorD'])) {
                    $result['exception'] = 'ID incorrecto';
                } elseif (!$data = $distribuidor->readOne()) {
                    $result['exception'] = 'Proveedor inexistente';
                } elseif ($distribuidor->eliminarProveedor()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Proveedor eliminado correctamente';
                } else {
                    $result['exception'] = Database::getException();
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
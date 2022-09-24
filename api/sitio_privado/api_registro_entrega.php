<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/registro_entrega.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $registro_inventario = new RegistroInventario;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'leerIngredientes':
                if ($result['dataset'] = $registro_inventario->leerIngredientes()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay ingredientes registrados';
                }
                break;
            case 'leerIngredientesBuscador':
                $_POST = $registro_inventario->validateForm($_POST);
                if ($_POST['buscador_ingrediente_input'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $registro_inventario->leerIngredientesBuscador($_POST['buscador_ingrediente_input'])) {
                    $result['message'] = 'Ingredientes encontrados, revise las opciones encontradas';
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay ingredientes registrados';
                }
                break;
            case 'obtenerDatosInventario':
                if ($result['dataset'] = $registro_inventario->obtenerInventario()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay ingredientes registrados';
                }
                break;
            case 'search':
                $_POST = $registro_inventario->validateForm($_POST);
                if ($_POST['input_inventario'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $registro_inventario->buscarInventario($_POST['input_inventario'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Registro encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'agregarRegistro':
                $_POST = $registro_inventario->validateForm($_POST);
                if (!$registro_inventario->setCantidad($_POST['cantidad_ingrediente'])) {
                    $result['exception'] = 'La cantidad ingresada es menor a 0 o tiene un formato incorrecto';
                } elseif (!$registro_inventario->setFecha($_POST['fecha_registro'])) {
                    $result['exception'] = 'El formato de la fecha es incorrecto';
                } elseif (!$registro_inventario->setPrecioUnitario($_POST['precio_unitario'])) {
                    $result['exception'] = 'El precio unitario tiene un formato incorrecto';
                } elseif (!$registro_inventario->setIdIngrediente($_POST['nombre_ingrediente'])) {
                    $result['exception'] = 'Error al asignar el ingrediente';
                } elseif ($registro_inventario->agregarInventario()) {
                    if($registro_inventario->traerExistencias()){
                        if($registro_inventario->actualizarIngrediente()){
                            $result['estado'] = 1;
                            $result['message'] = 'Registro agregado correctamente al inventario';
                        }
                    }
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            case 'modificarRegistro':
                $_POST = $registro_inventario->validateForm($_POST);
                if (!$registro_inventario->setCantidad($_POST['cantidad_ingrediente'])) {
                    $result['exception'] = 'La cantidad ingresada es menor a 0 o tiene un formato incorrecto';
                } elseif (!$registro_inventario->setIdInventario($_POST['idinventario'])) {
                    $result['exception'] = 'Error al obtener el identificador del registro';
                } elseif ($_POST['idusuario'] != $_SESSION["idusuario_empleado"]) {
                    $result['exception'] = 'Lo sentimos, pero su usuario no coincide con las credenciales del usuario que registro este producto, solo el usuario que lo registro puede modificarlo';
                } elseif (!$registro_inventario->setFecha($_POST['fecha_registro'])) {
                    $result['exception'] = 'El formato de la fecha es incorrecto';
                } elseif (!$registro_inventario->setPrecioUnitario($_POST['precio_unitario'])) {
                    $result['exception'] = 'El precio unitario tiene un formato incorrecto';
                } elseif (!$registro_inventario->setIdIngrediente($_POST['nombre_ingrediente'])) {
                    $result['exception'] = 'Error al asignar el ingrediente';
                } elseif ($registro_inventario->modificarInventario()) {
                    if($registro_inventario->traerExistencias()){
                        if($registro_inventario->actualizarIngrediente()){
                            $result['estado'] = 1;
                            $result['message'] = 'Registro modificado correctamente al inventario';
                        }
                        else{
                            $result['exception'] = 'No se ha podido agregar los nuevos datos del inventario al ingrediente existente';
                        }
                    }
                    else{
                        $result['exception'] = 'No se pudo obtener las existencias del producto a agregar en inventario';
                    }
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            //case readall con pagination
            case 'readAllContador':
                if (!$registro_inventario->setContador($_POST['contador'])) {
                    $result['exception'] = 'Error al navegar entre datos';
                } elseif ($result['dataset'] = $registro_inventario->obtenerInventario()) {
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

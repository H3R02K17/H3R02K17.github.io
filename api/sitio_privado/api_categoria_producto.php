<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/categoria_producto.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $categoria = new Categoria;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            //case readall
            case 'readAll':
                if ($result['dataset'] = $categoria->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // caso readOne para mostrar los datos de un registro en particular
            case 'readOne':
                if (!$categoria->setidcategoria_producto($_POST['idcategoria_producto'])) {
                    $result['exception'] = 'Categoria incorrecta';
                } elseif ($result['dataset'] = $categoria->readOne()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Categoria inexistente';
                }
                break;
            //Buscador
            case 'search':
                $_POST = $categoria->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $categoria->buscador($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            //Insertar datos a la tabla Categoria Prooducto    
            case 'createCategoria':
                $_POST = $categoria->validateForm($_POST);
                if (!$categoria->setcategoria_producto($_POST['categoriaC'])) {
                    $result['exception'] = 'Categoria incorrecta';
                } elseif (!is_uploaded_file($_FILES['imagen_categoria']['tmp_name'])) {
                    $result['exception'] = 'Seleccione una imagen';
                } elseif (!$categoria->setimagen_categoria_producto($_FILES['imagen_categoria'])) {
                    $result['exception'] = $categoria->getFileError();
                }elseif ($categoria->crearCategoria()) {
                    $result['estado'] = 1;
                    if ($categoria->saveFile($_FILES['imagen_categoria'], $categoria->getruta_img(), $categoria->getimagen_categoria_producto())) {
                        $result['message'] = 'Categoria creada correctamente';
                    } else {
                        $result['message'] = 'Categoria creada pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            //Actualizar campo de tabla Categoria    
            case 'updateCategoria':
                $_POST = $categoria->validateForm($_POST);
                if (!$categoria->setidcategoria_producto($_POST['idcategoriaM'])) {
                    $result['exception'] = 'Id incorrecto';
                } elseif (!$data = $categoria->readOne()) {
                    $result['exception'] = 'Categoria inexistente';
                } elseif (!$categoria->setcategoria_producto($_POST['categoriaM'])) {
                    $result['exception'] = 'Categoria incorrecto';
                } elseif (!is_uploaded_file($_FILES['imagen_categoriaM']['tmp_name'])) {
                    if ($categoria->actualizarCategoria($data['imagen_categoria_producto'])) {
                        $result['estado'] = 1;
                        $result['message'] = 'Usuario modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                } elseif (!$categoria->setimagen_categoria_producto($_FILES['imagen_categoriaM'])) {
                    $result['exception'] = $categoria->getFileError();
                } elseif ($categoria->actualizarCategoria($data['imagen_categoria_producto'])) {
                    $result['estado'] = 1;
                    if ($categoria->saveFile($_FILES['imagen_categoriaM'], $categoria->getruta_img(), $categoria->getimagen_categoria_producto())) {
                        $result['message'] = 'Usuario modificado correctamente';
                    } else {
                        $result['message'] = 'Usuario modificado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            //Eliminar registro de la tabla Categoria
            case 'eliminarCategoria':
                if (!$categoria->setidcategoria_producto($_POST['idcategoriaD'])) {
                    $result['exception'] = 'Categoría incorrecta';
                } elseif (!$data = $categoria->readOne()) {
                    $result['exception'] = 'Categoría inexistente';
                } elseif ($categoria->eliminarCategoria()) {
                    $result['estado'] = 1;
                    if ($categoria->deleteFile($categoria->getruta_img(), $data['imagen_categoria_producto'])) {
                        $result['message'] = 'Categoría eliminada correctamente';
                    } else {
                        $result['message'] = 'Categoría eliminada pero no se borró la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            //case readall con pagination
            case 'readAllContador':
                if (!$categoria->setContador($_POST['contador'])) {
                    $result['exception'] = 'Error al navegar entre datos';
                } elseif ($result['dataset'] = $categoria->readAll()) {
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
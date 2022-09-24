<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/admin_usuario.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuario = new UsuarioEmpleado;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //case readall
            case 'readAll':
                if ($result['dataset'] = $usuario->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                // caso readOne para mostrar los datos de un registro en particular
            case 'readOne':
                if (!$usuario->setidusuario_empleado($_POST['idusuario_empleado'])) {
                    $result['exception'] = 'Usuario incorrecto';
                } elseif ($result['dataset'] = $usuario->readOne()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Usuario inexistente';
                }
                break;
                //Buscador
            case 'search':
                $_POST = $usuario->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $usuario->buscador($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
                //Insertar datos a la tabla Usuario    
            case 'createUsuario':
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setusuario_empleado($_POST['usuarioC'])) {
                    $result['exception'] = 'usuario incorrecto';
                } elseif (!$usuario->setcontrasenia_empleado($_POST['contrasenia'])) {
                    $result['exception'] = $usuario->getPasswordError();
                } elseif (!$usuario->setConfirmarContrasenia($_POST['confirmar_contrasenia'])) {
                    $result['exception'] = $usuario->getPasswordError();
                } elseif ($_POST['contrasenia'] != $_POST['confirmar_contrasenia']) {
                    $result['exception'] = 'La contraseñas deben de ser iguales';
                } elseif (!$usuario->setidempleado($_POST['idempleadoC'])) {
                    $result['exception'] = 'Seleccione un empleado.';
                } elseif (!isset($_POST['tipo'])) {
                    $result['exception'] = 'Seleccione un tipo';
                } elseif (!$usuario->setidtipo_usuario($_POST['tipo'])) {
                    $result['exception'] = 'Tipo de usuario incorrecto';
                } elseif (!$usuario->setidestado_usuario('1')) {
                    $result['exception'] = 'Campo incorrecto';
                } elseif (!is_uploaded_file($_FILES['imagen_usuario']['tmp_name'])) {
                    $result['exception'] = 'Seleccione una imagen';
                } elseif (!$usuario->setimagen_empleado($_FILES['imagen_usuario'])) {
                    $result['exception'] = $usuario->getFileError();
                } elseif ($usuario->crearUsuario()) {
                    $result['estado'] = 1;
                    if ($usuario->saveFile($_FILES['imagen_usuario'], $usuario->getruta_img(), $usuario->getimagen_empleado())) {
                        $result['message'] = 'Usuario creado correctamente';
                    } else {
                        $result['message'] = 'Usuario creado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
                //Actualizar campo de tabla Usuario    
            case 'updateUsuario':
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setidusuario_empleado($_POST['idusuarioM'])) {
                    $result['exception'] = 'ID incorrecto';
                } elseif (!$data = $usuario->readOne()) {
                    $result['exception'] = 'Producto inexistente';
                } elseif (!$usuario->setusuario_empleado($_POST['usuarioM'])) {
                    $result['exception'] = 'Usuario incorrecto';
                } elseif (!$usuario->setidempleado($_POST['idempleadoM'])) {
                    $result['exception'] = 'sexooooooo';
                } elseif (!$usuario->setidtipo_usuario($_POST['tipoM'])) {
                    $result['exception'] = 'Tipo incorrecto';
                } elseif (!$usuario->setidestado_usuario($_POST['estadoM'])) {
                    $result['exception'] = 'Estado de empleado incorrecto';
                } elseif (!is_uploaded_file($_FILES['imagen_usuarioM']['tmp_name'])) {
                    if ($usuario->actualizarUsuario($data['imagen_empleado'])) {
                        $result['estado'] = 1;
                        $result['message'] = 'Usuario modificado correctamente';
                    } else {
                        $result['exception'] = Database::getException();
                    }
                } elseif (!$usuario->setimagen_empleado($_FILES['imagen_usuarioM'])) {
                    $result['exception'] = $usuario->getFileError();
                } elseif ($usuario->actualizarUsuario($data['imagen_empleado'])) {
                    $result['estado'] = 1;
                    if ($usuario->saveFile($_FILES['imagen_usuarioM'], $usuario->getruta_img(), $usuario->getimagen_empleado())) {
                        $result['message'] = 'Usuario modificado correctamente';
                    } else {
                        $result['message'] = 'Usuario modificado pero no se guardó la imagen';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
                // inicio de los case para estado usuario
            case 'readEstado':
                if ($result['dataset'] = $usuario->readEstado()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                // Leer empleados para mostrar en tabla de selección
            case 'readEmpleado':
                if ($result['dataset'] = $usuario->readEmpleado()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readTipoUsuario':
                if ($result['dataset'] = $usuario->readTipoUsuario()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                //Eliminar datos (cambiar estado y desaparecer de vista)    
            case 'eliminarUsuario':
                if (!$usuario->setidusuario_empleado($_POST['idusuarioD'])) {
                    $result['exception'] = 'Usuario incorrecto';
                } elseif (!$data = $usuario->readOne()) {
                    $result['exception'] = 'Usuario inexistente';
                } elseif ($usuario->eliminarUsuario()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Usuario eliminado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
                //case para llenar la tabla empleado en el modal
            case 'readAlls':
                if ($result['dataset'] = $usuario->readEmpleados()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                //Buscador
            case 'searchEmp':
                $_POST = $usuario->validateForm($_POST);
                if ($_POST['search-emp'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $usuario->buscadorEmp($_POST['search-emp'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
                //case readall con pagination
            case 'readAllContador':
                if (!$usuario->setContador($_POST['contador'])) {
                    $result['exception'] = 'Error al navegar entre datos';
                } elseif ($result['dataset'] = $usuario->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            default;
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

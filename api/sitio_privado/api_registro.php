<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/registro.php');
require_once('../modelo/login.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuario = new Usuarios;
    $registroUsuario = new RegistroUsuario;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);

    // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
    switch ($_GET['action']) {
            //Verificamos si existen usuarios
        case 'verificarPrimerUso':
            //Si existen usuarios manda un mensaje de que se encontraron
            if ($registroUsuario->validarExistenciaPrimerUsuario()) {
                $result['estado'] = 1;
                $result['message'] = 'Existe al menos un usuario registrado';
            } else {
                $result['exception'] = 'No existe un usuario administrador registrado';
            }
            break;
        case 'registroUsuario':
            $_POST = $registroUsuario->validateForm($_POST);
            if (!$registroUsuario->setNombres($_POST['nombre_empleado'])) {
                $result['exception'] = 'El formato de los nombres es incorrecto';
            } elseif (!$registroUsuario->setApellidos($_POST['apellido_empleado'])) {
                $result['exception'] = 'El formato de los apellidos es incorrecto';
            } elseif (!$registroUsuario->setDUI($_POST['dui'])) {
                $result['exception'] = 'Formato de DUI incorrecto';
            } elseif (!$registroUsuario->setNIT($_POST['nit'])) {
                $result['exception'] = 'Formato de NIT incorrecto';
            } elseif ($_POST['dui'] != $_POST['nit']){
                $result['exception'] = 'El DUI y NIT no coinciden, recuerde que el NIT son los mismos números que el DUI';
            } elseif (!$registroUsuario->setTelefono($_POST['telefono'])) {
                $result['exception'] = 'El formato de teléfono es incorrecto, 
                asegurese que ha ingresado un número de teléfono válido';
            } elseif (!$registroUsuario->setFechaNEmpleado($_POST['fecha'])) {
                $result['exception'] = 'Formato de fecha ingresado es incorrecto, 
                el empleado debe ser mayor de 18 años';
            } elseif (!$registroUsuario->setCorreoEmpleado($_POST['correo'])) {
                $result['exception'] = 'El formato de correo eléctronico es inválido';
            } elseif ($_POST['contrasenia'] != $_POST['confirmar_contrasenia']) {
                $result['exception'] = 'Las contraseñas ingresadas son diferentes';
            } elseif (strpos($_POST['contrasenia'], strval($_POST['nombre_empleado'])) !== false ||
            strpos($_POST['contrasenia'], strval($_POST['apellido_empleado'])) !== false ||
            strpos($_POST['contrasenia'], strval($_POST['dui'])) !== false || 
            strpos($_POST['contrasenia'], strval($_POST['telefono'])) !== false ||
            strpos($_POST['contrasenia'], strval($_POST['fecha'])) !== false ||
            strpos($_POST['contrasenia'], strval($_POST['correo'])) !== false) {
                $result['exception'] = 'La contraseña ingresada debe ser diferente a los datos personales, 
                por su seguridad ingrese una contraseña más segura.';
            } elseif (!$registroUsuario->setContraEmpleado($_POST['contrasenia'])) {
                $result['exception'] = $registroUsuario->getPasswordError();
            } elseif (!is_uploaded_file($_FILES['imagen_usuario']['tmp_name'])) {
                $result['exception'] = 'Seleccione una imagen para el usuario';
            } elseif (!$registroUsuario->setImagen($_FILES['imagen_usuario'])) {
                $result['exception'] = $registroUsuario->getFileError();  
            } elseif ($usuario->validarExistenciaPrimerUsuario()){
                $result['exception'] = 'Existe al menos un usuario registrado';
            } elseif ($registroUsuario->registrarEmpleado()) {
                    if ($registroUsuario->obtenerEmpleadoRegistrado()) {
                        if ($registroUsuario->registrarUsuarioEmpleado()) {
                            $result['estado'] = 1;
                            if ($registroUsuario->saveFile($_FILES['imagen_usuario'], $registroUsuario->getLink(), $registroUsuario->getImagen())) {
                                $result['message'] = 'Usuario administrador registrado correctamente';
                            } else {
                                $result['message'] = 'Usuario administrador registrado correctamente pero no se guardó su imagen';
                            }
                        } else {
                            $result['exception'] = 'Usuario administrador no pudo ser registrado';
                        }
                    } else {
                        $result['exception'] = 'Error al obtener credenciales';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
            break;
        default:
            $result['exception'] = 'Acción no disponible fuera de la sesión why?';
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

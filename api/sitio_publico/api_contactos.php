<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/reservaciones.php');
require_once('../conexion/send_email.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se instancian las clases correspondientes.
    $reservaciones = new Reservaciones;
    $mailer = new Mailer;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null, 'dataset' => null);
    // Se compara la acción a realizar según la petición del controlador.
    switch ($_GET['action']) {
        case 'contactanos':
            if (isset($_COOKIE['contactos'])) {
                $result['exception'] = 'Antes de enviar otro comentario debes esperar 15 minutos desde la hora que enviaste el último comentario';
            } else {
                //Validar formulario de login
                $_POST = $reservaciones->validateForm($_POST);
                if (!$reservaciones->setCorreoContacto($_POST['email_contacto'])) {
                    $result['exception'] = 'El correo ingresado no posee un formato correcto para ser enviado';
                } else if (!$reservaciones->setNombreContacto($_POST['nombre_contacto'])) {
                    $result['exception'] = 'Formato de nombre incorrecto. Ingrese solo valores alfabéticos';
                } else if (!$reservaciones->setTelefonoContacto($_POST['telefono_contacto'])) {
                    $result['exception'] = 'Formato de teléfono incorrecto, asegurese de ingresar un número teléfonico válido';
                } else if (!$reservaciones->setComentario($_POST['comentario_contacto'])) {
                    $result['exception'] = 'Asegurese que su comentario tenga la longitud correcta de Minimo 10 caracteres y Máximo 1000 caracteres o que no contenga caracteres especiales no válidos, solo están permitidos signos de pausa';
                } elseif ($mailer->comentariosUsuario($_POST['email_contacto'], $_POST['nombre_contacto'], $_POST['telefono_contacto'], $_POST['comentario_contacto'])) {
                    //Creamos los valores para nuestra cookie
                    $expira = time() + 900;
                    //Creamos un cookie con duración de 15 min
                    setcookie('contactos', 'enviado', $expira);
                    $result['estado'] = 1;
                    $result['message'] = 'Comentario realizado con éxito';
                } else {
                    $result['exception'] = 'No se pudo enviar tu comentario. Estamos resolviendo el problema con nuestro correo de contactos';
                }
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

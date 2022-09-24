<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/eventos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $eventos = new Eventos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            //case readall
            case 'readAll':
                if ($result['dataset'] = $eventos->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay eventos registrados';
                }
                break;
            //case actualizar estado realizado
            case 'actualizarEstadoRealizado':
                if ($eventos->actualizarEventosPasados()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo actualizar estado de los eventos realizados';
                }
                break;
            //case actualizar estado realizado
            case 'actualizarEstadoRealizando':
                if ($eventos->actualizarEventosActuales()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo actualizar estado de los eventos actuales';
                }
                break;
            //case parar agregar eventos
            case 'agregarEventos':
                $_POST = $eventos->validateForm($_POST);
                if (!$eventos->setNombreEvento($_POST['nombre_evento'])) {
                    $result['exception'] = 'El nombre del evento posee caracteres inválidos, ingrese solo caracteres Alfabéticos';
                } elseif (!$eventos->setDescripcion($_POST['descripcion_evento'])) {
                    $result['exception'] = 'Asegurese que su descripción tenga la longitud correcta de Minimo 10 caracteres y Máximo 400 caracteres o que no contenga caracteres especiales no válidos, solo están permitidos signos de pausa';
                } elseif (!$eventos->setFecha($_POST['fecha_evento'])) {
                    $result['exception'] = 'El formato de la fecha es incorrecto, verifique que haya ingresado un formato válido';
                } elseif ($_POST['hora_evento_final'] == "") {
                    if ($result['dataset'] = $eventos->agregarEvento()) {
                        $result['estado'] = 1;
                        $result['message'] = 'Evento agregado correctamente';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se pudo registrar el evento';
                    }
                } elseif (isset($_POST['hora_evento_final'])) {
                    if (!$eventos->setHora($_POST['hora_evento_final'])) {
                        $result['exception'] = 'Formato de hora incorrecto';
                    } elseif ($result['dataset'] = $eventos->agregarEvento()) {
                        $result['estado'] = 1;
                        $result['message'] = 'Evento agregado correctamente';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se pudo registrar el evento';
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo registrar el evento';
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
<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/reservaciones.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $reservaciones = new Reservaciones;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null);
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Caso para mostrar todas las reservaciones
            case 'obtenerReservaciones':
                if ($result['dataset'] = $reservaciones->obtenerReservaciones()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Caso para mostrar todos los estados de las reservaciones
            case 'obtenerEstadosReservacion':
                if ($result['dataset'] = $reservaciones->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Caso para obtener las mesas que ya estan reservadas en una fecha y hora especifica
            case 'mesasApartadasFechaHora':
                if (!$reservaciones->setFechaReservacion($_POST['fecha_reservacion'])) {
                    $result['exception'] = 'Formato de fecha es incorrecto';
                } elseif (!isset($_POST['hora_reservacion'])) {
                    $result['exception'] = 'Seleccione una hora para la reservación';
                } elseif (!$reservaciones->setHoraReservacion($_POST['hora_reservacion'])) {
                    $result['exception'] = 'Formato de hora incorrecta';
                } elseif ($result['dataset'] = $reservaciones->obtenerMesasReservadas()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Reservación creada correctamente';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se ha podido crear la reservación';
                }
                break;
            // caso readOne para mostrar los datos de un registro en particular
            case 'leerUnaReservacion':
                if (!$reservaciones->setIdReservacion($_POST['idreservacion'])) {
                    $result['exception'] = 'ID de la reservación incorrecto';
                } elseif ($result['dataset'] = $reservaciones->leerUnaReservacion()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Categoria inexistente';
                }
                break;
                //Caso para la busqueda de reservaciones por un valor especifico
            case 'busquedaReservaciones':
                $_POST = $reservaciones->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $reservaciones->buscarReservaciones($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay reservaciones que coincidan con la busqueda';
                }
                break;
                //Caso para crear una reservación
            case 'crearReservacion':
                if (!$reservaciones->setNombreCliente($_POST['nombre_cliente'])) {
                    $result['exception'] = 'Formato de nombre incorrecto';
                } elseif (!$reservaciones->setApellidoCliente($_POST['apellidos_cliente'])) {
                    $result['exception'] = 'Formato de apellido incorrecto';
                } elseif (!$reservaciones->setTelefonoCliente($_POST['telefono_cliente'])) {
                    $result['exception'] = 'Formato de teléfono incorrecto';
                } elseif (!$reservaciones->setFechaReservacion($_POST['fecha_reservacion'])) {
                    $result['exception'] = 'Formato de fecha es incorrecto';
                } elseif (!isset($_POST['hora_reservacion'])) {
                    $result['exception'] = 'Seleccione una hora para la reservación';
                } elseif (!$reservaciones->setHoraReservacion($_POST['hora_reservacion'])) {
                    $result['exception'] = 'Formato de hora incorrecta';
                } elseif (is_null($_POST['correo_cliente'])) {
                    //Si los campos son correctos se procede a crear la reservación
                    if ($reservaciones->agregarReservacion()) {
                        // Obtenemos el último id de la reservación para ligarle las mesas
                        if ($reservaciones->obtenerIdUltimaReservacion()) {
                            //Ciclo para crear uno a uno según las mesas ligadas a la reservación
                            foreach ($_POST['mesas'] as $mesa) {
                                //Asignamos el id de la mesa
                                if (!$reservaciones->setIdMesa($mesa)) {
                                    $result['exception'] = 'No se ha seleccionado una mesa';
                                } //Se agrega a tbmesas_reservaciones
                                elseif ($reservaciones->agregarMesasReservacion()) {
                                    $result['estado'] = 1;
                                    $result['message'] = 'Reservación creada correctamente';
                                } elseif (Database::getException()) {
                                    $result['exception'] = Database::getException();
                                } else {
                                    $result['exception'] = 'A ocurrido un error al asignar las mesas a la reservación';
                                }
                            }
                        }
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se ha podido crear la reservación';
                    }
                } elseif (isset($_POST['correo_cliente'])) {
                    if (!$reservaciones->setCorreoCliente($_POST['correo_cliente'])) {
                        $result['exception'] = 'El correo ingresado no tiene el formato correcto';
                    }
                    //Si los campos son correctos se procede a crear la reservación
                    elseif ($reservaciones->agregarReservacion()) {
                        // Obtenemos el último id de la reservación para ligarle las mesas
                        if ($reservaciones->obtenerIdUltimaReservacion()) {
                            //Ciclo para crear uno a uno según las mesas ligadas a la reservación
                            foreach ($_POST['mesas'] as $mesa) {
                                //Asignamos el id de la mesa
                                if (!$reservaciones->setIdMesa($mesa)) {
                                    $result['exception'] = 'No se ha seleccionado una mesa';
                                } //Se agrega a tbmesas_reservaciones
                                elseif ($reservaciones->agregarMesasReservacion()) {
                                    $result['estado'] = 1;
                                    $result['message'] = 'Reservación creada correctamente';
                                } elseif (Database::getException()) {
                                    $result['exception'] = Database::getException();
                                } else {
                                    $result['exception'] = 'A ocurrido un error al asignar las mesas a la reservación';
                                }
                            }
                        }
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se ha podido crear la reservación';
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se ha podido crear la reservación';
                }
                break;
            //Caso para modificar una reservación
            case 'modificarReservacion':
                if (!$reservaciones->setIdReservacion($_POST['idreservacion'])) {
                    $result['exception'] = 'ID de la reservación a modificar no pudo obtenerse';
                } elseif (!$reservaciones->setNombreCliente($_POST['nombre_cliente_modificar'])) {
                    $result['exception'] = 'Formato de nombre incorrecto';
                } elseif (!$reservaciones->setApellidoCliente($_POST['apellido_cliente_modificar'])) {
                    $result['exception'] = 'Formato de apellido incorrecto';
                } elseif (!$reservaciones->setTelefonoCliente($_POST['telefono_cliente_modificar'])) {
                    $result['exception'] = 'Formato de teléfono incorrecto';
                } elseif (!$reservaciones->setFechaReservacion($_POST['fecha_reservacion_modificar'])) {
                    $result['exception'] = 'Formato de fecha es incorrecto';
                } elseif (!isset($_POST['hora_reservacion_modificar'])) {
                    $result['exception'] = 'Seleccione una hora para la reservación';
                } elseif (!$reservaciones->setHoraReservacion($_POST['hora_reservacion_modificar'])) {
                    $result['exception'] = 'Formato de hora incorrecta';
                } elseif (!$reservaciones->setIdEstadoR($_POST['estadoM'])) {
                    $result['exception'] = 'Estado de la reservación incorrecto';
                } elseif (is_null($_POST['correo_cliente_modificar'])) {
                    //Si los campos son correctos se procede a actualizar la reservación
                    if ($reservaciones->actualizarReservacion()) {
                        $result['estado'] = 1;
                        $result['message'] = 'Reservación actualizada correctamente';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se ha podido actualizar la reservación';
                    }
                } elseif (isset($_POST['correo_cliente_modificar'])) {
                    if (!$reservaciones->setCorreoCliente($_POST['correo_cliente_modificar'])) {
                        $result['exception'] = 'El correo ingresado no tiene el formato correcto';
                    }
                    //Si los campos son correctos se procede a actualizar la reservación
                    elseif ($reservaciones->actualizarReservacion()) {
                        $result['estado'] = 1;
                        $result['message'] = 'Reservación actualizada correctamente';
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se ha podido actualizar la reservación';
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se ha podido actualizar la reservación';
                }
                break;
                //Función para grafica de 12 meses con conteo de reservaciones por mes
            case 'cantidadReservacionesMes':
                if ($result['dataset'] = $reservaciones->cantidadReservacionesMes()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos disponibles';
                }
                break;
                //Caso para grafica de cantidad de mesas Reservadas
            case 'mesasReservadas':
                if ($result['dataset'] = $reservaciones->mesasReservadas()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos disponibles';
                }
                break;
                //Caso para grafica de fechas de reservaciones
            case 'graficaHoras':
                if ($result['dataset'] = $reservaciones->graficaHoras()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener el porcentaje de productos más vendidos por empleados';
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

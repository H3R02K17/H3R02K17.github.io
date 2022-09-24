<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/pedidos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedidos = new Pedidos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'total_pedidos' => null, 'monto_total' => null, 'monto_total_ayer' => null, 'monto_total_anteayer' => null, 'monto_total_mensual' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'datosPedidosMenu':
                date_default_timezone_set('America/El_Salvador');
                $fecha_actual = date('Y-m-d');
                //Consultamos el total de pedidos realizados en la fecha actual
                if ($pedidos->totalPedidosActuales($fecha_actual)) {
                    //Consultamos el monto total de los pedidos realizados en la fecha actual
                    if ($pedidos->montoTotalDiaActual($fecha_actual)) {
                        if ($pedidos->montoTotalMesActual()) {
                            $result['estado'] = 1;
                            $result['total_pedidos'] = $pedidos->getPedidosActuales();
                            $result['monto_total'] = $pedidos->getMontoTotal();
                            $result['monto_total_mensual'] = $pedidos->getMontoTotalMensual();
                        }
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No pudieron cargarse los datos de muestra';
                }
                break;
                //Caso para llenar la tabla de pedidos recientes en el dashboard
            case 'cargarPedidosRecientes':
                if ($result['dataset'] = $pedidos->pedidosRecientes()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay pedidos recientes';
                }
                break;
                //Caso para traer el monto_total de ventas del día actual, de ayer y anteayer
            case 'estadisticasVentas':
                date_default_timezone_set('America/El_Salvador');
                $actual = date('Y-m-d');
                $ayer = date('Y-m-d', strtotime('-1 day'));
                $anteayer = date('Y-m-d', strtotime('-2 day'));
                //Consultamos el monto total de los pedidos realizados en la fecha actual
                if ($pedidos->montoTotalDiaActual($actual)) {
                    if ($pedidos->montoTotalAyer($ayer)) {
                        if ($pedidos->montoTotalAnteAyer($anteayer)) {
                            $result['estado'] = 1;
                            $result['monto_total'] = $pedidos->getMontoTotal();
                            $result['monto_total_ayer'] = $pedidos->getMontoTotalAyer();
                            $result['monto_total_anteayer'] = $pedidos->getMontoTotalAnteayer();
                        }
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No pudieron cargarse las estadisticas de ventas';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible fuera de la sesión';
                break;
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

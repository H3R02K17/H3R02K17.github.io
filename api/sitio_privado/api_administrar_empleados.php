<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/administrar_empleado.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $empleado = new Empleados;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idusuario_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            //case readall
            case 'readAll':
                if ($result['dataset'] = $empleado->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // caso readOne para mostrar los datos de un registro en particular
            case 'readOne':
                if (!$empleado->setIdEmpleado($_POST['idempleado'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif ($result['dataset'] = $empleado->readOne()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Empleado inexistente';
                }
                break;
            case 'search':
                $_POST = $empleado->validateForm($_POST);
                if ($_POST['search'] == '') {
                    $result['exception'] = 'Ingrese un valor para buscar';
                } elseif ($result['dataset'] = $empleado->searchRows($_POST['search'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Valor encontrado';
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay coincidencias';
                }
                break;
            case 'createEmpleado':
                $_POST = $empleado->validateForm($_POST);
                if (!$empleado->setNombreEmpleado($_POST['nombre'])) {
                    $result['exception'] = 'Nombre incorrecto. Es posible que el campo contenga caracteres especiales o numeros.';
                } elseif (!$empleado->setApellidoEmpleado($_POST['apellidos'])) {
                    $result['exception'] = 'Apellido incorrecto. Es posible que el campo contenga caracteres especiales o numeros.';
                } elseif ($_POST['nit'] != $_POST['dui']) { 
                    $result['exception'] = 'El dui y el nit deben ser iguales';
                } elseif (!$empleado->setDuiEmpleado($_POST['dui'])) {
                    $result['exception'] = 'Dui incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                } elseif (!$empleado->setNitEmpleado($_POST['nit'])) {
                    $result['exception'] = 'Nit incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                }elseif (!$empleado->setTelefonoEmpleado($_POST['telefono'])) {
                    $result['exception'] = 'Telefono incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                } elseif (!$empleado->setCorreoEmpleado($_POST['correo'])) {
                    $result['exception'] = 'Correo incorrecto.';
                } elseif (!$empleado->setFechaNaEmpleado($_POST['fechaC'])) {
                    $result['exception'] = 'Fecha incorrecta.';
                } elseif (!$empleado->setIdTipoEmpleado($_POST['tipo'])) {
                    $result['exception'] = 'Tipo de empleado incorrecto.';
                } elseif (!$empleado->setIdEstadoEmpleado('1')){
                    $result['exception'] = 'Estado de empleado incorrecto.';
                } elseif ($empleado->createEmpleado()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Empleado registrado correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            case 'updateEmpleado':
                $_POST = $empleado->validateForm($_POST);
                if (!$empleado->setIdEmpleado($_POST['idempleadoM'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$empleado->setNombreEmpleado($_POST['nombreM'])) {
                    $result['exception'] = 'Nombre incorrecto. Es posible que el campo contenga caracteres especiales o numeros.';
                } elseif (!$empleado->setApellidoEmpleado($_POST['apellidosM'])) {
                    $result['exception'] = 'Apellido incorrecto. Es posible que el campo contenga caracteres especiales o numeros.';
                } elseif ($_POST['nitM'] != $_POST['duiM']) { 
                    $result['exception'] = 'El dui y el nit deben ser iguales';
                }elseif (!$empleado->setDuiEmpleado($_POST['duiM'])) {
                    $result['exception'] = 'Dui incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                } elseif (!$empleado->setNitEmpleado($_POST['nitM'])) {
                    $result['exception'] = 'Nit incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                } elseif (!$empleado->setTelefonoEmpleado($_POST['telefonoM'])) {
                    $result['exception'] = 'Telefono incorrecto. Es posible que el campo contenga caracteres especiales o letras';
                } elseif (!$empleado->setCorreoEmpleado($_POST['correoM'])) {
                    $result['exception'] = 'Correo incorrecto.';
                } elseif (!$empleado->setFechaNaEmpleado($_POST['fechaM'])) {
                    $result['exception'] = 'Fecha incorrecta.';
                } elseif (!$empleado->setIdTipoEmpleado($_POST['tipoM'])) {
                    $result['exception'] = 'Tipo de empleado incorrecto';
                } elseif (!$empleado->setIdEstadoEmpleado($_POST['estadoM'])){
                    $result['exception'] = 'Estado de empleado incorrecto';
                } elseif ($empleado->updateEmpleado()) {
                    if($empleado->searchUsuarioEmpleado()){
                        if($empleado->updateUsuarioEmpleadoEstado()){
                            $result['estado'] = 1;
                            $result['message'] = 'Empleado actualizado correctamente, el estado de su usuario se cambio correctamente.';
                        } else{
                            $result['estado'] = 1;
                            $result['message'] = 'Empleado actualizado correctamente, el estado de su usuario se no actualizo correctamente.';
                        }
                    }
                    else{
                        $result['estado'] = 1;
                        $result['message'] = 'Empleado actualizado correctamente, no poseia un usuario ligado';
                    }
                    $result['exception'] = 'Estado de empleado incorrecto';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            case 'deleteEmpleado':
                if (!$empleado->setIdEmpleado($_POST['idempleadoD'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$data = $empleado->readOne()) {
                    $result['exception'] = 'Empleado inexistente';
                } elseif ($empleado->deleteEmpleado()) {
                    if($empleado->searchUsuarioEmpleado()){
                        if($empleado->updateUsuarioEmpleadoEliminado()){
                            $result['estado'] = 1;
                            $result['message'] = 'Empleado eliminado correctamente, su usuario ha sido deshabilitado';
                        } else{
                            $result['estado'] = 1;
                            $result['message'] = 'Empleado eliminado correctamente, su usuario no se ha podido deshabilitar';
                        }
                    }
                    else{
                        $result['estado'] = 1;
                        $result['message'] = 'Empleado eliminado correctamente, no poseia un usuario ligado';
                    }
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            // inicio de los case para las observaciones
            case 'readObservacionPersonal':
                if (!$empleado->setIdEmpleado($_POST['id'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif ($result['dataset'] = $empleado->readObservacionPersonal()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Observacion inexistente';
                }
                break;
            case 'readObservacionGeneral':
                if ($result['dataset'] = $empleado->readObservacionGeneral()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Observaciones inexistentes';
                }
                break;
            // caso para crear una observacion
            case 'createObservacion':
                $_POST = $empleado->validateForm($_POST);
                if (!$empleado->setIdEmpleado($_POST['idempleado'])) {
                    $result['exception'] = 'Empleado incorrecto';
                } elseif (!$empleado->setObservacionEmpleado($_POST['observacion'])) {
                    $result['exception'] = 'Observacion incorrecta';
                } elseif ($empleado->createObservacion()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Observación creada correctamente';
                } else {
                    $result['exception'] = Database::getException();;
                }
                break;
            // inicio de los case para tipo empleado y estado empleado
            case 'readEstado':
                if ($result['dataset'] = $empleado->readEstado()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            case 'readTipoEmpleado':
                if ($result['dataset'] = $empleado->readTipoEmpleado()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            //case readall con pagination
            case 'readAllContador':
                if (!$empleado->setContador($_POST['contador'])) {
                    $result['exception'] = 'Error al navegar entre datos';
                } elseif ($result['dataset'] = $empleado->readAll()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            //Caso para grafica de Vendedores que más vendieron en un mes 
            case 'graficaUsuarioMes':
                if ($result['dataset'] = $empleado->graficaUsuarioMes()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener los empleados que más han vendido este mes';
                }
                break;
            //Caso para grafica de Vendedores que más ingresos generaron en un mes 
            case 'graficaUsuarioIngresosMes':
                if ($result['dataset'] = $empleado->graficaUsuarioIngresosMes()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener los empleados que más ingresos generaron este mes';
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
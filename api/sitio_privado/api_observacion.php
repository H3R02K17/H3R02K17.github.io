<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/observaciones.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $observacion = new Observaciones;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // if (isset($_SESSION['idusuario_e'])) {    
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET['action']) {
            //Caso para leer las cards de observaciones
        case 'readAll':
            if ($result['dataset'] = $observacion->readAll()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
        //Caso para leer las ultimas 2 observaciones
        case 'ultimasObservaciones':
            if ($result['dataset'] = $observacion->obtenerUltimasObservaciones()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso para leer las cards de observaciones
        case 'readAllTipos':
            if ($result['dataset'] = $observacion->readAllTipo()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso para leer las cards de observaciones
        case 'readAllEstados':
            if ($result['dataset'] = $observacion->readAllEstado()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso para crear observaciones
        case 'create':
            $_POST = $observacion->validateForm($_POST);
            if (!$observacion->setObservacion($_POST['observacion'])) {
                $result['exception'] = 'La observación realizada posee datos no permitidos, la longitud máxima de caracteres es de 500';
            } elseif (!isset($_POST['tipo_observacion'])) {
                $result['exception'] = 'Seleccione un Tipo';
            } elseif (!$observacion->setTipo_ob($_POST['tipo_observacion'])) {
                $result['exception'] = 'Tipo incorrecto';
            } elseif ($observacion->crearObservacion()) {
                $result['estado'] = 1;
                $result['message'] = 'Observacion creada correctamente';
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            //Caso obtenerTipoObservaciones para obtener los selects de tipo de observación
        case 'obtenerTipoObservaciones':
            if ($result['dataset'] = $observacion->obtenerTipoObservacion()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso search para buscar valores 
        case 'search':
            $_POST = $observacion->validateForm($_POST);
            if ($_POST['search'] == '') {
                $result['exception'] = 'Ingrese un valor para buscar';
            } elseif ($result['dataset'] = $observacion->BuscarObservacion($_POST['search'])) {
                $result['estado'] = 1;
                $result['message'] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay coincidencias';
            }
            break;
            //caso para buscar un campo en especifico
        case 'readOne':
            if (!$observacion->setIdobservacion($_POST['id'])) {
                $result['exception'] = 'el identificador Observación incorrecta';
            } elseif ($result['dataset'] = $observacion->readOneObservacion()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Observación inexistente';
            }
            break;
            //caso para actualizar un campo
        case 'update':
            $_POST = $observacion->validateForm($_POST);
            if (!$observacion->setIdobservacion($_POST['id'])) {
                $result['exception'] = 'el identificador Observación incorrecta';
            } elseif ($observacion->ModificarEstado()) {
                $result['estado'] = 1;
                $result['exception'] = 'Observación modificado correctamente';
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            //caso para buscar un campo en especifico
        case 'readOnextipo':
            if (!$observacion->setIdobservacion($_POST['idtipo'])) {
                $result['exception'] = 'Observación incorrecta';
            } elseif ($result['dataset'] = $observacion->readOneObservacion()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Observación inexistente';
            }
            break;
            //caso para buscar un campo en especifico
        case 'readOneTipos':
            if (!$observacion->setTipo_ob($_POST['idtipo'])) {
                $result['exception'] = 'el identificador Tipo incorrecto';
            } elseif ($result['dataset'] = $observacion->BusquedaxTipo()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay Tipos de observaciones registrados por el momento';
            }
            break;
            //caso para buscar un campo en especifico
        case 'readOneEstados':
            if (!$observacion->setEstado_ob($_POST['idestado'])) {
                $result['exception'] = 'el identificador Estado incorrecto';
            } elseif ($result['dataset'] = $observacion->BusquedaxEstado()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay Estados de observaciones registrados por el momento';
            }
            break;
    }

    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
    //} else 
    //{
    //  print(json_encode('Acceso denegado'));
    //}
} else {
    print(json_encode('Recurso no disponible'));
}

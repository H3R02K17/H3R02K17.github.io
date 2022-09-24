<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/productos.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new Productos;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'message' => null, 'exception' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // if (isset($_SESSION['idusuario_e'])) {    
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET['action']) {
            //Caso readAll para leer todos los datos de la tbproductos
        case 'readAll':
            if (!$producto->setContador(0)) {
                $result['exception'] = 'Error de contador';
            } elseif ($result['dataset'] = $producto->readAll()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso cargarIngredientes para poder trabajar con estos
        case 'cargarIngredientes':
            if ($result['dataset'] = $producto->cargarIngrediente()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso obtenerEstadoProducto para obtener los selects de estado_producto
        case 'obtenerEstadoProducto':
            if ($result['dataset'] = $producto->obtenerEstadoProducto()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso obtenerCategoriaProducto para obtener los selects de categoria_producto
        case 'obtenerCategoriaProducto':
            if ($result['dataset'] = $producto->obtenerCategoriaProducto()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso search para buscar valores o productos
        case 'search':
            if ($_POST['search'] == '') {
                $result['exception'] = 'Ingrese un valor para buscar';
            } elseif ($result['dataset'] = $producto->BuscarProducto($_POST['search'])) {
                $result['estado'] = 1;
                $result['message'] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay coincidencias';
            }
            break;
            //caso create para crear productos e ingredientes
        case 'create':
            if (!$producto->setNombre($_POST['nombre'])) {
                $result['exception'] = 'Verificar si los caracteres del nombre son correctos o que no este vacío';
            } elseif (!$producto->setDescripcion($_POST['descripcion'])) {
                $result['exception'] = 'Verificar si los caracteres de descripción son correctos o que no este vacío';
            } elseif (!$producto->setExistencias($_POST['existencias'])) {
                $result['exception'] = 'Verificar si la cantidad de existencias es mayor a 0';
            } elseif (!$producto->setDescuento($_POST['descuento'])) {
                $result['exception'] = 'Verificar si el campo de descuento esta vacío';
            } elseif (!$producto->setPrecio($_POST['precio'])) {
                $result['exception'] = 'Verificar si el campo de precio es mayor a 0';
            } elseif (!isset($_POST['categoria_agregar'])) {
                $result['exception'] = 'Seleccione una categoria';
            } elseif (!$producto->setCategoria($_POST['categoria_agregar'])) {
                $result['exception'] = 'Categoria seleccionada incorrecta';
            } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                $result['exception'] = 'Seleccione una imagen';
            } elseif (!$producto->setImagen($_FILES['archivo'])) {
                $result['exception'] = $producto->getFileError();
            } elseif ($producto->crearProducto()) {
                if ($producto->obtenerUltimoIdProducto()) {
                    //Ciclo para crear uno a uno según los ingredientes ligados al producto
                    foreach ($_POST['ingredientes_'] as $ingredientes) {
                        //Asignamos el id de el ingrediente
                        if (!$producto->setIdIngrediente($ingredientes)) {
                            $result['exception'] = 'No se ha seleccionado un ingrediente';
                        } //Se agrega a tbproducto_ingrediente
                        elseif ($producto->crearIngredientexProducto()) {
                            $result['estado'] = 1;
                            $result['message'] = 'producto creado correctamente';
                        } elseif (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = 'A ocurrido un error al asignar un ingrediente al producto';
                        }
                    }
                }
                $result['estado'] = 1;
                if ($producto->saveFile($_FILES['archivo'], $producto->getLink(), $producto->getImagen())) {
                    $result['message'] = 'Producto creado correctamente';
                } else {
                    $result['message'] = 'Producto creado pero no se guardó la imagen';
                }
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            // caso readOne para mostrar los datos de un registro en particular
        case 'readOne':
            if (!$producto->setId($_POST['id'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif ($result['dataset'] = $producto->readOne()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
            //Caso updateP para actualizar los datos de la tabla productos y ingredientes
        case 'updateP':
            $_POST = $producto->validateForm($_POST);
            if (!$producto->setId($_POST['id'])) {
                $result['exception'] = 'id del producto es incorrecto ';
            } elseif (!$data = $producto->readOne()) {
                $result['exception'] = 'No existe el producto seleccionado';
            } elseif (!$producto->setNombre($_POST['nombreM'])) {
                $result['exception'] = 'Verificar si los caracteres del nombre son correctos o que no este vacío';
            } elseif (!$producto->setDescripcion($_POST['descripcionM'])) {
                $result['exception'] = 'Verificar si los caracteres de descripción son correctos o que no este vacío';
            } elseif (!$producto->setExistencias($_POST['existenciasM'])) {
                $result['exception'] = 'Verificar si la cantidad de existencias es mayor a 0';
            } elseif (!$producto->setDescuento($_POST['descuentoM'])) {
                $result['exception'] = 'Verificar si el campo de descuento esta vacío';
            } elseif (!$producto->setPrecio($_POST['precioM'])) {
                $result['exception'] = 'Verificar si el campo de precio es mayor a 0';
            } elseif (!$producto->setEstado($_POST['estadoM'])) {
                $result['exception'] = 'estado incorrecto';
            } elseif (!$producto->setCategoria($_POST['categoriaM'])) {
                $result['exception'] = 'categoria incorrecto';
            } elseif (!is_uploaded_file($_FILES['archivoM']['tmp_name'])) {
                if ($producto->actualizarProducto($data['imagen_principal'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
            } elseif (!$producto->setImagen($_FILES['archivoM'])) {
                $result['exception'] = $producto->getFileError();
            } elseif ($producto->actualizarProducto($data['imagen_principal'])) {
                $result['estado'] = 1;
                if ($producto->saveFile($_FILES['archivoM'], $producto->getLink(), $producto->getImagen())) {
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['message'] = 'Producto modificado pero no se guardó la imagen';
                }
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            //Caso delete que se encargara de eliminar datos de la tabla productos
        case 'delete':
            if (!$producto->setId($_POST['idd'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif (!$data = $producto->readOne()) {
                $result['exception'] = 'Producto inexistente';
            } elseif ($producto->EliminarProductos()) {
                $result['estado'] = 1;
                if ($producto->deleteFile($producto->getLink(), $data['imagen_principal'])) {
                    $result['message'] = 'Producto eliminado correctamente';
                } else {
                    $result['message'] = 'Producto eliminado pero no se borró la imagen';
                }
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            // caso cargarIngredientexProduct para mostrar los datos de un registro en particular
        case 'cargarIngredientexProduct':
            if (!$producto->setId($_POST['id'])) {
                $result['exception'] = 'Producto incorrecto';
            } elseif ($result['dataset'] = $producto->cargarIngredienteporProducto()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Producto inexistente';
            }
            break;
            //Caso para CargarLosingredientes por producto
        case 'CargarLosingredientes':
            if (!$producto->setId($_POST['id'])) {
                $result['exception'] = 'producto incorrecto';
            } elseif ($result['dataset'] = $producto->cargarIngredienteporProducto()) {
                $result['status'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay Ingredientes registrados en el producto';
            }
            break;
            // caso readOne para mostrar los datos de un registro en particular
        case 'readOneIngredientes':
            if (!$producto->setIdproducto_ingrediente($_POST['idi'])) {
                $result['exception'] = 'Ingrediente incorrecto';
            } elseif ($result['dataset'] = $producto->readOneIngrediente()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Ingrediente inexistente';
            }
            break;
            //Caso para eliminar ingredientes    
        case 'deleteIngrediente':
            if (!$producto->setIdproducto_ingrediente($_POST['idi'])) {
                $result['exception'] = 'ingrediente incorrecto';
            } elseif (!$data = $producto->readOneIngrediente()) {
                $result['exception'] = 'ingrediente inexistente';
            } elseif ($producto->Eliminaringredientes()) {
                $result['estado'] = 1;
                $result['message'] = 'ingrediente eliminado correctamente';
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            //Caso obtenerIngredienteModificar para obtener los selects de ingredientes
        case 'obtenerIngredienteModificar':
            if ($result['dataset'] = $producto->ObtenerIngredientes()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso para crear ingredientes en un producto en especifico
        case 'createIngredientexProducto':
            $_POST = $producto->validateForm($_POST);
            if (!isset($_POST['ingrediente_select'])) {
                $result['exception'] = 'Seleccione un ingrediente';
            } elseif (!$producto->setIdproducto_ingrediente($_POST['ingrediente_select'])) {
                $result['exception'] = 'ingrediente incorrecto';
            } elseif ($producto->crearIngrediente()) {
                $result['estado'] = 1;
                $result['message'] = 'ingrediente creado correctamente';
            } else {
                $result['exception'] = Database::getException();
            }
            break;
            //Caso buscar por medio del buscador
        case 'readAllContador':
            if (!$producto->setContador($_POST['contador'])) {
                $result['exception'] = 'Error al navegar entre datos';
            } elseif ($result['dataset'] = $producto->readAll()) {
                $result['estado'] = 1;
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No hay datos registrados';
            }
            break;
            //Caso para filtrar productos vendidos en las gráficas
        case 'productosVendidosFiltro':
            if (!$producto->setFiltro($_POST['tipo'])) {
                $result['exception'] = 'Error en elegir un filtro';
            } else if (!$producto->setOpcion($_POST['opcion'])) {
                $result['exception'] = 'Error al elegir una opcion';
            } else if ($result['dataset'] = $producto->filtroProductosVendidos()) {
                $result['estado'] = 1;
                $result['message'] = 'Grafica creada correctamente';
            } else if (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Este filtro aún no posee productos';
            }
            break;
            //Caso para filtrar productos vendidos en las gráficas
        case 'productosVendidosFiltroReport':
            if (!$producto->setFiltro($_POST['tipo'])) {
                $result['exception'] = 'Error al elegir un filtro';
            } else if (!$producto->setOpcion($_POST['opcion'])) {
                $result['exception'] = 'Error al elegir una opcion';
            } else if ($result['dataset'] = $producto->filtroProductosVendidos()) {
                $result['estado'] = 1;
                $result['message'] = 'Grafica creada correctamente';
            } else if (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'Este filtro aún no posee productos';
            }
            break;
            //Para el gráfico de barras sobre inventario en un rango de fechas.
        case 'graficoInventarioRango':
            if (!$producto->setFechaIncio($_POST['fecha_inicio'])) {
                $result['exception'] = 'fecha inicio incorrecto';
            } elseif (!$producto->setFechaFinal($_POST['fecha_final'])) {
                $result['exception'] = 'fecha final incorrecta';
            } elseif ($result['dataset'] = $producto->obtenerInventarioRango()) {
                $result['estado'] = 1;
                $result['message'] = 'Grafica creada correctamente';
            } elseif (Database::getException()) {
                $result['exception'] = Database::getException();
            } else {
                $result['exception'] = 'No se tienen registros en inventario en estos rangos de fechas';
            }
            break;
        default:
            $result['exception'] = 'Acción no disponible dentro de la sesión';
            break;
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

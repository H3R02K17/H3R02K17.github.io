<?php
require_once('../conexion/database.php');
require_once('../conexion/validaciones.php');
require_once('../modelo/login.php');
require_once('../conexion/send_email.php');
require_once('../conexion/generador_qr.php');
require_once('../conexion/two_factor.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $mailer = new Mailer;
    $usuario = new Usuarios;
    $generador_qr = new GeneratorQR;
    $auth = new Authenticator;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('estado' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'error' => 0, 'dataset' => null, 'two_factor' => null, 'username' => null, 'cambio_contra' => null, 'empleado' => null, 'apellido' => null, 'dui' => null, 'nit' => null, 'fecha_nacimiento' => null, 'telefono' => null, 'usuario' => null, 'imagen_usuario' => null, 'nivel_usuario' => null, 'tipo_usuario' => null, 'qr_code' => null, 'recuperacion' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idusuario_empleado']) && $_SESSION['cambio_contra'] == 1 && $_SESSION['two_factor'] == 1) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando el administrador ha iniciado sesión.
        switch ($_GET['action']) {
                //Caso por si desea cerrar la sesión actual
            case 'cerrarSesion':
                if (session_destroy()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['exception'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
                //Saber si existe un usuario y está intentando acceder a los forms de Recuperar y Renovar contra
            case 'existenciaUsuarioRecuperar':
                if (isset($_SESSION['idusuario_empleado'])) {
                    $result['estado'] = 1;
                    $result['message'] = 'Existe una conexión';
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No se pudo obtener el usuario logueado';
                }
                break;
                //Función la cuál obtendrá los datos del usuario de las variables de sessión 
            case 'obtenerUsuario':
                //Se valida que exista el ID del usuario
                if (isset($_SESSION['idusuario_empleado'])) {
                    $result['estado'] = 1;
                    $result['username'] = $_SESSION['idusuario_empleado'];
                    $result['empleado'] = $_SESSION['nombre_empleado'];
                    $result['apellido'] = $_SESSION['apellido_empleado'];
                    $result['dui'] = $_SESSION['dui_empleado'];
                    $result['nit'] = $_SESSION['nit_empleado'];
                    $result['fecha_nacimiento'] = $_SESSION['fecha_nacimiento_empleado'];
                    $result['telefono'] = $_SESSION['telefono_empleado'];
                    $result['usuario'] = $_SESSION['usuario_empleado'];
                    $result['imagen_usuario'] = $_SESSION['imagen_empleado'];
                    $result['nivel_usuario'] = $_SESSION['idtipo_usuario'];
                    $result['tipo_usuario'] = $_SESSION['tipo_usuario'];
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Nombre de usuario indefinido';
                }
                break;
                //Función para actualizar los datos del perfil exceptuando la contraseña
            case 'actualizarPerfil':
                //Validamos el form de perfil
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setTelefono($_POST['telefono'])) {
                    $result['exception'] = 'El número de teléfono ingresado tiene un formato incorrecto. Recuerde el formato de teléfono "0000-0000"';
                } else if (!$usuario->setCorreoUsuario($_POST['correo'])) {
                    $result['exception'] = 'El correo ingresado no tiene un formato válido. Intentelo de nuevo';
                } else if ($usuario->actualizarPerfil()) {
                    //Si desea actualizar el usario sin la imagen de perfil
                    if (!is_uploaded_file($_FILES['imagen_usuario']['tmp_name'])) {
                        if ($usuario->actualizarUsuario($_SESSION['imagen_empleado'])) {
                            $result['estado'] = 1;
                            $_SESSION['usuario_empleado'] = $usuario->getUsuario();
                            $_SESSION['telefono_empleado'] = $usuario->getTelefono();
                            $_SESSION['imagen_empleado'] = $usuario->getImagenActualizar();
                            $result['message'] = 'Usuario modificado correctamente';
                        } else {
                            $result['exception'] = Database::getException();
                        }
                    } else if (!$usuario->setImagen($_FILES['imagen_usuario'])) {
                        $result['exception'] = $usuario->getFileError();
                    } //Si desea actualizar el usario con la imagen de perfil
                    else if ($usuario->actualizarUsuario($_SESSION['imagen_empleado'])) {
                        $result['estado'] = 1;
                        if ($usuario->saveFile($_FILES['imagen_usuario'], $usuario->getLink(), $usuario->getImagenActualizar())) {
                            $result['estado'] = 1;
                            $_SESSION['usuario_empleado'] = $usuario->getUsuario();
                            $_SESSION['telefono_empleado'] = $usuario->getTelefono();
                            $_SESSION['imagen_empleado'] = $usuario->getImagenActualizar();
                            $result['message'] = 'Sus datos fueron modificados correctamente con la nueva imagen';
                        } else {
                            $result['message'] = 'Usuario modificada pero no se guardó la imagen';
                        }
                    }
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Nombre de usuario indefinido';
                }
                break;
                //Buscar el two_factor
            case 'knownTwoFactor':
                if ($result['dataset'] = $usuario->readTwoFactor()) {
                    $result['estado'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Verificación incorrecta';
                }
                break;
                //Saber si esta activa la autenticación en 2 pasos
            case 'get2fa':
                if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                    $result['exception'] = 'Nombre de usuario inválido';
                } elseif (!$usuario->setSecret($auth->generateRandomSecret())) {
                    $result['exception'] = 'Error al generar secreto.';
                } elseif (!$usuario->set2fa()) {
                    $result['exception'] = Database::getException();
                } elseif ($result['dataset'] = $auth->getQR('KoffiSoft', $usuario->getSecret())) {
                    $result['estado'] = 1;
                    $result['message'] = 'Activación de autenticación en 2 pasos completa.';
                } else {
                    $result['exception'] = 'Ha ocurrido un error al generar el código QR.';
                }
                break;
                //Activar la autenticación en 2 pasos
            case 'activate2fa':
                if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                    $result['exception'] = 'Nombre de usuario inválido';
                } elseif (!$usuario->setSecret($auth->generateRandomSecret())) {
                    $result['exception'] = 'Error al generar secreto.';
                } elseif (!$usuario->set2fa()) {
                    $result['exception'] = Database::getException();
                } elseif ($result['dataset'] = $auth->getQR('Koffi-Soft', $usuario->getSecret())) {
                    $result['estado'] = 1;
                    $result['message'] = 'Activación de autenticación en 2 pasos completa.';
                } else {
                    $result['exception'] = 'Ha ocurrido un error al generar el código QR.';
                }
                break;
                //Desactivar la autenticación en 2 pasos
            case 'deactivate2fa':
                if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                    $result['exception'] = 'Nombre de usuario inválido';
                } elseif ($usuario->deactivate2fa()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Se ha desactivado la autenticación en 2 pasos.';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'actualizarContra':
                //Validar formulario de actualizar
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                    $result['exception'] = 'No se ha podido obtener el ID del usuario activo';
                } elseif ($usuario->validarContraUsuarioEmpleado($_POST['contrasenia'])) {
                    if ($_POST['confirmar_contrasenia'] != $_POST['confirmar_nueva_contrasenia']) {
                        $result['exception'] = 'La nueva contraseña ingresada no es igual a la ingresada en el apartado de 
                        confirmar nueva contraseña';
                    } else if (!$usuario->setContra($_POST['confirmar_contrasenia'])) {
                        $result['exception'] = $usuario->getPasswordError();
                    } //Función que busca en la tabla de contras si el usuario ya ha utilizado la contra ingresada
                    else if ($usuario->buscarContrasenia($_POST['confirmar_contrasenia'])) {
                        $result['exception'] = 'Esta contraseña ya fue usada anteriormente';
                    } //Si en caso las validaciones sean correctas se actualiza el usuario y se guarda la contra correctamente en tbcontras
                    else if ($usuario->actualizaContra() && $usuario->guardarContrasenia()) {
                        $result['estado'] = 1;
                        $result['message'] = 'Proceso realizado correctamente, la contraseña ha sido actualizada';
                    } else if (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se pudo actualizar la hora de bloqueo';
                    }
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = "La contraseña actual es incorrecta. Verifique si ha ingresado la contraseña correcta 
                    o puede restaurar su contraseña en caso haya sido olvidada";
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible fuera de la sesión';
                break;
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
                //Verificamos si existen usuarios
            case 'verificarPrimerUso':
                //Si existen usuarios manda un mensaje de que se encontraron
                if ($usuario->validarExistenciaPrimerUsuario()) {
                    $result['estado'] = 1;
                    $result['message'] = 'Existe al menos un usuario registrado';
                } else if (Database::getException()) {
                    $result['error'] = 1;
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No existe un usuario administrador registrado';
                }
                break;
                //Caso para actualizar la contraseña cuando esta no se ha modificado en mas de 90 dias
            case 'actualizarContra90dias':
                //Validar formulario de login
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                    $result['exception'] = 'No se ha podido obtener el ID del usuario activo';
                } elseif ($usuario->validarContraUsuarioEmpleado($_POST['contrasenia1'])) {
                    if ($_POST['confirmar_contrasenia'] != $_POST['confirmar_nueva_contrasenia']) {
                        $result['exception'] = 'La nueva contraseña ingresada no es igual a la ingresada en el apartado de 
                            confirmar nueva contraseña';
                    } else if (!$usuario->setIdUsuario($_SESSION['idusuario_empleado'])) {
                        $result['exception'] = 'No se ha podido obtener el ID del usuario activo';
                    } else if (!$usuario->setContra($_POST['confirmar_contrasenia'])) {
                        $result['exception'] = $usuario->getPasswordError();
                    } else if ($usuario->buscarContrasenia($_POST['confirmar_contrasenia'])) {
                        $result['exception'] = 'Esta contraseña ya fue usada anteriormente';
                    } elseif ($usuario->actualizaContra()) {
                        $usuario->guardarContrasenia();
                        $result['estado'] = 1;
                        $result['message'] = 'Proceso realizado correctamente, la contraseña ha sido actualizada';
                    } else if (Database::getException()) {
                        $result['exception'] = Database::getException();
                    } else {
                        $result['exception'] = 'No se pudo actualizar la hora de bloqueo';
                    }
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = "La contraseña actual es incorrecta. Verifique si ha ingresado la contraseña correcta 
                        o puede restaurar su contraseña en caso haya sido olvidada";
                }
                break;
                //Proceso para ingresar en el login
            case 'logIn':
                $_POST = $usuario->validateForm($_POST);
                //Si el usuario no es correcto manda una alerta
                if (!$usuario->validarUsuarioEmpleado($_POST['usuario'])) {
                    $result['exception'] = 'El usuario o la contraseña ingresados no son válidos';
                    //Si el usuario y la contraseña es la correcta y el número de intentos es menor a 3 y un estado activo manda una alerta
                } else if (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else if ($usuario->validarContraUsuarioEmpleado($_POST['contrasenia']) && $usuario->getIntento() < 3 && $usuario->getEstadoU() == 1) {
                    $result['estado'] = 1;
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['idusuario_empleado'] = $usuario->getIdUsuario();
                    $_SESSION['usuario_empleado'] = $usuario->getUsuario();
                    $_SESSION['nombre_empleado'] = $usuario->getNombreEmpleado();
                    $_SESSION['apellido_empleado'] = $usuario->getApellidoEmpleado();
                    $_SESSION['dui_empleado'] = $usuario->getDUIEmpleado();
                    $_SESSION['nit_empleado'] = $usuario->getNITEmpleado();
                    $_SESSION['telefono_empleado'] = $usuario->getTelefono();
                    $_SESSION['fecha_cambio_contra'] = $usuario->getFecha_cambio_contra();
                    $_SESSION['fecha_nacimiento_empleado'] = $usuario->getFechaNacimiento();
                    $_SESSION['imagen_empleado'] = $usuario->getImagenU();
                    $_SESSION['idtipo_usuario'] = $usuario->getIdTipoU();
                    $_SESSION['tipo_usuario'] = $usuario->getTipoUsuario();
                    $usuario->habilitarIntentos(0, 1);
                    //Variable que almacena la fecha actual
                    $dia_actual = date('Y-m-d H:i:s', time());
                    //Variable que almacena la fecha menos 90 días
                    $dia90 = date('Y-m-d H:i:s', strtotime($dia_actual . "- 90 days"));
                    //Si fecha cambio es mayor que dia 90 esta no pediria cambios a la contraseña
                    //Inciara normalmente
                    if ($_SESSION['fecha_cambio_contra'] > $dia90) {
                        $result['cambio_contra'] = 1;
                        $_SESSION['cambio_contra'] = 1;
                        if ($usuario->get2fa()) {
                            $result['two_factor'] = 1;
                            $_SESSION['two_factor'] = 2;
                            $_SESSION['id_usuario_temp_two'] = $usuario->getIdUsuario();
                        } else {
                            $result['two_factor'] = 2;
                            $_SESSION['two_factor'] = 1;
                        }
                    } else {
                        //Si el resultado es 2 entonces este si pedira cambio debido a que ya han pasado 90 días y no se ha actulizado campos
                        $result['cambio_contra'] = 2;
                        $_SESSION['cambio_contra'] = 2;
                    }
                }
                //Si el usuario es el correcto pero la contra es incorrecta
                else {
                    //Si el número de intentos es menor a 3
                    if ($usuario->getIntento() < 3) {
                        //Validamos si tiene intentos pero si posee un estado 2 (inactivo) es porque el empleado ha sido deshabilitado
                        if ($usuario->getEstadoU() == 2) {
                            $result['exception'] = 'El usuario esta inactivo';
                        }
                        //Validamos si tiene intentos pero si posee un estado 3 (eliminado) es porque el empleado ha sido eliminado
                        elseif ($usuario->getEstadoU() == 3) {
                            $result['exception'] = 'El usuario ha sido eliminado del sistema';
                        }
                        //Se agrega un intento al usuario que está ingresando
                        else if ($usuario->intentosUsuarioEmpleado()) {
                            $result['exception'] = 'Credenciales incorrectas. Tienes ' . (3 - $usuario->getIntento()) . ' intentos restantes';
                        } else if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        }
                        //Si ocurre un fallo al actualizar
                        else {
                            $result['exception'] = 'No se pudo actualizar los intentos';
                        }
                    } elseif (Database::getException()) {
                        $result['exception'] = Database::getException();
                    }
                    //Si el número de intentos es igual a 3
                    else if ($usuario->getIntento() == 3) {
                        //Verificaremos si no existe una fecha de bloqueo para poder agregar una
                        if ($usuario->getHoraInactivacion() == null && $usuario->getHoraActivacion() == null) {
                            //Crearemos los valores de hora de bloqueo y desbloqueo
                            date_default_timezone_set('America/El_Salvador');
                            $hora_inactivacion = date('Y-m-d H:i:s', time());
                            $hora_actual = date('Y-m-d H:i:s', time());
                            //La hora de activación es la fecha y hora actual + 24 horas que tendrá que esperar para volver a tener 3 intentos
                            $hora_activacion = date('Y-m-d H:i:s', strtotime($hora_actual . "+ 1 days"));
                            //Mandamos la hora de bloqueo, la hora de desbloqueo y el 2 que es para poner estado inactiva a la cuenta
                            if ($usuario->registrarHoraIntento($hora_inactivacion, $hora_activacion, 2)) {
                                if ($mailer->sendMail($usuario->getCorreoEmpleado())) {
                                    $result['exception'] = 'Tendrá 3 oportunidades dentro de 24 horas, por favor espere';
                                } else {
                                    $result['exception'] = 'Tendrá 3 oportunidades dentro de 24 horas, por favor espere. Ha ocurrido un error con nuestro correo de contactos';
                                }
                            } else if (Database::getException()) {
                                $result['exception'] = Database::getException();
                            } else {
                                $result['exception'] = 'No se pudo actualizar la hora de bloqueo';
                            }
                        }
                        //Verificaremos si existe una fecha de bloqueo para decirle al usuario el tiempo de espera
                        else {
                            date_default_timezone_set('America/El_Salvador');
                            //Creamos un variable que almacene la hora local
                            $hora_actual = date('Y-m-d H:i:s', time());
                            //Si la hora actual es mayor a la fecha de activación le decimos que debe esperar
                            if ($usuario->getHoraActivacion() > $hora_actual) {
                                if ($mailer->sendMail($usuario->getCorreoEmpleado())) {
                                    $result['exception'] = 'Tendrá 3 oportunidades dentro de 24 horas desde la hora de bloqueo, por favor espere.';
                                } else {
                                    $result['exception'] = 'Tendrá 3 oportunidades dentro de 24 horas desde la hora de bloqueo, por favor espere. Ha ocurrido un error con nuestro correo de contactos';
                                }
                            }
                            //Si la hora actual es menor a la fecha de activación, se actualizaran los intentos a 0 y se eliminara las fechas de bloqueo y desbloqueo 
                            else if ($usuario->getHoraActivacion() < $hora_actual) {
                                //Actualizamos los intentos a 0 y su estado a 1 que es activo
                                if ($usuario->habilitarIntentos(0, 1)) {
                                    $result['exception'] = 'Estado Actualizado. Ha acabado el tiempo de espera, tiene 3 intentos más';
                                } else if (Database::getException()) {
                                    $result['exception'] = Database::getException();
                                } else {
                                    $result['exception'] = 'Error de Actualización. Ha ocurrido un error en el momento de actualizar intentos';
                                }
                            } else {
                                $result['exception'] = Database::getException();
                            }
                        }
                    }
                }
                break;
                // Caso para validar DUI y Usuario para mandar codigo de recuperación
            case 'correoRecuperacion':
                //Validar formulario recuperar
                $_POST = $usuario->validateForm($_POST);
                //Obtenemos el usuario ingresado
                if (!$usuario->setCorreoUsuario($_POST['usuario'])) {
                    $result['exception'] = 'El usuario ingresado posee un formato incorrecto';
                } //Obtenemos el DUI ingresado
                elseif (!$usuario->setDUIEmpleado($_POST['dui'])) {
                    $result['exception'] = 'El usuario ingresado posee un formato incorrecto';
                } //Llamamos la función para obtener el correo del empleado
                elseif ($usuario->correoRecuperacion()) {
                    //Configuramos la hora local
                    date_default_timezone_set('America/El_Salvador');
                    //Variable que almacenará el código
                    $codigo = '';
                    //Generamos un código random de longitud 4
                    for ($i = 0; $i < 6; $i++) {
                        $codigo .= intval(rand(0, 9));
                    }
                    //Creamos nombres para nuestra cookie
                    $nombre = "codigo";
                    $expira = time() + 900;
                    if ($mailer->codigoRecuperacion($usuario->getCorreoEmpleado(), $codigo)) {
                        //Creamos un cookie con duración de 15 min
                        setcookie($nombre, $codigo, $expira);
                        $_SESSION['usuario_recuperacion'] = $_POST['usuario'];
                        $_SESSION['correo_recuperacion'] = $usuario->getCorreoEmpleado();
                        $_SESSION['dui_recuperación'] = $_POST['dui'];
                        $_SESSION['recuperacion'] = 1;
                        $result['estado'] = 1;
                        $result['message'] = 'El código de verificación ha sido enviado al correo personal ligado del empleado';
                    } else {
                        //Creamos un cookie con duración de 15 min
                        setcookie($nombre, $codigo, $expira);
                        $_SESSION['usuario_recuperacion'] = $_POST['usuario'];
                        $_SESSION['correo_recuperacion'] = $usuario->getCorreoEmpleado();
                        $_SESSION['dui_recuperación'] = $_POST['dui'];
                        $_SESSION['recuperacion'] = 1;
                        $result['estado'] = 1;
                        $result['message'] = 'Ha ocurrido un error al enviar el código de verificación al correo personal. 
                        Nuestro correo de contactos presento un problema y estamos solucionandolo, intente el método de generar QR';
                    }
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                //Caso para validar que el código es válido y se pueda actualizar la contraseña
            case 'renovarContra':
                //Comprobamos si aún existe la cookie de codigo
                if (isset($_COOKIE['codigo'])) {
                    //Obtenemos el valor de la cookie
                    $codigo_validacion = $_COOKIE['codigo'];
                    //Si el código ingresado es igual al valor de la cookie
                    if ($codigo_validacion == $_POST['codigo']) {
                        //Validar formulario
                        $_POST = $usuario->validateForm($_POST);
                        //Mandamos el valor anteriormente brindado del correo al SET
                        if (!$usuario->setCorreoUsuario($_SESSION['usuario_recuperacion'])) {
                            $result['exception'] = 'El correo posee un formato incorrecto';
                        } elseif ($_POST['nueva_contra'] != $_POST['nueva_contra_confirmar']) {
                            $result['exception'] = 'Las contraseñas ingresadas son diferentes, verifique que haya ingresado correctamente las nuevas contraseñas';
                        } elseif (!$usuario->setContra($_POST['nueva_contra'])) {
                            $result['exception'] = $registroUsuario->getPasswordError();
                        } else if ($usuario->buscarContraseniaRenovar($_POST['nueva_contra'])) {
                            $result['exception'] = 'Esta contraseña ya fue usada anteriormente';
                        } //Verificamos si se pudo realizar el proceso con exito
                        elseif ($usuario->renovarContra()) {
                            $usuario->guardarContraseniaRenovar();
                            $result['estado'] = 1;
                            $result['message'] = 'Contraseña actualizada correctamente, Intente el proceso de login para acceder al sistema';
                        } else if (Database::getException()) {
                            $result['exception'] = Database::getException();
                        } else {
                            $result['exception'] = "La contraseña actual es incorrecta. Verifique si ha ingresado la contraseña correcta 
                                    o puede restaurar su contraseña en caso haya sido olvidada";
                        }
                    } else {
                        $result['exception'] = 'El código ingresado no es válido, compruebe que ha ingresado el código correcto';
                    }
                } else {
                    $result['exception'] = 'El código enviado ya no es válido, ha sobrepasado el tiempo de validez';
                }
                break;
                //Caso para generar código QR
            case 'generarQR':
                //Comprobamos si aún existe la cookie de codigo
                if (isset($_COOKIE['codigo'])) {
                    //Obtenemos el valor de la cookie
                    $codigo_validacion = $_COOKIE['codigo'];
                    //Mandamos al generador el nombre del usuario y el codigo
                    if ($generador_qr->generadorQR($_SESSION['usuario_recuperacion'], $codigo_validacion)) {
                        $result['estado'] = 1;
                        $result['message'] = 'Codigo QR generado con éxito';
                        $result['qr_code'] = $_SESSION['filename'];
                    } else {
                        $result['exception'] = 'No se ha podido generar el código QR';
                    }
                } else {
                    $result['exception'] = 'El código enviado ya no es válido, ha sobrepasado el tiempo de validez';
                }
                break;
                //Caso para reenviar EMAIL
            case 'reenviarEmail':
                //Comprobamos si aún existe la cookie de codigo
                if (isset($_COOKIE['codigo'])) {
                    if ($mailer->codigoRecuperacion($_SESSION['correo_recuperacion'], $_COOKIE['codigo'])) {
                        $result['estado'] = 1;
                        $result['message'] = 'El código de verificación ha sido enviado al correo personal ligado del empleado';
                    } else {
                        $result['estado'] = 1;
                        $result['message'] = 'Ha ocurrido un error al enviar el código de verificación al correo personal. 
                        Nuestro correo de contactos presento un problema y estamos solucionandolo, intente el método de generar QR';
                    }
                } elseif (!isset($_COOKIE['codigo'])) {
                    //Configuramos la hora local
                    date_default_timezone_set('America/El_Salvador');
                    //Variable que almacenará el código
                    $codigo = '';
                    //Generamos un código random de longitud 4
                    for ($i = 0; $i < 6; $i++) {
                        $codigo .= intval(rand(0, 9));
                    }
                    //Creamos nombres para nuestra cookie
                    $nombre = "codigo";
                    $expira = time() + 900;
                    if ($mailer->codigoRecuperacion($_SESSION['correo_recuperacion'], $codigo)) {
                        //Creamos un cookie con duración de 15 min
                        setcookie($nombre, $codigo, $expira);
                        $result['estado'] = 1;
                        $result['message'] = 'El código de verificación ha sido enviado al correo personal ligado del empleado';
                    } else {
                        //Creamos un cookie con duración de 15 min
                        setcookie($nombre, $codigo, $expira);
                        $result['estado'] = 1;
                        $result['message'] = 'Ha ocurrido un error al enviar el código de verificación al correo personal. 
                        Nuestro correo de contactos presento un problema y estamos solucionandolo, intente el método de generar QR';
                    }
                } else {
                    $result['estado'] = 2;
                    $result['exception'] = 'No se pudo verificar la existencia del código';
                }
                break;
            case 'verificacionRecuperar':
                //Comprobamos si existe la variable sesion de recuperar, sino no ha pasado el formulario de recuperación
                if (isset($_SESSION['recuperacion'])) {
                    if ($_SESSION['recuperacion'] == 1) {
                        $result['recuperacion'] = 1;
                    } else {
                        $result['recuperacion'] = 2;
                    }
                } else {
                    $result['recuperacion'] = 2;
                    $result['exception'] = 'No ha pasado el formulario de Recuperación';
                }
                break;
                //Caso para verificar el código de acceso de autenticación en 2 pasos de un usuario.
            case 'twoFactorAuthent':
                $_POST = $usuario->validateForm($_POST);
                if (!$usuario->setIdUsuario($_SESSION['id_usuario_temp_two'])) {
                    $result['exception'] = 'ID de usuario inválido';
                } elseif (!$usuario->validarUsuarioEmpleado($_SESSION['usuario_empleado'])) {
                    $result['exception'] = 'Usuario inexistente.';
                } elseif (!$usuario->setCode2fa($_POST['twoFactorCode'])) {
                    $result['exception']  = 'Código de acceso no válido';
                } elseif ($auth->verifyCode($usuario->getUserSecret(), $_POST['twoFactorCode'], 0)) {
                    $result['estado'] = 1;
                    $_SESSION['idusuario_empleado'] = $usuario->getIdUsuario();
                    $_SESSION['usuario_empleado'] = $usuario->getUsuario();
                    $result['message'] = 'Autenticación correcta';
                    $_SESSION['two_factor'] = 1;
                    unset($_SESSION['id_usuario_temp_two']);
                } else {
                    $result['exception'] = 'El código de acceso no es correcto, vuelva a intentar.';
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible si no ha iniciado sesión';
                break;
        }
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}

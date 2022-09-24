<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Usuarios extends Validator
{
    // Declaración de atributos (propiedades).
    private $idusuario_empleado = null;
    private $usuario_empleado = null;
    private $clave_usuario = null;
    private $hora_inactivacion = null;
    private $hora_activacion = null;
    private $imagen_usuario = null;
    private $imagen_usuario_actualizar = null;
    private $link = '../images/usuario/';
    private $intentos = null;
    private $idestado_usuario = null;
    private $idtipo_usuario = null;
    private $tipo_usuario = null;
    private $nombre_empleado = null;
    private $apellido_empleado = null;
    private $correo_empleado = null;
    private $dui = null;
    private $nit = null;
    private $telefono = null;
    private $fecha_nacimiento = null;
    private $secret = null;
    //parametros para la tabla de contraseñas del usuario 
    private $idcontra = null;

    /*
        Metodo para la tabla de contraseñas del usuario
    */

    public function setIdContra($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idcontra = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCorreoEmpleado($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    //Le asignamos un valor al ID usuario
    public function setIdUsuario($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idusuario_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos un valor al telefono
    public function setTelefono($value)
    {
        if ($this->validarTelefono($value)) {
            $this->telefono = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos un valor al correo y que también servira para actualizar el usuario
    public function setCorreoUsuario($value)
    {
        if ($this->validateEmail($value)) {
            $this->usuario_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setContra($value)
    {
        if ($this->validatePassword($value)) {
            $this->clave_usuario = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    //Validamos la imagen del usuario
    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 2000, 2000)) {
            $this->imagen_usuario_actualizar = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el dui tenga el formato correcto*/
    public function setDUIEmpleado($value)
    {
        if ($this->validarDUI($value)) {
            $this->dui = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setSecret($value)
    {
        if ($this->validateAlphanumeric($value, 16, 16)) {
            $this->secret = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCode2fa($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->code_2fa = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getIdUsuario()
    {
        return $this->idusuario_empleado;
    }

    public function getCorreoEmpleado()
    {
        return $this->correo_empleado;
    }

    public function getUsuario()
    {
        return $this->usuario_empleado;
    }

    public function getClaveUsuario()
    {
        return $this->clave_usuario;
    }

    public function getHoraInactivacion()
    {
        return $this->hora_inactivacion;
    }

    public function getHoraActivacion()
    {
        return $this->hora_activacion;
    }

    public function getFecha_cambio_contra()
    {
        return $this->fecha_cambio_contra;
    }

    public function getIntento()
    {
        return $this->intentos;
    }

    public function getEstadoU()
    {
        return $this->idestado_usuario;
    }

    public function getIdTipoU()
    {
        return $this->idtipo_usuario;
    }

    public function getTipoUsuario()
    {
        return $this->tipo_usuario;
    }

    public function getNombreEmpleado()
    {
        return $this->nombre_empleado;
    }

    public function getApellidoEmpleado()
    {
        return $this->apellido_empleado;
    }

    public function getDUIEmpleado()
    {
        return $this->dui;
    }

    public function getNITEmpleado()
    {
        return $this->nit;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getFechaNacimiento()
    {
        return $this->fecha_nacimiento;
    }

    public function getLink()
    {
        return $this->link;
    }

    public function getImagenU()
    {
        return $this->imagen_usuario;
    }

    public function getImagenActualizar()
    {
        return $this->imagen_usuario_actualizar;
    }

    public function getSecret()
    {
        return $this->secret;
    }

    /* Traer los datos de un usuario si el usuario ingresado existe */
    public function validarExistenciaPrimerUsuario()
    {
        $sql = 'SELECT idusuario_empleado, usuario_empleado, intentos, fecha_bloqueo, fecha_desbloqueo, 
        imagen_empleado, idempleado, idtipo_usuario, idestado_usuario
        FROM tbusuario_empleado ORDER BY idusuario_empleado';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    /*
    *   Métodos para gestionar la cuenta del usuario.
    */
    public function validarUsuarioEmpleado($usuario)
    {
        $sql = 'SELECT tue.idusuario_empleado, tue.intentos, tue.fecha_bloqueo, tue.two_factor, 
        tue.fecha_desbloqueo, tue.imagen_empleado, tue.idtipo_usuario, tue.fecha_cambio_contra, 
        ttu.tipo_usuario, tue.idestado_usuario, te.nombre_empleado, te.apellido_empleado, te.correo_empleado, 
        te.dui_empleado, te.nit_empleado, te.telefono_empleado, te.fecha_nacimiento_empleado
        FROM tbusuario_empleado tue, tbtipousuario ttu, tbempleado te
        WHERE tue.idtipo_usuario = ttu.idtipo_usuario AND tue.idempleado = te.idempleado AND usuario_empleado = ?';
        $params = array($usuario);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->idusuario_empleado = $data['idusuario_empleado'];
            $this->usuario_empleado = $usuario;
            $this->intentos = $data['intentos'];
            $this->hora_inactivacion = $data['fecha_bloqueo'];
            $this->correo_empleado = $data['correo_empleado'];
            $this->hora_activacion = $data['fecha_desbloqueo'];
            $this->fecha_cambio_contra = $data['fecha_cambio_contra'];
            $this->imagen_usuario = $data['imagen_empleado'];
            $this->idestado_usuario = $data['idestado_usuario'];
            $this->idtipo_usuario = $data['idtipo_usuario'];
            $this->tipo_usuario = $data['tipo_usuario'];
            $this->nombre_empleado = $data['nombre_empleado'];
            $this->apellido_empleado = $data['apellido_empleado'];
            $this->dui = $data['dui_empleado'];
            $this->nit = $data['nit_empleado'];
            $this->telefono = $data['telefono_empleado'];
            $this->fecha_nacimiento = $data['fecha_nacimiento_empleado'];
            $this->secret = $data['two_factor'];
            return true;
        } else {
            return false;
        }
    }

    //Se actualizan los intentos del usuario empleado al equivocarse de contra
    public function intentosUsuarioEmpleado()
    {
        $sql = 'UPDATE tbusuario_empleado SET intentos = ? WHERE usuario_empleado = ?';
        $params = array(($this->intentos += 1), $this->usuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    /* Registrar la hora de bloqueo y la hora de desbloqueo del usuario empleado */
    public function registrarHoraIntento($hora_block, $hora_desblock, $idestadoU)
    {
        $sql = 'UPDATE tbusuario_empleado SET fecha_bloqueo = ? , fecha_desbloqueo = ?, idestado_usuario = ? WHERE usuario_empleado = ?';
        $params = array($hora_block, $hora_desblock, $idestadoU, $this->usuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Método para habilitar intentos
    public function habilitarIntentos($intento, $idestadoU)
    {
        $sql = "UPDATE tbusuario_empleado SET fecha_bloqueo = NULL, fecha_desbloqueo = NULL, intentos = ?, idestado_usuario = ? WHERE usuario_empleado = ?";
        $params = array($intento, $idestadoU, $this->usuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*Validamos la contra del usuario empleado para acceder al sitio */
    public function validarContraUsuarioEmpleado($password)
    {
        $sql = 'SELECT contrasenia_empleado FROM tbusuario_empleado WHERE idusuario_empleado = ?';
        $params = array($this->idusuario_empleado);
        $data = Database::obtenerSentencia($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        // Sirve para desencriptar la clave del empleado
        if (password_verify($password, $data['contrasenia_empleado'])) {
            return true;
        } else {
            return false;
        }
    }

    /*PERFIL*/
    /*Actualizamos datos del perfil */
    public function actualizarPerfil()
    {
        $sql = 'UPDATE tbempleado SET telefono_empleado = ?, correo_empleado = ? WHERE dui_empleado = ?';
        $params = array($this->telefono, $this->usuario_empleado, $_SESSION['dui_empleado']);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*Actualizamos datos del usuario */
    public function actualizarUsuario($imagen_usuario)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen_usuario_actualizar) ? $this->deleteFile($this->getLink(), $imagen_usuario) : $this->imagen_usuario_actualizar = $imagen_usuario;
        $sql = 'UPDATE tbusuario_empleado SET usuario_empleado = ?, imagen_empleado = ? WHERE idusuario_empleado = ?';
        $params = array($this->usuario_empleado, $this->imagen_usuario_actualizar, $_SESSION['idusuario_empleado']);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*Actualizamos los valores de session que hayan sido actualizados*/
    public function renovarDatosUsuario($usuario)
    {
        $sql = 'SELECT tue.usuario_empleado, tue.contrasenia_empleado, tue.imagen_empleado, te.telefono_empleado
        FROM tbusuario_empleado tue, tbempleado te
        WHERE tue.idempleado = te.idempleado AND usuario_empleado = ?';
        $params = array($usuario);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->usuario_empleado = $data['usuario_empleado'];
            $this->imagen_usuario = $data['imagen_empleado'];
            $this->telefono = $data['telefono_empleado'];
            return true;
        } else {
            return false;
        }
    }

    /*Actualizamos la contraseña*/
    public function actualizaContra()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d H:i:s', time());
        $sql = 'UPDATE tbusuario_empleado SET contrasenia_empleado = ?, fecha_cambio_contra = ? 
        WHERE idusuario_empleado = ?';
        $params = array($this->clave_usuario, $fecha_hora_actual, $this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    // Funcion para guardar la contrasenia de los usuarios
    public function guardarContrasenia()
    {
        $sql = 'INSERT INTO tbcontras_usuario(contrasenia_empleado, idusuario_empleado)
                VALUES (?, ?)';
        $params = array($this->clave_usuario, $this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    public function buscarContrasenia($password)
    {
        $sql = 'SELECT contrasenia_empleado FROM tbcontras_usuario WHERE idusuario_empleado = ? 
        ORDER BY idcontra DESC LIMIT 3';
        $params = array($this->idusuario_empleado);
        $data = Database::obtenerSentencias($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        // Sirve para desencriptar la clave del empleado
        $estado = false;
        foreach ($data as $value) {
            if (password_verify($password, $value['contrasenia_empleado'])) {
                $estado = true;
            }
        }
        return $estado;
    }

    //Función para obtener correo y mandar mensaje de código de recuperación si el dui y usuario son correctos
    public function correoRecuperacion()
    {
        $sql = "SELECT te.correo_empleado FROM tbempleado te
        INNER JOIN tbusuario_empleado tue
        ON te.idempleado = tue.idempleado
        WHERE tue.usuario_empleado = ? AND te.dui_empleado = ?";
        $params = array($this->usuario_empleado, $this->dui);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->correo_empleado = $data['correo_empleado'];
            return true;
        } else {
            return false;
        }
    }

    public function buscarContraseniaRenovar($password)
    {
        $sql = 'SELECT contrasenia_empleado 
        FROM tbcontras_usuario 
        WHERE idusuario_empleado = (SELECT idusuario_empleado FROM tbusuario_empleado 
        WHERE usuario_empleado = ?)
        ORDER BY idcontra DESC LIMIT 3';
        $params = array($this->usuario_empleado);
        $data = Database::obtenerSentencias($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        // Sirve para desencriptar la clave del empleado
        $estado = false;
        foreach ($data as $value) {
            if (password_verify($password, $value['contrasenia_empleado'])) {
                $estado = true;
            }
        }
        return $estado;
    }

    /*Actualizamos la contraseña en el proceso de renovar si la ha olvidado*/
    public function renovarContra()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d H:i:s', time());
        $sql = 'UPDATE tbusuario_empleado SET contrasenia_empleado = ?, fecha_cambio_contra = ? 
        WHERE usuario_empleado = ?';
        $params = array($this->clave_usuario, $fecha_hora_actual, $this->usuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    // Funcion para guardar la contrasenia de los usuarios
    public function guardarContraseniaRenovar()
    {
        $sql = 'INSERT INTO tbcontras_usuario(contrasenia_empleado, idusuario_empleado)
                VALUES (?, (SELECT idusuario_empleado FROM tbusuario_empleado 
                WHERE usuario_empleado = ?))';
        $params = array($this->clave_usuario, $this->usuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*------------------------------------------------------------
    AUTENTICACIÓN EN 2 PASOS USANDO GOOGLE AUTHENTICATOR */

    public function readTwoFactor()
    {
        $sql = 'SELECT two_factor
                FROM tbusuario_empleado
                WHERE idusuario_empleado = ?';
        $params = array($_SESSION['idusuario_empleado']);
        return Database::obtenerSentencia($sql, $params);
    }

    public function get2fa()
    {
        $sql = 'SELECT two_factor FROM tbusuario_empleado WHERE idusuario_empleado = ?';
        $params = array($this->idusuario_empleado);
        $two_factor = Database::obtenerSentencia($sql, $params);
        return $two_factor['two_factor'];
    }

    public function getUserSecret()
    {
        $sql = 'SELECT two_factor_key FROM tbusuario_empleado WHERE idusuario_empleado = ?';
        $params = array($this->idusuario_empleado);
        $secret = Database::obtenerSentencia($sql, $params);
        return $secret['two_factor_key'];
    }

    public function set2fa()
    {
        $sql = 'UPDATE tbusuario_empleado
        SET two_factor = true,
        two_factor_key = ?
        WHERE idusuario_empleado = ?';
        $params = array($this->secret, $this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    public function deactivate2fa()
    {
        $sql = "UPDATE tbusuario_empleado
        SET two_factor = false,
        two_factor_key = null
        WHERE idusuario_empleado = ?";
        $params = array($this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }
}

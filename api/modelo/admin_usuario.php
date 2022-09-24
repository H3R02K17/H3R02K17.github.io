<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class UsuarioEmpleado extends Validator
{
    // Declaración de los atributos.
    private $idusuario_empleado = null;
    private $usuario_empleado = null;
    private $contrasenia_empleado = null;
    private $confirmar_contrasenia_empleado = null;
    private $intentos = null;
    private $imagen_empleado = null;
    private $ruta_img = '../images/usuario/';
    private $idempleado = null;
    private $idtipo_usuario = null;
    private $idestado_usuario = null;
    private $correo_empleado = null;
    private $dui_empleado = null;
    // Parametro para el pagination
    private $contador = 0;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setContador($value)
    {
        if ($this->validacionNumeroNaturalesConCero($value)) {
            $this->contador = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setidusuario_empleado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idusuario_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el usuario sea un correo */
    public function setusuario_empleado($value)
    {
        if ($this->validateEmail($value)) {
            $this->usuario_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Registra contraseña una contraseña al usuario
    public function setcontrasenia_empleado($value)
    {
        if ($this->validatePassword($value)) {
            $this->contrasenia_empleado = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    //Registra contraseña una contraseña al usuario
    public function setConfirmarContrasenia($value)
    {
        if ($this->validatePassword($value)) {
            $this->confirmar_contrasenia_empleado = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }
    
    //Traemos los intentos de inicio
    public function setintentos($value)
    {
        if ($this->validacionNumeroNaturalesConCero($value)) {
            $this->intentos = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos una imagen
    public function setimagen_empleado($file)
    {
        if ($this->validateImages($file, 2000, 2000)) {
            $this->imagen_empleado = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    //Traemos el id al empleado que pertence
    public function setidempleado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idempleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Traemos el id del tipo de usuario al se le asignara
    public function setidtipo_usuario($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idtipo_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Traemos el id del estado de usuario al se le asignara
    public function setidestado_usuario($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el dui tenga el formato correcto*/
    public function setDUIEmpleado($value)
    {
        if ($this->validarDUI($value)) {
            $this->dui_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //-----------------------------Metodos------------------------------

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getidusuario_empleado()
    {
        return $this->idusuario_empleado;
    }

    public function getusuario_empleado()
    {
        return $this->usuario_empleado;
    }

    public function getcontrasenia_empleado()
    {
        return $this->contrasenia_empleado;
    }

    public function getintentos()
    {
        return $this->intentos;
    }

    public function getimagen_empleado()
    {
        return $this->imagen_empleado;
    }

    public function getruta_img()
    {
        return $this->ruta_img;
    }

    public function getidempleado()
    {
        return $this->idempleado;
    }

    public function getidtipo_usuario()
    {
        return $this->idtipo_usuario;
    }

    public function getidestado_usuario()
    {
        return $this->idestado_usuario;
    }

    public function getCorreoEmpleado()
    {
        return $this->correo_empleado;
    }

    /* Trae los datos para mostrarlos en la tabla */
    public function readAll()
    {
        $sql = 'SELECT idusuario_empleado, usuario_empleado, tipo_usuario, estado_usuario, 
        COALESCE(intentos,0) as intentos
        FROM tbusuario_empleado
        INNER JOIN tbtipousuario USING(idtipo_usuario)
        INNER JOIN tbestado_usuario USING(idestado_usuario)
        ORDER BY idusuario_empleado ASC LIMIT 10 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion del buscador
    public function buscador($value)
    {
        $sql = 'SELECT idusuario_empleado, usuario_empleado, tipo_usuario, estado_usuario, 
                COALESCE(intentos,0) as intentos, idestado_usuario
                FROM tbusuario_empleado
                INNER JOIN tbtipousuario USING(idtipo_usuario)
                INNER JOIN tbestado_usuario USING(idestado_usuario)
                WHERE idestado_usuario != 3 AND usuario_empleado ILIKE ? OR tipo_usuario ILIKE ? 
                OR CAST(intentos AS VARCHAR) ILIKE ?
                ORDER BY idusuario_empleado ASC LIMIT 10 OFFSET 0';
        $params = array("%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    /*
    Funciones para llenar los selects
    */
    public function readEmpleado()
    {
        $sql = 'SELECT idempleado, nombre_empleado
                FROM tbempleado';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    public function readTipoUsuario()
    {
        $sql = 'SELECT idtipo_usuario, tipo_usuario
                FROM tbtipousuario';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para insertar datos a la tabla de usuarios
    public function crearUsuario()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d H:i:s', time());
        $sql = 'INSERT INTO tbusuario_empleado(
                usuario_empleado, contrasenia_empleado, imagen_empleado, fecha_cambio_contra, idempleado, 
                idtipo_usuario, idestado_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->usuario_empleado, $this->contrasenia_empleado, $this->imagen_empleado, 
        $fecha_hora_actual, $this->idempleado, $this->idtipo_usuario, $this->idestado_usuario);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para actualizar campos a la tabla
    public function actualizarUsuario($current_image)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen_empleado) ? $this->deleteFile($this->getruta_img(), $current_image) : $this->imagen_empleado = $current_image;
        $sql = 'UPDATE tbusuario_empleado
                SET usuario_empleado=?, imagen_empleado=?, idempleado=?, idtipo_usuario=?, idestado_usuario=?
                WHERE idusuario_empleado = ?';
        $params = array($this->usuario_empleado, $this->imagen_empleado, $this->idempleado, $this->idtipo_usuario, 
        $this->idestado_usuario, $this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para buscar un campo especifico
    public function readOne()
    {
        $sql = 'SELECT idusuario_empleado, usuario_empleado, intentos, fecha_bloqueo, fecha_desbloqueo, 
                imagen_empleado, idempleado, nombre_empleado, idtipo_usuario, idestado_usuario
                FROM tbusuario_empleado
                INNER JOIN tbempleado USING(idempleado)
                WHERE idusuario_empleado = ?';
        $params = array($this->idusuario_empleado);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para eliminar datos
    public function eliminarUsuario()
    {
        $sql = 'UPDATE tbusuario_empleado set idestado_usuario = 3
                WHERE idusuario_empleado = ?';
        $params = array($this->idusuario_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    //funcion para llenar la tabla empleado del modal 
    public function readEmpleados()
    {
        $sql = 'SELECT idempleado, nombre_empleado, apellido_empleado, dui_empleado
                FROM public.tbempleado
                INNER JOIN tbtipo_empleado using(idtipo_empleado)
                INNER JOIN tbestado_empleado using(idestado_empleado)
                WHERE idestado_empleado = 1
                ORDER BY idempleado ASC LIMIT 8';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion del buscador
    public function buscadorEmp($value)
    {
        $sql = 'SELECT idempleado, nombre_empleado, apellido_empleado, dui_empleado
                FROM public.tbempleado
                INNER JOIN tbtipo_empleado using(idtipo_empleado)
                INNER JOIN tbestado_empleado using(idestado_empleado)
                WHERE idestado_empleado = 1 AND nombre_empleado ILIKE ? OR apellido_empleado ILIKE ? 
                OR dui_empleado ILIKE ?
                ORDER BY idempleado ASC LIMIT 8';
        $params = array("%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }
    
    //Funcion para llenar los estados del usuario en el option
    public function readEstado()
    {
        $sql = 'SELECT idestado_usuario, estado_usuario
                FROM tbestado_usuario
                WHERE idestado_usuario != 3';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
}

<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class RegistroUsuario extends Validator
{
    // Declaración de atributos (propiedades).
    private $idempleado = null;
    private $nombre_empleado = null;
    private $apellido_empleado = null;
    private $dui = null;
    private $nit = null;
    private $telefono_empleado = null;
    private $correo_empleado = null;
    private $fecha_nacimiento_empleado = null;
    private $idtipo_empleado = 1;
    private $idestado_empleado = 1;
    private $contrasena = null;
    private $imagen_usuario = null;
    private $link = '../images/usuario/';
    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIdEmpleado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idempleado = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el nombre tenga como longitud máxima 50 */
    public function setNombres($value)
    {
        if ($this->validateAlphabetic($value, 1, 40)) {
            $this->nombre_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos los apellidos del empleado
    public function setApellidos($value)
    {
        if ($this->validateAlphabetic($value, 1, 40)) {
            $this->apellido_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor de NIT
    public function setDUI($value)
    {
        if ($this->validarDUI($value)) {
            $this->dui = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor de NIT
    public function setNIT($value)
    {
        if ($this->validarDUI($value)) {
            $this->nit = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor del telefono de empleado
    public function setTelefono($value)
    {
        if ($this->validarTelefono($value)) {
            $this->telefono_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor de correo
    public function setCorreoEmpleado($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor de fecha
    public function setFechaNEmpleado($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_nacimiento_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor de empleado
    public function setContraEmpleado($value)
    {
        if ($this->validatePassword($value)) {
            $this->contrasena = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    //Validamos la imagen de la categoria
    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 2000, 2000)) {
            $this->imagen_usuario = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getIdempleado()
    {
        return $this->idempleado;
    }

    public function getNombres()
    {
        return $this->nombres;
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function getDui()
    {
        return $this->dui;
    }

    public function getClave()
    {
        return $this->clave;
    }

    public function getImagen()
    {
        return $this->imagen_usuario;
    }

    public function getLink()
    {
        return $this->link;
    }

    /* Traer los datos de un usuario si el usuario ingresado existe */
    public function validarExistenciaPrimerUsuario()
    {
        $sql = 'SELECT idusuario_empleado, usuario_empleado, contrasenia_empleado, intentos, fecha_bloqueo, 
        fecha_desbloqueo, imagen_empleado, idempleado, idtipo_usuario, idestado_usuario
        FROM tbusuario_empleado ORDER BY idusuario_empleado';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para registrar un empleado 
    public function registrarEmpleado()
    {
        $sql = 'INSERT INTO tbempleado(nombre_empleado, apellido_empleado, dui_empleado, nit_empleado, 
        telefono_empleado, correo_empleado, fecha_nacimiento_empleado, idtipo_empleado, idestado_empleado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';
        $params = array(
            $this->nombre_empleado, $this->apellido_empleado, $this->dui, $this->nit,
            $this->telefono_empleado, $this->correo_empleado, $this->fecha_nacimiento_empleado, $this->idtipo_empleado,
            $this->idestado_empleado
        );
        return Database::ejecutarSentencia($sql, $params);
    }

    //Función para obtener el IdEmpleado del empleado por ID
    public function obtenerEmpleadoRegistrado()
    {
        $sql = 'SELECT idempleado FROM tbempleado WHERE dui_empleado = ?';
        $params = array($this->dui);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->idempleado = $data['idempleado'];
            return true;
        } else {
            return false;
        }
    }

    //Función para registrar un usuario del empleado
    public function registrarUsuarioEmpleado()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d H:i:s', time());
        $sql = 'INSERT INTO tbusuario_empleado(usuario_empleado, contrasenia_empleado, imagen_empleado, 
        fecha_cambio_contra, idempleado, 
        idtipo_usuario, idestado_usuario)
        VALUES (?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->correo_empleado, $this->contrasena, $this->imagen_usuario, $fecha_hora_actual, 
        $this->idempleado, $this->idtipo_empleado, $this->idestado_empleado);
        return Database::ejecutarSentencia($sql, $params);
    }
}

<?php
/*
*	Clase para manejar la tabla empleados de la base de datos.
*   Es clase hija de Validator.
*/
class Empleados extends Validator
{
    // Declaración de atributos (propiedades).
    private $idempleado = null;
    private $nombre_empleado = null;
    private $apellido_empleado = null;
    private $dui_empleado = null;
    private $nit_empleado = null;
    private $telefono_empleado = null;
    private $correo_empleado = null;
    private $fecha_nacimiento_empleado = null;
    private $idtipo_empleado = null;
    private $idestado_empleado = null;

    //atributo para el pagination
    private $contador = 0;

    //atributo para la tabla tipo empleado
    private $tipo_empleado = null;

    //atributo para la tabla estado 
    private $estado_empleado = null;

    //atributo para la tabla observaciones
    private $observacion_empleado = null;

    //atributo para la tabla usuario
    private $idestado_usuario = null;

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

    public function setIdEmpleado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idempleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreEmpleado($value)
    {
        if ($this->validateAlphabetic($value, 1, 40)) {
            $this->nombre_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidoEmpleado($value)
    {
        if ($this->validateAlphabetic($value, 1, 40)) {
            $this->apellido_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDuiEmpleado($value)
    {
        if ($this->validarDUI($value)) {
            $this->dui_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNitEmpleado($value)
    {
        if ($this->validarDUI($value)) {
            $this->nit_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefonoEmpleado($value)
    {
        if ($this->validarTelefono($value)) {
            $this->telefono_empleado = $value;
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

    public function setFechaNaEmpleado($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_nacimiento_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdTipoEmpleado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->idtipo_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEstadoEmpleado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->idestado_empleado = $value;
            return true;
        } else {
            return false;
        }
    }
    /*
    * Métodos para validar y asignar valores de los atributos de la tabla observaciones.
    */

    
    public function setObservacionEmpleado($value)
    {
        if ($this->validateString($value,1 ,1000)) {
            $this->observacion_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    * Métodos para validar y asignar valores de los atributos de la tabla usuario.
    */

    public function setIdUsuario($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    
    public function getIdEmpleado()
    {
        return $this->idempleado;
    }

    public function getNombreEmpleado()
    {
        return $this->nombre_empleado;
    }

    public function getApellidoEmpleado()
    {
        return $this->apellido_empleado;
    }

    public function getDuiEmpleado()
    {
        return $this->dui_empleado;
    }
    
    public function getNitEmpleado()
    {
        return $this->nit_empleado;
    }

    public function getTelefonoEmpleado()
    {
        return $this->telefono_empleado;
    }

    public function getCorreoEmpleado()
    {
        return $this->correo_empleado;
    }

    public function getFechaNacimientoEmpleado()
    {
        return $this->fecha_nacimiento_empleado;
    }

    public function getIdTipoEmpleado()
    {
        return $this->idtipo_empleado;
    }

    public function getIdEstadoEmpleado()
    {
        return $this->idestado_empleado;
    }

    /*
    *   Métodos para obtener valores de los atributos de la tablas estado empleado y tipo empleado.
    */

    public function getEstadoEmpleado()
    {
        return $this->estado_empleado;
    }

    public function getTipoEmpleado()
    {
        return $this->tipo_empleado;
    }

    /*
    *   Métodos para obtener valores de los atributos de la tabla observacion.
    */

    public function getObservacionEmpleado()
    {
        return $this->observacion_empleado;
    }

    /*
    *   Métodos para obtener valores de los atributos de la tabla observacion.
    */

    public function getIdUsuario()
    {
        return $this->idestado_usuario;
    }


    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    
    //Buscamos todos los datos
    public function readAll()
    {
        $sql = 'SELECT idempleado, nombre_empleado, apellido_empleado, tipo_empleado, telefono_empleado, correo_empleado, estado_empleado, idestado_empleado
                FROM public.tbempleado
                INNER JOIN tbtipo_empleado using(idtipo_empleado)
                INNER JOIN tbestado_empleado using(idestado_empleado)
                ORDER BY idempleado ASC LIMIT 10 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //buscamos un dato en especifico
    public function readOne()
    {
        $sql = 'SELECT idempleado, nombre_empleado, apellido_empleado, dui_empleado, nit_empleado, telefono_empleado, correo_empleado, fecha_nacimiento_empleado, idtipo_empleado, idestado_empleado
                FROM tbempleado
                Where idempleado = ?';
        $params = array($this->idempleado);
        return Database::obtenerSentencia($sql, $params);
    }

    //funcion para el buscador
    public function searchRows($value)
    {
        $sql = 'SELECT idempleado, nombre_empleado, apellido_empleado, tipo_empleado, telefono_empleado, correo_empleado, estado_empleado, idestado_empleado
                FROM public.tbempleado
                INNER JOIN tbtipo_empleado using(idtipo_empleado)
                INNER JOIN tbestado_empleado using(idestado_empleado)
                WHERE idestado_empleado != 3 AND (nombre_empleado ILIKE ? OR apellido_empleado ILIKE ? OR tipo_empleado ILIKE ? OR CAST(telefono_empleado AS VARCHAR) ILIKE ? OR correo_empleado ILIKE ?)
                ORDER BY idempleado ASC LIMIT 10 OFFSET 0';
        $params = array("%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    //funcion para crear un registro
    public function createEmpleado()
    {
        $sql = 'INSERT INTO tbempleado(nombre_empleado, apellido_empleado, dui_empleado, nit_empleado, telefono_empleado, correo_empleado, fecha_nacimiento_empleado, idtipo_empleado, idestado_empleado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre_empleado, $this->apellido_empleado, $this->dui_empleado, $this->nit_empleado, $this->telefono_empleado, $this->correo_empleado, $this->fecha_nacimiento_empleado, $this->idtipo_empleado, $this->idestado_empleado); 
        return Database::ejecutarSentencia($sql, $params);
    }

    //funcion para actualizar un registro
    public function updateEmpleado()
    {
        $sql = 'UPDATE tbempleado
                SET  nombre_empleado=?, apellido_empleado=?, dui_empleado=?, nit_empleado=?, telefono_empleado=?, correo_empleado=?, fecha_nacimiento_empleado=?, idtipo_empleado=?, idestado_empleado=?
                WHERE idempleado = ?';
        $params = array($this->nombre_empleado, $this->apellido_empleado, $this->dui_empleado, $this->nit_empleado, $this->telefono_empleado, $this->correo_empleado, $this->fecha_nacimiento_empleado, $this->idtipo_empleado, $this->idestado_empleado, $this->idempleado); 
        return Database::ejecutarSentencia($sql, $params);
    }

    //Eliminamos al empleado
    public function deleteEmpleado()
    {
        $sql = 'UPDATE tbempleado set idestado_empleado = 3
                WHERE idempleado = ?';
        $params = array($this->idempleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Encontramos el id del Usuario Empleado para que cuando se cambie el estado
    //del empleado pueda cambiar también el estado de su usuario
    public function searchUsuarioEmpleado(){
        $sql = 'SELECT idusuario_empleado FROM tbusuario_empleado WHERE idempleado = ?';
        $params = array($this->getIdEmpleado());
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->idusuario = $data['idusuario_empleado'];
            return true;
        } else {
            return false;
        }
    }

    //Desactivamos el usuario ligado al empleado deshabilitado
    public function updateUsuarioEmpleadoEliminado(){
        $sql = 'UPDATE tbusuario_empleado SET idestado_usuario = 3 WHERE idusuario_empleado = ?';
        $params = array($this->idusuario);
        return Database::ejecutarSentencia($sql, $params);
    }

    public function updateUsuarioEmpleadoEstado(){
        $sql = 'UPDATE tbusuario_empleado SET idestado_usuario = ? WHERE idusuario_empleado = ?';
        $params = array($this->idestado_empleado, $this->idusuario);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*
    * Métodos para realizar la operacion read de las tablas tipo empleado y estado empleado
    */

    public function readEstado()
    {
        $sql = 'SELECT idestado_empleado, estado_empleado
	            FROM tbestado_empleado
                WHERE idestado_empleado != 3';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    public function readTipoEmpleado()
    {
        $sql = 'SELECT idtipo_empleado, tipo_empleado
                FROM tbtipo_empleado;';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    /*
    * Métodos para realizar la operacion read de las tablas de observaciones
    */

    public function readObservacionPersonal()
    {
        $sql = 'SELECT idobservacion_empleado, observacion_empleado, nombre_empleado, idempleado
                FROM tbobservacion_empleado
                INNER JOIN tbempleado USING(idempleado)
                WHERE idempleado = ?';
        $params = array($this->idempleado);
        return Database::obtenerSentencias($sql, $params);
    }

    public function readObservacionGeneral()
    {
        $sql = 'SELECT idobservacion_empleado, observacion_empleado, nombre_empleado, idempleado
                FROM tbobservacion_empleado
                INNER JOIN tbempleado USING(idempleado)';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    public function createObservacion()
    {
        $sql = 'INSERT INTO tbobservacion_empleado(observacion_empleado, idempleado)
                VALUES (?, ?)';
        $params = array($this->observacion_empleado, $this->idempleado);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para grafica de Vendedores que más vendieron en un mes (pastel) 
    public function graficaUsuarioMes(){
        $sql = 'SELECT nombre_empleado, COUNT(idfactura_pedido) as cantidad
        FROM tbfactura_pedido
        INNER JOIN tbusuario_empleado  USING(idusuario_empleado)
        LEFT JOIN tbempleado ON tbusuario_empleado.idusuario_empleado = tbempleado.idempleado
        WHERE EXTRACT (MONTH FROM fecha_factura) = EXTRACT(MONTH FROM now())
        GROUP BY idusuario_empleado, nombre_empleado, usuario_empleado, tbempleado.idempleado ORDER BY cantidad DESC LIMIT 5';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para grafica de Vendedores que más ingresos generaron en un mes (pastel) 
    public function graficaUsuarioIngresosMes(){
        $sql = 'SELECT nombre_empleado, SUM(monto_total) as cantidad_generada
        FROM tbfactura_pedido
        INNER JOIN tbusuario_empleado  USING(idusuario_empleado)
        LEFT JOIN tbempleado ON tbusuario_empleado.idusuario_empleado = tbempleado.idempleado
        WHERE EXTRACT (MONTH FROM fecha_factura) = EXTRACT(MONTH FROM now())
        GROUP BY idusuario_empleado, nombre_empleado, usuario_empleado, tbempleado.idempleado ORDER BY cantidad_generada DESC LIMIT 5';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
}
<?php

class Observaciones extends Validator
{
    // Declaración de atributos (propiedades).
    private $idobservacion = null;
    private $observacion = null;
    private $fecha_observacion = null;
    private $usuario = null;
    private $tipo_ob = null;
    private $estado_ob = null;
    //Reporte atributos
    private $idempleado = null;
    private $idtipo = null;

    public function setIdobservacion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idobservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setObservacion($value)
    {
        if ($this->validateString($value, 1, 500)) {
            $this->observacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha_observacion($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_observacion = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setUsuario($value)
    {
        if ($this->validateBoolean($value)) {
            $this->usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTipo_ob($value)
    {
        if ($this->validateBoolean($value)) {
            $this->tipo_ob = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEstado_ob($value)
    {
        if ($this->validateBoolean($value)) {
            $this->estado_ob = $value;
            return true;
        } else {
            return false;
        }
    }

    //Set de el atributo a usar del reporte observación empleado
    public function setIdempleado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idempleado = $value;
            return true;
        } else {
            return false;
        }
    }


    //Set de el atributo a usar del reporte observación tipo
    public function setIdTipo($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idtipo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function getIdobservacion()
    {
        return $this->idobservacion;
    }

    public function getObservacion()
    {
        return $this->observacion;
    }

    public function getFecha_observacion()
    {
        return $this->fecha_observacion;
    }

    public function getUsuario()
    {
        return $this->usuario;
    }

    public function getTipo_ob()
    {
        return $this->tipo_ob;
    }

    public function getEstado_ob()
    {
        return $this->estado_ob;
    }

    //Get del atributo a usar en el reporte de observación empleado
    public function getIdempleado()
    {
        return $this->idempleado;
    }

    //Obtenemos valores para mostrarlos en la tabla
    public function readAll()
    {
        $sql = 'SELECT tbo.idobservacion, observacion, fecha_observacion, usuario_empleado, tipo_observacion, 
        estado_observacion, nombre_empleado, apellido_empleado, imagen_empleado, tbo.idtipo_observacion, 
        tbo.idestado_observacion
        FROM tbobservacion tbo
        INNER JOIN tbestado_observacion tbeo
        ON tbo.idestado_observacion = tbeo.idestado_observacion
        INNER JOIN tbtipo_observacion tbtipo
        ON tbo.idtipo_observacion = tbtipo.idtipo_observacion
        INNER JOIN tbusuario_empleado tbu
        ON tbo.idusuario_empleado = tbu.idusuario_empleado
        LEFT JOIN tbempleado tbe
        ON tbu.idempleado = tbe.idempleado
        ORDER BY idobservacion DESC';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para obtener las últimas 2 observaciones
    public function obtenerUltimasObservaciones()
    {
        $sql = "SELECT tbo.idobservacion, to_char(fecha_observacion, 'YYYY-MM-DD') fecha_observacion, nombre_empleado, imagen_empleado
        FROM tbobservacion tbo
        INNER JOIN tbusuario_empleado tbu
        ON tbo.idusuario_empleado = tbu.idusuario_empleado
        LEFT JOIN tbempleado tbe
        ON tbu.idempleado = tbe.idempleado
        ORDER BY idobservacion DESC LIMIT 2";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Busqueda x tipo observacion (accidente, atención al cliente, limpieza, producto agotado y Altercado)
    public function BusquedaxTipo()
    {
        $sql = 'SELECT tbo.idobservacion, observacion, fecha_observacion, usuario_empleado, tipo_observacion, 
        estado_observacion, nombre_empleado, apellido_empleado, imagen_empleado, tbo.idtipo_observacion, tbo.idestado_observacion
        FROM tbobservacion tbo
        INNER JOIN tbestado_observacion tbeo
        ON tbo.idestado_observacion = tbeo.idestado_observacion
        INNER JOIN tbtipo_observacion tbtipo
        ON tbo.idtipo_observacion = tbtipo.idtipo_observacion
        INNER JOIN tbusuario_empleado tbu
        ON tbo.idusuario_empleado = tbu.idusuario_empleado
        LEFT JOIN tbempleado tbe
        ON tbu.idempleado = tbe.idempleado
        WHERE tbtipo.idtipo_observacion = ?
        ORDER BY idobservacion DESC';
        $params = array($this->tipo_ob);
        return Database::obtenerSentencias($sql, $params);
    }
    //Busqueda x tipo observacion (accidente, atención al cliente, limpieza, producto agotado y Altercado)
    public function BusquedaxEstado()
    {
        $sql = '	SELECT tbo.idobservacion, observacion, fecha_observacion, usuario_empleado, tipo_observacion, 
        estado_observacion, nombre_empleado, apellido_empleado, imagen_empleado, tbo.idtipo_observacion, tbo.idestado_observacion
        FROM tbobservacion tbo
        INNER JOIN tbestado_observacion tbeo
        ON tbo.idestado_observacion = tbeo.idestado_observacion
        INNER JOIN tbtipo_observacion tbtipo
        ON tbo.idtipo_observacion = tbtipo.idtipo_observacion
        INNER JOIN tbusuario_empleado tbu
        ON tbo.idusuario_empleado = tbu.idusuario_empleado
        LEFT JOIN tbempleado tbe
        ON tbu.idempleado = tbe.idempleado
        WHERE tbeo.idestado_observacion = ?
        ORDER BY idobservacion DESC';
        $params = array($this->estado_ob);
        return Database::obtenerSentencias($sql, $params);
    }
    //Obtenemos valores para mostrar tipo
    public function readAllTipo()
    {
        $sql = '    SELECT idtipo_observacion, tipo_observacion
                    FROM tbtipo_observacion 
                    ORDER BY idtipo_observacion ASC';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Obtenemos valores para mostrar estado
    public function readAllEstado()
    {
        $sql = '    SELECT idestado_observacion, estado_observacion
                    FROM tbestado_observacion
                    ORDER BY idestado_observacion ASC';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
    //Función para crear una observación
    public function crearObservacion()
    {
        $fecha_actual = date('Y-m-d H:i:s', time());
        $sql = 'INSERT INTO tbobservacion(
                observacion, fecha_observacion, idusuario_empleado, idtipo_observacion, idestado_observacion)
                VALUES (?, ?, ?, ?, ?)';
        $params = array($this->observacion, $fecha_actual, $_SESSION['idusuario_empleado'], $this->tipo_ob, 2);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Obtenemos los tipos de observacion para los SELECTS
    public function obtenerTipoObservacion()
    {
        $sql = 'SELECT idtipo_observacion, tipo_observacion
                FROM public.tbtipo_observacion';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
    //función para buscar valores 
    public function BuscarObservacion($value)
    {
        $sql = 'SELECT tbo.idobservacion, observacion, fecha_observacion, usuario_empleado, tipo_observacion, 
        estado_observacion, nombre_empleado, apellido_empleado, imagen_empleado, tbo.idtipo_observacion, tbo.idestado_observacion
        FROM tbobservacion tbo
        INNER JOIN tbestado_observacion tbeo
        ON tbo.idestado_observacion = tbeo.idestado_observacion
        INNER JOIN tbtipo_observacion tbtipo
        ON tbo.idtipo_observacion = tbtipo.idtipo_observacion
        INNER JOIN tbusuario_empleado tbu
        ON tbo.idusuario_empleado = tbu.idusuario_empleado
        LEFT JOIN tbempleado tbe
        ON tbu.idempleado = tbe.idempleado
        WHERE observacion ILIKE ? OR nombre_empleado ILIKE ? OR apellido_empleado ILIKE ? OR tipo_observacion ILIKE ? 
        OR estado_observacion ILIKE ?
        ORDER BY idobservacion DESC';
        //paramatetros por los cuales se hará la busqueda que en este caso seran solamente son 3 que sera por 
        //la observación(una palabra clave) nombre de empleado y apellido empleado
        $params = array("%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para actualizar el estado de la observación
    public function ModificarEstado()
    {
        $sql = 'UPDATE tbobservacion
            SET idestado_observacion = 1
            WHERE idobservacion=?';
        $params = array($this->idobservacion);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para buscar un campo especifico
    public function readOneObservacion()
    {
        $sql = 'SELECT idobservacion, observacion, fecha_observacion, idusuario_empleado, idtipo_observacion, idestado_observacion
                FROM public.tbobservacion
                WHERE idobservacion= ?';
        $params = array($this->idobservacion);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para buscar un campo especifico en Tipo
    public function readObservacionxTipo()
    {
        $sql = 'SELECT idobservacion, observacion, fecha_observacion, idusuario_empleado, idtipo_observacion, idestado_observacion
                FROM tbobservacion
                WHERE idtipo_observacion = ?';
        $params = array($this->tipo_ob);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para buscar un campo especifico en Estado
    public function readObservacionxEstado()
    {
        $sql = 'SELECT idobservacion, observacion, fecha_observacion, idusuario_empleado, idtipo_observacion, idestado_observacion
                FROM tbobservacion
                WHERE idestado_observacion = ?';
        $params = array($this->estado_ob);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para reporte de observación para empleado
    public function reporteObservacionEmpleado()
    {
        $sql = "SELECT idobservacion_empleado, observacion_empleado, nombre_empleado, idempleado
                FROM tbobservacion_empleado
                INNER JOIN tbempleado USING(idempleado)
                WHERE idempleado = ?";
        $params = array($this->idempleado);
        return Database::obtenerSentencias($sql, $params);
    }

    //----------------------------------*Reportes*//----------------------------------
    //Reporte Observación tipo
    public function reporteObservacionesTipo()
    {
        $sql = 'SELECT idobservacion, observacion, fecha_observacion, tp.usuario_empleado, tf.estado_observacion
        FROM public.tbobservacion tdf
        INNER JOIN tbusuario_empleado tp
        ON tdf.idusuario_empleado = tp.idusuario_empleado
        INNER JOIN tbestado_observacion tf
        ON tdf.idestado_observacion = tf.idestado_observacion
        WHERE tdf.idtipo_observacion = ?
        ORDER BY tdf.idobservacion';
        $params = array($this->idtipo);
        return Database::obtenerSentencias($sql, $params);
    }
}

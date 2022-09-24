<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Reservaciones extends Validator
{
    //Declaramos los parametros que recibiran los valores de la base
    private $idreservacion = null;
    private $nombre_cliente = null;
    private $apellido_cliente = null;
    private $telefono_cliente = null;
    private $correo_cliente = null;
    private $fecha_reservacion = null;
    private $hora_reservacion = null;
    private $idestado_reservacion = 1;
    private $idmesa = null;

    //Reporte
    private $id = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIdReservacion($value)
    {
        //Validamos que los campos sean números naturales arriba de 0
        if ($this->validacionNumeroNaturales($value)) {
            $this->idreservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombreCliente($value)
    {
        //Validamos que los campos sean solo letras
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos que los campos sean solo letras
    public function setApellidoCliente($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->apellido_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos el formato del teléfono ingresado
    public function setTelefonoCliente($value)
    {
        if ($this->validarTelefono($value)) {
            $this->telefono_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos el formato de correo del cliente
    public function setCorreoCliente($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos la fecha que se ha realizado la reservación
    public function setFechaReservacion($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_reservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos la hora que se ha realizado la reservación
    public function setHoraReservacion($value)
    {
        if ($this->validarHora($value)) {
            $this->hora_reservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos el id de las mesas a agregar
    public function setIdMesa($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idmesa = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validamos el id de las mesas a agregar
    public function setIdEstadoR($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_reservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    /*--------------------------------SET Y GET PUBLICO--------------------------------*/
    //Le asignamos el email del contacto
    public function setCorreoContacto($value)
    {
        if ($this->validateEmail($value)) {
            return true;
        } else {
            return false;
        }
    }

    //Validamos el nombre de contacto
    public function setNombreContacto($value)
    {
        if ($this->validateAlphabetic($value, 1, 40)) {
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor del telefono de contacto
    public function setTelefonoContacto($value)
    {
        if ($this->validarTelefono($value)) {
            return true;
        } else {
            return false;
        }
    }

    //Le asignamos el valor del telefono de contacto
    public function setComentario($value)
    {
        if ($this->validateString($value, 10, 1000)) {
            return true;
        } else {
            return false;
        }
    }


    /* Traer los datos de un usuario si el usuario ingresado existe */
    public function obtenerReservaciones()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_actual = date('Y-m-d');
        $sql = 'SELECT idreservacion, nombre_cliente, apellido_cliente, telefono_cliente, fecha_reservacion, idestado_reservacion
        FROM tbreservacion 
        WHERE fecha_reservacion >= ? ORDER BY fecha_reservacion ASC';
        $params = array($fecha_actual);
        return Database::obtenerSentencias($sql, $params);
    }

    //
    public function obtenerMesasReservadas()
    {
        $sql = 'SELECT idmesa FROM tbmesa_reservacion tbmr
        INNER JOIN tbreservacion tbr
        ON tbmr.idreservacion = tbr.idreservacion
        WHERE tbr.fecha_reservacion = ?';
        $params = array(($this->fecha_reservacion . " " . $this->hora_reservacion));
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para cargar una Reservacion
    public function leerUnaReservacion()
    {
        $sql = 'SELECT idreservacion, nombre_cliente, apellido_cliente, telefono_cliente, correo_cliente, fecha_reservacion, idestado_reservacion
        FROM tbreservacion 
        WHERE idreservacion = ?';
        $params = array($this->idreservacion);
        return Database::obtenerSentencia($sql, $params);
    }

    //funcion para el buscador de reservaciones
    public function buscarReservaciones($busqueda)
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_actual = date('Y-m-d');
        $sql = 'SELECT idreservacion, nombre_cliente, apellido_cliente, telefono_cliente, fecha_reservacion, idestado_reservacion
        FROM tbreservacion 
        WHERE fecha_reservacion >= ? AND nombre_cliente ILIKE ? OR apellido_cliente ILIKE ? OR telefono_cliente ILIKE ? OR CAST(fecha_reservacion AS VARCHAR) ILIKE ?
        ORDER BY fecha_reservacion DESC';
        $params = array($fecha_actual, "%$busqueda%", "%$busqueda%", "%$busqueda%", "%$busqueda%");
        return Database::obtenerSentencias($sql, $params);
    }

    //funcion para agregar una reservación
    public function agregarReservacion()
    {
        $sql = 'INSERT INTO tbreservacion(nombre_cliente, apellido_cliente, telefono_cliente, correo_cliente, fecha_reservacion, idestado_reservacion)
        VALUES (?, ?, ?, ?, ?, ?);';
        $params = array($this->nombre_cliente, $this->apellido_cliente, $this->telefono_cliente, $this->correo_cliente, ($this->fecha_reservacion . " " . $this->hora_reservacion), $this->idestado_reservacion);
        return Database::ejecutarSentencia($sql, $params);
    }

    //funcion para actualizar una reservación
    public function actualizarReservacion()
    {
        $sql = 'UPDATE tbreservacion
        SET nombre_cliente=?, apellido_cliente=?, telefono_cliente=?, correo_cliente=?, fecha_reservacion=?, idestado_reservacion=?
        WHERE idreservacion = ?';
        $params = array($this->nombre_cliente, $this->apellido_cliente, $this->telefono_cliente, $this->correo_cliente, ($this->fecha_reservacion . " " . $this->hora_reservacion), $this->idestado_reservacion, $this->idreservacion);
        return Database::ejecutarSentencia($sql, $params);
    }

    //función para obtener el ID de la última reservación creada
    public function obtenerIdUltimaReservacion()
    {
        $sql = 'SELECT idreservacion FROM tbreservacion ORDER BY idreservacion DESC LIMIT 1';
        $params = null;
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->idreservacion = $data['idreservacion'];
            return true;
        } else {
            return false;
        }
    }

    //Función para ligar las mesas a la reservación creada
    public function agregarMesasReservacion()
    {
        $sql = 'INSERT INTO tbmesa_reservacion(idreservacion, idmesa) VALUES (?, ?);';
        $params = array($this->idreservacion, $this->idmesa);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Función para grafica de 12 meses con conteo de reservaciones por mes
    public function cantidadReservacionesMes()
    {
        $sql = "SELECT COUNT(idreservacion) AS cantidad, to_char(fecha_reservacion, 'TMMonth') AS nombre_mes, 
        to_char(fecha_reservacion, 'mm') AS numero_mes 
        FROM tbreservacion
        WHERE to_char(fecha_reservacion,'yy') = to_char(CURRENT_DATE,'yy')
        GROUP BY nombre_mes, numero_mes
        ORDER BY numero_mes";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para grafica de las mesas mas solicitadas 
    public function mesasReservadas()
    {
        $sql = "SELECT COUNT(idmesa) AS cantidad, idmesa AS numero_mesa
                FROM tbmesa_reservacion
                INNER JOIN tbmesa USING(idmesa)
                GROUP BY idmesa 
                ORDER BY cantidad DESC LIMIT 5";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para grafica de fechas
    public function graficaHoras()
    {
        $sql = "SELECT COUNT(idreservacion) AS cantidad, to_char(fecha_reservacion, 'HH24:MI:SS') AS hora_dia
        FROM tbreservacion
        GROUP BY hora_dia
        ORDER BY hora_dia";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Reporte de reservacion
    //Read ALL para estado reservación
    public function readAll()
    {
        $sql = 'SELECT idestado_reservacion, estado_reservacion 
                FROM tbestado_Reservacion';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para las reservaciones por estado
    public function reporteReservaciones()
    {
        $sql = "SELECT nombre_cliente, to_char(fecha_reservacion, 'DD-MM-YYYY') fecha_reservacion, estado_reservacion
                FROM tbreservacion
                INNER JOIN tbestado_reservacion USING(idestado_reservacion)
                WHERE EXTRACT (MONTH FROM fecha_reservacion) = EXTRACT(MONTH FROM now())
                AND idestado_reservacion = ?
                group by nombre_cliente, fecha_reservacion, estado_reservacion
                order by fecha_reservacion DESC";
        $params = array($this->id);
        return Database::obtenerSentencias($sql, $params);
    }
}

<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Estado_reservacion extends Validator
{
    // Declaración de los atributos.
    private $idestadoreservacion = null;
    private $idreservacion = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIdestadoreservacion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestadoreservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdreservacion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idreservacion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos Get

    public function getIdestadoreservacion()
    {
        return $this->idestadoreservacion;
    }

    public function getIdreservacion()
    {
        return $this->idreservacion;
    }

    public function getidingrediente()
    {
        return $this->idingrediente;
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
        $sql = "SELECT nombre_cliente, apellido_cliente, telefono_cliente, to_char(fecha_reservacion, 'DD-MM-YYYY') fecha_reservacion, estado_reservacion
    FROM tbreservacion
    INNER JOIN tbestado_reservacion USING(idestado_reservacion)
    WHERE EXTRACT (MONTH FROM fecha_reservacion) = EXTRACT(MONTH FROM now())
    AND idestado_reservacion = ?
    group by nombre_cliente, apellido_cliente, telefono_cliente, fecha_reservacion, estado_reservacion
    order by fecha_reservacion DESC";
        $params = array($this->idestadoreservacion);
        return Database::obtenerSentencias($sql, $params);
    }
}

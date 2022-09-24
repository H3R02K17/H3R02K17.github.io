<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Eventos extends Validator
{
    // Declaración de los atributos.
    private $nombre_evento = null;
    private $descripcion = null;
    private $fecha_evento = null;
    private $hora_evento = null;
    private $idestado_evento = 1;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setNombreEvento($value)
    {
        if ($this->validateAlphabetic($value, 1, 20)) {
            $this->nombre_evento = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if ($this->validateString($value, 10, 400)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_evento = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setHora($value)
    {
        if ($this->validarHora($value)) {
            $this->hora_evento = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEstado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_evento = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos Get
    public function getNombreEvento()
    {
        return $this->nombre_evento;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getFecha()
    {
        return $this->fecha_evento;
    }

    public function getEstado()
    {
        return $this->idestado_evento;
    }

    //Método para traer todos los eventos creados
    public function readAll(){
        $sql = 'SELECT * FROM tbevento';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Metodos para reporte de producto mas vendido con descuento
    public function agregarEvento()
    {
        $sql = 'INSERT INTO tbevento(nombre_evento, descripcion, fecha_evento, idestado_evento)
            VALUES (?, ?, ?, ?)';
        $params = array($this->nombre_evento, $this->descripcion, 
        ($this->fecha_evento . " " . $this->hora_evento), $this->idestado_evento);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Actualizar los estados de los eventos pasados
    public function actualizarEventosPasados()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d');
        $sql = 'UPDATE tbevento
        SET idestado_evento = 2
        WHERE fecha_evento < ?';
        $params = array($fecha_hora_actual);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Actualizar los estados de los eventos actuales
    public function actualizarEventosActuales()
    {
        //Crearemos los valores de hora actual
        date_default_timezone_set('America/El_Salvador');
        $fecha_hora_actual = date('Y-m-d');
        $ayer = date('Y-m-d', strtotime($fecha_hora_actual . "- 1 days"));
        $manana = date('Y-m-d', strtotime($fecha_hora_actual . "+ 1 days"));
        $sql = 'UPDATE tbevento
        SET idestado_evento = 3
        WHERE fecha_evento BETWEEN ? AND ?';
        $params = array($ayer, $manana);
        return Database::ejecutarSentencia($sql, $params);
    }
}
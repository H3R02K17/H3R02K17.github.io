<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Alergenos extends Validator
{
    // Declaración de los atributos de la tabala tipo alergeno
    private $idtipo_alergeno = null;
    private $tipo_alergeno = null;
    // Declaración de los atributos de la tabala alergenos
    private $idalergeno = null;
    private $idingrediente = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIdTipoAlerg($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idtipo_alergeno = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setIdAlerg($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idalergeno = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setIdIngre($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el proveedor sea letras*/
    public function setNombreTipo($value)
    {
        if ($this->validateString($value, 1, 100)) {
            $this->tipo_alergeno = $value;
            return true;
        } else {
            return false;
        }
    }
    //-----------------------------Metodos------------------------------

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getIdTipoAlerg()
    {
        return $this->idtipo_alergeno;
    }

    public function getIdAlerg()
    {
        return $this->idalergeno;
    }

    public function getIdIngre()
    {
        return $this->idingrediente;
    }


    public function getNombreTipo()
    {
        return $this->tipo_alergeno;
    }

    /* Trae los datos para mostrarlos en la tabla */
    public function readAll()
    {
        $sql = 'SELECT idproveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor
                    FROM tbproveedor	
                    ORDER BY idproveedor ASC LIMIT 10 OFFSET 0';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion del buscador
    public function buscador($value)
    {
        $sql = 'SELECT idproveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor
                    FROM tbproveedor
                    WHERE nombre_proveedor ILIKE ? OR direccion_proveedor ILIKE ? OR telefono_proveedor ILIKE ?
                    ORDER BY idproveedor ASC LIMIT 10 OFFSET 0';
        $params = array("%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para insertar datos
    public function crearProveedor()
    {
        $sql = 'INSERT INTO tbproveedor(
                    nombre_proveedor, direccion_proveedor, telefono_proveedor)
                    VALUES (?, ?, ?)';
        $params = array($this->nombre_proveedor, $this->direccion_proveedor, $this->telefono_proveedor);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion Para actualizar datos
    public function actualizarProveedor()
    {
        $sql = 'UPDATE tbproveedor
                    SET nombre_proveedor=?, direccion_proveedor=?, telefono_proveedor=?
                    WHERE idproveedor=?';
        $params = array($this->nombre_proveedor, $this->direccion_proveedor, $this->telefono_proveedor, $this->idproveedor);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para leer un campo en especifico
    public function readOne()
    {
        $sql = 'SELECT idproveedor, nombre_proveedor, direccion_proveedor, telefono_proveedor
                    FROM tbproveedor
                    WHERE  idproveedor = ?';
        $params = array($this->idproveedor);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para eliminar un registro
    public function eliminarProveedor()
    {
        $sql = 'DELETE FROM tbproveedor
                    WHERE idproveedor = ?';
        $params = array($this->idproveedor);
        return Database::ejecutarSentencia($sql, $params);
    }
}

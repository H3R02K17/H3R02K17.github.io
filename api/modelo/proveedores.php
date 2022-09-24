<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Proveedor extends Validator
{
    // Declaración de los atributos.
    private $idproveedor = null;
    private $nombre_proveedor = null;
    private $direccion_proveedor = null;
    private $telefono_proveedor = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setidproveedor($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproveedor = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que el proveedor sea letras*/
    public function setnombre_proveedor($value)
    {
        if ($this->validateString($value, 1, 100)) {
            $this->nombre_proveedor = $value;
            return true;
        } else {
            return false;
        }
    }

    //Direccion con letras y numeros
    public function setdireccion_proveedor($value)
    {
        if ($this->validateDireccion($value, 1, 1000)) {
            $this->direccion_proveedor = $value;
            return true;
        } else {
            return false;
        }
    } 

    //Telefono de proveedor
    public function settelefono_proveedor($value)
    {
        if ($this->validarTelefono($value)) {
            $this->telefono_proveedor = $value;
            return true;
        } else {
            return false;
        }
    }

    //-----------------------------Metodos------------------------------

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getidproveedor()
    {
        return $this->idproveedor;
    }

    public function getnombre_proveedor()
    {
        return $this->nombre_proveedor;
    }

    public function getdireccion_proveedor()
    {
        return $this->direccion_proveedor;
    }

    public function gettelefono_proveedor()
    {
        return $this->telefono_proveedor;
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
        $params = array($this->nombre_proveedor, $this->direccion_proveedor,$this->telefono_proveedor ,$this->idproveedor); 
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
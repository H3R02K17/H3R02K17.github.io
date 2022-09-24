<?php
/*
*	Clase para manejar la tabla empleados de la base de datos.
*   Es clase hija de Validator.
*/
class Inventario extends Validator
{
    /*
     * Declaracion de atributos
     */
    private $idingrediente = null;
    private $ingrediente = null;
    private $existencia_ingrediente = null;
    private $fecha_caducidad = null;
    private $precio_ingrediente = null;
    private $idproveedor = null;
    private $idcategoria_ingrediente = null;
    private $idestado_ingrediente = null;

    //atributos para las llaves foreneas
    private $categoria_ingrediente = null;
    private $estado_ingrediente = null;
    private $nombre_proveedor = null;
    //atributo para el pagination
    private $contador = 0;

    // Método para validar y asignar valor al contador 

    public function setContador($value)
    {
        if ($this->validacionNumeroNaturalesConCero($value)) {
            $this->contador = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */

    public function setIdIngrediente($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIngrediente($value)
    {
        if ($this->validateAlphabetic($value, 1, 200)) {
            $this->ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setExistencias($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->existencia_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFechaCa($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_caducidad = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio($value)
    {
        if ($this->validarDinero($value)) {
            $this->precio_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para validar y asignar valores de los atributos de las tablas foraneas.
    */

    public function setIdProveedor($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproveedor = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdCategoria($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idcategoria_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdEstado($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }


    public function getIdIngrediente()
    {
        return $this->idingrediente;
    }

    public function getIngrediente()
    {
        return $this->ingrediente;
    }

    public function getExistencias()
    {
        return $this->existencia_ingrediente;
    }

    public function getFechaCa()
    {
        return $this->fecha_caducidad;
    }
    
    public function getPrecio()
    {
        return $this->precio_ingrediente;
    }

    public function getIdProveedor()
    {
        return $this->idproveedor;
    }

    public function getIdCategoria()
    {
        return $this->idcategoria_ingrediente;
    }

    public function getIdEstado()
    {
        return $this->idestado_ingrediente;
    }

    public function getProveedor()
    {
        return $this->nombre_proveedor;
    }

    public function getCategoria()
    {
        return $this->categoria_ingrediente;
    }

    public function getEstado()
    {
        return $this->estado_ingrediente;
    }

    
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    //Buscamos todos los datos
    public function readAll()
    {
        $sql = 'SELECT idingrediente, ingrediente, existencia_ingrediente, fecha_caducidad, nombre_proveedor, precio_ingrediente, categoria_ingrediente, estado_ingrediente, idestado_ingrediente
                FROM tbingrediente
                INNER JOIN tbproveedor USING(idproveedor)
                INNER JOIN tbcategoria_ingrediente USING(idcategoria_ingrediente)
                INNER JOIN tbestado_ingrediente USING(idestado_ingrediente)
                WHERE idestado_ingrediente != 3
                ORDER BY idingrediente ASC LIMIT 10 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT idingrediente, ingrediente, existencia_ingrediente, fecha_caducidad, precio_ingrediente, idproveedor, idcategoria_ingrediente, idestado_ingrediente
                FROM tbingrediente
                WHERE idingrediente = ?';
        $params = array($this->idingrediente);
        return Database::obtenerSentencia($sql, $params);
    }

    //funcion para el buscador
    public function searchRows($value)
    {
        $sql = 'SELECT idingrediente, ingrediente, existencia_ingrediente, fecha_caducidad, nombre_proveedor, precio_ingrediente, categoria_ingrediente, estado_ingrediente, idestado_ingrediente
                FROM tbingrediente
                INNER JOIN tbproveedor USING(idproveedor)
                INNER JOIN tbcategoria_ingrediente USING(idcategoria_ingrediente)
                INNER JOIN tbestado_ingrediente USING(idestado_ingrediente)
                WHERE idestado_ingrediente != 3 AND ingrediente ILIKE ? OR CAST(existencia_ingrediente AS VARCHAR) ILIKE ? OR nombre_proveedor ILIKE ? OR CAST(precio_ingrediente AS VARCHAR) ILIKE ? OR estado_ingrediente ILIKE ? OR categoria_ingrediente ILIKE ?
                ORDER BY idingrediente ASC LIMIT 10 OFFSET 0';
        $params = array("%$value%", "%$value%", "%$value%", "%$value%", "%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    public function createIngre()
    {
        $sql = 'INSERT INTO public.tbingrediente(ingrediente, existencia_ingrediente, fecha_caducidad, precio_ingrediente, idproveedor, idcategoria_ingrediente, idestado_ingrediente)
                VALUES (?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->ingrediente, $this->existencia_ingrediente ,$this->fecha_caducidad ,$this->precio_ingrediente ,$this->idproveedor ,$this->idcategoria_ingrediente ,$this->idestado_ingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    public function updateIngre()
    {
        $sql = 'UPDATE tbingrediente
                SET  ingrediente=?, existencia_ingrediente=?, fecha_caducidad=?, precio_ingrediente=?, idproveedor=?, idcategoria_ingrediente=?, idestado_ingrediente=?
                WHERE idingrediente = ?';
        $params = array($this->ingrediente, $this->existencia_ingrediente ,$this->fecha_caducidad ,$this->precio_ingrediente ,$this->idproveedor ,$this->idcategoria_ingrediente ,$this->idestado_ingrediente, $this->idingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    public function deleteIngre()
    {
        $sql = 'UPDATE tbingrediente 
                SET idestado_ingrediente = 3
                WHERE idingrediente = ?';
        $params = array($this->idingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    /*
    * Métodos para realizar la operacion read de las tablas tipo empleado y estado empleado
    */

    public function readEstado()
    {
        $sql = 'SELECT idestado_ingrediente, estado_ingrediente
	            FROM tbestado_ingrediente
                WHERE idestado_ingrediente != 3';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    public function readProveedor()
    {
        $sql = 'SELECT idproveedor, nombre_proveedor
                FROM tbproveedor';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    public function readCategoria()
    {
        $sql = 'SELECT idcategoria_ingrediente, categoria_ingrediente
                FROM tbcategoria_ingrediente';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
    
    //Función unica para reporte 
    public function readAllReporte()
    {
        $sql = 'SELECT idingrediente, ingrediente, existencia_ingrediente, fecha_caducidad, nombre_proveedor, precio_ingrediente, categoria_ingrediente, estado_ingrediente, idestado_ingrediente
                FROM tbingrediente
                INNER JOIN tbproveedor USING(idproveedor)
                INNER JOIN tbcategoria_ingrediente USING(idcategoria_ingrediente)
                INNER JOIN tbestado_ingrediente USING(idestado_ingrediente)';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
/*----------------------------------------------------------REPORTES----------------------------------------------------------*/
public function reporteIngredientesCantidad()
{
    $sql = 'SELECT idingrediente, ingrediente, existencia_ingrediente
    FROM public.tbingrediente
    ORDER BY idingrediente';
    $params = null;
    return Database::obtenerSentencias($sql, $params);
}
}

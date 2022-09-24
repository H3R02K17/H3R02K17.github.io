<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Ingrediente extends Validator
{
    // Declaración de los atributos.
    private $idproducto_ingrediente = null;
    private $idproducto = null;
    private $idingrediente = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIdproducto_ingrediente($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproducto_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdproducto($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproducto = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdingrediente($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos Get

    public function getidproducto_ingrediente()
    {
        return $this->idproducto_ingrediente;
    }

    public function getidproducto()
    {
        return $this->idproducto;
    }

    public function getidingrediente()
    {
        return $this->idingrediente;
    }

    //Metodos 

    //Metodo Read All
    public function readAll()
    {
        $sql = 'SELECT idproducto_ingrediente, idproducto, idingrediente
                FROM tbproducto_ingrediente';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para traer los ingredientes de cada producto
    public function reporteIngrediente()
    {
        $sql = 'SELECT nombre_producto, ingrediente
                FROM tbproducto_ingrediente
                INNER JOIN tbproducto using (idproducto)
                INNER JOIN tbingrediente using (idingrediente)
                WHERE idproducto = ?
                GROUP BY nombre_producto, ingrediente
                ORDER BY nombre_producto';
        $params = array($this->idingrediente);
        return Database::obtenerSentencias($sql, $params);
    }
}
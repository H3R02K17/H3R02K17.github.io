<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Detalle extends Validator
{
    // Declaración de los atributos.
    private $iddetalle_factura = null;
    private $precio_actual = null;
    private $cantidad_descuento = null;
    private $cantidad_producto = null;
    private $idfactura_pedido = null;
    private $idproducto = null;
    private $idestado_preparacion = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setIddetalle_factura($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->iddetalle_factura = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio_actual($value)
    {
        if ($this->validarDinero($value)) {
            $this->precio_actual = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCantidad_descuento($value)
    {
        if ($this->validacionPorcentaje($value)) {
            $this->cantidad_descuento = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCantidad_producto($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->cantidad_producto = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdfactura_pedido($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idfactura_pedido = $value;
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

    public function setIdestado_preparacion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idestado_preparacion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos Get

    public function getiddetalle_factura()
    {
        return $this->iddetalle_factura;
    }

    public function getprecio_actual()
    {
        return $this->precio_actual;
    }

    public function getcantidad_descuento()
    {
        return $this->cantidad_descuento;
    }

    public function getcantidad_producto()
    {
        return $this->cantidad_producto;
    }

    public function getidfactura_pedido()
    {
        return $this->idfactura_pedido;
    }

    public function getidproducto()
    {
        return $this->idproducto;
    }

    public function getidestado_preparacion()
    {
        return $this->idestado_preparacion;
    }

    //Metodos 

    //Metodos para reporte de producto mas vendido con descuento
    public function ProductoDescuento()
    {
        $sql = 'SELECT idproducto, nombre_producto, SUM (COALESCE(cantidad_descuento)) as total_descuento, SUM(monto_total) as monto_total, COUNT(idproducto) as contador
        FROM tbdetalle_factura
        INNER JOIN tbfactura_pedido using (idfactura_pedido)
        INNER JOIN tbproducto using(idproducto)
        WHERE idestado_preparacion = 1 AND cantidad_descuento !=0.00
        GROUP BY  idproducto, nombre_producto
        ORDER BY total_descuento DESC';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
}
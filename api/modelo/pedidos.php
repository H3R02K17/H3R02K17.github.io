<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Pedidos extends Validator
{
    //Declaración de atributos (propiedades) 
    private $pedidos_actuales = null;
    private $monto_total_diario = null;
    private $monto_total_ayer = null;
    private $monto_total_anteayer = null;
    private $monto_total_mensual = null;
    // Atributos para la generación de Reporte
    private $fecha_inicio_report = null;
    private $fecha_fin_report = null;
    private $opcion = null;
    private $tipo = null;
    private $tipo_frase = null;

    public function getPedidosActuales()
    {
        return $this->pedidos_actuales;
    }

    public function getMontoTotal()
    {
        return $this->monto_total_diario;
    }

    public function getMontoTotalAyer()
    {
        return $this->monto_total_ayer;
    }

    public function getMontoTotalAnteayer()
    {
        return $this->monto_total_anteayer;
    }

    public function getMontoTotalMensual()
    {
        return $this->monto_total_mensual;
    }

    public function getTipo()
    {
        return $this->tipo;
    }

    public function getOpcion()
    {
        return $this->opcion;
    }

    public function getOpcionFrase()
    {
        return $this->tipo_frase;
    }

    /*Funciones para setar las fechas que son necesarias para los reportes*/

    public function setFecha_inicio_report($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_inicio_report = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha_fin_report($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_fin_report = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTipo($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->tipo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setOpcion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->opcion = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Traer el total de pedidos realizados el día actual */
    public function totalPedidosActuales($fecha_actual)
    {
        $sql = 'SELECT COALESCE(COUNT(idfactura_pedido),0) as pedidos_realizados_hoy
        FROM tbfactura_pedido
        WHERE fecha_factura = ?;';
        $params = array($fecha_actual);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->pedidos_actuales = $data['pedidos_realizados_hoy'];
            return true;
        } else {
            return false;
        }
    }

    /*Traer el total de pedidos realizados el día actual */
    public function montoTotalDiaActual($fecha_actual)
    {
        $sql = 'SELECT COALESCE(SUM(monto_total),0) as total_ventas_dia
        FROM tbfactura_pedido 
        WHERE fecha_factura = ?;';
        $params = array($fecha_actual);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->monto_total_diario = $data['total_ventas_dia'];
            return true;
        } else {
            return false;
        }
    }

    /*Traer el total de pedidos realizados el día de ayer */
    public function montoTotalAyer($ayer)
    {
        $sql = 'SELECT COALESCE(SUM(monto_total),0) as total_ventas_ayer
            FROM tbfactura_pedido 
            WHERE fecha_factura = ?;';
        $params = array($ayer);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->monto_total_ayer = $data['total_ventas_ayer'];
            return true;
        } else {
            return false;
        }
    }

    /*Traer el total de pedidos realizados el día de anteayer */
    public function montoTotalAnteAyer($anteayer)
    {
        $sql = 'SELECT COALESCE(SUM(monto_total),0) as total_ventas_anteayer
                FROM tbfactura_pedido 
                WHERE fecha_factura = ?;';
        $params = array($anteayer);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->monto_total_anteayer = $data['total_ventas_anteayer'];
            return true;
        } else {
            return false;
        }
    }

    /*Traer el total de pedidos realizados el día actual */
    public function montoTotalMesActual()
    {
        $sql = "SELECT COALESCE(SUM(monto_total),0) as total_ventas_mensual
        FROM tbfactura_pedido
        WHERE fecha_factura BETWEEN (select date_trunc('month',current_date)) AND now();";
        $params = null;
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->monto_total_mensual = $data['total_ventas_mensual'];
            return true;
        } else {
            return false;
        }
    }

    //Traer los 10 últimos pedidos para mostrar en el dashboard del privado
    public function pedidosRecientes()
    {
        $sql = 'SELECT tdf.iddetalle_factura, tp.nombre_producto, tdf.cantidad_producto, tdf.cantidad_descuento, 
        tfp.monto_total
        FROM tbdetalle_factura tdf
        INNER JOIN tbfactura_pedido tfp
        ON tdf.idfactura_pedido = tfp.idfactura_pedido
        INNER JOIN tbproducto tp
        ON tdf.idproducto = tp.idproducto
        ORDER BY iddetalle_factura DESC LIMIT 10';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    /*------------------------------------------------Reportes----------------------------------------------*/
    //Funcion para generar el reporte de ingresos por historial
    public function reportePedidos()
    {
        $sql = "SELECT idfactura_pedido, TO_CHAR(fecha_factura, 'DD/MM/yyyy') AS fecha_factura, monto_total, tipo_pago
                FROM tbfactura_pedido
                INNER JOIN tbtipo_pago USING(idtipo_pago)
                WHERE fecha_factura BETWEEN ? AND ?
                ORDER BY fecha_factura ASC";
        $params = array($this->fecha_inicio_report, $this->fecha_fin_report);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para seleccionar el filtro elegido y luego mandarle el id elegido
    public function filtroProductosVendidos()
    {
        switch ($this->getTipo()) {
            case 1:
                $this->tipo_frase = 'la categoria de: ';
                $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto, 
                SUM(monto_total) monto_total
                FROM tbdetalle_factura tdf
                INNER JOIN tbproducto tp
                ON tdf.idproducto = tp.idproducto
                INNER JOIN tbfactura_pedido tf
                ON tf.idfactura_pedido = tdf.idfactura_pedido
                WHERE idestado_preparacion = 1 AND tp.idcategoria_producto = ?
                GROUP BY tp.idproducto
                ORDER BY idproducto ASC';
                $params = array($this->opcion);
                return Database::obtenerSentencias($sql, $params);
            break;
            case 2:
                $this->tipo_frase = 'el proveedor: ';
                $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,
                SUM(monto_total) monto_total
                FROM tbdetalle_factura tdf
                INNER JOIN tbproducto tp
                ON tdf.idproducto = tp.idproducto
                INNER JOIN tbfactura_pedido tf
                ON tf.idfactura_pedido = tdf.idfactura_pedido
                INNER JOIN tbproducto_ingrediente tpi
                ON tp.idproducto = tpi.idproducto
                INNER JOIN tbingrediente ti
                ON tpi.idingrediente = ti.idingrediente
                WHERE idestado_preparacion = 1 AND ti.idproveedor = ?
                GROUP BY tp.idproducto
                ORDER BY monto_total DESC';
                $params = array($this->opcion);
                return Database::obtenerSentencias($sql, $params);
            break;
            case 3:
                $this->tipo_frase = 'el empleado: ';
                $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,
                SUM(monto_total) monto_total
                FROM tbdetalle_factura tdf
                INNER JOIN tbproducto tp
                ON tdf.idproducto = tp.idproducto
                INNER JOIN tbfactura_pedido tf
                ON tf.idfactura_pedido = tdf.idfactura_pedido
                WHERE idestado_preparacion = 1 AND tf.idusuario_empleado = ?
                GROUP BY tp.idproducto
                ORDER BY monto_total DESC';
                $params = array($this->opcion);
                return Database::obtenerSentencias($sql, $params);
            break;
        }
    }
}


<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class RegistroInventario extends Validator
{
    //Declaramos las variables a utilizar para ingresar en la base
    private $idinventario = null;
    private $cantidad = null;
    private $precio_unitario = null;
    private $fecha_entrega = null;
    private $idingrediente = null;
    private $cantidad_anterior = null;
    // Atributos para la generación de Reporte
    private $fecha_inicio_report = null;
    private $fecha_fin_report = null;
    //atributo para buscar las fechas para el reporte de ingresos por historial
    private $fecha_reporte = null;    
    //atributo para el pagination
    private $contador = 0;

    //Le asignamos un valor para el pagination
    public function setContador($value)
    {
        if ($this->validacionNumeroNaturalesConCero($value)) {
            $this->contador = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validar el ID del inventario para modificar
    public function setIdInventario($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idinventario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validar si la cantidad es mayor a 0 y no es decimal
    public function setCantidad($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validar si el formato es de tipo decimal
    public function setPrecioUnitario($value)
    {
        if ($this->validarDinero($value)) {
            $this->precio_unitario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validar si el formato es de tipo fecha
    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_entrega = $value;
            return true;
        } else {
            return false;
        }
    }

    //Validar el valor del select de ingrediente
    public function setIdIngrediente($value)
    {
        if ($this->validateBoolean($value)) {
            $this->idingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    /* Método para asignar el valor para la consulta para generar el reporte de ingresos por historial
    */
    //Validar si el formato es de tipo fecha
    public function setFechaReporte($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_reporte = $value;
            return true;
        } else {
            return false;
        }
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

    //Función para cargar los ingredientes en select
    public function leerIngredientes()
    {
        $sql = 'SELECT idingrediente, ingrediente FROM tbingrediente ORDER BY ingrediente;';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para cargar los ingredientes en select
    public function leerIngredientesBuscador($buscador)
    {
        $sql = 'SELECT idingrediente, ingrediente FROM tbingrediente WHERE ingrediente ILIKE ? ORDER BY ingrediente;';
        $params = array("%$buscador%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para cargar los datos existentes en el inventario
    public function obtenerInventario()
    {
        $sql = 'SELECT tin.idinventario, ti.ingrediente, tin.cantidad, tin.fecha_entrega, tin.precio_unitario, 
        tin.idusuario_empleado, tu.usuario_empleado
        FROM tbinventario tin
        INNER JOIN tbingrediente ti
        ON tin.idingrediente = ti.idingrediente
        INNER JOIN tbusuario_empleado tu
        ON tin.idusuario_empleado = tu.idusuario_empleado
        ORDER BY idinventario DESC LIMIT 5 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para cargar los datos existentes en el inventario
    public function buscarInventario($buscador)
    {
        $sql = 'SELECT tin.idinventario, ti.ingrediente, tin.cantidad, tin.fecha_entrega, tin.precio_unitario, 
        tin.idusuario_empleado, tu.usuario_empleado
        FROM tbinventario tin
        INNER JOIN tbingrediente ti
        ON tin.idingrediente = ti.idingrediente
        INNER JOIN tbusuario_empleado tu
        ON tin.idusuario_empleado = tu.idusuario_empleado
        WHERE ti.ingrediente ILIKE ? OR CAST(tin.fecha_entrega AS VARCHAR) ILIKE ? OR tu.usuario_empleado ILIKE ?
        ORDER BY idinventario DESC LIMIT 5 OFFSET 0';
        $params = array("%$buscador%", "%$buscador%", "%$buscador%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para agregar los valores al inventario
    public function agregarInventario()
    {
        date_default_timezone_set('America/El_Salvador');
        $hora = date('H:i:s', time());
        $sql = 'INSERT INTO tbinventario(cantidad, precio_unitario, fecha_entrega, idingrediente, idusuario_empleado)
            VALUES (?, ?, ?, ?, ?);';
        $params = array($this->cantidad, $this->precio_unitario, $this->fecha_entrega . " " . $hora, 
        $this->idingrediente, $_SESSION['idusuario_empleado']);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Función para modificar los valores al inventario
    public function modificarInventario()
    {
        date_default_timezone_set('America/El_Salvador');
        $hora = date('H:i:s', time());
        $sql = 'UPDATE tbinventario
        SET cantidad = ?, precio_unitario = ?, fecha_entrega = ?, idingrediente = ?
        WHERE idinventario=?';
        $params = array($this->cantidad, $this->precio_unitario, $this->fecha_entrega . " " . $hora, 
        $this->idingrediente, $this->idinventario);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Función para traer las existencias del ingrediente para luego actualizarlas
    public function traerExistencias()
    {
        $sql = 'SELECT existencia_ingrediente FROM tbingrediente WHERE idingrediente = ?';
        $params = array($this->idingrediente);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->cantidad_anterior = $data['existencia_ingrediente'];
            return true;
        }
        else{
            return false;
        }
    }

    //Función para actualizar los ingredientes según lo ingresado en el inventario
    public function actualizarIngrediente()
    {
        $sql = 'UPDATE tbingrediente SET existencia_ingrediente = ?, precio_ingrediente=?, idestado_ingrediente = ?
        WHERE idingrediente = ?';
        $params = array(($this->cantidad + $this->cantidad_anterior), $this->precio_unitario, 1, $this->idingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para generar el reporte de ingresos por historial
    public function reporteIngresosHistorial()
    {
        $sql = "SELECT idinventario, cantidad, TO_CHAR(fecha_entrega, 'DD/MM/yyyy') AS fecha_entrega, ingrediente
                FROM tbinventario
                INNER JOIN tbingrediente USING(idingrediente)
                where fecha_entrega = ?
                ORDER BY fecha_entrega ASC";
        $params = array($this->fecha_reporte);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para generar el reporte de ingresos por ingrediente
    public function reporteIngresosIngrediente()
    {
        $sql = 'SELECT idinventario, cantidad, CAST(fecha_entrega AS DATE), usuario_empleado
                FROM tbinventario
                INNER JOIN tbingrediente USING(idingrediente)
                INNER JOIN tbusuario_empleado USING(idusuario_empleado)
                WHERE idingrediente = ?
                ORDER BY fecha_entrega ASC';
        $params = array($this->idingrediente);
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para buscar las fechas para el reporte de ingresoso por historial
    public function buscadorFechasReporteIngresosHistorial()
    {
        $sql = 'SELECT CAST(fecha_entrega AS date)
            FROM tbinventario
            GROUP BY fecha_entrega';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }


    //Funcion para generar el reporte de ingresos por historial en un rango de fechas
    public function reporteIngresosHistorialFechas()
    {
        $sql = "SELECT idinventario, cantidad, TO_CHAR(fecha_entrega, 'DD/MM/yyyy') AS fecha_entrega, ingrediente
                FROM tbinventario
                INNER JOIN tbingrediente USING(idingrediente)
                WHERE fecha_entrega BETWEEN ? AND ?
                ORDER BY fecha_entrega ASC";
        $params = array($this->fecha_inicio_report, $this->fecha_fin_report);
        return Database::obtenerSentencias($sql, $params);
    }
}

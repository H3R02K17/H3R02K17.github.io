<?php

class Productos extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombre = null;
    private $descripcion = null;
    private $existencias = null;
    private $descuento = null;
    private $precio = null;
    private $estado = null;
    private $categoria = null;
    private $imagen = null;
    private $ingredientes = null;
    private $idingrediente = null;
    private $idproducto_ingrediente = null;
    private $link = '../images/productos/';
    private $idcategoria = null;
    private $idproducto = null;
    // Parametro para el pagination
    private $contador = 0;
    // Parametros de las gráficas
    private $filtro = null;
    private $opcion = null;
    // Parametros de las gráficas de inventario
    private $fechainicio = null;
    private $fechafinal = null;
    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setContador($value)
    {
        if ($this->validacionNumeroNaturalesConCero($value)) {
            $this->contador = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setId($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->id = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombre($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if ($this->validateString($value, 1, 500)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setExistencias($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->existencias = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescuento($value)
    {
        if ($this->validacionPorcentaje($value)) {
            $this->descuento = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio($value)
    {
        if ($this->validarDinero($value)) {
            $this->precio = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEstado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCategoria($value)
    {
        if ($this->validateBoolean($value)) {
            $this->categoria = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setBuscador($value)
    {
        if ($this->validateString($value, 1, 35)) {
            $this->buscador = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 2000, 2000)) {
            $this->imagen = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    public function setIngredientes($value)
    {
        if ($this->validateAlphabetic($value, 1, 75)) {
            $this->ingredientes = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdIngrediente($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdproducto_ingrediente($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproducto_ingrediente = $value;
            return true;
        } else {
            return false;
        }
    }

    // Set que guardará el filtro elegido
    public function setFiltro($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->filtro = $value;
            return true;
        } else {
            return false;
        }
    }

    // Set que guardará el id de la opción seleccionada
    public function setOpcion($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->opcion = $value;
            return true;
        } else {
            return false;
        }
    }
    //Le asignamos un valor a fecha inicial
    public function setFechaIncio($value)
    {
        if ($this->fechainicio = $value) {
            return true;
        } else {
            return false;
        }
    }


    //Le asignamos un valor a la fecha final
    public function setFechaFinal($value)
    {
        if ($this->fechafinal = $value) {
            return true;
        } else {
            return false;
        }
    }

    // Set que guardará el id de la categoria seleccionada
    public function setIdCategoria($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idcategoria = $value;
            return true;
        } else {
            return false;
        }
    }

    //Set que guardará el id del producto del detalle
    public function setIdProducto($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idproducto = $value;
            return true;
        } else {
            return false;
        }
    }

    public function getId()
    {
        return $this->id;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getExistencias()
    {
        return $this->existencias;
    }

    public function getDescuentos()
    {
        return $this->descuento;
    }

    public function getIngredientes()
    {
        return $this->ingredientes;
    }

    public function getPrecio()
    {
        return $this->precio;
    }

    public function getLink()
    {
        return $this->link;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getIdIngrediente()
    {
        return $this->idingrediente;
    }

    public function getIdproducto_ingrediente()
    {
        return $this->idproducto_ingrediente;
    }

    //Obtener el filtro elegido
    public function getFiltro()
    {
        return $this->filtro;
    }
    //grafica fecha incio y fecha final get
    public function getFechaInicio()
    {
        return $this->fechainicio;
    }

    public function getFechafinal()
    {
        return $this->fechafinal;
    }

    //Obtenemos valores para mostrarlos en la tabla
    public function readAll()
    {
        $sql = 'SELECT tp.idproducto, tp.imagen_principal, tp.nombre_producto, tep.estado_producto, tcp.categoria_producto, 
        tp.descripcion, tp.existencias, tp.porcentaje_descuento, tp.precio_producto
            FROM tbproducto tp
            INNER JOIN tbestado_producto tep
            ON tp.idestado_producto = tep.idestado_producto
            INNER JOIN tbcategoria_producto tcp
            ON tp.idcategoria_producto = tcp.idcategoria_producto
            ORDER BY idproducto ASC LIMIT 9 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para crear un producto
    public function crearProducto()
    {
        $sql = 'INSERT INTO public.tbproducto(
            nombre_producto, descripcion, existencias, porcentaje_descuento, precio_producto, imagen_principal, 
            idestado_producto, idcategoria_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            $this->nombre, $this->descripcion, $this->existencias, $this->descuento, $this->precio,
            $this->imagen, 1,  $this->categoria
        );
        return Database::ejecutarSentencia($sql, $params);
    }

    //Obtener los ingredientes divididos por categoria
    public function cargarIngrediente()
    {
        $sql = 'SELECT i.idingrediente, i.ingrediente, ci.categoria_ingrediente
        FROM tbcategoria_ingrediente ci, tbingrediente i
        WHERE i.idcategoria_ingrediente = ci.idcategoria_ingrediente ORDER BY ci.idcategoria_ingrediente';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //función para buscar productos 
    public function BuscarProducto($value)
    {
        $sql = 'SELECT tp.idproducto, tp.imagen_principal, tp.nombre_producto, tep.estado_producto, tcp.categoria_producto, 
        tp.descripcion, tp.existencias, tp.porcentaje_descuento, tp.precio_producto
            FROM tbproducto tp
            INNER JOIN tbestado_producto tep
            ON tp.idestado_producto = tep.idestado_producto
            INNER JOIN tbcategoria_producto tcp
            ON tp.idcategoria_producto = tcp.idcategoria_producto
            WHERE nombre_producto ILIKE ? OR categoria_producto ILIKE ?
            ORDER BY idproducto ASC';
        //paramatetros por los cuales se hará la busqueda que en este caso seran solamente 2 que sera por nombre y la categoria
        $params = array("%$value%", "%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Obtenemos el estado de productos para los selects
    public function obtenerEstadoProducto()
    {
        $sql = 'SELECT idestado_producto, estado_producto
            FROM tbestado_producto';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Obtenemos las categorias de los productos para los selects
    public function obtenerCategoriaProducto()
    {
        $sql = 'SELECT idcategoria_producto, categoria_producto
                FROM tbcategoria_producto';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para buscar un campo especifico
    public function readOne()
    {
        $sql = 'SELECT idproducto, nombre_producto, descripcion, existencias, porcentaje_descuento, precio_producto, 
        imagen_principal, idestado_producto, idcategoria_producto
                    FROM public.tbproducto
                    WHERE idproducto = ?';
        $params = array($this->id);
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $_SESSION['idproducto'] = $data['idproducto'];
            return Database::obtenerSentencia($sql, $params);
        } else {
            return false;
        }
    }

    //Funcion para actualizar campos a la tabla
    public function actualizarProducto($current_image)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getLink(), $current_image) : $this->imagen = $current_image;
        $sql = 'UPDATE tbproducto
                    SET nombre_producto=?, descripcion=?, existencias=?, porcentaje_descuento=?, precio_producto=?, 
                    imagen_principal=?, idestado_producto=?, idcategoria_producto=?
                    WHERE idproducto=?';
        $params = array(
            $this->nombre, $this->descripcion, $this->existencias, $this->descuento, $this->precio,
            $this->imagen, $this->estado,  $this->categoria, $this->id
        );
        return Database::ejecutarSentencia($sql, $params);
    }

    //Función para eliminar campos en la tabla productos
    public function EliminarProductos()
    {
        $sql = 'DELETE FROM tbproducto
                    WHERE idproducto=?';
        $params = array($this->id);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Consulta para Obtener los ingredientes por producto
    public function cargarIngredienteporProducto()
    {
        $sql = 'SELECT tpi.idproducto_ingrediente, ti.idingrediente, ti.ingrediente, ci.categoria_ingrediente, ti.existencia_ingrediente
                FROM tbproducto_ingrediente tpi
                INNER JOIN tbingrediente ti
                ON tpi.idingrediente = ti.idingrediente
                LEFT JOIN tbcategoria_ingrediente ci 
                ON  ti.idcategoria_ingrediente = ci.idcategoria_ingrediente
                INNER JOIN tbproducto tp
                ON tpi.idproducto = tp.idproducto
                WHERE ti.idcategoria_ingrediente = ci.idcategoria_ingrediente 
                AND tpi.idproducto = ?';
        $params = array($this->id);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para crear ingredientes

    public function crearIngrediente()
    {
        $sql = 'INSERT INTO public.tbproducto_ingrediente(
                idproducto, idingrediente)
                VALUES (?, ?)';
        $params = array($_SESSION['idproducto'], $this->idproducto_ingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para buscar un campo especifico
    public function readOneIngrediente()
    {
        $sql = 'SELECT idproducto_ingrediente, idproducto, idingrediente
                    FROM public.tbproducto_ingrediente
                    WHERE idproducto_ingrediente = ?';
        $params = array($this->idproducto_ingrediente);
        return Database::obtenerSentencia($sql, $params);
    }

    //Función para eliminar campos en la tabla productos
    public function Eliminaringredientes()
    {
        $sql = 'DELETE FROM public.tbproducto_ingrediente
                    WHERE idproducto_ingrediente = ?';
        $params = array($this->idproducto_ingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }


    //Obtenemos el ingredientes que no esten en un producto para agregarlos a los selects
    public function ObtenerIngredientes()
    {
        $sql = 'SELECT idingrediente, ingrediente
                    FROM tbingrediente
                    WHERE idingrediente NOT IN (SELECT idingrediente FROM tbproducto_ingrediente WHERE idproducto = ?)';
        $params =  array($_SESSION['idproducto']);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para crear ingredientes x el producto deseado

    public function crearIngredientexProducto()
    {
        $sql = 'INSERT INTO public.tbproducto_ingrediente(
                idproducto, idingrediente)
                VALUES (?, ?)';
        $params = array($this->id, $this->idingrediente);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Caso para obtener el ultimo id del producto y poder hacer un insert en la tabla intermediaria que es 
    //producto_ingrediente que enlazara ingrediente a producto
    public function obtenerUltimoIdProducto()
    {
        $sql = 'SELECT idproducto FROM tbproducto ORDER BY idproducto DESC LIMIT 1';
        $params = null;
        if ($data = Database::obtenerSentencia($sql, $params)) {
            $this->id = $data['idproducto'];
            return true;
        } else {
            return false;
        }
    }

    /*----------------------------------------------------------GRÁFICAS---------------------------------------------------------- */
    //Función para seleccionar el filtro elegido y luego mandarle el id elegido
    public function filtroProductosVendidos()
    {
        switch ($this->getFiltro()) {
            case 1:
                $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
                FROM tbdetalle_factura tdf
                INNER JOIN tbproducto tp
                ON tdf.idproducto = tp.idproducto
                INNER JOIN tbfactura_pedido tf
                ON tf.idfactura_pedido = tdf.idfactura_pedido
                WHERE idestado_preparacion = 1 AND tp.idcategoria_producto = ?
                GROUP BY tp.idproducto
                ORDER BY idproducto ASC LIMIT 10';
                $params = array($this->opcion);
                return Database::obtenerSentencias($sql, $params);
                break;
            case 2:
                $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
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
                ORDER BY monto_total DESC LIMIT 10';
                $params = array($this->opcion);
                return Database::obtenerSentencias($sql, $params);
                break;
        }
    }

    //Grafico de barras para ver Inventario en un rango de fechas mediante grafico de barras
    public function obtenerInventarioRango()
    {
        $sql = "SELECT to_char(fecha_entrega, 'DD-MM-YYYY') fecha_entregas, count(fecha_entrega) as fecha_cantidades, SUM(cantidad) as cantidad from
        tbinventario where fecha_entrega BETWEEN ? AND ?
        group by fecha_entregas
        ORDER BY fecha_cantidades DESC LIMIT 10";
        $params = array($this->fechainicio, $this->fechafinal);
        return Database::obtenerSentencias($sql, $params);
    }

    /*----------------------------------------------------------REPORTES----------------------------------------------------------*/
    //Función para traer los datos de las ganancias
    public function reporteVentasRecaudacion()
    {
        $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
        FROM tbdetalle_factura tdf
        INNER JOIN tbproducto tp
        ON tdf.idproducto = tp.idproducto
        INNER JOIN tbfactura_pedido tf
        ON tf.idfactura_pedido = tdf.idfactura_pedido
        WHERE idestado_preparacion = 1
        GROUP BY tp.idproducto
        ORDER BY idproducto ASC';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para traer los ingredientes de cada producto
    public function reporteIngrediente()
    {
        $sql = 'SELECT nombre_producto, ingrediente, existencia_ingrediente
        FROM tbproducto_ingrediente
        INNER JOIN tbproducto using (idproducto)
        INNER JOIN tbingrediente using (idingrediente)
        WHERE idproducto = ?
        GROUP BY nombre_producto, ingrediente, existencia_ingrediente
        ORDER BY nombre_producto';
        $params = array($this->id);
        return Database::obtenerSentencias($sql, $params);
    }

    public function obtenerProductoI()
    {
        $sql = 'SELECT tp.idproducto, tp.imagen_principal, tp.nombre_producto, tep.estado_producto, tcp.categoria_producto, 
        tp.descripcion, tp.existencias, tp.porcentaje_descuento, tp.precio_producto
        FROM tbproducto tp
        INNER JOIN tbestado_producto tep
        ON tp.idestado_producto = tep.idestado_producto
        INNER JOIN tbcategoria_producto tcp
        ON tp.idcategoria_producto = tcp.idcategoria_producto';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Reporte Ventas por fecha tipo: Día
    public function openReporteProductosVD()
    {
        date_default_timezone_set('America/El_Salvador');
        $date = date('Y-m-d');
        $sql = 'SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
        FROM tbdetalle_factura tdf
        INNER JOIN tbproducto tp
        ON tdf.idproducto = tp.idproducto
        INNER JOIN tbfactura_pedido tf
        ON tf.idfactura_pedido = tdf.idfactura_pedido
        WHERE idestado_preparacion = 1 AND tf.fecha_factura = ?
        GROUP BY tp.idproducto
		ORDER BY idproducto ASC';
        $params = array($date);
        return Database::obtenerSentencias($sql, $params);
    }

    //Reporte Ventas por fecha tipo: Mes
    public function openReporteProductosVM()
    {
        date_default_timezone_set('America/El_Salvador');
        $sql = "SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
        FROM tbdetalle_factura tdf
        INNER JOIN tbproducto tp
        ON tdf.idproducto = tp.idproducto
        INNER JOIN tbfactura_pedido tf
        ON tf.idfactura_pedido = tdf.idfactura_pedido
        WHERE idestado_preparacion = 1 AND to_char(tf.fecha_factura,'mm') = to_char(CURRENT_DATE,'mm')
        GROUP BY tp.idproducto
        ORDER BY idproducto ASC";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    //Reporte Ventas por fecha tipo: Año
    public function openReporteProductosVA()
    {
        date_default_timezone_set('America/El_Salvador');
        $sql = "SELECT tp.idproducto, nombre_producto, SUM(cantidad_producto) cantidad_producto,SUM(monto_total) monto_total
        FROM tbdetalle_factura tdf
        INNER JOIN tbproducto tp
        ON tdf.idproducto = tp.idproducto
        INNER JOIN tbfactura_pedido tf
        ON tf.idfactura_pedido = tdf.idfactura_pedido
        WHERE idestado_preparacion = 1 AND to_char(tf.fecha_factura,'yy') = to_char(CURRENT_DATE,'yy')
        GROUP BY tp.idproducto
        ORDER BY idproducto ASC";
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }

    /*----------------------------------------------------------PÚBLICO----------------------------------------------------------  */
    //Productos con más dinero recaudado
    public function productosFavoritos()
    {
        $sql = 'SELECT tp.idproducto, tp.nombre_producto, tp.porcentaje_descuento, tp.precio_producto, tp.imagen_principal, 
            SUM(monto_total) as monto_total
            FROM public.tbproducto tp
            INNER JOIN tbdetalle_factura tdf
            ON tdf.idproducto = tp.idproducto
            INNER JOIN tbfactura_pedido tf
            ON tdf.idfactura_pedido = tf.idfactura_pedido
            WHERE existencias > 0 and idestado_producto = 1
            GROUP BY tp.idproducto, tp.nombre_producto, tp.porcentaje_descuento, tp.precio_producto, tp.imagen_principal
            ORDER BY monto_total DESC LIMIT 8';
        $params = NULL;
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para leer los productos de una categoria
    public function readProductosCategoria()
    {
        $sql = 'SELECT tp.idproducto, tp.nombre_producto, tp.porcentaje_descuento, tp.precio_producto, tp.imagen_principal
        FROM public.tbproducto tp
        WHERE tp.existencias > 0 AND tp.idestado_producto = 1 AND idcategoria_producto = ?
        ORDER BY idproducto ASC LIMIT 8 OFFSET ?';
        $params = array($this->idcategoria, $this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función para cargar los datos de un producto
    public function leerUnProducto()
    {
        $sql = 'SELECT tp.idproducto, tp.nombre_producto, tp.descripcion, tp.porcentaje_descuento, tp.precio_producto, 
        tp.imagen_principal, tp.idestado_producto, tbep.estado_producto
        FROM tbproducto tp
        INNER JOIN tbestado_producto tbep
        ON tp.idestado_producto = tbep.idestado_producto
        WHERE idproducto = ?';
        $params = array($this->idproducto);
        return Database::obtenerSentencia($sql, $params);
    }

    //Función para cargar los ingredientes de un producto
    public function cargarIngredientesProducto()
    {
        $sql = 'SELECT ingrediente, idproducto, tbpi.idingrediente
        FROM tbproducto_ingrediente tbpi
        INNER JOIN tbingrediente tbi
        ON tbi.idingrediente = tbpi.idingrediente
        WHERE idproducto = ?';
        $params = array($this->idproducto);
        return Database::obtenerSentencias($sql, $params);
    }

    //Función de contador de productos para el pagination
    public function contadorProductos()
    {
        $sql = 'SELECT COUNT(tp.idproducto) AS cantidad_productos
        FROM tbproducto tp
        WHERE tp.existencias > 0 AND tp.idestado_producto = 1 AND idcategoria_producto = ?';
        $params = array($this->idcategoria);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para leer productos con descuenos.
    public function productoDescuentoLeer()
    {
        $sql = 'SELECT tp.idproducto, tp.nombre_producto, tp.porcentaje_descuento, tp.precio_producto, tp.imagen_principal
        FROM public.tbproducto tp
        WHERE tp.existencias > 0 AND tp.idestado_producto = 1 AND porcentaje_descuento >= 0.1  
        ORDER BY idproducto ASC LIMIT 8 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion contador promocion
    public function contadorProductosPromocion()
    {
        $sql = 'SELECT COUNT(tp.idproducto) AS cantidad_productos
        FROM tbproducto tp
        WHERE tp.existencias > 0 AND tp.idestado_producto = 1 AND porcentaje_descuento >= 0.1';
        $params = null;
        return Database::obtenerSentencia($sql, $params);
    }

    //Función para traer los productos de una categoria y que contienen ciertos alergenos
    public function obtenerProductosAlergenos($array_tipos)
    {
        $tipo_alergenos = "";
        //Variable para saber si ya se agrego el primer tipo o en caso solo haya uno
        $primer_valor = 1;
        foreach ($array_tipos as $value) {
            if ($primer_valor == 0) {
                //Guardamos en la variable los productos que tienen alergenos y que usaremos en la busqueda
                $tipo_alergenos .= " OR ta.idtipo_alergeno IN(" . strval($value) . ")";
            } else {
                $tipo_alergenos = " ta.idtipo_alergeno IN(" . strval($value) . ")";
                $primer_valor = 0;
            }
        }
        $sql = 'SELECT DISTINCT ON (tp.idproducto) tp.idproducto, tp.nombre_producto FROM tbproducto tp
        WHERE tp.idcategoria_producto = ? and tp.idproducto NOT IN 
        (SELECT DISTINCT ON (tp.idproducto) tp.idproducto FROM tbproducto tp
        INNER JOIN tbproducto_ingrediente tpi
        ON tpi.idproducto = tp.idproducto
        INNER JOIN tbingrediente ti
        ON ti.idingrediente = tpi.idingrediente
        INNER JOIN tbalergeno ta
        ON ta.idingrediente = ti.idingrediente
        INNER JOIN tbtipo_alergeno tta
        ON ta.idtipo_alergeno = tta.idtipo_alergeno
        WHERE' . $tipo_alergenos . ')
        ORDER BY tp.idproducto ASC';
        $params = array($this->idcategoria);
        return Database::obtenerSentencias($sql, $params);
    }
}

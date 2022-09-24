<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Categoria extends Validator
{
    // Declaración de los atributos.
    private $idcategoria_producto = null;
    private $categoria_producto = null;
    private $imagen_categoria_producto = null;
    private $ruta_img = '../images/categoria/';
    // Parametro para el pagination
    private $contador = 0;

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

    public function setidcategoria_producto($value)
    {
        if ($this->validacionNumeroNaturales($value)) {
            $this->idcategoria_producto = $value;
            return true;
        } else {
            return false;
        }
    }

    /*Validar que la categoria sean letras*/
    public function setcategoria_producto($value)
    {
        if ($this->validateAlphabetic($value, 1, 25)) {
            $this->categoria_producto = $value;
            return true;
        } else {
            return false;
        }
    }


    //Le asignamos una imagen
    public function setimagen_categoria_producto($file)
    {
        if ($this->validateImages($file, 2000, 2000)) {
            $this->imagen_categoria_producto = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    //-----------------------------Metodos------------------------------

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getidcategoria_producto()
    {
        return $this->idcategoria_producto;
    }

    public function getcategoria_producto()
    {
        return $this->categoria_producto;
    }

    public function getimagen_categoria_producto()
    {
        return $this->imagen_categoria_producto;
    }

    public function getruta_img()
    {
        return $this->ruta_img;
    }

    /* Trae los datos para mostrarlos en la tabla */
    public function readAll()
    {
        $sql = 'SELECT idcategoria_producto, categoria_producto, imagen_categoria_producto
                FROM tbcategoria_producto
                ORDER BY idcategoria_producto ASC LIMIT 10 OFFSET ?';
        $params = array($this->contador);
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion del buscador
    public function buscador($value)
    {
        $sql = 'SELECT idcategoria_producto, categoria_producto, imagen_categoria_producto
                FROM tbcategoria_producto
                WHERE categoria_producto ILIKE ?
                ORDER BY idcategoria_producto ASC LIMIT 10 OFFSET 0';
        $params = array("%$value%");
        return Database::obtenerSentencias($sql, $params);
    }

    //Funcion para insertar datos
    public function crearCategoria()
    {
        $sql = 'INSERT INTO public.tbcategoria_producto(
                    categoria_producto, imagen_categoria_producto)
                    VALUES (?, ?)';
        $params = array($this->categoria_producto, $this->imagen_categoria_producto);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion Para actualizar datos
    public function actualizarCategoria($current_image)
    {
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen_categoria_producto) ? $this->deleteFile($this->getruta_img(), $current_image) : $this->imagen_categoria_producto = $current_image;
        $sql = 'UPDATE tbcategoria_producto
                    SET categoria_producto=?, imagen_categoria_producto=?
                    WHERE idcategoria_producto = ?';
        $params = array($this->categoria_producto, $this->imagen_categoria_producto, $this->idcategoria_producto);
        return Database::ejecutarSentencia($sql, $params);
    }

    //Funcion para leer un campo en especifico
    public function readOne()
    {
        $sql = 'SELECT idcategoria_producto, categoria_producto, imagen_categoria_producto
                    FROM tbcategoria_producto
                    WHERE idcategoria_producto = ?';
        $params = array($this->idcategoria_producto);
        return Database::obtenerSentencia($sql, $params);
    }

    //Funcion para eliminar un registro
    public function eliminarCategoria()
    {
        $sql = 'DELETE FROM tbcategoria_producto
                    WHERE idcategoria_producto = ?';
        $params = array($this->idcategoria_producto);
        return Database::ejecutarSentencia($sql, $params);
    }

    /* -------------------------------------PÚBLICO-------------------------------------*/
    /* Trae los datos de categoria para mostrarlos en el sitio público */
    public function cargarCategorias()
    {
        $sql = 'SELECT idcategoria_producto, categoria_producto, imagen_categoria_producto
                FROM tbcategoria_producto
                ORDER BY idcategoria_producto';
        $params = null;
        return Database::obtenerSentencias($sql, $params);
    }
}

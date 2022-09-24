<?php
if (isset($_GET['tipo']) && isset($_GET['opcion']) && isset($_GET['frase']) && isset($_GET['opcion_texto'])) {
    //Se crean las variables para recibir las fechas
    $tipo = $_GET['tipo'];
    $opcion = $_GET['opcion'];
    $frase = $_GET['frase'];
    $opcion_texto = $_GET['opcion_texto'];

    require('../../conexion/dashboard_report.php');
    require('../../modelo/pedidos.php');

    $pdf = new Report;
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Pedidos Vendidos por su ' . $frase, 
    'El reporte muestra los pedidos completados clasificados según su ' . $frase);
    // Se instancia el módelo de Productos para procesar los datos.
    $pedidos = new Pedidos;
    //se setean las variables para la consulta
    $pedidos->setTipo($tipo) && $pedidos->setOpcion($opcion);
    // Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
    if ($datapedidos = $pedidos->filtroProductosVendidos()) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(76, 7, 10);
        // Se establece un color para el texto de los encabezados.
        $pdf->SetTextColor(255, 255, 255);
        // Se establece un color para el borde de las celdas de los encabezados.
        $pdf->SetDrawColor(255, 255, 255);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Helvetica', 'B', 10);
        //Se imprimen las fechas en las que se solicito el reporte
        $pdf->cell(185, 10, utf8_decode('Reporte clasificado según ' . $pedidos->getOpcionFrase() . $opcion_texto), 1, 1, 'C', 1);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(15, 10, utf8_decode('ID'), 1, 0, 'C', 1);
        $pdf->cell(90, 10, utf8_decode('Nombre del Producto'), 1, 0, 'C', 1);
        $pdf->cell(45, 10, utf8_decode('Cantidad Vendida'), 1, 0, 'C', 1);
        $pdf->cell(35, 10, utf8_decode('Monto Total'), 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Helvetica', '', 9);
        // Se establece el color de la fuente para los datos de los productos.
        $pdf->SetTextColor(74, 31, 14);
        // Contador para aumentar por cada fila
        $contador = 0;
        // Se recorren los registros ($dataProductos) fila por fila ($rowProducto).
        foreach ($datapedidos as $rowpedidos) {
            if ($contador % 2 == 0) {
                // Se establece un color de relleno para las celdas pares que se imprimen.
                $pdf->setFillColor(255, 255, 255, 255);
            } else {
                // Se establece un color de relleno para las celdas impares que se imprimen.
                $pdf->setFillColor(249, 236, 208);
            }
            // Aumentamos el valor del contador
            $contador++;
            $pdf->cell(15, 10, $rowpedidos['idproducto'], 1, 0, 'C', 1);
            $pdf->cell(90, 10, utf8_decode($rowpedidos['nombre_producto']), 1, 0, 'C', 1);
            $pdf->cell(45, 10, $rowpedidos['cantidad_producto'], 1, 0, 'C', 1);
            $pdf->cell(35, 10, '$' . $rowpedidos['monto_total'], 1, 1, 'C', 1);
        }
    } else {
        $pdf->cell(0, 10, utf8_decode('No hay pedidos registrados'), 1, 1);
    }
    // Se envía el documento al navegador y se llama al método footer()
    $pdf->output('I', 'pedidos_historial.pdf');
} else {
    header('location: ../../../vistas/privado/reportes.html');
}

<?php
require('../../conexion/dashboard_report.php');
require('../../modelo/productos.php');

// Se inica el reporte
$pdf = new Report;
//Establecemos la zona horaria de El Salvador
date_default_timezone_set('America/El_Salvador');
//Obtenemos el año actual
$anio_actual = date('Y');
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Productos vendidos y monto recaudado en el año ' . $anio_actual, 
'El reporte muestra los productos y las ganancias recaudadas en sus ventas durante un año');
// Se instancia el módelo de Productos para procesar los datos.
$productosdia = new Productos;
// Se verifica si existen registros (productos) para mostrar, de lo contrario se imprime un mensaje.
if ($dataProductosVA = $productosdia->openReporteProductosVA()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(76, 7, 10);
    // Se establece un color para el texto de los encabezados.
    $pdf->SetTextColor(255, 255, 255);
    // Se establece un color para el borde de las celdas de los encabezados.
    $pdf->SetDrawColor(255, 255, 255);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Helvetica', 'B', 10);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(25, 10, utf8_decode('ID'), 1, 0, 'C', 1);
    $pdf->cell(90, 10, utf8_decode('Nombre del Producto'), 1, 0, 'C', 1);
    $pdf->cell(35, 10, utf8_decode('Cantidad Vendida'), 1, 0, 'C', 1);
    $pdf->cell(35, 10, utf8_decode('Monto Total'), 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Helvetica', '', 9);
    // Se establece el color de la fuente para los datos de los productos.
    $pdf->SetTextColor(74, 31, 14);
    // Contador para aumentar por cada fila
    $contador = 0;
    // Se recorren los registros ($dataProductosVA) fila por fila ($rowProducto).
    foreach ($dataProductosVA as $rowProducto) {
        if ($contador % 2 == 0) {
            // Se establece un color de relleno para las celdas pares que se imprimen.
            $pdf->setFillColor(255, 255, 255, 255);
        } else {
            // Se establece un color de relleno para las celdas impares que se imprimen.
            $pdf->setFillColor(249, 236, 208);
        }
        // Aumentamos el valor del contador
        $contador ++;
        $pdf->cell(25, 10, $rowProducto['idproducto'], 1, 0, 'C', 1);
        $pdf->cell(90, 10, utf8_decode($rowProducto['nombre_producto']), 1, 0, 'C', 1);
        $pdf->cell(35, 10, $rowProducto['cantidad_producto'], 1, 0, 'C', 1);
        $pdf->cell(35, 10, '$' . $rowProducto['monto_total'], 1, 1, 'C', 1);
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay productos vendidos'), 1, 1);
}
// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'productos_vendidos_dia.pdf');;
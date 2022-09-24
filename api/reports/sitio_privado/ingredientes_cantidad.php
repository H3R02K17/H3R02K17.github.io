<?php
require('../../conexion/dashboard_report.php');
require('../../modelo/administrar_inventario.php');

$pdf = new Report;
// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Ingredientes y su cantidad', 
'El reporte muestra los ingredientes y la cantidad de existencias que hay de ellos.');
// Se instancia el módelo de Inventario para procesar los datos.
$ingrediente = new Inventario;
// Se verifica si existen registros (inventario) para mostrar, de lo contrario se imprime un mensaje.
if ($dataIngredientesC = $ingrediente->reporteIngredientesCantidad()) {
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
    $pdf->cell(125, 10, utf8_decode('Nombre del ingrediente'), 1, 0, 'C', 1);
    $pdf->cell(35, 10, utf8_decode('Cantidad'), 1, 1, 'C', 1);
     // Se establece la fuente para los datos del inventario.
    $pdf->setFont('Helvetica', '', 9);
     // Se establece el color de la fuente para los datos del inventario.
    $pdf->SetTextColor(74, 31, 14);
     // Contador para aumentar por cada fila
    $contador = 0;

       // Se recorren los registros ($dataIngredientesC) fila por fila ($rowIngrediente).
    foreach ($dataIngredientesC as $rowIngrediente) {
        if ($contador % 2 == 0) {
            // Se establece un color de relleno para las celdas pares que se imprimen.
            $pdf->setFillColor(255, 255, 255, 255);
        } else {
            // Se establece un color de relleno para las celdas impares que se imprimen.
            $pdf->setFillColor(249, 236, 208);
        }
        // Aumentamos el valor del contador
        $contador ++;
        $pdf->cell(25, 10, $rowIngrediente['idingrediente'], 1, 0, 'C', 1);
        $pdf->cell(125, 10, utf8_decode($rowIngrediente['ingrediente']), 1, 0, 'C', 1);
        $pdf->cell(35, 10, $rowIngrediente['existencia_ingrediente'], 1, 1, 'C', 1);
    }
} else {
    $pdf->cell(0, 10, utf8_decode('No hay ingredientes'), 1, 1);
}
// Se envía el documento al navegador y se llama al método footer()
$pdf->output('I', 'ingredientes_cantidad.pdf');;
<?php
require('fpdf.php');

class Index
{
    public function GetData()
    {
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(40, 10, 'Hello World!');
        $pdf->Output();
    }
}

$index = new Index();

$index->GetData();
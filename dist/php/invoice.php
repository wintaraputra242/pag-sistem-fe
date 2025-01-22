<?php
require('fpdf/fpdf.php');

$image1 = "logo.png";

// $nama_office = 'RS. Bakti Bangsa';
// $no_invoice = 'ISN-1120225211';
// $bulan = 'Januari';
// $tahun = '2023';
// $sub_total = '20000';
// $payment_fee = '5000';
// $komisi_fee = '0';
// $additional_fee = '0';
// $total = '20000';
// $tax = '0';

$nama_office = addslashes($_POST['nama_office']);
$no_invoice = addslashes($_POST['no_invoice']);
$bulan = addslashes($_POST['bulan']);
$tahun = addslashes($_POST['tahun']);
$sub_total = addslashes($_POST['sub_total']); //harga gabungan total + payment fee
$payment_fee = addslashes($_POST['payment_fee']);
$komisi_fee = addslashes($_POST['komisi_fee']);
$additional_fee = addslashes($_POST['additional_fee']);
$total = addslashes($_POST['total']);
$tax = addslashes($_POST['tax']);

$tgl = date('d-m-Y');
$list_bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
$grand_total = $sub_total - $payment_fee - $komisi_fee - $additional_fee;
$grand_total_after_tax = $grand_total-$tax;

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial', 'B', 12);
// $pdf->Cell(80,20, '', 0 ,0, 'C');
// $pdf->Cell(50, 40, $pdf->Image($image1, $pdf->GetX(), $pdf->GetY(), 20.78), 0, 0, 'R', false );
// $pdf->Ln(); // Berpindah baris
// $pdf->Cell(190,7, 'Laporan Laba Rugi Sederhana', 0 ,0, 'C');

$pdf->Cell(190, 7, $pdf->Image($image1, $pdf->GetX(), $pdf->GetY(), 20.78), 0, 0, 'L', false );
$pdf->Ln(15); // Berpindah baris

$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(0, 10, 'PT. Inovasi Solusi Nusantara', 0, 1, 'L');
$pdf->SetFont('Arial', '', 10);
$pdf->Cell(0, 1, 'Jl. Merdeka No 45', 0, 1, 'L');
$pdf->Cell(0, 7, 'Denpasar - Bali, 80235', 0, 1, 'L');
$pdf->Cell(0, 2, '(0361) 265521', 0, 1, 'L');
$pdf->Ln(10);

$pdf->SetFont('Arial', 'B', 14);
$pdf->setFillColor(0,255,255);
$pdf->Cell(0, 5, '', 0 ,1, 'C', TRUE);
$pdf->Cell(0, 5, 'INVOICE #'.$no_invoice, 0 ,1, 'C', TRUE);
$pdf->SetFont('Arial', 'I', 11);
$pdf->Cell(0, 5, 'Bulan '.$bulan, 0, 1, 'C', TRUE);
$pdf->Cell(0, 5, 'Tahun '.$tahun, 0, 1, 'C', TRUE);
$pdf->Cell(0, 4, '', 0, 1, 'C', TRUE);

$pdf->Ln(); // Berpindah baris
$pdf->Ln(); // Berpindah baris
$pdf->SetFont('Arial', 'B', 11);
$pdf->Cell(0, 5, 'Invoice Kepada : '.$nama_office, 0, 1, 'L');

$pdf->setFillColor(255,255,255);
$pdf->SetFont('Arial', '', 11);
$pdf->MultiCell(190, 5, 'Kepada Partner Kami yang terhormat, terima kasih atas kerjasama yang telah terjalin selama 1 bulan ini untuk menghadirkan solusi layanan terbaik disertai dengan metode pembayaran terintegrasi kepada konsumen Anda. Izinkan kami memberikan laporan terkait proses transaksi yang telah terjadi pada akun Anda. Kami berharap kerjasama yang baik ini dapat terus berlanjut pada bulan-bulan berikutnya.', 0, 1, 'L', FALSE);

$pdf->Ln(); // Berpindah baris
$pdf->SetFont('Arial', 'B', 10);
$pdf->setFillColor(211,211,211);
$pdf->Cell(130,7,'Deskripsi',1,0,'C', TRUE);
$pdf->Cell(60,7,'Total',1,0,'C', TRUE);

$pdf->Ln(); // Berpindah baris
$pdf->SetFont('Arial', '', 11);
$pdf->Cell(130,7,'Total Transaction + Payment Fee' ,1,0,'L');
$pdf->Cell(60,7,'Rp. '.number_format($sub_total, 0, ',', '.'),1,0,'C');

$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Payment Fee' ,1,0,'L');
$pdf->Cell(60,7,'(Rp. '.number_format($payment_fee, 0, ',', '.').')',1,0,'C');

$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Success Fee (20%)' ,1,0,'L');
$pdf->Cell(60,7,'(Rp. '.number_format($komisi_fee, 0, ',', '.').')',1,0,'C');

$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Additional Charge' ,1,0,'L');
$pdf->Cell(60,7,'(Rp. '.number_format($additional_fee, 0, ',', '.').')',1,0,'C');


$pdf->SetFont('Arial', 'B', 11);
$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Sub Total' ,1,0,'R', TRUE);
$pdf->Cell(60,7,'Rp. '.number_format($grand_total, 0, ',', '.'),1,0,'C', TRUE);

$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Tax' ,1,0,'R', TRUE);
$pdf->Cell(60,7,'Rp. '.number_format($tax, 0, ',', '.'),1,0,'C', TRUE);

$pdf->Ln(); // Berpindah baris
$pdf->Cell(130,7,'Grand Total' ,1,0,'R', TRUE);
$pdf->Cell(60,7,'Rp. '.number_format($grand_total_after_tax, 0, ',', '.'),1,0,'C', TRUE);

$pdf->Ln(); // Berpindah baris
$pdf->Ln(); // Berpindah baris
$pdf->Ln(); // Berpindah baris

$pdf->SetFont('Arial', '', 11);
$pdf->Cell(0, 5, 'Demikian invoice yang kami terbitkan agar bisa dipergunakan sebagaimana mesti nya.', 0, 1, 'C');
$pdf->Cell(0, 5, 'Atas kerjasama yang telah terjalin kami ucapkan Terima Kasih', 0, 1, 'C');

$pdf->Ln(); // Berpindah baris
$pdf->SetFont('Arial', 'I', 10);
$pdf->Cell(0, 5, 'Dicetak : '.$tgl, 0, 1, 'C');




// $pdf->Output();
$pdf->Output('D','INVOICE_#'.$no_invoice.'.pdf');
?>

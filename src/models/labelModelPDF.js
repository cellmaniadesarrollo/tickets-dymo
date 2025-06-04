const { exec } = require('child_process');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path'); 

const labelModelPDF = {};

 

labelModelPDF.printLabel = async (producto = { nombre: 'Producto', sku: '12345', precio: 99.99 }) => {
   try {
      // 1. Generar PDF temporal con nombre fijo
      const pdfPath = path.join(__dirname, 'etiqueta.pdf');
      fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

      const pdfStream = fs.createWriteStream(pdfPath);
      pdfStream.on('error', (err) => {
         console.error('Error escribiendo el PDF:', err);
      });

      const doc = new PDFDocument({ size: [108, 71] }); // tamaño en puntos (mm * 2.835)
      doc.pipe(pdfStream);

      // Dibuja un recuadro alrededor del contenido
      doc.rect(1, 1, 106, 69).stroke(); // borde de 1pt en todo el contorno

      doc.fontSize(10).text(producto.nombre, 5, 8, { width: 98, height: 12, ellipsis: true });
      doc.fontSize(8).text(`SKU: ${producto.sku}`, 5, 28, { width: 98, height: 10, ellipsis: true });
      doc.fontSize(8).text(`Precio: $${producto.precio}`, 5, 46, { width: 98, height: 10, ellipsis: true });

      doc.end();
      console.log('Comando ejecutado1');

      // Esperar a que el PDF se termine de escribir correctamente
      await new Promise((resolve, reject) => {
         pdfStream.on('finish', resolve);
         pdfStream.on('error', reject);
      }); 
      // 2. Imprimir PDF con SumatraPDF
      const sumatraPath = `"${path.join(__dirname, 'SumatraPDF-3.5.2-64.exe')}"`;
      const printerName = "DYMO LabelWriter 450 Twin Turbo";
      const cmd = `${sumatraPath} -print-to "${printerName}" -silent "${pdfPath}"`; 

      exec(cmd, (error, stdout, stderr) => {
         if (error) {
            console.error('Error al imprimir:', error);
            return;
         }
         console.log('Etiqueta enviada a la impresora');
      });

      return true;
   } catch (error) {
      console.error('Error general:', error);
   }
};

module.exports = labelModelPDF;
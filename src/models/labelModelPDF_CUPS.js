const ipp = require('ipp');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const QRCode = require('qrcode');

const labelModelPDF_CUPS = {};



// Imprimir una etiqueta widows
labelModelPDF_CUPS.printLabel = async (producto ) => {
  try {
        const { topText1, topText2, bottomText1, cant, qrText, price, iva } = producto;
    const doc = new PDFDocument({ size: [87, 67] });  
    const pdfChunks = [];
    const stream = new PassThrough();

    stream.on('data', chunk => pdfChunks.push(chunk));
    doc.pipe(stream);

// Área útil dibujada (opcional)
//doc.rect(1, 1, 85, 65).stroke();

// topText1 centrado arriba
doc.fontSize(5).text(topText1, 2, 1, { width: 83, height: 8, align: 'center', ellipsis: true });

// topText2 debajo, centrado
doc.fontSize(5).text(topText2, 2, 6, { width: 83, height: 10, align: 'center', ellipsis: true });

// Generar QR como buffer
const qrBuffer = await QRCode.toBuffer(qrText, { width: 26, margin: 0 });

// Insertar QR a la izquierda (debajo de topText2)
doc.image(qrBuffer, 1, 16, { width: 43, height: 43 });

// price a la derecha del QR
doc.fontSize(7).text(`$${price}`, 45, 27, { width: 53, height: 12, align: 'left', ellipsis: true });
doc.fontSize(6).text(`Teamcellmania`, 45, 37, { width: 53, height: 12, align: 'left', ellipsis: true });
// bottomText1 debajo de QR y price, centrado
doc.fontSize(4).text(bottomText1, 2, 62, { width: 83, height: 10, align: 'center', ellipsis: true });


    doc.end();

    // Esperar a que termine de generar el PDF
    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const pdfBuffer = Buffer.concat(pdfChunks);

    // // Guardar el PDF en disco
    // const fs = require('fs');
    // const path = require('path');
    // const pdfPath = path.join(__dirname, `etiqueta_${producto.sku || 'sinSKU'}.pdf`);
    // fs.writeFileSync(pdfPath, pdfBuffer);
 
    // Enviar el PDF a CUPS usando IPP
    const printer = ipp.Printer("http://172.17.0.1:631/printers/DYMO_LabelWriter_450");//ipp.Printer("http://192.168.0.250:631/printers/DYMO_LabelWriter_450"); //ipp.Printer("http://localhost:631/printers/DYMO_LabelWriter_450");//
    const msg = {
      "operation-attributes-tag": {
        "requesting-user-name": "usuario",
        "job-name": "Etiqueta",
        "document-format": "application/pdf"
      },
      data: pdfBuffer
    };

    return new Promise((resolve, reject) => {
      printer.execute("Print-Job", msg, function (err, res) {
        if (err) {
          console.error('Error enviando a CUPS:', err);
          reject(err);
        } else {
          console.log('Enviado a CUPS:', res.statusCode || res.status);
          resolve(true);
        }
      });
    });
    
  } catch (error) {
    console.error('Error general:', error);
    return false;
  }
};

module.exports = labelModelPDF_CUPS;
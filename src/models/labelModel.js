const fetch = require('node-fetch');
const https = require('https');
 const axios = require('axios');
const agent = new https.Agent({
  rejectUnauthorized: false // Ignora SSL en desarrollo
});

const labelModel = {};

// Obtener impresoras disponibles
labelModel.getPrinters = async () => {
  try {
    const response = await fetch('https://localhost:41951/DYMO/DLS/Printing/GetPrinters', {
      agent,
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.text(); // DYMO devuelve XML, no JSON
    console.log('Impresoras disponibles:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener impresoras:', error);
    throw error;
  }
};

// Imprimir una etiqueta
labelModel.printLabel = async (printerName1) => {
  const labelXml = `<?xml version="1.0" encoding="utf-8"?><DieCutLabel Version="8.0" Units="twips"><PaperOrientation>Landscape</PaperOrientation><Id>Address</Id><PaperName>30252 Address</PaperName><DrawCommands><RoundRectangle X="0" Y="0" Width="3060" Height="5040" Rx="270" Ry="270"/></DrawCommands><ObjectInfo><TextObject><Name>TEXT</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0"/><BackColor Alpha="0" Red="255" Green="255" Blue="255"/><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>True</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><TextFitMode>AlwaysFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>Hola DYMO!</String><Attributes><Font Family="Arial" Size="13" Bold="True" Italic="False" Underline="False" Strikeout="False"/><ForeColor Alpha="255" Red="0" Green="0" Blue="0"/></Attributes></Element></StyledText></TextObject><Bounds X="332" Y="150" Width="4455" Height="1260"/></ObjectInfo></DieCutLabel>`;
  const printParamsXml = "<PrintParams/>";
  const requestXml =
    `<PrintLabelRequest>
      <printerName>${printerName1}</printerName>
      <labelXml>${escapeXml(labelXml)}</labelXml>
      <printParamsXml>${escapeXml(printParamsXml)}</printParamsXml>
      <labelSetXml></labelSetXml>
    </PrintLabelRequest>`;

  try {
    const response = await axios.post(
      'https://localhost:41951/DYMO/DLS/Printing/PrintLabel',
      requestXml,
      {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
    console.log('Status:', response.status);
    console.log('Respuesta impresión:', response.data);
    return response.data;
  } catch (e) {
    if (e.response) {
      console.error('Status:', e.response.status);
      console.error('Respuesta impresión:', e.response.data);
    } else {
      console.error('Error:', e.message);
    }
    throw e;
  }
};

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
module.exports = labelModel;
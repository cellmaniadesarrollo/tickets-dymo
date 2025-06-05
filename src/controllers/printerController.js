const net = require('net');
const printerController = {}
 const labelModel = require('../models/labelModelPDF_CUPS')
printerController.index = async (req, res) => {
    res.sendFile(__dirname + "/views/");
    //res.send('exito aqui')   
  }; 
printerController.imprimirEtiquetaDinamica = async (req, res) => {
    try { 
      console.log(req.body)
        const printResult = await labelModel.printLabel(req.body); 
        if (printResult) {
            res.sendStatus(200); // Éxito
        } else {
            res.sendStatus(500); // Error en impresión
        }
    } catch (error) {   
        console.log(error);
        res.sendStatus(500); // Error general
    }
}; 

module.exports = printerController;
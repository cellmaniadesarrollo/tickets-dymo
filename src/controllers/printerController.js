const net = require('net');
const printerController = {}
 const labelModel = require('../models/labelModelPDF_CUPS')
printerController.index = async (req, res) => {
    res.sendFile(__dirname + "/views/");
    //res.send('exito aqui')   
  }; 
printerController.imprimirEtiquetaDinamica = async (req, res) => {
    try { 
    const printResult = await labelModel.printLabel(req.query ); 
    if (printResult) {
        res.sendFile(__dirname + "/views/exito.html");
    } else {
        res.sendFile(__dirname + "/views/error.html");
    }
    } catch (error) {   
      console.log(error)
      res.sendFile(__dirname + "/views/error.html");
    }
}; 

module.exports = printerController;
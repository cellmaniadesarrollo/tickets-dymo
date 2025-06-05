const express = require('express');
const router = express.Router();
 const printerController = require('../controllers/printerController');

router.get("/", printerController.index); 
router.post('/api/printtikets', printerController.imprimirEtiquetaDinamica);

module.exports = router;
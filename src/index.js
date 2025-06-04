 
const express = require('express');
const morgan = require('morgan'); // Importa morgan 
const path = require('node:path');
const app = express();

// Middleware para logging con morgan (configuración básica: 'dev')
app.use(morgan('dev')); // Puedes usar otros formatos como 'combined', 'tiny', etc.

app.use(express.json());

// Rutas
app.use(require('./routes'));

// RUTAS PUBLICAS 
app.use(express.static(path.join(__dirname, 'public')))

// Servidor 
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
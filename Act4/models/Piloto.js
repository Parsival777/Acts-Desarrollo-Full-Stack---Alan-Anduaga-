const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  escuderia: { type: String, required: true },
  
  numero: { type: Number, required: true, min: 1, max: 99 },
  
  titulos: { type: Number, required: true, default: 0, min: 0 },
  estado: { type: String, required: true, enum: ['Activo', 'Retirado'] }
});

module.exports = mongoose.model('Piloto', pilotoSchema);

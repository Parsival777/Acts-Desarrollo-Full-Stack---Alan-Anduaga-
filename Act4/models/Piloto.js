const mongoose = require('mongoose');

const pilotoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  escuderia: {
    type: String,
    required: true
  },
  numero: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Piloto', pilotoSchema);

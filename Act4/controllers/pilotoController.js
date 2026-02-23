const Piloto = require('../models/Piloto');

exports.createPiloto = async (req, res) => {
  try {
    const piloto = new Piloto(req.body);
    await piloto.save();
    res.status(201).json(piloto);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el piloto' });
  }
};

exports.getPilotos = async (req, res) => {
  try {
    const pilotos = await Piloto.find();
    res.status(200).json(pilotos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pilotos' });
  }
};

exports.getPilotoById = async (req, res) => {
  try {
    const piloto = await Piloto.findById(req.params.id);
    if (!piloto) {
      return res.status(404).json({ error: 'Piloto no encontrado' });
    }
    res.status(200).json(piloto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el piloto' });
  }
};

exports.updatePiloto = async (req, res) => {
  try {
    const piloto = await Piloto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!piloto) {
      return res.status(404).json({ error: 'Piloto no encontrado' });
    }
    res.status(200).json(piloto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el piloto' });
  }
};

exports.deletePiloto = async (req, res) => {
  try {
    const piloto = await Piloto.findByIdAndDelete(req.params.id);
    if (!piloto) {
      return res.status(404).json({ error: 'Piloto no encontrado' });
    }
    res.status(200).json({ message: 'Piloto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el piloto' });
  }
};

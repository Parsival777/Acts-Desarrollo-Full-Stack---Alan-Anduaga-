const express = require('express');
const router = express.Router();
const pilotoController = require('../controllers/pilotoController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, pilotoController.createPiloto);
router.get('/', authMiddleware, pilotoController.getPilotos);
router.get('/:id', authMiddleware, pilotoController.getPilotoById);
router.put('/:id', authMiddleware, pilotoController.updatePiloto);
router.delete('/:id', authMiddleware, pilotoController.deletePiloto);

module.exports = router;

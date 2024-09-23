const express = require('express');
const router = express.Router();

// Exemple de route GET
router.get('/', (req, res) => {
  res.send('Liste des tâches');
});

// Exemple de route POST
router.post('/', (req, res) => {
  res.send('Créer une nouvelle tâche');
});

module.exports = router;
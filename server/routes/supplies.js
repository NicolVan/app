const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Supplies = require('../models/Supplies')

router.post('/saveSupplies', auth, async (req, res) => {
  const { userId, itemName, quantity } = req.body;

  const newSupply = new Supplies({ userId, itemName, quantity });
  try {
    await newSupply.save();
    res.status(201).json(newSupply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/supplies/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const supplies = await Supplies.find({ userId });
      res.status(200).json(supplies);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;
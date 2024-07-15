const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Supplies = require('../models/Supplies');

router.post('/saveSupplies', auth, async (req, res) => {
  const { itemName, quantity, category, userId, foodCat } = req.body;

  if (!itemName || !quantity || !category || !userId || !foodCat) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      const newSupply = new Supplies({
          itemName,
          quantity,
          category,
          userId,
          foodCat
      });

      const savedSupply = await newSupply.save();
      res.status(201).json(savedSupply);
  } catch (error) {
      res.status(500).json({ error: 'Failed to add supply' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      await Supplies.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'Supply deleted successfully' });
  } catch (error) {
      res.status(500).send({ message: 'Error deleting supply', error });
  }
});

router.put('/edditsupplies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Supplies.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
        return res.status(404).send('Item not found');
    }
    res.json(updatedItem);
} catch (error) {
    res.status(500).send('Server error');
}
});

router.get('/getsupplies', auth, async (req, res) => {
  const { search, foodCat } = req.query;
  const userId = req.user.id;

  const query = { userId };

  if (search) {
    query.itemName = { $regex: search, $options: 'i' };
  }

  if (foodCat) {
    query.foodCat = { $in: foodCat.split(',') };
  }

  try {
    const supplies = await Supplies.find(query);
    res.status(200).json(supplies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ShoppingList = require('../models/ShoppingList'); 

router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const lists = await ShoppingList.find({ userId });
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addshoplist', async (req, res) => {
    const { userId, items } = req.body;
  
    if (!userId || !items) {
      return res.status(400).json({ error: 'User ID and items are required' });
    }
  
    try {
      const shoppingList = new ShoppingList({ userId, items });
      await shoppingList.save();
      res.status(201).json(shoppingList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

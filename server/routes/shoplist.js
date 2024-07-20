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

router.put('/:listId/item/:itemId', async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).send('Shopping list not found');
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      return res.status(404).send('Item not found');
    }

    item.set(req.body);
    await shoppingList.save();

    res.status(200).json(item);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
})

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

  router.delete('/:listId/item/:itemId', async (req, res) => {
    const { listId, itemId } = req.params;
  
    try {
      const shoppingList = await ShoppingList.findById(listId);
  
      if (!shoppingList) {
        return res.status(404).send({ message: 'Shopping list not found' });
      }
  
      const itemIndex = shoppingList.items.findIndex(item => item._id.toString() === itemId);
  
      if (itemIndex === -1) {
        return res.status(404).send({ message: 'Item not found in shopping list' });
      }
  
      shoppingList.items.splice(itemIndex, 1);
  
      await shoppingList.save();
  
      res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).send({ message: 'Error deleting item', error });
    }
  });
  
  router.delete('/:listId', async (req, res) => {
    const { listId } = req.params;
  
    try {
      const shoppingList = await ShoppingList.findById(listId);
  
      if (!shoppingList) {
        return res.status(404).send({ message: 'Shopping list not found' });
      }
  
      await ShoppingList.findByIdAndDelete(listId);
  
      res.status(200).send({ message: 'Shopping list deleted successfully' });
    } catch (error) {
      console.error('Error deleting shopping list:', error);
      res.status(500).send({ message: 'Error deleting shopping list', error });
    }
  });
  
module.exports = router;

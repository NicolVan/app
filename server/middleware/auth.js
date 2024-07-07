const jwt = require('jsonwebtoken');
const User = require('../models/User')

module.exports = async function  (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Received token:', token);
  if (!token) {
    return res.status(401).send('User not logged in');
}

try {
    
    const decoded = jwt.verify(token, 'fd35b13d3aecf8a9117fd89dbf18c91b147aeee87c7795e0640b577e744684c6');
    console.log('Decoded token:', decoded);
    const user = await User.findOne({
        _id: decoded.user.id,
        tokens: { $elemMatch: { token: token } }
      });
    console.log('Query for user with _id:', decoded.user.id, 'and token:', token);
    console.log('Found user:', user);

    if (!user) {
        throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
} catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send('Invalid user ID');
}
};

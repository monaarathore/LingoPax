const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Request ke header se token nikalo
  const token = req.header('x-auth-token');

  // 2. Agar token nahi hai, toh block karo
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Token ko verify karo
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Token se user id nikal kar request me daal di
    next(); // Agle step (yaani dashboard-data route) par jaane do
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid, session expired' });
  }
};
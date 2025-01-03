const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (verified.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = { auth, adminAuth }; 
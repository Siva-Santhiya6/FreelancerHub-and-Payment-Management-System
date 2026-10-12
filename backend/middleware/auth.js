const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEMO_USERS_MAP = {
  '65f000000000000000000000': { _id: '65f000000000000000000000', name: 'Admin User', email: 'admin@freelancerhub.com', role: 'ADMIN', isVerified: true, trustScore: 100 },
  '65f000000000000000000001': { _id: '65f000000000000000000001', name: 'Sarah Client', email: 'client@freelancerhub.com', role: 'CLIENT', isVerified: true, trustScore: 92 },
  '65f000000000000000000002': { _id: '65f000000000000000000002', name: 'Raj Freelancer', email: 'freelancer@freelancerhub.com', role: 'FREELANCER', isVerified: true, trustScore: 95 },
  '65f000000000000000000003': { _id: '65f000000000000000000003', name: 'Apex Studio Agency', email: 'agency@freelancerhub.com', role: 'AGENCY_MANAGER', isVerified: true, trustScore: 98 },
  '65f000000000000000000004': { _id: '65f000000000000000000004', name: 'Payment Manager', email: 'payment@freelancerhub.com', role: 'PAYMENT_MANAGER', isVerified: true, trustScore: 99 },
};

/**
 * Authentication Middleware: Validates JWT Bearer Token
 */
const protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token provided.'
      });
    }

    const secret = process.env.JWT_SECRET || 'dev_secret_jwt_freelancerhub_2026';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (tokenErr) {
      if (tokenErr.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }

    try {
      req.user = await User.findById(decoded.id).select('-password');
    } catch (dbErr) {
      // Fallback
    }

    if (!req.user && DEMO_USERS_MAP[decoded.id]) {
      req.user = DEMO_USERS_MAP[decoded.id];
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
    }

    next();
  } catch (err) {
    console.error('Protect middleware error:', err);
    res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

/**
 * Optional Authentication: Attaches req.user if valid token present, otherwise continues
 */
const optionalProtect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const secret = process.env.JWT_SECRET || 'dev_secret_jwt_freelancerhub_2026';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * Role-Based Authorization Middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please sign in.'
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted. Role '${req.user.role}' is not authorized for this action. Allowed: [${roles.join(', ')}]`
      });
    }
    next();
  };
};

module.exports = { protect, optionalProtect, authorize };

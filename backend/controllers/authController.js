const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_jwt_freelancerhub_2026';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Demo accounts dictionary with pre-configured verified credentials
const DEMO_ACCOUNTS = {
  'admin@freelancerhub.com': {
    name: 'Admin User',
    email: 'admin@freelancerhub.com',
    password: 'Admin@123',
    role: 'ADMIN',
    isVerified: true,
    trustScore: 100,
    country: 'India',
    language: 'en',
  },
  'client@freelancerhub.com': {
    name: 'Sarah Client',
    email: 'client@freelancerhub.com',
    password: 'Client@123',
    role: 'CLIENT',
    isVerified: true,
    trustScore: 92,
    bio: 'Tech startup founder building scalable web & AI products.',
    country: 'India',
    language: 'en',
  },
  'freelancer@freelancerhub.com': {
    name: 'Raj Freelancer',
    email: 'freelancer@freelancerhub.com',
    password: 'Freelancer@123',
    role: 'FREELANCER',
    isVerified: true,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'UI/UX'],
    experience: 5,
    hourlyRate: 40,
    rating: 4.9,
    trustScore: 95,
    bio: 'Senior Full-Stack Architect & AI Specialist with 5+ years building SaaS apps.',
    availability: 'AVAILABLE',
    country: 'India',
    language: 'en',
  },
  'agency@freelancerhub.com': {
    name: 'Apex Studio Agency',
    email: 'agency@freelancerhub.com',
    password: 'Agency@123',
    role: 'AGENCY_MANAGER',
    agencyName: 'Apex Digital Solutions',
    agencySize: 12,
    isVerified: true,
    trustScore: 98,
    skills: ['Full Stack', 'Mobile App', 'DevOps', 'Cloud Architecture', 'UI/UX'],
    bio: 'Top-rated enterprise agency managing end-to-end cloud and mobile ecosystems.',
    country: 'India',
    language: 'en',
  },
  'payment@freelancerhub.com': {
    name: 'Payment Manager',
    email: 'payment@freelancerhub.com',
    password: 'Payment@123',
    role: 'PAYMENT_MANAGER',
    isVerified: true,
    trustScore: 99,
    country: 'India',
    language: 'en',
  },
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, skills, hourlyRate, bio } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) {
      // Instant offline fallback account creation
      const dummyId = '65f99' + Math.random().toString(16).slice(2, 21);
      const userPayload = {
        _id: dummyId,
        name: name?.trim() || 'User',
        email: cleanEmail,
        role: role || 'CLIENT',
        skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
        hourlyRate: Number(hourlyRate) || 0,
        bio: bio || '',
        isVerified: true,
        trustScore: 80,
        profileStrength: 60,
      };
      return res.status(201).json({
        success: true,
        token: generateToken(dummyId),
        user: userPayload,
      });
    }

    const exists = await User.findOne({ email: cleanEmail });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered. Please sign in.' });

    const user = await User.create({
      name: name?.trim() || 'User',
      email: cleanEmail,
      password,
      role: role || 'CLIENT',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      hourlyRate: Number(hourlyRate) || 0,
      bio: bio || '',
      isVerified: true,
      trustScore: 80,
      profileStrength: 60,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: user.toJSON ? user.toJSON() : user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const isConnected = mongoose.connection.readyState === 1;

    // Fast-path for 1-Click Demo Accounts
    if (DEMO_ACCOUNTS[cleanEmail] && password === DEMO_ACCOUNTS[cleanEmail].password) {
      const demoData = DEMO_ACCOUNTS[cleanEmail];
      const dummyId = '65f00000000000000000000' + Object.keys(DEMO_ACCOUNTS).indexOf(cleanEmail);

      if (!isConnected) {
        return res.json({
          success: true,
          token: generateToken(dummyId),
          user: { _id: dummyId, ...demoData }
        });
      }

      // If DB is connected, ensure it exists in DB
      let user = null;
      try {
        user = await User.findOne({ email: cleanEmail }).select('+password');
        if (!user) {
          user = await User.create(demoData);
        }
      } catch (dbErr) {
        // fallback
      }

      const userData = user ? (user.toJSON ? user.toJSON() : user) : { _id: dummyId, ...demoData };
      return res.json({
        success: true,
        token: generateToken(userData._id || dummyId),
        user: userData
      });
    }

    if (!isConnected) {
      return res.status(401).json({
        success: false,
        message: 'Database offline. Please use one of the 1-click demo accounts or connect MongoDB Atlas.'
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    let isMatch = false;
    if (typeof user.comparePassword === 'function') {
      try {
        isMatch = await user.comparePassword(password);
      } catch (pwErr) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userData = typeof user.toJSON === 'function' ? user.toJSON() : user;
    res.json({ success: true, token: generateToken(user._id), user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
};

// POST /api/auth/oauth (Google & GitHub 1-Click OAuth Unified Endpoint)
const oauthLogin = async (req, res) => {
  try {
    let { provider = 'google', email, name, avatar, role = 'CLIENT', providerId, credential } = req.body;

    // If Google ID token credential is provided, decode payload
    if (credential && (!email || !name || !avatar)) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
          const decoded = JSON.parse(jsonPayload);
          if (decoded.email) {
            email = email || decoded.email;
            name = name || decoded.name;
            avatar = avatar || decoded.picture;
            providerId = providerId || decoded.sub;
          }
        }
      } catch (jwtErr) {
        console.warn('Google credential decode warning:', jwtErr.message);
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'OAuth user email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isConnected = mongoose.connection.readyState === 1;

    if (!isConnected) {
      const dummyId = '65f88' + Math.random().toString(16).slice(2, 21);
      const userPayload = {
        _id: dummyId,
        name: name || (cleanEmail.split('@')[0]),
        email: cleanEmail,
        role: role || 'CLIENT',
        profileImage: avatar || '',
        isVerified: true,
        trustScore: 85,
        profileStrength: 80,
      };
      return res.json({
        success: true,
        provider: provider || 'google',
        token: generateToken(dummyId),
        user: userPayload,
        message: `Successfully authenticated with ${provider ? provider.toUpperCase() : 'OAuth'}`
      });
    }

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Create new user linked via OAuth
      const randomPassword = 'OAuth_' + Math.random().toString(36).substring(2, 15) + '!A9';
      user = await User.create({
        name: name || (cleanEmail.split('@')[0]),
        email: cleanEmail,
        password: randomPassword,
        role: role || 'CLIENT',
        profileImage: avatar || '',
        isVerified: true,
        trustScore: 85,
        profileStrength: 80,
      });
    } else {
      // Update avatar if provided and not already custom
      let modified = false;
      if (avatar && (!user.profileImage || user.profileImage.includes('unsplash.com'))) {
        user.profileImage = avatar;
        modified = true;
      }
      if (name && (!user.name || user.name === 'User')) {
        user.name = name;
        modified = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        modified = true;
      }
      if (modified) {
        await user.save();
      }
    }

    const userData = typeof user.toJSON === 'function' ? user.toJSON() : user;
    const token = generateToken(user._id);

    res.json({
      success: true,
      provider: provider || 'oauth',
      token,
      user: userData,
      message: `Successfully authenticated with ${provider ? provider.toUpperCase() : 'OAuth'}`
    });
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).json({ success: false, message: err.message || 'OAuth authentication failed' });
  }
};

// GET /api/auth/oauth/url (OAuth Config / Simulated Redirect URL)
const getOAuthUrl = async (req, res) => {
  const { provider } = req.query;
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  if (provider === 'google') {
    return res.json({
      success: true,
      provider: 'google',
      url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=demo_google_client_id&redirect_uri=${encodeURIComponent(baseUrl + '/auth/callback?provider=google')}&response_type=code&scope=openid%20profile%20email`
    });
  }
  if (provider === 'github') {
    return res.json({
      success: true,
      provider: 'github',
      url: `https://github.com/login/oauth/authorize?client_id=demo_github_client_id&redirect_uri=${encodeURIComponent(baseUrl + '/auth/callback?provider=github')}&scope=user:email`
    });
  }
  res.status(400).json({ success: false, message: 'Unsupported OAuth provider' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const allowed = ['name','phone','bio','skills','experience','hourlyRate','availability','country','language','profileImage'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    // Recalculate profile strength
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let strength = 0;
    if (user.name) strength += 20;
    if (user.bio) strength += 20;
    if (user.skills?.length) strength += 20;
    if (user.phone) strength += 20;
    if (user.profileImage) strength += 20;
    user.profileStrength = Math.min(100, strength);
    await user.save();

    res.json({ success: true, user: user.toJSON ? user.toJSON() : user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, oauthLogin, getOAuthUrl, getMe, updateProfile };

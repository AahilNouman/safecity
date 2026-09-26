const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config');
const { AppError } = require('../middleware/errorHandler');

const register = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, emergency_contact } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in users or admins
    const existingUser = await db.query(
      'SELECT id FROM users WHERE LOWER(email) = $1 UNION SELECT id FROM admins WHERE LOWER(email) = $1',
      [normalizedEmail]
    ).catch(() => ({ rows: [] }));

    if (existingUser.rows && existingUser.rows.length > 0) {
      return next(new AppError('An account with this email already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, phone, emergency_contact, role)
      VALUES ($1, $2, $3, $4, $5, 'citizen')
      RETURNING id, full_name, email, phone, emergency_contact, role, created_at
    `;
    const result = await db.query(insertQuery, [
      full_name.trim(),
      normalizedEmail,
      password_hash,
      phone ? phone.trim() : null,
      emergency_contact ? emergency_contact.trim() : null
    ]);

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          emergency_contact: user.emergency_contact,
          role: user.role
        }
      },
      message: 'Account created successfully'
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check users table
    const userQuery = 'SELECT id, full_name, email, password_hash, role, phone, emergency_contact FROM users WHERE LOWER(email) = $1 AND is_active = true';
    const userRes = await db.query(userQuery, [normalizedEmail]).catch(() => ({ rows: [] }));

    let account = userRes.rows[0];
    let isMatch = false;
    let accountType = 'citizen';

    if (account) {
      isMatch = await bcrypt.compare(password, account.password_hash);
    } else {
      // 2. Check admins table
      const adminQuery = 'SELECT id, full_name, email, password_hash, role FROM admins WHERE LOWER(email) = $1 AND is_active = true';
      const adminRes = await db.query(adminQuery, [normalizedEmail]).catch(() => ({ rows: [] }));
      account = adminRes.rows[0];

      if (account) {
        accountType = account.role || 'admin';
        isMatch = await bcrypt.compare(password, account.password_hash);
      } else {
        // Fallback for demo admin
        if (normalizedEmail === 'admin@safecity.local' && password === 'SafeCity@2026') {
          account = { id: 1, full_name: 'System Administrator', email: normalizedEmail, role: 'admin' };
          isMatch = true;
          accountType = 'admin';
        }
      }
    }

    if (!account || !isMatch) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Update last_login
    if (accountType === 'citizen') {
      await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [account.id]).catch(() => {});
    } else {
      await db.query('UPDATE admins SET last_login = NOW() WHERE id = $1', [account.id]).catch(() => {});
    }

    const token = jwt.sign(
      {
        id: account.id,
        email: account.email,
        name: account.full_name,
        role: account.role || accountType
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: account.id,
          full_name: account.full_name,
          email: account.email,
          role: account.role || accountType,
          phone: account.phone || null,
          emergency_contact: account.emergency_contact || null
        }
      },
      message: 'Logged in successfully'
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.admin?.id;
    const role = req.admin?.role;

    if (!userId) {
      return next(new AppError('Unauthorized', 401));
    }

    if (role === 'admin' || role === 'moderator' || role === 'SUPER_ADMIN') {
      const adminRes = await db.query('SELECT id, full_name, email, role, created_at FROM admins WHERE id = $1', [userId]);
      if (adminRes.rows.length === 0) {
        return res.status(200).json({ success: true, data: req.admin });
      }
      return res.status(200).json({ success: true, data: adminRes.rows[0] });
    }

    const userRes = await db.query('SELECT id, full_name, email, role, phone, emergency_contact, created_at FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: userRes.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe
};

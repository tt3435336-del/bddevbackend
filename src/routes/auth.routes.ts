import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = new Hono();

const getJwtSecret = () => process.env.JWT_SECRET;
const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@safetypro.sn';
const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'admin123';
const getAdminPasswordHash = () => process.env.ADMIN_PASSWORD_HASH;

const isValidPassword = async (password: string) => {
  const passwordHash = getAdminPasswordHash();
  if (passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  return password === getAdminPassword();
};

router.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return c.json({ success: false, error: 'Email et mot de passe requis' }, 400);
    }

    if (email === getAdminEmail() && await isValidPassword(password)) {
      const secret = getJwtSecret();
      if (!secret) {
        return c.json({ success: false, error: 'Erreur de configuration' }, 500);
      }

      const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'];

      const token = jwt.sign(
        { userId: 'admin-1', email: getAdminEmail(), role: 'admin' },
        secret,
        { expiresIn }
      );

      return c.json({
        success: true,
        data: {
          token,
          user: {
            id: 'admin-1',
            email: getAdminEmail(),
            role: 'admin',
          },
        },
      });
    }

    return c.json({ success: false, error: 'Identifiants invalides' }, 401);
  } catch (error) {
    console.error('Erreur login:', error);
    return c.json({ success: false, error: 'Erreur lors de la connexion' }, 500);
  }
});

router.get('/auth/me', authMiddleware, async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ success: false, error: 'Authentification requise' }, 401);
  }

  return c.json({
    success: true,
    data: {
      id: user.userId,
      email: user.email,
      role: user.role,
    },
  });
});

export { router as authRoutes };

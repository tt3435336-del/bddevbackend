import { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Middleware d'authentification JWT
export const authMiddleware: MiddlewareHandler<{
  Variables: {
    user?: JwtPayload;
  };
}> = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Token d\'authentification manquant' }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET non défini');
      return c.json({ success: false, error: 'Erreur de configuration serveur' }, 500);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Ajouter les informations utilisateur au contexte
    c.set('user', {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    await next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return c.json({ success: false, error: 'Token expiré' }, 401);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ success: false, error: 'Token invalide' }, 401);
    }

    console.error('Erreur middleware auth:', error);
    return c.json({ success: false, error: 'Erreur d\'authentification' }, 500);
  }
};

// Middleware pour vérifier le rôle admin
export const adminMiddleware: MiddlewareHandler<{
  Variables: {
    user?: JwtPayload;
  };
}> = async (c, next) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ success: false, error: 'Authentification requise' }, 401);
  }

  if (user.role !== 'admin') {
    return c.json({ success: false, error: 'Accès non autorisé - rôle admin requis' }, 403);
  }

  await next();
};

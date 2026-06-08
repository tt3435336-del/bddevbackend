import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { contactsRoutes } from './routes/contacts.routes';
import { authRoutes } from './routes/auth.routes';
import { prisma } from './config/database';
import { productsRoutes } from './routes/products.routes';
import { ordersRoutes } from './routes/orders.routes';
import { personalizationsRoutes } from './routes/personalizations.routes';

// Créer l'application Hono
const app = new Hono();
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8082',
  'http://127.0.0.1:8083',
  ...(process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) || []),
]);

// Middlewares globaux
app.use('*', cors({
  origin: (origin) => {
    if (!origin) {
      return '*';
    }

    return allowedOrigins.has(origin) ? origin : '';
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use('*', logger());

// Middleware de gestion d'erreurs globale
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ success: false, error: 'Erreur interne du serveur' }, 500);
});

// Middleware 404
app.notFound((c) => {
  return c.json({ success: false, error: 'Route non trouvée' }, 404);
});

// Route d'accueil API
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'API SafetyPro Sénégal opérationnelle',
    endpoints: {
      health: '/health',
      contacts: '/api/contacts',
      produits: '/api/produits',
      commandes: '/api/commandes',
      personnalisations: '/api/personnalisations',
    },
  });
});

app.get('/favicon.ico', (c) => c.body(null, 204));

// Routes de santé
app.get('/health', async (c) => {
  try {
    // Vérifier la connexion à la DB
    await prisma.$queryRaw`SELECT 1`;
    return c.json({
      success: true,
      message: 'Serveur opérationnel',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    return c.json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    }, 500);
  }
});

// Monter les routes
app.route('/api', contactsRoutes);
app.route('/api', authRoutes);
app.route('/api', productsRoutes);
app.route('/api', ordersRoutes);
app.route('/api', personalizationsRoutes);

// Démarrage du serveur
const port = process.env.PORT || 3002;

serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
console.log(`🏠 API Accueil: http://localhost:${port}/`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`📧 API Contacts: http://localhost:${port}/api/contacts`);
console.log(`📦 API Produits: http://localhost:${port}/api/produits`);

export default {
  port,
  fetch: app.fetch,
};

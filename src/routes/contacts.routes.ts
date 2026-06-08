import { Hono } from 'hono';
import { ContactsController } from '../controllers/contacts.controller';
import { ContactsService } from '../services/contacts.service';
import { ContactsRepository } from '../repositories/contacts.repository';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateCreateContact, validateUpdateContact } from '../middlewares/validation.middleware';

// Injection de dépendances
const repository = new ContactsRepository();
const service = new ContactsService(repository);
const controller = new ContactsController(service);

// Créer le routeur
const router = new Hono();

// Routes publiques
router.post('/contacts', validateCreateContact, controller.create);

// Routes admin (protégées)
router.use('/admin/contacts', authMiddleware, adminMiddleware);
router.use('/admin/contacts/*', authMiddleware, adminMiddleware);

router.get('/admin/contacts', controller.getAll);
router.get('/admin/contacts/stats', controller.getStats);
router.get('/admin/contacts/:id', controller.getById);
router.patch('/admin/contacts/:id', validateUpdateContact, controller.update);
router.patch('/admin/contacts/:id/read', controller.markAsRead);
router.delete('/admin/contacts/:id', controller.delete);

export { router as contactsRoutes };

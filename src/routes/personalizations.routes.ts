import { Hono } from 'hono';
import { PersonalizationsController } from '../controllers/personalizations.controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';
import {
  validateCreatePersonalization,
  validateUpdatePersonalizationStatus,
} from '../middlewares/validation.middleware';
import { PersonalizationsRepository } from '../repositories/personalizations.repository';
import { PersonalizationsService } from '../services/personalizations.service';

const repository = new PersonalizationsRepository();
const service = new PersonalizationsService(repository);
const controller = new PersonalizationsController(service);

const router = new Hono();

router.post('/personnalisations', validateCreatePersonalization, controller.create);

router.use('/admin/personnalisations', authMiddleware, adminMiddleware);
router.use('/admin/personnalisations/*', authMiddleware, adminMiddleware);

router.get('/admin/personnalisations', controller.getAll);
router.patch(
  '/admin/personnalisations/:id/statut',
  validateUpdatePersonalizationStatus,
  controller.updateStatus
);

export { router as personalizationsRoutes };

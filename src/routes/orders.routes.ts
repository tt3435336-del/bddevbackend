import { Hono } from 'hono';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersRepository } from '../repositories/orders.repository';
import { OrdersService } from '../services/orders.service';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';
import { validateCreateOrder, validateUpdateOrderStatus } from '../middlewares/validation.middleware';

const repository = new OrdersRepository();
const service = new OrdersService(repository);
const controller = new OrdersController(service);

const router = new Hono();

router.post('/commandes', validateCreateOrder, controller.create);

router.use('/admin/commandes', authMiddleware, adminMiddleware);
router.use('/admin/commandes/*', authMiddleware, adminMiddleware);

router.get('/admin/commandes', controller.getAll);
router.get('/admin/commandes/:id', controller.getById);
router.patch('/admin/commandes/:id/statut', validateUpdateOrderStatus, controller.updateStatus);

export { router as ordersRoutes };

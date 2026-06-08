import { Hono } from 'hono';
import { ProductsController } from '../controllers/products.controller';
import { ProductsRepository } from '../repositories/products.repository';
import { ProductsService } from '../services/products.service';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware';
import { validateCreateProduct, validateUpdateProduct } from '../middlewares/validation.middleware';

const repository = new ProductsRepository();
const service = new ProductsService(repository);
const controller = new ProductsController(service);

const router = new Hono();

router.get('/produits', controller.getAll);
router.get('/produits/:id', controller.getById);

router.use('/admin/produits', authMiddleware, adminMiddleware);
router.use('/admin/produits/*', authMiddleware, adminMiddleware);

router.post('/admin/produits', validateCreateProduct, controller.create);
router.patch('/admin/produits/:id', validateUpdateProduct, controller.update);
router.delete('/admin/produits/:id', controller.delete);

export { router as productsRoutes };

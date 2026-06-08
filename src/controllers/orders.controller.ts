import { Context } from 'hono';
import { OrdersService } from '../services/orders.service';

type HonoContext = Context;

export class OrdersController {
  constructor(private service: OrdersService) {}

  getAll = async (c: HonoContext) => {
    try {
      const orders = await this.service.getAllOrders();
      return c.json({ success: true, data: orders });
    } catch (error) {
      console.error('Erreur recuperation commandes:', error);
      return c.json({ success: false, error: 'Erreur lors de la recuperation des commandes' }, 500);
    }
  };

  getById = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      const order = await this.service.getOrderById(id);
      if (!order) {
        return c.json({ success: false, error: 'Commande non trouvee' }, 404);
      }

      return c.json({ success: true, data: order });
    } catch (error) {
      console.error('Erreur recuperation commande:', error);
      return c.json({ success: false, error: 'Erreur lors de la recuperation de la commande' }, 500);
    }
  };

  create = async (c: HonoContext) => {
    try {
      const body = await c.req.json();
      const order = await this.service.createOrder(body);
      return c.json({ success: true, data: order, message: 'Commande creee avec succes' }, 201);
    } catch (error) {
      console.error('Erreur creation commande:', error);

      if (error instanceof Error && error.message.startsWith('Validation echouee')) {
        return c.json({ success: false, error: error.message }, 400);
      }

      return c.json({ success: false, error: 'Erreur lors de la creation de la commande' }, 500);
    }
  };

  updateStatus = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      const body = await c.req.json();
      const order = await this.service.updateOrderStatus(id, body);
      return c.json({ success: true, data: order, message: 'Statut mis a jour avec succes' });
    } catch (error) {
      console.error('Erreur mise a jour commande:', error);

      if (error instanceof Error) {
        if (error.message === 'Commande non trouvee') {
          return c.json({ success: false, error: error.message }, 404);
        }

        if (error.message.startsWith('Validation echouee')) {
          return c.json({ success: false, error: error.message }, 400);
        }
      }

      return c.json({ success: false, error: 'Erreur lors de la mise a jour de la commande' }, 500);
    }
  };
}

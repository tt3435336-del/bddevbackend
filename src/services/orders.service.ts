import { z } from 'zod';
import {
  createOrderSchema,
  CreateOrderInput,
  Order,
  updateOrderStatusSchema,
  UpdateOrderStatusInput,
} from '../models/order.model';
import { OrdersRepository } from '../repositories/orders.repository';

export class OrdersService {
  constructor(private repository: OrdersRepository) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.repository.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.repository.findById(id);
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    try {
      const validatedInput = createOrderSchema.parse(input);
      return await this.repository.create(validatedInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation echouee: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`
        );
      }
      throw error;
    }
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
    const existingOrder = await this.repository.findById(id);
    if (!existingOrder) {
      throw new Error('Commande non trouvee');
    }

    try {
      const validatedInput = updateOrderStatusSchema.parse(input);
      return await this.repository.updateStatus(id, validatedInput.statut);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation echouee: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`
        );
      }
      throw error;
    }
  }
}

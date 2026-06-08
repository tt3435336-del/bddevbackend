import { prisma } from '../config/database';
import { CreateOrderInput, Order } from '../models/order.model';

export class OrdersRepository {
  async findAll(): Promise<Order[]> {
    return await prisma.commande.findMany({
      include: {
        items: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await prisma.commande.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async create(data: CreateOrderInput): Promise<Order> {
    const { items, ...commande } = data;

    return await prisma.commande.create({
      data: {
        ...commande,
        quartier: commande.quartier ?? '',
        notes: commande.notes ?? '',
        items: {
          create: items.map((item) => ({
            produit_id: item.produit_id ?? null,
            nom_produit: item.nom_produit,
            prix_unitaire: item.prix_unitaire,
            quantite: item.quantite,
            couleur: item.couleur ?? '',
            pointure: item.pointure ?? '',
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: string, statut: string): Promise<Order> {
    return await prisma.commande.update({
      where: { id },
      data: { statut },
      include: {
        items: true,
      },
    });
  }
}

import { prisma } from '../config/database';
import { CreateProductInput, Product, UpdateProductInput } from '../models/product.model';

export class ProductsRepository {
  async findAll(categorie?: string): Promise<Product[]> {
    return await prisma.produit.findMany({
      where: categorie ? { categorie } : undefined,
      orderBy: {
        date_ajout: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await prisma.produit.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProductInput): Promise<Product> {
    return await prisma.produit.create({
      data,
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return await prisma.produit.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.produit.delete({
      where: { id },
    });
  }
}

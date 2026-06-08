import { z } from 'zod';
import { ProductsRepository } from '../repositories/products.repository';
import {
  createProductSchema,
  CreateProductInput,
  Product,
  updateProductSchema,
  UpdateProductInput,
} from '../models/product.model';

const normalizeProductImageUrls = (imageUrls: string[] = []) =>
  Array.from(new Set(imageUrls.map((url) => url.trim()).filter(Boolean))).slice(0, 8);

const withNormalizedCreateImages = (input: CreateProductInput): CreateProductInput => {
  const imageUrls = normalizeProductImageUrls(input.image_urls.length > 0 ? input.image_urls : [input.image_url]);

  return {
    ...input,
    image_url: imageUrls[0] || '',
    image_urls: imageUrls,
  };
};

const withNormalizedUpdateImages = (input: UpdateProductInput): UpdateProductInput => {
  const hasImageUrls = Object.prototype.hasOwnProperty.call(input, 'image_urls');
  const hasImageUrl = Object.prototype.hasOwnProperty.call(input, 'image_url');

  if (!hasImageUrls && !hasImageUrl) {
    return input;
  }

  const imageUrls = normalizeProductImageUrls(hasImageUrls ? input.image_urls || [] : [input.image_url || '']);

  return {
    ...input,
    image_url: imageUrls[0] || '',
    image_urls: imageUrls,
  };
};

export class ProductsService {
  constructor(private repository: ProductsRepository) {}

  async getAllProducts(categorie?: string): Promise<Product[]> {
    return await this.repository.findAll(categorie);
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.repository.findById(id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    try {
      const validatedInput = withNormalizedCreateImages(createProductSchema.parse(input));
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

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Produit non trouve');
    }

    try {
      const validatedInput = withNormalizedUpdateImages(updateProductSchema.parse(input));
      if (Object.keys(validatedInput).length === 0) {
        throw new Error('Aucune donnee a mettre a jour');
      }

      return await this.repository.update(id, validatedInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation echouee: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`
        );
      }
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Produit non trouve');
    }

    await this.repository.delete(id);
  }
}

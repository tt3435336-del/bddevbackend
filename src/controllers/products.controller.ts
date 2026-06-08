import { Context } from 'hono';
import { ProductsService } from '../services/products.service';

type HonoContext = Context;

export class ProductsController {
  constructor(private service: ProductsService) {}

  getAll = async (c: HonoContext) => {
    try {
      const categorie = c.req.query('categorie');
      const products = await this.service.getAllProducts(categorie);
      return c.json({ success: true, data: products });
    } catch (error) {
      console.error('Erreur recuperation produits:', error);
      return c.json({ success: false, error: 'Erreur lors de la recuperation des produits' }, 500);
    }
  };

  getById = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      const product = await this.service.getProductById(id);
      if (!product) {
        return c.json({ success: false, error: 'Produit non trouve' }, 404);
      }

      return c.json({ success: true, data: product });
    } catch (error) {
      console.error('Erreur recuperation produit:', error);
      return c.json({ success: false, error: 'Erreur lors de la recuperation du produit' }, 500);
    }
  };

  create = async (c: HonoContext) => {
    try {
      const body = await c.req.json();
      const product = await this.service.createProduct(body);
      return c.json({ success: true, data: product, message: 'Produit cree avec succes' }, 201);
    } catch (error) {
      console.error('Erreur creation produit:', error);

      if (error instanceof Error && error.message.startsWith('Validation echouee')) {
        return c.json({ success: false, error: error.message }, 400);
      }

      return c.json({ success: false, error: 'Erreur lors de la creation du produit' }, 500);
    }
  };

  update = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      const body = await c.req.json();
      const product = await this.service.updateProduct(id, body);
      return c.json({ success: true, data: product, message: 'Produit mis a jour avec succes' });
    } catch (error) {
      console.error('Erreur mise a jour produit:', error);

      if (error instanceof Error) {
        if (error.message === 'Produit non trouve') {
          return c.json({ success: false, error: error.message }, 404);
        }

        if (error.message.startsWith('Validation echouee') || error.message === 'Aucune donnee a mettre a jour') {
          return c.json({ success: false, error: error.message }, 400);
        }
      }

      return c.json({ success: false, error: 'Erreur lors de la mise a jour du produit' }, 500);
    }
  };

  delete = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      await this.service.deleteProduct(id);
      return c.json({ success: true, message: 'Produit supprime avec succes' });
    } catch (error) {
      console.error('Erreur suppression produit:', error);

      if (error instanceof Error && error.message === 'Produit non trouve') {
        return c.json({ success: false, error: error.message }, 404);
      }

      return c.json({ success: false, error: 'Erreur lors de la suppression du produit' }, 500);
    }
  };
}

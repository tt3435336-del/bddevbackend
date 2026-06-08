import { zValidator } from '@hono/zod-validator';
import { createContactSchema, updateContactSchema } from '../models/contact.model';
import { createOrderSchema, updateOrderStatusSchema } from '../models/order.model';
import {
  createPersonalizationSchema,
  updatePersonalizationStatusSchema,
} from '../models/personalization.model';
import { createProductSchema, updateProductSchema } from '../models/product.model';

const buildValidationError = (result: any, c: any) => {
  if (!result.success) {
    return c.json({
      success: false,
      error: 'Donnees de validation invalides',
      details: result.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    }, 400);
  }
};

// Middleware de validation pour la création de contact
export const validateCreateContact = zValidator('json', createContactSchema, buildValidationError);

// Middleware de validation pour la mise à jour de contact
export const validateUpdateContact = zValidator('json', updateContactSchema, buildValidationError);

export const validateCreateProduct = zValidator('json', createProductSchema, buildValidationError);
export const validateUpdateProduct = zValidator('json', updateProductSchema, buildValidationError);

export const validateCreateOrder = zValidator('json', createOrderSchema, buildValidationError);
export const validateUpdateOrderStatus = zValidator('json', updateOrderStatusSchema, buildValidationError);

export const validateCreatePersonalization = zValidator(
  'json',
  createPersonalizationSchema,
  buildValidationError
);
export const validateUpdatePersonalizationStatus = zValidator(
  'json',
  updatePersonalizationStatusSchema,
  buildValidationError
);

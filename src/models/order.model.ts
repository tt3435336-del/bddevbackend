import { z } from 'zod';

export const orderPaymentModes = [
  'wave',
  'orange_money',
  'free_money',
  'paiement_livraison',
] as const;

export const orderStatuses = [
  'en_attente',
  'confirmee',
  'en_cours',
  'livree',
  'annulee',
] as const;

export const createOrderItemSchema = z.object({
  produit_id: z.string().uuid('ID produit invalide').optional().nullable(),
  nom_produit: z.string().min(1, 'Le nom du produit est requis').max(255, 'Nom du produit trop long'),
  prix_unitaire: z.number().int().min(0, 'Le prix unitaire doit etre positif'),
  quantite: z.number().int().min(1, 'La quantite doit etre superieure a 0'),
  couleur: z.string().max(120, 'La couleur est trop longue').optional().nullable(),
  pointure: z.string().max(120, 'La pointure est trop longue').optional().nullable(),
});

export const createOrderSchema = z.object({
  nom_complet: z.string().min(1, 'Le nom complet est requis').max(255, 'Le nom complet est trop long'),
  telephone: z.string().min(1, 'Le telephone est requis').max(60, 'Le telephone est trop long'),
  adresse: z.string().min(1, 'L adresse est requise').max(255, 'L adresse est trop longue'),
  quartier: z.string().max(255, 'Le quartier est trop long').optional().nullable(),
  mode_paiement: z.enum(orderPaymentModes, { message: 'Mode de paiement invalide' }),
  total: z.number().int().min(0, 'Le total doit etre positif'),
  notes: z.string().max(5000, 'Les notes sont trop longues').optional().nullable(),
  items: z.array(createOrderItemSchema).min(1, 'Au moins un produit est requis'),
});

export const updateOrderStatusSchema = z.object({
  statut: z.enum(orderStatuses, { message: 'Statut invalide' }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;

export interface OrderItem {
  id: string;
  commande_id: string;
  produit_id: string | null;
  nom_produit: string;
  prix_unitaire: number;
  quantite: number;
  couleur: string | null;
  pointure: string | null;
}

export interface Order {
  id: string;
  nom_complet: string;
  telephone: string;
  adresse: string;
  quartier: string;
  mode_paiement: string;
  statut: string;
  total: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
  items?: OrderItem[];
}

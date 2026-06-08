import { z } from 'zod';

// Schéma Zod pour la validation des données d'entrée
export const createContactSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z.string()
    .email('Adresse email invalide')
    .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

export const updateContactSchema = z.object({
  lu: z.boolean().optional(),
});

// Types TypeScript dérivés des schémas Zod
export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

// Interface pour les données complètes du contact (avec champs générés par DB)
export interface Contact {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  created_at: Date;
}

// Interface pour les données partielles (sans champs générés)
export interface ContactWithoutTimestamps {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
}
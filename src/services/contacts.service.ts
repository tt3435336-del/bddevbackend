import { ContactsRepository } from '../repositories/contacts.repository';
import { Contact, CreateContactInput, UpdateContactInput, createContactSchema } from '../models/contact.model';
import { z } from 'zod';

export class ContactsService {
  constructor(private repository: ContactsRepository) {}

  /**
   * Récupère tous les contacts avec métadonnées
   */
  async getAllContacts(): Promise<{
    contacts: Contact[];
    total: number;
    unread: number;
  }> {
    const [contacts, total, unread] = await Promise.all([
      this.repository.findAll(),
      this.repository.count(),
      this.repository.countUnread(),
    ]);

    return {
      contacts,
      total,
      unread,
    };
  }

  /**
   * Récupère un contact par son ID
   */
  async getContactById(id: string): Promise<Contact | null> {
    return await this.repository.findById(id);
  }

  /**
   * Crée un nouveau contact avec validation
   */
  async createContact(input: CreateContactInput): Promise<Contact> {
    try {
      // Validation avec Zod
      const validatedInput = createContactSchema.parse(input);

      // Vérifications métier supplémentaires si nécessaire
      // Par exemple : vérifier que l'email n'est pas déjà utilisé récemment

      return await this.repository.create(validatedInput);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Reformater les erreurs Zod pour une meilleure lisibilité
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new Error(`Validation échouée: ${formattedErrors.map((e: any) => `${e.field}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Met à jour un contact existant
   */
  async updateContact(id: string, input: UpdateContactInput): Promise<Contact> {
    // Vérifier que le contact existe
    const existingContact = await this.repository.findById(id);
    if (!existingContact) {
      throw new Error('Contact non trouvé');
    }

    return await this.repository.update(id, input);
  }

  /**
   * Marque un contact comme lu
   */
  async markContactAsRead(id: string): Promise<Contact> {
    const existingContact = await this.repository.findById(id);
    if (!existingContact) {
      throw new Error('Contact non trouvé');
    }

    if (existingContact.lu) {
      throw new Error('Le contact est déjà marqué comme lu');
    }

    return await this.repository.markAsRead(id);
  }

  /**
   * Supprime un contact
   */
  async deleteContact(id: string): Promise<void> {
    const existingContact = await this.repository.findById(id);
    if (!existingContact) {
      throw new Error('Contact non trouvé');
    }

    await this.repository.delete(id);
  }

  /**
   * Récupère les statistiques des contacts
   */
  async getContactStats(): Promise<{
    total: number;
    unread: number;
    read: number;
  }> {
    const [total, unread] = await Promise.all([
      this.repository.count(),
      this.repository.countUnread(),
    ]);

    return {
      total,
      unread,
      read: total - unread,
    };
  }
}
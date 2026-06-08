import { prisma } from '../config/database';
import { Contact, CreateContactInput, UpdateContactInput } from '../models/contact.model';

export class ContactsRepository {
  /**
   * Récupère tous les contacts triés par date de création décroissante
   */
  async findAll(): Promise<Contact[]> {
    return await prisma.contact.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Récupère un contact par son ID
   */
  async findById(id: string): Promise<Contact | null> {
    return await prisma.contact.findUnique({
      where: { id },
    });
  }

  /**
   * Crée un nouveau contact
   */
  async create(data: CreateContactInput): Promise<Contact> {
    return await prisma.contact.create({
      data,
    });
  }

  /**
   * Met à jour un contact existant
   */
  async update(id: string, data: UpdateContactInput): Promise<Contact> {
    return await prisma.contact.update({
      where: { id },
      data,
    });
  }

  /**
   * Marque un contact comme lu
   */
  async markAsRead(id: string): Promise<Contact> {
    return await prisma.contact.update({
      where: { id },
      data: { lu: true },
    });
  }

  /**
   * Supprime un contact
   */
  async delete(id: string): Promise<void> {
    await prisma.contact.delete({
      where: { id },
    });
  }

  /**
   * Compte le nombre total de contacts
   */
  async count(): Promise<number> {
    return await prisma.contact.count();
  }

  /**
   * Compte le nombre de contacts non lus
   */
  async countUnread(): Promise<number> {
    return await prisma.contact.count({
      where: { lu: false },
    });
  }
}
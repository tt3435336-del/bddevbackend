import { Context } from 'hono';
import { createContactSchema, updateContactSchema } from '../models/contact.model';
import { ContactsService } from '../services/contacts.service';

// Type pour le contexte Hono étendu
type Variables = {
  user?: { id: string; role: string };
};

type HonoContext = Context<{ Variables: Variables }>;

export class ContactsController {
  constructor(private service: ContactsService) {}

  /**
   * Récupère tous les contacts (admin seulement)
   */
  getAll = async (c: HonoContext) => {
    try {
      const result = await this.service.getAllContacts();

      return c.json({
        success: true,
        data: result.contacts,
        meta: {
          total: result.total,
          unread: result.unread,
        },
      });
    } catch (error) {
      console.error('Erreur récupération contacts:', error);
      return c.json(
        { success: false, error: 'Erreur lors de la récupération des contacts' },
        500
      );
    }
  };

  /**
   * Récupère un contact par ID (admin seulement)
   */
  getById = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }
      const contact = await this.service.getContactById(id);

      if (!contact) {
        return c.json({ success: false, error: 'Contact non trouvé' }, 404);
      }

      return c.json({ success: true, data: contact });
    } catch (error) {
      console.error('Erreur récupération contact:', error);
      return c.json(
        { success: false, error: 'Erreur lors de la récupération du contact' },
        500
      );
    }
  };

  /**
   * Crée un nouveau contact (public)
   */
  create = async (c: HonoContext) => {
    try {
      const body = await c.req.json();
      const newContact = await this.service.createContact(body);

      return c.json(
        {
          success: true,
          data: newContact,
          message: 'Message envoyé avec succès',
        },
        201
      );
    } catch (error) {
      console.error('Erreur création contact:', error);

      if (error instanceof Error && error.message.startsWith('Validation échouée')) {
        return c.json({ success: false, error: error.message }, 400);
      }

      return c.json(
        { success: false, error: 'Erreur lors de l\'envoi du message' },
        500
      );
    }
  };

  /**
   * Met à jour un contact (admin seulement)
   */
  update = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }
      const body = await c.req.json();

      const updatedContact = await this.service.updateContact(id, body);

      return c.json({
        success: true,
        data: updatedContact,
        message: 'Contact mis à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur mise à jour contact:', error);

      if (error instanceof Error && error.message === 'Contact non trouvé') {
        return c.json({ success: false, error: error.message }, 404);
      }

      return c.json(
        { success: false, error: 'Erreur lors de la mise à jour du contact' },
        500
      );
    }
  };

  /**
   * Marque un contact comme lu (admin seulement)
   */
  markAsRead = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }
      const updatedContact = await this.service.markContactAsRead(id);

      return c.json({
        success: true,
        data: updatedContact,
        message: 'Contact marqué comme lu',
      });
    } catch (error) {
      console.error('Erreur marquage contact lu:', error);

      if (error instanceof Error && (error.message === 'Contact non trouvé' || error.message === 'Le contact est déjà marqué comme lu')) {
        return c.json({ success: false, error: error.message }, 400);
      }

      return c.json(
        { success: false, error: 'Erreur lors du marquage du contact' },
        500
      );
    }
  };

  /**
   * Supprime un contact (admin seulement)
   */
  delete = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }
      await this.service.deleteContact(id);

      return c.json({
        success: true,
        message: 'Contact supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur suppression contact:', error);

      if (error instanceof Error && error.message === 'Contact non trouvé') {
        return c.json({ success: false, error: error.message }, 404);
      }

      return c.json(
        { success: false, error: 'Erreur lors de la suppression du contact' },
        500
      );
    }
  };

  /**
   * Récupère les statistiques des contacts (admin seulement)
   */
  getStats = async (c: HonoContext) => {
    try {
      const stats = await this.service.getContactStats();

      return c.json({ success: true, data: stats });
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      return c.json(
        { success: false, error: 'Erreur lors de la récupération des statistiques' },
        500
      );
    }
  };
}
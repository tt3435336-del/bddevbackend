import { Context } from 'hono';
import { PersonalizationsService } from '../services/personalizations.service';

type HonoContext = Context;

export class PersonalizationsController {
  constructor(private service: PersonalizationsService) {}

  getAll = async (c: HonoContext) => {
    try {
      const requests = await this.service.getAllRequests();
      return c.json({ success: true, data: requests });
    } catch (error) {
      console.error('Erreur recuperation demandes:', error);
      return c.json({ success: false, error: 'Erreur lors de la recuperation des demandes' }, 500);
    }
  };

  create = async (c: HonoContext) => {
    try {
      const body = await c.req.json();
      const request = await this.service.createRequest(body);
      return c.json({ success: true, data: request, message: 'Demande creee avec succes' }, 201);
    } catch (error) {
      console.error('Erreur creation demande:', error);

      if (error instanceof Error && error.message.startsWith('Validation echouee')) {
        return c.json({ success: false, error: error.message }, 400);
      }

      return c.json({ success: false, error: 'Erreur lors de la creation de la demande' }, 500);
    }
  };

  updateStatus = async (c: HonoContext) => {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'ID manquant' }, 400);
      }

      const body = await c.req.json();
      const request = await this.service.updateStatus(id, body);
      return c.json({ success: true, data: request, message: 'Statut mis a jour avec succes' });
    } catch (error) {
      console.error('Erreur mise a jour demande:', error);

      if (error instanceof Error) {
        if (error.message === 'Demande non trouvee') {
          return c.json({ success: false, error: error.message }, 404);
        }

        if (error.message.startsWith('Validation echouee')) {
          return c.json({ success: false, error: error.message }, 400);
        }
      }

      return c.json({ success: false, error: 'Erreur lors de la mise a jour de la demande' }, 500);
    }
  };
}

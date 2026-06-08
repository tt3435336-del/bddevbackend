import { prisma } from '../config/database';
import {
  CreatePersonalizationInput,
  PersonalizationRequest,
} from '../models/personalization.model';

export class PersonalizationsRepository {
  async findAll(): Promise<PersonalizationRequest[]> {
    return await prisma.demandePersonnalisation.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findById(id: string): Promise<PersonalizationRequest | null> {
    return await prisma.demandePersonnalisation.findUnique({
      where: { id },
    });
  }

  async create(data: CreatePersonalizationInput): Promise<PersonalizationRequest> {
    return await prisma.demandePersonnalisation.create({
      data: {
        entreprise: data.entreprise,
        telephone: data.telephone,
        details: data.details ?? '',
        logo_url: data.logo_url ?? '',
      },
    });
  }

  async updateStatus(id: string, statut: string): Promise<PersonalizationRequest> {
    return await prisma.demandePersonnalisation.update({
      where: { id },
      data: { statut },
    });
  }
}

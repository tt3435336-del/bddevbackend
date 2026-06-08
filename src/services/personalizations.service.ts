import { z } from 'zod';
import {
  createPersonalizationSchema,
  CreatePersonalizationInput,
  PersonalizationRequest,
  updatePersonalizationStatusSchema,
  UpdatePersonalizationStatusInput,
} from '../models/personalization.model';
import { PersonalizationsRepository } from '../repositories/personalizations.repository';

export class PersonalizationsService {
  constructor(private repository: PersonalizationsRepository) {}

  async getAllRequests(): Promise<PersonalizationRequest[]> {
    return await this.repository.findAll();
  }

  async createRequest(input: CreatePersonalizationInput): Promise<PersonalizationRequest> {
    try {
      const validatedInput = createPersonalizationSchema.parse(input);
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

  async updateStatus(id: string, input: UpdatePersonalizationStatusInput): Promise<PersonalizationRequest> {
    const existingRequest = await this.repository.findById(id);
    if (!existingRequest) {
      throw new Error('Demande non trouvee');
    }

    try {
      const validatedInput = updatePersonalizationStatusSchema.parse(input);
      return await this.repository.updateStatus(id, validatedInput.statut);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation echouee: ${error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')}`
        );
      }
      throw error;
    }
  }
}

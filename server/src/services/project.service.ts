import { getRepository } from '../datastore';
import { Project } from '../entities/Project';

export class ProjectService {
  async all(activeOnly = true) {
    const projRepository = await getRepository(Project);
    const condition = activeOnly ? { active: true } : {};
    return await projRepository.find(condition);
  }
}

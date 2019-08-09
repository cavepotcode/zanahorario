import { getRepository } from '../datastore';
import { Project } from '../entities/Project';
import { Project as ProjectDto } from '../dto/project';

export type ResponseType = 'ok' | 'exists' | 'error';
export type CreateResponse = {
  result: ResponseType;
  data: any;
};

export class ProjectService {
  async all(activeOnly = true): Promise<CreateResponse> {
    const projRepository = await getRepository(Project);
    const condition = activeOnly ? { active: true } : {};
    return await projRepository.find(condition);
  }

  async create(project: ProjectDto) {
    const projRepository = await getRepository(Project);
    const projects = await projRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name: project.name })
      .getMany();

    if (projects.length) {
      return { result: 'exists' };
    }

    const { id } = await projRepository.save({ description: '', ...project });
    return { result: 'ok', data: id };
  }
}

import { EntityRepository, Raw, Repository } from 'typeorm';
import { Timesheet } from '../entities/Timesheet';

@EntityRepository(Timesheet)
export class TimesheetRepository extends Repository<Timesheet> {
  hoursByProject(year: number, month: number): Promise<IHoursByProject[]> {
    return this.getHoursByProject().getRawMany();
  }

  monthlyHoursByProject(year: number, month: number): Promise<IHoursByProject[]> {
    return this.getHoursByProject()
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  monthlyHoursByProjectByUser(year: number, month: number): Promise<IHoursByUserProject[]> {
    return this.getHoursByProject()
      .addGroupBy('time."userId"')
      .addGroupBy('user.initials')
      .innerJoin('time.user', 'user')
      .addSelect('"userId"')
      .addSelect('user.initials as initials')
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  private getHoursByProject() {
    return this.createQueryBuilder('time')
      .groupBy('time."projectId"')
      .select('SUM(time.hours) as total')
      .addSelect('"projectId"');
  }
}

export interface IHoursByProject {
  projectId: number;
  total: number;
}

export interface IHoursByUserProject {
  initials: string;
  projectId: number;
  total: number;
  userId: number;
}

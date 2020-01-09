import { Between, EntityRepository, IsNull, Not, Raw, Repository } from 'typeorm';
import { Timesheet } from '../entities/Timesheet';
import { Expense } from '../entities';

@EntityRepository(Expense)
export class ExpenseRepository extends Repository<Expense> {
  projectsLastEntry(): any {
    return this.createQueryBuilder('time')
      .groupBy('time.project_id')
      .select('time.project_id as "projectId"')
      .addSelect('MAX(time.date)', 'date')
      .getRawMany();
  }

  usersLastEntry(): any {
    return this.createQueryBuilder('time')
      .groupBy('time."user_id"')
      .select('time.user_id as "userId"')
      .addSelect('MAX(time.date)', 'date')
      .getRawMany();
  }

  hoursByProject(year: number, month: number): Promise<IHoursByProject[]> {
    return this.getHoursByProject()
      .innerJoin('time.project', 'project')
      .addGroupBy('project.name')
      .addSelect('project.name as "projectName"')
      .getRawMany();
  }

  hoursByUser(year: number, month: number): Promise<IHoursByUser[]> {
    return this.getHoursByUser()
      .innerJoin('time.user', 'user')
      .addGroupBy('user.name')
      .addSelect('user.name as "userName"')
      .getRawMany();
  }

  monthlyHoursByProject(year: number, month: number): Promise<IHoursByProject[]> {
    return this.getHoursByProject()
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  monthlyHoursByUser(year: number, month: number): Promise<IHoursByUser[]> {
    return this.getHoursByUser()
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  monthlyHoursByProjectByUser(year: number, month: number): Promise<IHoursByUserProject[]> {
    return this.getHoursByProject()
      .addGroupBy('time.user_id')
      .addGroupBy('user.initials')
      .innerJoin('time.user', 'user')
      .addSelect('user_id as "userId"')
      .addSelect('user.initials as initials')
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  monthlyHoursByUserByProject(year: number, month: number): Promise<IHoursByProjectUser[]> {
    return this.getHoursByUser()
      .addGroupBy('time.project_id')
      .addGroupBy('project.name')
      .innerJoin('time.project', 'project')
      .addSelect('project_id as "projectId"')
      .addSelect('project.name as "projectName"')
      .where("DATE_PART('year', date) = :year AND DATE_PART('month', date) = :month", { year, month })
      .getRawMany();
  }

  // userTimesheets(userId: number, from: Date, to: Date): Promise<Timesheet[]> {
  //   return this.find({
  //     where: {
  //       userId,
  //       date: Between(from, to),
  //       hours: Not(IsNull())
  //     }
  //   });
  // }

  mostRecentProjects(userId: number, count: number = 2): Promise<{ projectId: number }[]> {
    return this.createQueryBuilder()
      .where('user_id = :id', { id: userId })
      .limit(count)
      .groupBy('project_id')
      .addGroupBy('user_id')
      .select('project_id as "projectId"')
      .orderBy('MAX(date)', 'DESC')
      .getRawMany();
  }

  private getHoursByProject() {
    return this.createQueryBuilder('time')
      .groupBy('time."project_id"')
      .select('SUM(time.hours) as total')
      .addSelect('project_id as "projectId"');
  }

  private getHoursByUser() {
    return this.createQueryBuilder('time')
      .groupBy('time."user_id"')
      .select('SUM(time.hours) as total')
      .addSelect('user_id as "userId"');
  }

  // TODO:
  private getExpenses() {
    return this.createQueryBuilder('expense').select('SUM(expense.amount) as total');
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

export interface IHoursByUser {
  userId: number;
  total: number;
}

export interface IHoursByProjectUser {
  projectName: string;
  projectId: number;
  total: number;
  userId: number;
}

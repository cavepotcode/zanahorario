import { Raw, Between, LessThan, MoreThan } from 'typeorm';
import { ResponseCode } from '../sdk/constants';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { User } from '../entities/User';
import { Timesheet } from '../entities/Timesheet';
import { getRepository } from '../datastore';
import { groupBy } from '../utilClass';

export class TimesheetService {
  async projectHours(year: number, month: number): Promise<any> {
    const timeRepository = await getRepository(Timesheet);
    const [projectsTime, monthlyProjectTime, monthlyUserTime, lastEntries] = await Promise.all([
      timeRepository.hoursByProject(year, month),
      timeRepository.monthlyHoursByProject(year, month),
      timeRepository.monthlyHoursByProjectByUser(year, month),
      timeRepository.lastEntryByProject()
    ]);

    return projectsTime.map((pTime: any) => {
      const monthHours = monthlyProjectTime.find((mpt: any) => mpt.projectId === pTime.projectId);

      const usersHours = monthlyUserTime
        .filter((mup: any) => mup.projectId === pTime.projectId)
        .map((mup: any) => ({ user: { id: mup.userId, initials: mup.initials }, hours: mup.total }));

      const lastEntry = lastEntries.find((entry: any) => entry.projectId === pTime.projectId);

      const { projectId, projectName, ...projectTime } = pTime;
      return {
        ...projectTime,
        usersHours,
        project: { id: projectId, name: projectName },
        monthHours: monthHours ? monthHours.total : 0,
        lastEntry: lastEntry && lastEntry.date
      };
    });
  }

  async userWeekHours(userId: number, from: Date): Promise<any> {
    const timeRepository = await getRepository(Timesheet);
    const to = new Date(from);
    to.setDate(to.getDate() + 7);

    const result = await timeRepository.find({
      where: {
        userId,
        date: Between(from, to)
      }
    });
    return groupBy(result, 'projectId');
  }

  async add(userId: number, data: any[]) {
    const entries = <Timesheet[]>data.map(entry => ({
      ...entry,
      userId,
      observations: ''
    }));

    const timeRepository = await getRepository(Timesheet);
    return await timeRepository
      .createQueryBuilder()
      .insert()
      .into(Timesheet)
      .values(entries)
      .execute();
  }
}

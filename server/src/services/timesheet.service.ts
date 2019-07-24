import { ResponseCode } from '../sdk/constants';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { User } from '../entities/User';
import { Timesheet } from '../entities/Timesheet';
import { getRepository } from '../datastore';
import { groupBy } from '../utilClass';
import { normalize } from '../utils/date';

export class TimesheetService {
  async projectHours(year: number, month: number): Promise<any> {
    const timeRepository = await getRepository(Timesheet);
    const [projectsTime, monthlyProjectTime, monthlyUserTime, lastEntries] = await Promise.all([
      timeRepository.hoursByProject(year, month),
      timeRepository.monthlyHoursByProject(year, month),
      timeRepository.monthlyHoursByProjectByUser(year, month),
      timeRepository.projectsLastEntry()
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

    const result = await timeRepository.userTimesheets(userId, from, to);
    return groupBy(result, 'projectId');
  }

  async add(userId: number, data: any[]) {
    const entries = <Timesheet[]>data.map(entry => ({
      ...entry,
      userId,
      date: normalize(entry.date) // remove the time, keep only the date
    }));

    const timeRepository = await getRepository(Timesheet);
    return await timeRepository
      .createQueryBuilder()
      .insert()
      .into(Timesheet)
      .values(entries)
      .onConflict('("date", "project_id", "user_id") DO UPDATE SET "hours" = excluded.hours')
      .execute();
  }

  validateEntries(entries: any[]): boolean {
    return !entries.some(entry => entry.hours > 24 || !entry.projectId);
  }
}

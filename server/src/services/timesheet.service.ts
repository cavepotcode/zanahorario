import { Raw } from 'typeorm';
import { ResponseCode } from '../sdk/constants';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { User } from '../entities/User';
import { Timesheet } from '../entities/Timesheet';
import { getRepository } from '../datastore';

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
}

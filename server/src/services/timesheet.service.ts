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
    const [projectsTime, monthlyProjectTime, monthlyUserTime] = await Promise.all([
      timeRepository.hoursByProject(year, month),
      timeRepository.monthlyHoursByProject(year, month),
      timeRepository.monthlyHoursByProjectByUser(year, month)
    ]);

    return projectsTime.map((pTime: any) => {
      const monthHours = monthlyProjectTime.find((mpt: any) => mpt.projectId === pTime.projectId);
      const usersHours = monthlyUserTime
        .filter((mup: any) => mup.projectId === pTime.projectId)
        .map((mup: any) => ({ user: { id: mup.userId, initials: mup.initials }, hours: mup.total }));

      return {
        ...pTime,
        usersHours,
        monthHours: monthHours ? monthHours.total : 0
      };
    });
  }
}

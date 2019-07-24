import { getRepository } from '../datastore';
import { Timesheet } from '../entities/Timesheet';

export class UserService {
  async userHours(year: number, month: number): Promise<any> {
    const userRepository = await getRepository(Timesheet);
    const [usersTime, monthlyUserTime, monthlyProjectTime, lastEntries] = await Promise.all([
      userRepository.hoursByUser(year, month),
      userRepository.monthlyHoursByUser(year, month),
      userRepository.monthlyHoursByUserByProject(year, month),
      userRepository.lastEntryByUser()
    ]);

    return usersTime.map((uTime: any) => {
      const monthHours = monthlyUserTime.find((mut: any) => mut.user_id === uTime.user_id);

      const projectsHours = monthlyProjectTime
        .filter((mpu: any) => mpu.user_id === uTime.user_id)
        .map((mpu: any) => ({ project: { id: mpu.user_id, name: mpu.project_name }, hours: mpu.total }));

      const lastEntry = lastEntries.find((entry: any) => entry.user_id === uTime.user_id);

      const { user_id, userName, ...userTime } = uTime;
      return {
        ...userTime,
        projectsHours,
        user: { id: user_id, name: userName },
        monthHours: monthHours ? monthHours.total : 0,
        lastEntry: lastEntry && lastEntry.date
      };
    });
  }
}

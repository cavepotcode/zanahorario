import { getRepository } from '../datastore';
import { Timesheet } from '../entities/Timesheet';

export class UserService {
  async userHours(year: number, month: number): Promise<any> {
    const userRepository = await getRepository(Timesheet);
    const [usersTime, monthlyUserTime, monthlyProjectTime, lastEntries] = await Promise.all([
      userRepository.hoursByUser(year, month),
      userRepository.monthlyHoursByUser(year, month),
      userRepository.monthlyHoursByUserByProject(year, month),
      userRepository.usersLastEntry()
    ]);

    return usersTime.map((uTime: any) => {
      const monthHours = monthlyUserTime.find((mut: any) => mut.userId === uTime.userId);

      const projectsHours = monthlyProjectTime
        .filter((mpu: any) => mpu.userId === uTime.userId)
        .map((mpu: any) => ({ project: { id: mpu.projectId, name: mpu.projectName }, hours: mpu.total }));

      const lastEntry = lastEntries.find((entry: any) => entry.userId === uTime.userId);

      const { userId, userName, ...userTime } = uTime;
      return {
        ...userTime,
        projectsHours,
        user: { id: userId, name: userName },
        monthHours: monthHours ? monthHours.total : 0,
        lastEntry: lastEntry && lastEntry.date
      };
    });
  }
}

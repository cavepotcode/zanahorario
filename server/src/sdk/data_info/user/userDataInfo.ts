import { IsString } from 'class-validator';

export class UserDataInfo {
  @IsString() id: string;
  email: string;
  initials: string;
  userMonthHours: number;
  color: string;
  name: string;
  imageUrl: string;
}

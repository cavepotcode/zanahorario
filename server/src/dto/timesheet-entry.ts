import { IsArray, IsInt, IsDate, IsOptional } from 'kiwi-server';

export class TimesheetEntry {
  @IsInt() projectId: number;
  @IsDate() date: Date;
  @IsOptional() @IsInt() hours?: number;
}

export class TimesheetEntries {
  @IsArray(() => TimesheetEntry)
  entries: TimesheetEntry[];
}

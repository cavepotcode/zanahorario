export interface ITimesheetEntry {
  date: Date;
  hours?: number;
}

export interface ITimesheet {
  hours: {
    [projectId: number]: ITimesheetEntry[];
  };
}

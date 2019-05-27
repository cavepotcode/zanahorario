export class UtilClass {
  static userId: string;
  static userEmail: string;

  static isNullOrWithSpaces(data: string): boolean {
    return data === null || data === undefined || data.match(/^ *$/) !== null;
  }

  static isNull(data: any): boolean {
    return data === null || data === undefined;
  }

  static setLoggedUser(id: string, email: string): void {
    this.userId = id;
    this.userEmail = email;
  }

  static getDayname(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  static getMonthDay(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[month];
  }

  static dayIsWeekend(day: number): boolean {
    return day === 0 || day === 6;
  }
}

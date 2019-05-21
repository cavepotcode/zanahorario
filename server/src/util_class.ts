export class UtilClass {
    static user_id: string;
    static user_email: string;

    static IsNullOrWithSpaces(data: string): boolean {
        return data === null || data === undefined || data.match(/^ *$/) !== null;
    }

    static IsNull(data: any): boolean {
        return data === null || data === undefined;
    }

    static SetLoggedUser(id: string, email: string): void {
        this.user_id = id;
        this.user_email = email;
    }

    static GetDayname(day: number): string {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day];
    }

    static GetMonthDay(month: number): string {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    static DayIsWeekend(day: number): boolean {
        return day === 0 || day === 6;
    }
}




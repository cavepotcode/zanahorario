import { getRepository } from '../datastore';
import { groupBy } from '../utilClass';
import { normalize } from '../utils/date';
import { Expense } from '../entities/Expense';

export class ExpenseService {
  async expense(year: number, month: number): Promise<any> {
    const expenseRepository = await getRepository(Expense);
    console.log(expenseRepository);
    const result = await Promise.all([expenseRepository.getExpenses(year, month)]);
    console.log('result', result);
  }
}

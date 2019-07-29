import React from 'react';
import {
  fillWeek,
  generateInitialEntries,
  getCompleteWeek,
  getMonthLabel,
  getTimeChanges,
  updateEntries
} from '../helper';
import api from '../../../utils/api';

describe('generateInitialEntries', () => {
  it('should generate entire week', async () => {
    const date = new Date(2019, 6, 29);
    const entries = {
      1: [
        { date: '2019-07-30T00:00:00.000Z', hours: 5, projectId: 1, userId: 1 },
        { date: '2019-07-31T00:00:00.000Z', hours: 6, projectId: 1, userId: 1 }
      ]
    };

    const result = generateInitialEntries(date, entries);

    expect(result).toBeTruthy();
    expect(result.hours).toBeTruthy();
    expect(result.hours[1]).toBeTruthy();
    expect(Object.values(result.hours[1]).length).toBe(7);
  });
});

describe('getCompleteWeek', () => {
  it('should generate entire week', async () => {
    const date = new Date(2019, 6, 29);
    const entries = [
      { date: '2019-07-30T00:00:00.000Z', hours: 5, projectId: 1, userId: 1 },
      { date: '2019-07-31T00:00:00.000Z', hours: 6, projectId: 1, userId: 1 }
    ];

    const result = getCompleteWeek(date, entries);

    expect(result).toBeTruthy();
    expect(Object.values(result).length).toBe(7);
  });
});

describe('getMonthLabel', () => {
  it('should get short month', () => {
    const date = new Date(2019, 7, 29);
    expect(getMonthLabel(date)).toBe('MONTH: Aug');
  });
});

describe('getTimeChanges', () => {
  it('', () => {
    const entries = {
      1: [
        { date: '2019-07-30T00:00:00.000Z', hours: 5, projectId: 1, userId: 1 },
        { date: '2019-07-31T00:00:00.000Z', hours: 6, projectId: 1, userId: 1 }
      ]
    };
    const changes = {
      1: {
        '2019-07-30': 5,
        '2019-07-31': 8, // changes from 6 to 8
        '2019-08-01': 6, // changes from null to 6
        '2019-08-02': '',
        '2019-08-03': '',
        '2019-08-04': '',
        '2019-08-05': ''
      }
    };
    const result = getTimeChanges(1, entries, changes);

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2019-07-31T00:00:00.000Z');
    expect(result[0].hours).toBe(8);
    expect(result[1].date).toBe('2019-08-01');
    expect(result[1].hours).toBe(6);
  });
});

describe('updateEntries', () => {
  it('should add new entry', () => {
    const projectId = 1;
    const entries = {
      1: [
        { projectId, date: '2019-07-30T00:00:00.000Z', hours: 5, userId: 1 },
        { projectId, date: '2019-07-31T00:00:00.000Z', hours: 6, userId: 1 }
      ]
    };

    const changes = [{ projectId, date: '2019-07-30', hours: 2, userId: 1 }];

    const result = updateEntries(entries, changes);
    expect(result).toBeTruthy();
    expect(result[1]).toHaveLength(3);
  });
});

describe('fillWeek', () => {
  const entries = {
    hours: {
      1: {
        '2019-07-30': 6,
        '2019-07-31': 6,
        '2019-08-01': 6,
        '2019-08-02': '', // should fill
        '2019-08-03': '', // should fill
        '2019-08-04': '',
        '2019-08-05': ''
      },
      2: {
        '2019-07-30': '', // should fill
        '2019-07-31': '', // should fill
        '2019-08-01': '', // should fill
        '2019-08-02': 4,
        '2019-08-03': 3,
        '2019-08-04': '',
        '2019-08-05': 6 // Sunday is not filled
      }
    }
  };

  const result = fillWeek(entries);
  expect(result).toHaveLength(5);
  expect(result).toMatchObject([
    { field: 'hours.1.2019-08-02', value: 4 },
    { field: 'hours.1.2019-08-03', value: 5 },
    { field: 'hours.2.2019-07-30', value: 2 },
    { field: 'hours.2.2019-07-31', value: 2 },
    { field: 'hours.2.2019-08-01', value: 2 }
  ]);
});

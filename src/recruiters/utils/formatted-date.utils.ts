import { subDays, format } from 'date-fns';

export function FormattedDate(executionDate: Date): string {
  const newDay = subDays(executionDate, 1);

  const day = format(newDay, 'd');
  const month = format(newDay, 'M');

  const dateCronJob = `0 0 13 ${day} ${month} *`;

  return dateCronJob;
}

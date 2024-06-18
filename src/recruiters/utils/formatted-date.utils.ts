import { format } from 'date-fns';

export function FormattedDate(executionDate: Date): string {
  const day = format(executionDate, 'd');
  const month = format(executionDate, 'M');

  const dateCronJob = `0 25 18 ${day} ${month} *`;

  return dateCronJob;
}

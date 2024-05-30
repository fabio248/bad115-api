export function getSortOptions<T>(fields: Array<keyof T>): string[] {
  return fields.reduce((acc, field) => {
    return acc.concat([`${String(field)}-asc`, `${String(field)}-desc`]);
  }, [] as string[]);
}

export function getSortObject(sort: string) {
  return sort.split(',').reduce((acum, sortItem) => {
    const [field, order] = sortItem.split('-');
    return { ...acum, ...{ [field]: order } };
  }, {});
}

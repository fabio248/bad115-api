export function getSortOptions<T>(
  fields: Array<keyof T | { [key: string]: string }>,
): string[] {
  return fields.reduce((acc, field) => {
    if (typeof field === 'object') {
      // If the field is an object, recursively call getSortOptions on the object's fields
      Object.keys(field).forEach((key) => {
        const nestedFields = getSortOptions([field[key]]);
        acc = acc.concat(
          nestedFields.map((nestedField) => `${key}.${nestedField}`),
        );
      });
    } else {
      // If the field is not an object, add it to the sort options
      acc = acc.concat([`${String(field)}-asc`, `${String(field)}-desc`]);
    }
    return acc;
  }, [] as string[]);
}

export function getSortObject(sort: string) {
  return sort.split(',').reduce((acum, sortItem) => {
    const [field, order] = sortItem.split('-');

    if (field.split('.').length > 1) {
      const [nestedField, nestedNestedField] = field.split('.');
      return { ...acum, ...{ [nestedField]: { [nestedNestedField]: order } } };
    }

    return { ...acum, ...{ [field]: order } };
  }, {});
}

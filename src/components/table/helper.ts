export const prettifyHeader = (header: string): string => {
  return header
    .replaceAll(/[-_]/g, ' ')
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll(/\b\w/g, (c) => c.toUpperCase());
};

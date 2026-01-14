export function isEmptyObject(input: unknown): input is object {
  return typeof input === 'object' && input !== null && Object.keys(input).length === 0;
}

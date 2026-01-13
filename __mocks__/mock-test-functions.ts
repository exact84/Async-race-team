export function testTypeGuard<T>(result: boolean) {
  return function (v: unknown): v is T {
    void v;

    return result;
  };
}

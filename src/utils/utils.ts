export function deepExtend<T>(target: T, ...sources: T[]): T {
  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (
          typeof source[key] === 'object' &&
          typeof target[key] === 'object'
        ) {
          target[key] = deepExtend(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  return target;
}

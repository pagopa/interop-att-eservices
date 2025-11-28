export type Mapping = Record<string, string>;

function flatten(data: unknown, parentKey = ""): Record<string, unknown> {
  if (data === null || typeof data !== "object") {
    return parentKey ? { [parentKey]: data } : {};
  }

  if (Array.isArray(data)) {
    return { [parentKey]: data };
  }

  const entries = Object.entries(data as Record<string, unknown>);

  if (entries.length === 0) {
    return parentKey ? { [parentKey]: {} } : {};
  }

  return entries.reduce((acc, [key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    return {
      ...acc,
      ...flatten(value, fullKey),
    };
  }, {} as Record<string, unknown>);
}

function setProperty(
  obj: unknown,
  path: ReadonlyArray<string>,
  value: unknown
): unknown {
  const [head, ...tail] = path;

  if (!head) {
    return value;
  }

  const index = parseInt(head, 10);
  const isArray = !Number.isNaN(index);

  const currentLevel =
    obj !== undefined && obj !== null ? obj : isArray ? [] : {};

  const nextValue =
    tail.length > 0
      ? setProperty(
          isArray
            ? (currentLevel as ReadonlyArray<unknown>)[index]
            : (currentLevel as Record<string, unknown>)[head],
          tail,
          value
        )
      : value;

  if (Array.isArray(currentLevel)) {
    const len = currentLevel.length;
    if (index >= len) {
      return [
        ...currentLevel,
        ...Array.from({ length: index - len }),
        nextValue,
      ];
    }
    return [
      ...currentLevel.slice(0, index),
      nextValue,
      ...currentLevel.slice(index + 1),
    ];
  }

  return {
    ...(currentLevel as Record<string, unknown>),
    [head]: nextValue,
  };
}

function unflatten(data: Record<string, unknown>): unknown {
  if (Object.prototype.toString.call(data) !== "[object Object]") {
    return data;
  }

  return Object.entries(data).reduce<unknown>(
    (acc, [key, value]) => setProperty(acc, key.split("."), value),
    {}
  );
}

export function translateKeys<T = unknown>(
  obj: unknown,
  mapping: Mapping,
  returnFlat = false
): T {
  if (!obj) {
    return obj as T;
  }

  const flatObj = flatten(obj);

  const newFlatObj = Object.entries(flatObj).reduce((acc, [key, value]) => {
    const newKey = mapping[key];
    if (newKey) {
      return { ...acc, [newKey]: value };
    }
    return acc;
  }, {} as Record<string, unknown>);

  if (returnFlat) {
    return newFlatObj as unknown as T;
  }

  return unflatten(newFlatObj) as T;
}

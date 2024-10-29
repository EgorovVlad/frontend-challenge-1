export function autoBindClassMethods<T>(instance: T) {
  const prototype = Object.getPrototypeOf(instance);

  // Iterate over all properties in the prototype
  Object.getOwnPropertyNames(prototype).forEach((propertyName) => {
    const property = prototype[propertyName];

    // Check if the property is a function and not the constructor
    if (typeof property === 'function' && propertyName !== 'constructor') {
      (instance as Record<string, unknown>)[propertyName] = property.bind(instance);
    }
  });
}

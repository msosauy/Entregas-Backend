function findDifferentValues(obj1, obj2) {
    const differences = {};
  
    // Iterate through the properties of obj1
    for (const key in obj1) {
      // Check if the property exists in obj2
      if (obj2.hasOwnProperty(key)) {
        // If the values are different, add to differences object
        if (obj1[key] !== obj2[key]) {
          differences[key] = obj2[key]; // Store both values
        }
      } else {
        // If the property doesn't exist in obj2, add it to differences
        differences[key] = [obj1[key], undefined]; // Store the value from obj1 and undefined for obj2
      }
    }
  
    // Check for properties in obj2 that are missing in obj1
    for (const key in obj2) {
      if (!obj1.hasOwnProperty(key)) {
        differences[key] = [undefined, obj2[key]]; // Store undefined for obj1 and the value from obj2
      }
    }
  
    return differences;
  }
  
  // Example usage:
  const object1 = { a: 1, b: 2, c: 3 };
  const object2 = { a: 1, b: 5, d: 4 };
  
  const result = findDifferentValues(object1, object2);
  console.log(result);
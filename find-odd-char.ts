const findOdd = (str: string) => {
  // Get array of unique characters in given string
  const uniqueChars = [...new Set(str)];
  // Use array find function with test callback: if character occurs an odd number of times in the string.
  // For perfomance, using regex to count the number of occurs of a character in string.
  const result = uniqueChars.find((char) => (str.match(new RegExp(char,"g")) || []).length % 2 !== 0 );
  return result;
}

console.log(findOdd("abb")); // a
console.log(findOdd("7c7@@@c7@")); // 7
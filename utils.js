// Jai Ganesh
// Encodes with even parity
const encode = (message) => {
  try {
    if (!message || typeof message !== "string") {
      throw new Error("Invalid input: 'message' must be a non-empty string.");
    }

    // Input validation: Check if codeword contains only 0s and 1s
    if (!/^[01]+$/.test(message)) {
      throw new Error("Invalid input: 'message' must contain only 0s and 1s.");
    }

    // Reverse the message because Most significant bit (Right most bit is considered as first bit)
    const reversedMessage = message.split("").reverse();
    const messageLen = message.length;

    // Calculate number of redundant bits
    let redundantBitsCount = 1;

    // 2^r >= m+r+1
    while (
      Math.pow(2, redundantBitsCount) <
      messageLen + redundantBitsCount + 1
    ) {
      redundantBitsCount++;
    }

    // Size of code word is message bits plus redundant bits
    const size = messageLen + redundantBitsCount;
    const codeword = new Array(size).fill(0);

    // Parity array: 1st row stores parity bit values, 2nd row stores parity bit positions
    const parity = new Array(2)
      .fill(0)
      .map(() => Array(redundantBitsCount).fill(0));

    for (let index = 0; index < redundantBitsCount; index++) {
      parity[1][index] = Math.pow(2, index);
    }

    // Parity bits are at 2^power positions, assign rest of bit positions to message bits
    let codeIndex = 0,
      messageIndex = 0;
    while (codeIndex < size && messageIndex < messageLen) {
      if (((codeIndex + 1) & codeIndex) !== 0) {
        codeword[codeIndex] = parseInt(reversedMessage[messageIndex]);
        messageIndex++;
      }
      codeIndex++;
    }

    // Parity generation
    let parityIndex = 0;
    while (parityIndex < redundantBitsCount) {
      const parityBitPosition = parity[1][parityIndex];

      let parityCount = 0;
      let codeParityIndex = parityBitPosition - 1;

      while (codeParityIndex < size) {
        for (
          let currentIndex = codeParityIndex;
          currentIndex <= codeParityIndex + parityBitPosition - 1 &&
          currentIndex < size;
          currentIndex++
        ) {
          if (codeword[currentIndex] === 1) {
            parityCount++;
          }
        }
        codeParityIndex = codeParityIndex + 2 * parityBitPosition;
      }

      // Following even parity
      parity[0][parityIndex] = parityCount % 2 === 0 ? 0 : 1;
      parityIndex++;
    }

    // Putting parity bits in their position inside codeword
    let ind = 0,
      codeInd = 0;
    while (ind < redundantBitsCount && codeInd < size) {
      codeword[codeInd] = parity[0][ind];
      codeInd = codeInd + Math.pow(2, ind);
      ind++;
    }
    codeword.reverse();

    return codeword.join("");
  } catch (error) {
    console.error("Error in encode function:", error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// Validate with even parity
const validate = (codeword) => {
  try {
    // Input validation
    if (!codeword || typeof codeword !== "string") {
      throw new Error("Invalid input: 'codeword' must be a non-empty string.");
    }

    // Input validation: Check if codeword contains only 0s and 1s
    if (!/^[01]+$/.test(codeword)) {
      throw new Error("Invalid input: 'codeword' must contain only 0s and 1s.");
    }

    // Reverse the codeword
    const reversedCodeWord = codeword.split("").reverse();
    const size = codeword.length;

    // Calculate the number of checking bits
    let checkingBitsCount = 1;
    while (Math.pow(2, checkingBitsCount) < size) {
      checkingBitsCount++;
    }

    const checkingBits = new Array(2)
      .fill(0)
      .map(() => new Array(checkingBitsCount).fill(0));

    for (let index = 0; index < checkingBitsCount; index++) {
      checkingBits[1][index] = Math.pow(2, index);
    }

    // Compute parity for checking bits
    let checkingBitIndex = 0;
    while (checkingBitIndex < checkingBitsCount) {
      const checkingBitPosition = checkingBits[1][checkingBitIndex];

      let checkingBitParityCount = 0;
      let checkBitStartIndex = checkingBitPosition - 1;

      while (checkBitStartIndex < size) {
        for (
          let currentIndex = checkBitStartIndex;
          currentIndex <= checkBitStartIndex + checkingBitPosition - 1 &&
          currentIndex < size;
          currentIndex++
        ) {
          if (reversedCodeWord[currentIndex] === "1") {
            checkingBitParityCount++;
          }
        }
        checkBitStartIndex = checkBitStartIndex + 2 * checkingBitPosition;
      }

      // Because we are following even parity
      checkingBits[0][checkingBitIndex] =
        checkingBitParityCount % 2 === 0 ? 0 : 1;

      checkingBitIndex++;
    }

    // Check for error position
    let value = 0;
    for (let index = 0; index < checkingBitsCount; index++) {
      if (checkingBits[0][index] === 1) {
        value = value + Math.pow(2, index);
      }
    }

    // Value 0 means No error in the codeword
    if (value === 0) {
      return {
        isValid: true,
        correctedCodeWord: codeword,
        errorBitPosition: -1,
      };
    } else {
      // Error detected, correct the codeword
      let correctedCodeWord = reversedCodeWord;
      correctedCodeWord[value - 1] =
        correctedCodeWord[value - 1] === "1" ? "0" : "1";
      correctedCodeWord = correctedCodeWord.reverse().join("");

      return {
        isValid: false,
        correctedCodeWord: correctedCodeWord,
        errorBitPosition: value,
      };
    }
  } catch (error) {
    console.error("Error in validate function:", error.message);
    throw error; // Re-throw the error to propagate to the caller
  }
};

// Decodes codewords with maximum one error bit to correct original message bits
const decode = (codeword) => {
  try {
    // Input validation
    if (!codeword || typeof codeword !== "string") {
      throw new Error("Invalid input: 'codeword' must be a non-empty string.");
    }

    // Input validation: Check if codeword contains only 0s and 1s
    if (!/^[01]+$/.test(codeword)) {
      throw new Error("Invalid input: 'codeword' must contain only 0s and 1s.");
    }

    // Validate and correct the codeword
    const { correctedCodeWord } = validate(codeword);

    // Reverse the corrected codeword
    const reversedCodeWord = correctedCodeWord.split("").reverse();

    const message = [];

    // Extract message bits (skip parity bits)
    for (let index = 0; index < reversedCodeWord.length; index++) {
      if (((index + 1) & index) !== 0) {
        message.push(reversedCodeWord[index]);
      }
    }

    // Return the decoded message
    return { message: message.reverse().join("") };
  } catch (error) {
    console.error("Error in decode function:", error.message);
    throw error; // Re-throw the error to propagate to the caller
  }
};

module.exports = {
  encode,
  validate,
  decode,
};

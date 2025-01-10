# Hamming code service

## Introduction

> Hamming code is an error-correcting code used to detect and correct single-bit errors in data transmission or storage.

> This document outlines the API endpoints and features of the "Hamming code service" project.

---

## API Endpoints

1. Encode message

   - Endpoint: `/encode`
   - Method: POST <br/>
   - Request body:
     ```
     {
      "message": "1011001"
     }
     ```
   - Description: Encodes original message into codeword with even parity
   - Response body:
     ```
     {
      "codeword": "10101001110"
     }
     ```

2. Validate codeword

   - Endpoint: `/validate`
   - Request body:
     ```
      {
        "codeword": "10101001110"
      }
     ```
   - Description: Validates whether the code is valid or not and correctd thr code word if there is onebit error in the codeword
   - Response body:
     ```
     {
        "isValid": true,
        "correctedCodeWord": "10101001110",
        "errorBitPosition": -1
     }
     ```
     `errorBitPosition` with value `-1` and `isValid` with value `true` indicates `codeword` is valid and no error is present.<br/><br/>
     `correctedCodeWord` gives the corrected codeword with upto one bit error corrected.

3. Decodes the codeword

   - Endpoint: `/decode`
   - Method: POST <br/>
   - Request body:
     ```
     {
       "codeword": "10101001110"
     }
     ```
   - Description: Decodes codewords with maximum one error bit to correct original message bits
   - Response body:
     ```
     {
       "message": "1011001"
     }
     ```

## Project Structure

### The project is structured as follows:

- `index.js`: Main entry point of the application.
- `utils.js`: Utility functions for encoding, validating and decoding hotels.

## Installation and Setup

1.  Clone the repository: `https://github.com/JigarRajput/hamming-code-api.git`

2.  Navigate to the project directory: `cd hamming-code-api`

3.  Install dependencies: `npm install`

4.  Start the server: `node index.js`

5.  Access the application at: `http://localhost:3000`

---

## If you want to try it live, here is the url: [`https://trip-with-us-backend-apis.vercel.app/hotels`](https://trip-with-us-backend-apis.vercel.app/hotels)

Made with ❤️ by Jigar

import http from "k6/http";

export const options = {
  scenarios: {
    high_load_test: {
      executor: "constant-arrival-rate",
      rate: 2500, // 10,000 iterations per second
      timeUnit: "1s", // Spread 10,000 iterations over 1 second
      duration: "1s", // Run for 1 second
      preAllocatedVUs: 1000, // Allocate 10,000 VUs beforehand
      maxVUs: 1200, // Allow up-to 12,000 VUs if needed
    },
  },
};
export default function () {
  http.post(
    "http://localhost:3000/encode",
    JSON.stringify({ message: "1011001" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

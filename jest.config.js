module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  }
}
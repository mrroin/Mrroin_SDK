module.exports = {
  verbose: true,
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.[j]sx?$": "babel-jest",
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: ["src/**/*.{jsx,ts,tsx}", "!src/polyfills.ts"],
  testRegex: "(\\.|/)(test|spec)\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  transformIgnorePatterns: [
    "/node_modules/(?!intl-messageformat|intl-messageformat-parser).+\\.js$",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

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
  collectCoverageFrom: [
    "src/**/*.{jsx,ts,tsx}",
    "!src/polyfills.ts",
    "!src/index.d.ts",
    "!src/service/index.d.ts",
    "!src/service/schemaApp.ts",
    "!src/service/theme.ts",
    "!src/service/Uri.ts",
    "!src/schemaApp.ts",
  ],
  testRegex: "(\\.|/)(test|spec)\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  transformIgnorePatterns: [
    "/node_modules/(?!intl-messageformat|intl-messageformat-parser).+\\.js$",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

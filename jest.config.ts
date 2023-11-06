module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(lit-html|lit-element|lit|@lit)/)",
  ],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": [
      "babel-jest",
      {
        presets: ["@babel/preset-env"],
        plugins: [["@babel/transform-runtime"]],
      },
    ],
  },
};

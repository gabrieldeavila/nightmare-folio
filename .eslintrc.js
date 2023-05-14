module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "standard-with-typescript"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    // 1-> warning
    "@typescript-eslint/no-unused-vars": 1,
    semi: [2, "always"],
    quotes: [2, "double", { avoidEscape: true }],
    "comma-dangle": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/comma-dangle": "off",
    "react/prop-types": 1,
    "no-debugger": 0,
    // disable strict-boolean-expressions when is boolean
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        allowNullableBoolean: true,
        allowAny: true,
      },
    ],
  },
};

const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const typescriptEslintParser = require("@typescript-eslint/parser");
const path = require("path");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [
    {
        ignores: [
            "eslint.config.cjs",
            "vitest.config.ts",
            "**/src/model/generated/*.ts",
            "**/dist/**",
            "**/patchZodios.ts",
        ],
    },
    ...compat.extends("@pagopa/eslint-config"),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ["./packages/*/tsconfig.json", "./packages/*/test/tsconfig.json"],
            },
        },
        rules: {
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "default-case": "off",
            "prefer-arrow/prefer-arrow-functions": "off",
            eqeqeq: ["error", "smart"],
            "@typescript-eslint/consistent-type-definitions": "off",
            "sort-keys": "off",
            "functional/prefer-readonly-type": "off",
            "@typescript-eslint/no-shadow": "off",
            "extra-rules/no-commented-out-code": "off",
            "sonarjs/no-duplicate-string": "off",
            "max-lines-per-function": "off",
            "@typescript-eslint/naming-convention": "off",
            "@typescript-eslint/no-use-before-define": "off",
        },
    },
];
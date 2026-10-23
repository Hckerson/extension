// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const MAX_FILE_LINES = 150;

const BACKGROUND = ['src/background/**/*.{ts,tsx}'];
const CONTENT = ['src/content/**/*.{ts,tsx}'];
const POPUP = ['src/popup/**/*.{ts,tsx}'];
const UTILS = ['src/utils/**/*.{ts,tsx}'];
const SOURCE = [...BACKGROUND, ...CONTENT, ...POPUP, ...UTILS];
const TESTS = ['**/*.test.ts'];

const ID_SOURCE = 'IDs come from nanoid — never uuid or Date.now().';

const restrictedImports = [
    'error',
    {
        paths: [
            { name: 'uuid', message: ID_SOURCE },
        ],
        patterns: [
            {
                group: ['../*', '../**'],
                message: 'Import through the alias (@background, @content, @popup, @utils, @types). Deep-relative paths break when a file moves.',
            },
        ],
    },
];

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs', 'dist/**'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                chrome: 'readonly',
            },
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: SOURCE,
        rules: {
            'no-restricted-imports': restrictedImports,
            'max-lines': [
                'error',
                {
                    max: MAX_FILE_LINES,
                    skipBlankLines: false,
                    skipComments: false,
                },
            ],
            'no-console': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            'no-restricted-properties': [
                'error',
                { object: 'Date', property: 'now', message: ID_SOURCE },
            ],
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
        },
    },
    {
        files: BACKGROUND,
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        { name: '@content/*', message: 'Background scripts cannot directly import content scripts. Use messaging.' },
                        { name: '@popup/*', message: 'Background scripts cannot directly import popup. Use messaging.' },
                    ],
                },
            ],
        },
    },
    {
        files: CONTENT,
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        { name: '@background/*', message: 'Content scripts cannot directly import background scripts. Use messaging.' },
                        { name: '@popup/*', message: 'Content scripts cannot directly import popup. Use messaging.' },
                    ],
                },
            ],
        },
    },
    {
        files: POPUP,
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        { name: '@content/*', message: 'Popup cannot directly import content scripts. Use messaging.' },
                    ],
                },
            ],
        },
    },
    {
        files: TESTS,
        rules: { 'max-lines': 'off' },
    },
);

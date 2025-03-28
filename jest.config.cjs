// For ignoring any troublesome ESM modules that throw import errors
const esmModules = [
].join('|');

module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!node_modules/**',
    ],
    coveragePathIgnorePatterns: [
        // Don't show coverage data for code we don't need to unit test
        '/.*/constants',
        '/.*/constants.ts',
        '/.*/decorators',
        '/.*/decorators.ts',
        '/.*/types',
        '/.*/types.ts',
    ],
    coverageThreshold: {
    },
    moduleFileExtensions: ['js', 'ts'],
    extensionsToTreatAsEsm: ['.ts'],
    resolver: 'ts-jest-resolver',
    transform: {
        '^.+\\.ts?$': [
            '@swc/jest',
        ],
    },
    transformIgnorePatterns: [
        `<rootDir>/node_modules/(?!${esmModules})`,
    ],
    moduleNameMapper: {
        // Add any mocks here as needed
    },
};

/* eslint-disable @typescript-eslint/no-require-imports */
const config = require('./jest.config');
config.testMatch = ['**/*.e2e.ts'];
module.exports = config;

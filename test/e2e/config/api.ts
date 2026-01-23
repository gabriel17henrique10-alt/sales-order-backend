import cds from '@sap/cds';
import { resolve } from 'path';

const rootDir = resolve(__dirname, '..', '..', '..');
const api = cds.test(rootDir);
api.axios.defaults.auth = { username: 'joaozinho', password: '123456' };

export { api };

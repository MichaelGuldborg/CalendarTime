import packageJson from '../../package.json';

const API_ENV: string | undefined = process.env.REACT_APP_API_ENV || 'development';

const isProductionMode = API_ENV === 'production';
const isDevelopmentMode = API_ENV === 'development' || API_ENV === 'staging';
const isLocalhostMode = API_ENV === 'localhost';

export const config = {
    API_ENV,
    isLocalhostMode,
    isDevelopmentMode,
    isProductionMode,
    name: packageJson['name'],
    version: packageJson['version'],
}
export default config;
import packageJson from '../../package.json';

const API_ENV: string | undefined = process.env.REACT_APP_API_ENV || 'development';

const isProductionMode = API_ENV === 'production';
const isDevelopmentMode = API_ENV === 'development' || API_ENV === 'staging';
const isLocalhostMode = API_ENV === 'localhost';

const googleClientId = '419934641506-16mqcque3vpo5gcath9vsupqvq02a7ug.apps.googleusercontent.com';
const googleClientSecret = 'bdoIGHNODMTeLlV4X-6FvS0m';
const googleCalendarAPIKey = 'AIzaSyA38EM1jX0DMDaGu8Xq_GgX04hAbcq9ezU';

export const config = {
    API_ENV,
    isLocalhostMode,
    isDevelopmentMode,
    isProductionMode,
    name: packageJson['name'],
    version: packageJson['version'],
    googleClientId,
}
export default config;
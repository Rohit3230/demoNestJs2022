
export default () => {
    let envFile: string = ''
    console.log('NODE_ENV*****',process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case 'live':
            envFile = '.env'
            break;
        default:
            envFile = '.env'
    }
    console.log('Env File****', envFile);
    return envFile;
}
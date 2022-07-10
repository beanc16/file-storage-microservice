// Development environment
const devPort = 8002;
const devBaseUrl = "http://localhost";
const devUrl = `${devBaseUrl}:${devPort}`;

// Production environment
const prodPort = 80;
const prodUrl = "https://file-storage-microservice.herokuapp.com";



module.exports = {
    port: (process.env.PORT) ? process.env.PORT : devPort,

    // Development environment
    devPort: devPort,
    devUrl: devUrl,

    // Production environment
    prodPort: (process.env.PORT) ? process.env.PORT : prodPort,
    prodUrl: prodUrl,
};

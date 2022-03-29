const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Helpdesk - API',
        description: 'A complete description of the Helpdesk API to handle ticket submission',
    },
    host: 'localhost:8081',
    schemes: ['http'],
    securityDefinitions: {
        type: 'basic',
        in: 'header'
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
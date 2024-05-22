const Hapi = require('@hapi/hapi');
const loadModel = require('../services/loadModel');
require('dotenv').config();
const routes = require('./routes');
const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: process.env.HOST || '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            
            }
        }
    })

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
 
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            })
            newResponse.code(400)
            return newResponse;
        }
 
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }
 
        return h.continue;
    });


    const model = await loadModel();
    server.app.model = model;

    server.route(routes);
    
    
    await server.start()
    console.log(`Server running on ${server.info.uri}`)
})();
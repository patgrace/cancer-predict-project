const predict = require('../services/inferenceService');
const {storeData, readData} = require('../services/storeData');
const crypto = require('crypto');

async function postPredictHandler(request, h){
    const { image } = request.payload;
    const { model } = request.server.app;

    const prediction = await predict(model, image);


    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": prediction.label,
        "suggestion": prediction.suggestion,
        "createdAt": createdAt
    }

    await storeData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data: data
      })
      response.code(201);
      return response;
}

async function getPredictHistoriesHandler(request, h) {
    try {
      const data = await readData(request, h);
  
      return {
        status: 'success',
        message: 'Prediction histories received',
        data: data
      };
    } catch (error) {
      console.error('Error fetching prediction histories:', error);
      return {
        status: 'error',
        message: 'Failed to fetch prediction histories'
      };
    }
  }

  module.exports = postPredictHandler, getPredictHistoriesHandler;
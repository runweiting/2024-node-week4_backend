const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'MetaWall API',
    description:
      'MetaWall API 練習文件，注意事項：登入成功後請點「Authorize」輸入 Token。',
  },
  host: 'https://two024-node-week4.onrender.com',
  schemes: ['http', 'https'],
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

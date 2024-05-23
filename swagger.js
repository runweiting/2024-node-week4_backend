const swaggerAutogen = require('swagger-autogen')();
const axiosExample = `
\`\`\`javascript
const config = {
  headers: { Authorization: token },
};
axios.post('/V2/api/user/check', {}, config)
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });
\`\`\`
`;

const doc = {
  info: {
    title: 'MetaWall API',
    description:
      'MetaWall API 練習文件。<br>' +
      '注意事項：登入成功後請點「Authorize」輸入 Token。<br><br>' +
      '範例程式碼：<br><br>' +
      axiosExample,
  },
  host: 'localhost:3010',
  schemes: ['http', 'https'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'headers',
      name: 'authorization',
      description: '請加上 API Token',
    },
  },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
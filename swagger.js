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
  host: process.env.SWAGGER_HOST,
  // 預設使用 HTTPS 協定來生成 API 請求的 request url
  schemes: ['https', 'http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'authorization',
      description: '請加上 API Token',
    },
  },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

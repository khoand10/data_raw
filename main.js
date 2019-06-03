const axios = require('axios');
const aitool = require('./import');
// axios.get(`http://localhost:3000/api/intents?filter={"where":{"name":"smalltalk.agent.be_clever"}}`).then(
//     (res) => {
//         console.log('res', res.data);
//     }
// );
// aitool.importIntent();

aitool.importTranningData();

// aitool.importResponseData();

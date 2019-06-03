const axios = require('axios')
const intents = require('./Data_raw/Small-talk/Small-talk_entity_required.json')
const tranningData = require('./Data_raw/Small-talk/Small-talk_training_data.json')
const responseData = require('./Data_raw/Small-talk/Small-talk_response_data.json')
const shell = require('shelljs')
const api = "https://ai-mmc-demo.nal.vn"

exports.importIntent = function importIntent (){
    shell.exec(`echo "$(tput setaf 3) import intent...."`)
    Object.keys(intents).map(item => {
        const intentObj = {
            name: item,
            entity_required: [],
            type: 0
        }
        doImportIntent(intentObj);
    });
}

exports.importTranningData = async function importTranningData (){
    shell.exec(`echo "$(tput setaf 3) import tranning data...."`)
    Object.keys(tranningData).map((item, i) => {
        axios.get(`${api}/api/intents?filter={"where":{"name":"${item}"}}`).then(res => {
            if (res.status === 200) {
                tranningData[item].forEach((element, index) => {
                    const data = {
                        intent_id: res.data[0].id,
                        type: 0,
                        content: element
                    }
                    doImportTranning(data);
                });
            } else {
                shell.exec(`echo "$(tput setaf 1) Insert importTranningData: (${item}) Fail!"`)
            }
        })
    });
}

exports.importResponseData = function importResponseData (){
    console.log('import ResponseData....');
    Object.keys(responseData).map((item, i) => {
        axios.get(`${api}/api/intents?filter={"where":{"name":"${item}"}}`).then(res => {
            responseData[item].forEach((element, index) => {
                const data = {
                    intent_id: res.data[0].id,
                    type: 0,
                    answer: element
                }
                doImportResponse(data);
            });
        })
    });
}   

function doImportIntent(data, backoffTime = 1) {
        axios.post(`${api}/api/intents`, data).then(res => {
            if (res.status === 200) {
                shell.exec(`echo "$(tput setaf 2) Insert Intent: (${res.data.name}) Success!"`)
            } else {
                shell.exec(`echo "$(tput setaf 1) Insert Intent: (${data.name}) Fail!"`)
            }
        }).catch((error) => {
            backoff(backoffTime);
            doImportTranning(data, (backoffTime * 2));
            shell.exec(`echo "$(tput setaf 1) Insert intent data: (${data.name}) Fail! ==> Backoff ${error}"`)
        });
}

function doImportResponse(data, backoffTime = 1) {
        axios.post(`${api}/api/intent_response_sentences`, data).then(res => {
            if (res.status === 200) {
                shell.exec(`echo "$(tput setaf 2) Insert response: (${res.data.answer}) Success!"`)
            } else {
                shell.exec(`echo "$(tput setaf 1) Insert response: (${data.answer}) Fail!"`)
            }
        }).catch((error) => {
            backoff(backoffTime);
            doImportTranning(data, (backoffTime * 2));
            shell.exec(`echo "$(tput setaf 1) Insert response data: (${data.answer}) Fail! ==> Backoff ${error}"`)
        });
} 

function doImportTranning(data, backoffTime = 1) {
    axios.post(`${api}/api/intent_training_sentences`, data).then(res => {
        if (res.status === 200) {
            shell.exec(`echo "$(tput setaf 2) Insert tranning data: (${res.data.content}) Success!"`)
        } else {
            shell.exec(`echo "$(tput setaf 1) Insert tranning data: (${data.content}) Fail!"`)
        }
    }).catch((error) => {
        backoff(backoffTime);
        doImportTranning(data, (backoffTime * 2));
        shell.exec(`echo "$(tput setaf 1) Insert tranning data: (${data.content}) Fail! ==> Backoff ${error}"`)
    });
}

function backoff(time) {
    let milliseconds = time * 1000;
    let start = (new Date()).getTime();
    while (((new Date()).getTime() - start) < milliseconds) {
      // do nothing
    }
}

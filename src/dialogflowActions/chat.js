import { DialogflowApiID } from '../configs/dialogflow';
import Dialogflow from "react-native-dialogflow";

const APP_ID = DialogflowApiID;

export const dialogConnect = (session) => {
  Dialogflow.setConfiguration(
    APP_ID, Dialogflow.LANG_ENGLISH, session
  );
};

export const dialogContexts = (context) => {
  const contexts = context;
  
  Dialogflow.setContexts(contexts);
};

export const dialogFlowQuery = (message, sessionId, context) => {
  return new Promise((resolve, reject) => {
    if (!message) {
      reject('message is required.');
      return;
    }

    if (context){
      dialogContexts(context);
    }

    Dialogflow.requestQuery(
      message,
      sessionId,
      result=> { 
        resolve(result)
      }, 
      error=>{
        console.log(error),
        reject(error)
      }, 
    )
  })
};

export const eventQuery = async (eventName, sessionId, onResult, onError) => {

  const DEFAULT_BASE_URL = 'https://api.api.ai/v1/';
  const DEFAULT_API_VERSION = '20150910';

  const data = {
    "event":{  
      "name": eventName
    },
    "lang": "en",
    "sessionId": sessionId
  };

  fetch(DEFAULT_BASE_URL + "query?v=" + DEFAULT_API_VERSION, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + APP_ID,
      'charset': "utf-8"
    },
    body: JSON.stringify(data)
  })
  .then(function (response) {
    var json = response.json().then(onResult)
  })
  .catch(onError);
};
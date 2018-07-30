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

export const dialogFlowQuery = (message, context) => {
  return new Promise((resolve, reject) => {
    if (!message) {
      reject('message is required.');
      return;
    }

    if (context){
      dialogContexts(context);
    }

    Dialogflow.requestQuery(message, 
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

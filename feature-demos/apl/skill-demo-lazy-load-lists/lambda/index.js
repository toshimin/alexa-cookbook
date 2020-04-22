// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const TOKEN = "aplToken";
const colors = require('colors.json'); //Alphabetical list of color objects with name and hex value.
const sequenceDocument = require('./sequenceDocument.json');
const pagerDocument = require('./pagerDocument.json');

const AMOUNT_COLOR_NEIGHBORS = 15;
const COLOR_LIST_ID = "colorList";
const COLOR_SLOT = "color";
const PROMPT = "どうしますか？";
const PAGER_SESSION_VAR = "usePager";
const SEQUENCE_SESSION_VAR = "useSequence";

/**
 * Handles the initial launch intent for the skill.
 */
const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle (handlerInput) {
    const speechText = 'これはAPLの遅延読み込みリストのデモです。タッチするか声で色を選択してください。'
      + 'ヘッダーのページャ、シーケンスを選択して表示を切り替えることができます。現在はシーケンスが表示されています。' + PROMPT;

    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak('このデモスキルを試すにはAPLをサポートしたデバイスが必要です。FireTVやEcho Showのようなデバイスでお試しください。')
        .getResponse();
    }

    //Return the initial datasources with the dynamic Datasource.
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(PROMPT)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: TOKEN,
        version: '1.3',
        document: sequenceDocument,
        datasources: createDataSource(0, AMOUNT_COLOR_NEIGHBORS, colors)
      }).getResponse();
  },
};

/**
 * Handles the voice intent to change the color.
 */
const ChangeColorIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeColorIntent';
  },
  handle (handlerInput) {
    if (!supportsAPL(handlerInput)) {
      return handlerInput.responseBuilder
        .speak('このデモスキルを試すにはAPLをサポートしたデバイスが必要です。FireTVやEcho Showのようなデバイスでお試しください。')
        .getResponse();
    }

    const slot = Alexa.getSlot(handlerInput.requestEnvelope, COLOR_SLOT);
    console.log("Slot:  " + JSON.stringify(slot));
    //Make sure there is a valid slot value.
    if (slot === null || slot.resolutions === null
      || slot.resolutions.resolutionsPerAuthority === null || slot.resolutions.resolutionsPerAuthority[0] === null) {
      return handlerInput.responseBuilder
        .speak('ごめんなさい、色の名前がうまく聞き取れませんでした。タップして背景の色を変えることもできますよ？' + PROMPT)
        .reprompt(PROMPT)
        .getResponse();
    }
    const resolvedSlotValue = slot.resolutions.resolutionsPerAuthority[0].values[0].value;
    const index = parseInt(resolvedSlotValue.id);
    const name = resolvedSlotValue.name;

    const speechText = `はい。色を${name}に変更しました。この色のインデックスは${index}番です。`;

    let document = sequenceDocument;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (sessionAttributes.hasOwnProperty(PAGER_SESSION_VAR) && sessionAttributes[PAGER_SESSION_VAR]) {
      document = pagerDocument;
    }

    //Return the initial data sources.
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(PROMPT)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: TOKEN,
        version: '1.3',
        document: document,
        datasources: createDataSource(index, AMOUNT_COLOR_NEIGHBORS, colors)
      })
      .getResponse();
  },
}

/**
 * Button event handler. Sends a new renderDocument for the color selected at the top..
 */
const ButtonEventHandler = {
  canHandle (handlerInput) {
    // Check for SendEvent sent from the button
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
      && handlerInput.requestEnvelope.request.arguments[0] === 'BUTTON_PRESSED';
  },
  handle (handlerInput) {
    // Figure out which button was pressed by the ID.
    const buttonType = handlerInput.requestEnvelope.request.source.id;
    let name = "sequence", document = sequenceDocument;

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if (buttonType === 'PAGER_BUTTON') {
      sessionAttributes[PAGER_SESSION_VAR] = true;
      sessionAttributes[SEQUENCE_SESSION_VAR] = false;
      name = "pager document";
      document = pagerDocument;
    } else {
      sessionAttributes[SEQUENCE_SESSION_VAR] = true;
      sessionAttributes[PAGER_SESSION_VAR] = false;
    }

    const speechText = `はい。${name}を使ってAPLドキュメントを変更しました。インデックスをゼロ番目にリセットしました。`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(PROMPT)
      .addDirective(
        {
          type: 'Alexa.Presentation.APL.RenderDocument',
          token: TOKEN,
          version: '1.3',
          document: document,
          datasources: createDataSource(0, AMOUNT_COLOR_NEIGHBORS, colors)
        }
      )
      .getResponse();
  }
}

const ChangeColorEventHandler = {
  canHandle (handlerInput) {
    // Check for SendEvent sent from the button
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
  handle (handlerInput) {
    // Take argument sent from the button to speak back to the user
    const arguments = handlerInput.requestEnvelope.request.arguments;
    const name = arguments[0];
    const index = arguments[1];
    const speechText = `はい。色を${name}に変更しました。この色のインデックスは${index}番です。`;

    let document = sequenceDocument;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (sessionAttributes.hasOwnProperty(PAGER_SESSION_VAR) && sessionAttributes[PAGER_SESSION_VAR]) {
      document = pagerDocument;
    }

    //Return the initial datasources.
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(PROMPT)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: TOKEN,
        version: '1.3',
        document: document,
        datasources: createDataSource(index, AMOUNT_COLOR_NEIGHBORS, colors)
      })
      .getResponse();
  }
};

/**
 * Handles LoadIndexListData requests by returning a SendIndexListData directive.
 */
const LoadIndexListDataRequestHandler = {
  canHandle (handlerInput) {
    //Check to make sure this is a LoadIndexListData Request.
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.LoadIndexListData';
  },
  handle (handlerInput) {
    const requestObject = handlerInput.requestEnvelope.request;

    return handlerInput.responseBuilder
      .addDirective({
        type: "Alexa.Presentation.APL.SendIndexListData",
        token: TOKEN,
        correlationToken: requestObject.correlationToken,
        listId: requestObject.listId,
        startIndex: requestObject.startIndex,
        minimumInclusiveIndex: 0,
        maximumExclusiveIndex: colors.length,
        items: getColorsFromIndex(requestObject.startIndex, requestObject.count, colors)
      }).getResponse();
  }
}

const HelpIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle (handlerInput) {
    const speechText = 'これはAPLの遅延読み込みリストのデモです。動作を確認するには、ヘルプと言わずにスキルを起動してください。';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle (handlerInput) {
    const speechText = 'さようなら。';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle (handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

/**
 * This is used to log APL Runtime Errors. This is incredibly useful for monitoring post-certification.
 */
const APLRuntimeErrorHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.RuntimeError';
  },
  handle (handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // We only have one APL token in this example, but this is useful if you have more than one list ID.
    console.error("Errors for APL Document with token: " + request.token);
    request.errors.forEach(element => {
      console.error(JSON.stringify(element)); // You can log more complex metrics using the fields on the request object
    });

    return handlerInput.responseBuilder.getResponse();
  }
};
/**
 * Generic error handler.
 */
const ErrorHandler = {
  canHandle () {
    return true;
  },
  handle (handlerInput, error) {
    console.log(`Error Request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    console.log(`~~~~ Error handled: ${error.stack}`);

    return handlerInput.responseBuilder
      .speak('ごめんなさい。うまく行かないようです。もう一度試してみてください。' + PROMPT)
      .reprompt(PROMPT)
      .getResponse();
  },
};

/**
 * Logs the response on every turn.
 */
const LoggingResponseInterceptor = {
  async process (handlerInput) {
    console.log("Logging Response.");
    console.log(JSON.stringify(handlerInput.responseBuilder.getResponse()));
  }
}

//Helper functions:
/**
 * Creates a data source with both static and dynamicIndexList
 * @param {*} colorIndex
 * @param {*} count
 * @param {*} dataArray
 */
function createDataSource (colorIndex, count, dataArray) {
  return {
    staticDataSource: {
      backgroundColor: dataArray[colorIndex].value,
      headerTitle: "カラーピッカー"
    },
    colorDynamicSource: { //Dynamic list Data source. This matches the second data source Parameter in the APL document.
      type: "dynamicIndexList",
      listId: COLOR_LIST_ID,
      startIndex: colorIndex,
      minimumInclusiveIndex: 0,
      maximumExclusiveIndex: dataArray.length,
      items: getColorsFromIndex(colorIndex, count, dataArray)
    }
  }
}

/**
 * returns the neighboring colors given the index.
 * @param {*} index
 */
function getColorsFromIndex (index, count, dataArray) {
  console.log(`count ${count}, index ${index}`);

  if (index < count / 2) {
    return dataArray.slice(0, count);
  } else if (index > dataArray.length - count / 2) {
    return dataArray.slice(dataArray.length - count, dataArray.length);
  } else {
    return dataArray.slice(index, index + count);
  }
}

/**
 * convenience function for checking if the request supports APL.
 * @param {*} handlerInput
 */
function supportsAPL (handlerInput) {
  const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
  const aplInterface = supportedInterfaces['Alexa.Presentation.APL'];
  return aplInterface !== null && aplInterface !== undefined;
}

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ChangeColorIntentHandler,
    LoadIndexListDataRequestHandler,
    ButtonEventHandler,
    ChangeColorEventHandler,
    APLRuntimeErrorHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  ).addResponseInterceptors(
    LoggingResponseInterceptor
  )
  .addErrorHandlers(
    ErrorHandler
  ).withCustomUserAgent('cookbook/apl-dds/v1')
  .lambda();

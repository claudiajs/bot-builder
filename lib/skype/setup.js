'use strict';

const prompt = require('prompt');
const skReply = require('./reply');
const skParse = require('./parse');

module.exports = function skSetup(api, bot, logError, optionalParser, optionalResponder) {
  let parser = optionalParser || skParse;
  let responder = optionalResponder || skReply;
  
  
  api.post('/skype', request => {
    let arr = [].concat.apply([], request.body),
      skContextId = request.headers.contextid;

    let skHandle = parsedMessage => {
      if (!parsedMessage) return;
      return Promise.resolve(parsedMessage).then(bot)
        .then(botResponse => responder(request.env.skypeAppId, request.env.skypePrivateKey, parsedMessage.sender, botResponse, skContextId))
        .catch(logError);
    };
    
    return Promise.all(arr.map(message => parser(message)).map(skHandle))
      .then(() => 'ok');
  });

  api.addPostDeployStep('skype', (options, lambdaDetails, utils) => {
    return utils.Promise.resolve().then(() => {
      if (options['configure-skype-bot']) {
        utils.Promise.promisifyAll(prompt);

        prompt.start();
        return prompt.getAsync(['Skype App ID', 'Skype Private key'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                skypeAppId: results['Skype App ID'],
                skypePrivateKey: results['Skype Private key']
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment);
          });
      }
    })
      .then(() => `${lambdaDetails.apiUrl}/skype`);
  });
};

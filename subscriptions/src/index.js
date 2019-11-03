const url = require('url');
const aws4 = require('aws4');
const axios = require('axios');

const luke = {
  type: 'Human',
  id: '1000',
  name: 'Luke Skywalker',
  friends: ['1002', '1003', '2000', '2001'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Tatooine',
};

const vader = {
  type: 'Human',
  id: '1001',
  name: 'Darth Vader',
  friends: ['1004'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Tatooine',
};

const han = {
  type: 'Human',
  id: '1002',
  name: 'Han Solo',
  friends: ['1000', '1003', '2001'],
  appearsIn: [4, 5, 6],
};

const leia = {
  type: 'Human',
  id: '1003',
  name: 'Leia Organa',
  friends: ['1000', '1002', '2000', '2001'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Alderaan',
};

const tarkin = {
  type: 'Human',
  id: '1004',
  name: 'Wilhuff Tarkin',
  friends: ['1001'],
  appearsIn: [4],
};

const humanData = {
  '1000': luke,
  '1001': vader,
  '1002': han,
  '1003': leia,
  '1004': tarkin,
};

const humans = [luke, vader, han, leia, tarkin];

const APPSYNC_URL = url.parse(process.env.AWS_APPSYNC_URL);

exports.handler = async (event, context, callback) => {
  console.log("received event: ", JSON.stringify(event.field));

  const cognitoIdentityId = 'us-east-1:6f2b2b71-2ffb-4991-b6d8-41e40292736e';
  const humanIds = event.humanIds;
  return addHumans(cognitoIdentityId, humanIds);
};

async function addHumans(cognitoIdentityId, humanIds) {
  const humans = humanIds.map(humanId => {
    return humanData[humanId];
  });
  const humansInput = humans.map(human => {
    return {
      id: human.id,
      name: human.name,
      homePlanet: human.homePlanet,
    };    
  });

  const data = {
      query: `
            mutation addHumans($channel: String!, $input: [HumanInput]) {
              addHumans(channel: $channel, input: $input) {
                channel
                humans {
                  id
                  name
                }
              }
            }
      `,
      variables: {channel: cognitoIdentityId, input: humansInput}
  };
  
  const request = {
    host: APPSYNC_URL.hostname,
    method: 'POST',
    url: APPSYNC_URL.href,
    data: data,
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' },
    path: APPSYNC_URL.pathname
  };
  
  const signedRequest = aws4.sign({service: 'appsync', ...request});
  delete signedRequest.headers['Host'];
  delete signedRequest.headers['Content-Length'];
  
  try {
    const resp = await axios(signedRequest);
    if (resp && resp.data && resp.data.errors) {
      throw new Error(JSON.stringify(resp.data.errors));
    }
  } catch(err) {
    const msg = err.response && err.response.data || err.request || err.message;
    console.log("failed to do HTTPs addHuman mutation: ", msg);
    return Promise.reject(new Error("failed to do addHuman"));
  }
  
  return Promise.resolve();
}


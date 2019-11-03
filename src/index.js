const luke = {
  type: 'Human',
  id: '1000',
  name: 'Luke Skywalker',
  friends: ['1002', '1003', '2000', '2001'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Tatooine',
};

const humans = [luke];

exports.handler = async (event, context, callback) => {
  console.log("received event: ", JSON.stringify(event.field));

  switch(event.field) {
    case "humans":
      return humans;
    case "addHumans":
      return {
        channel: event.context.arguments.channel,
        humans: event.context.arguments.input
      };
    default:
      return Promise.reject(new Error("unknown field")); 
  }

};

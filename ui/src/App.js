import React from 'react';
import gql from "graphql-tag";
import { Auth, API, graphqlOperation } from "aws-amplify";

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphqlSubscription: {},
      humans: [],
    };
  }

  async setupSubscriptions(cognitoIdentityId) {
    const variables = { channel: cognitoIdentityId };

    const subscription = gql`
      subscription Humans($channel: String!) {
        subscribeToHumans(channel: $channel) {
          channel
          humans {
            id
            name
          }
        }
      }
    `;

    const subs = API.graphql(graphqlOperation(subscription, variables)).subscribe({
      error: (error) => {
        console.log('subsription error', error);
      },
      next: (payload) => {
        const humans = payload.value.data.subscribeToHumans.humans;
        this.setState({ humans: [...this.state.humans, ...humans]});
      },
    });

    this.setState({ graphqlSubscription: subs });
  }

  async componentWillUnmount() {
    this.state.graphqlSubscription.unsubscribe();
  }

  async componentDidMount() {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const identityPoolId = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID;
    const key = `aws.cognito.identity-id.${identityPoolId}`;
    const cognitoIdentityId = cognitoUser.storage.getItem(key);

    await this.setupSubscriptions(cognitoIdentityId);

    const query = gql`
      query {
        humans {
          id
          name
        }
      }
    `;
    const response = await API.graphql(graphqlOperation(query));
    this.setState({ humans: response.data.humans });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.humans.length !== nextState.humans.length) {
      return true;
    }

    return false;  
  }

  render() {
    const humans = this.state.humans.map((human) => {
      return (
        <li key={human.id}>{human.id} - {human.name}</li>
      );
    });

    return (
      <div className="App">
        <div className="App-main">
          <ul>
            {humans}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

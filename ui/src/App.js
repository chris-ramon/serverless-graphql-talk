import React from 'react';
import gql from "graphql-tag";
import { Auth, API, graphqlOperation } from "aws-amplify";

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cognitoUser: undefined,
      graphqlSubscriptionLambda: {},
      graphqlSubscriptionDynamoDB: {},
      humans: [],
    };
  }

  async setupSubscriptionsLambda(cognitoIdentityId) {
    const variables = { channel: cognitoIdentityId };

    const subscription = gql`
      subscription Humans($channel: String!) {
        subscribeToHumansLambda(channel: $channel) {
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
        const humans = payload.value.data.subscribeToHumansLambda.humans;
        this.setState({ humans: [...this.state.humans, ...humans]});
      },
    });

    this.setState({ graphqlSubscriptionLambda: subs });
  }

  async setupSubscriptionsDynamoDB(cognitoIdentityId) {
    const variables = { channel: cognitoIdentityId };

    const subscription = gql`
      subscription Humans($channel: String!) {
        subscribeToHumansDynamoDB(channel: $channel) {
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
        const humans = payload.value.data.subscribeToHumansDynamoDB.humans;
        this.setState({ humans: [...this.state.humans, ...humans]});
      },
    });

    this.setState({ graphqlSubscriptionDynamoDB: subs });
  }

  async componentWillUnmount() {
    this.state.graphqlSubscriptionLambda.unsubscribe();
    this.state.graphqlSubscriptionDynamoDB.unsubscribe();
  }

  async componentDidMount() {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const identityPoolId = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID;
    const key = `aws.cognito.identity-id.${identityPoolId}`;
    const cognitoIdentityId = cognitoUser.storage.getItem(key);

    await this.setupSubscriptionsLambda(cognitoIdentityId);
    await this.setupSubscriptionsDynamoDB(cognitoIdentityId);

    const query = gql`
      query {
        humans {
          id
          name
        }
      }
    `;
    const response = await API.graphql(graphqlOperation(query));
    this.setState({ humans: response.data.humans, cognitoUser });
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

    const { cognitoUser } = this.state;

    return (
      <div className="App">
        <div className="App-main">
          {cognitoUser && <button onClick={() => Auth.signOut()}>Sign Out {cognitoUser.getUsername()}</button>}
          <ul>
            {humans}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;

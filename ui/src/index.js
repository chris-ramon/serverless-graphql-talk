import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_WEBCLIENT_ID,
  },
  aws_appsync_authenticationType: process.env.REACT_APP_AWS_APPSYNC_AUTHENTICATION_TYPE,
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_AWS_APPSYNC_API_URL,
  aws_appsync_region: process.env.REACT_APP_AWS_REGION,
});

const AppWithAuth = withAuthenticator(App, false, [], null, null);

ReactDOM.render(<AppWithAuth />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Login from './app/pages/LoginPage'
import Signup from './app/pages/SignupPage'
import Main from './app/pages/Main'
import NewDiary from './app/pages/NewDiaryPage'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar={true}>
          <Scene key="login" component={Login} title="Login" />
          <Scene key="main" component={Main} title="Main" />
          <Scene key="signup" component={Signup} title="Signup" />
          <Scene key="newDiary" component={NewDiary} title="NewDiary" />
        </Scene>
      </Router>
    )
  }
}



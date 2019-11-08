import React from 'react';
import { withNavigation } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

const withAuth = (Component) => {
  const withNav = withNavigation(class extends React.Component {
    async logOut(screenAuth) {
      await AsyncStorage.clear();
      this.props.navigation.navigate(screenAuth);
    }

    render() {
      return <Component logOut={this.logOut.bind(this)} {...this.props} />;
    }
  });

  return hoistNonReactStatic(withNav, Component);
};
export default withAuth;

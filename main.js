/**
 * A trivial example of a React Native application
 */
import Exponent from 'exponent';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

function doExpensiveOperation() {
  let str = '';
  for (i = 0; i < Math.pow(2, 22); i++) {
    i = str + i;
  }
}

class ExpensiveScene extends React.Component {

  render() {
    // setting timeout so this happens in the middle of the
    // transition, if we do this at the start, it will not even
    // begin doing the transition. both are very bad.
    setTimeout(doExpensiveOperation, 50);

    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text>Expensive!</Text>
      </View>
    )
  }

}

class DeferredExpensiveScene extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });
  }

  renderPlaceholder() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  render() {
    if (!this.state.isReady) {
      return this.renderPlaceholder();
    }

    doExpensiveOperation();

    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text>Deferred expensive!</Text>
      </View>
    )
  }

}

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    return null;
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

};

class MainScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{padding: 20, backgroundColor: '#000', marginBottom: 20,}}
          onPress={() => this.props.navigator.push({component: ExpensiveScene, title: 'Expensive'}) }>
          <Text style={{color: '#fff'}}>Expensive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{padding: 20, backgroundColor: '#000'}}
          onPress={() => this.props.navigator.push({component: DeferredExpensiveScene, title: 'Deferred Expensive'}) }>
          <Text style={{color: '#fff'}}>Expensive but deferred</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

class ExampleApp extends React.Component {
  render() {
    return (
      <Navigator
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper} />
        }
        renderScene={(route, navigator) => {
          let Scene = route.component;

          return <Scene navigator={navigator} />
        }}
        initialRoute={{component: MainScreen, title: 'Main'}} />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});

Exponent.registerRootComponent(ExampleApp);

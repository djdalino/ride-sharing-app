import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigations/AppNavigator';
import { store } from './src/store'
import { Provider } from 'react-redux'
const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider> 
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider> 
    </Provider>
  );
};

export default App;
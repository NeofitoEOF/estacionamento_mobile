import React from 'react';
import Navigation from './src/navigation/navigation';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <Navigation />
    </PaperProvider>
  );
};

export default App;

import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppContent from './AppContent';
import { AuthProvider } from './auth';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

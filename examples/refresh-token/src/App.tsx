import * as React from 'react';
import AppContent from './AppContent';
import { AuthProvider } from './auth';

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

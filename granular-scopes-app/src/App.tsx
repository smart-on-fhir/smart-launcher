import React from 'react';
import './App.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import MainPage from './components/MainPage';

const App: React.FC = () => {
  return (
    <MainPage />
  );
}

export default App;

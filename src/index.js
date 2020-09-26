import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UserStateProvider } from './context/UserStateProvider';
import userReducer, { initialState } from './reducer/userReducer';

ReactDOM.render(
  <React.StrictMode>
    <UserStateProvider initialState={initialState} reducer={userReducer}>
      <App />
    </UserStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


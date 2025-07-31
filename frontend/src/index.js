import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' instead of 'react-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Store from './redux/store';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Create a root

root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

reportWebVitals();

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import '../node_modules/@patternfly/patternfly/patternfly.css'
import './style.css'

const container = document.getElementById('port-forward-app');
const root = createRoot(container);
root.render(<App />);
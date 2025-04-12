import React from 'react';
import ReactDOM from 'react-dom/client';
import WhatsAppLeadDialog from './components/WhatsAppLeadDialog';

function App() {
  return React.createElement(WhatsAppLeadDialog, null);
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(React.createElement(App, null));

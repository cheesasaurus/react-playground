import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BlackBox } from './black-box/BlackBox';
import { IBlackBox } from './black-box/interface';
import { App } from './App';
import { factoryDialogControl } from './components/dialog/DialogControl';

// init black box.
// In practice this would already be done by the engine,
// But for this proof of concept I've made my own in javascript.
declare global {
  interface Window { blackBox: IBlackBox}
}
window.blackBox = new BlackBox();

// init mediators, managers, etc
const dialogControl = factoryDialogControl();

// init view
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App dialogControl={dialogControl}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

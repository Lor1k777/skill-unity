import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit');
bridge.send('VKWebAppSetViewSettings', {
  status_bar_style: 'light'
});
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.js';

vkBridge.send('VKWebAppInit');

createRoot(document.getElementById('root')).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';

import './styles.css';
import { AppConfig } from './AppConfig';

// Инициализация VK Mini App
bridge.send('VKWebAppInit');

bridge.send('VKWebAppSetViewSettings', {
  status_bar_style: 'light'
});

// Рендер приложения
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppConfig />
  </React.StrictMode>
);

// Dev console
if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
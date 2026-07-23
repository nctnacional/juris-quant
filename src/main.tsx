import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registro do Service Worker para suporte a PWA (Instalação no Celular)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso: ', registration.scope);
      })
      .catch((err) => {
        console.log('Service Worker falhou: ', err);
      });
  });
}
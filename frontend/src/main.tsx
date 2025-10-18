import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// Force deployment trigger

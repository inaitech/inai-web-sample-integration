import './App.css';
import Routes from  './routes/AppRoutes';
import React, { useEffect } from 'react';

function App() {
  const inaiScript = 'https://assets.inai.io/checkout/v1/inai.js';
  useEffect(() => {
    let scripts = document.getElementsByTagName('script');
    scripts = [...scripts];
    let inai_script_present_in_app = scripts.find(ele => ele.src === inaiScript);
    if (!inai_script_present_in_app) {
      const script_element = document.createElement('script');
      script_element.src = inaiScript;
      script_element.type = "text/javascript";
      document.body.append(script_element);
    }
  }, [])
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;

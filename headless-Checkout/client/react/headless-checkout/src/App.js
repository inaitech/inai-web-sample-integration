import './App.css';
import Routes from  './routes/AppRoutes';
import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // https://backend-dev.inai-dev.com/checkout/v1/inai.js
    let shouldAppendScript = true;
    if (document.body.lastElementChild.nodeName === 'SCRIPT') {
      shouldAppendScript = document.body.lastElementChild.src !== "https://assets.inai-dev.com/checkout/v1/inai.js";
    }
    if (shouldAppendScript) {
      const script_element = document.createElement('script');
      script_element.src = "https://assets.inai-dev.com/checkout/v1/inai.js";
      script_element.type = "text/javascript";
      document.body.append(script_element);
    }
  }, []);
  
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;

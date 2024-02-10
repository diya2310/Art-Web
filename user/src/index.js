import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
import { ChatContextProvider } from './custom-hooks/ChatContext'
import { ToastContainer, Zoom } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <ChatContextProvider>
    <React.StrictMode>
      <BrowserRouter>
        <ToastContainer theme="dark" position="bottom-center" hideProgressBar={true}
          autoClose={3000} closeOnClick pauseOnHover={false} transition={Zoom}
        />

        <div className=''>
          <App />
        </div>

      </BrowserRouter>
    </React.StrictMode>
  </ChatContextProvider>
);


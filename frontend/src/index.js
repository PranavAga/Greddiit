import React from 'react';
import Authrem from './isAuthreset';
import ReactDOM from 'react-dom/client';
import Home from './routes/home';
import LS from './routes/L-S';
import MyProfile from './routes/MyProfile'
import Error from './routes/root-error';
import ModSG from './routes/modSG';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: "LS/",
      element: <LS/>,
      errorElement: <Error/>,
    },
    {
      path: "MyProfile/",
      element: <MyProfile/>,
      
    },{
      path: 'mysg/:id',
      element: <ModSG/>
    }
    
]);

  ReactDOM.createRoot(document.getElementById("root")).render(
    
    <React.StrictMode>
      {/* <Authrem/> */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayout from '../Layouts/Mainlayout';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/> ,
    children:[
      {
        
      }
    ]
  },
]);

export default router;
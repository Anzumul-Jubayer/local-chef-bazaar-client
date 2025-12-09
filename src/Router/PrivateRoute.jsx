import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import LoadingPage from '../Pages/Loading/LoadingPage';

const PrivateRoute = ({children}) => {
    const {user,loading}=useContext(AuthContext)
    const location=useLocation()
   
    if(loading){
        return <LoadingPage/>
    }
    if(!user){
      return <Navigate to='/login' state={location.pathname}></Navigate>  
    }
    return children
};

export default PrivateRoute;

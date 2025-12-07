import React from 'react';
import Navbar from '../Components/Common/Navbar';
import { Outlet } from 'react-router';
import Footer from '../Components/Common/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default MainLayout;
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import Loading from "./Loading"
import Footer from './Footer'

function MainLayout() {
  const {initialized} = useSelector((state)=> state.auth);
  if(!initialized){
    return <Loading/>
  }
  return (
    <>
        <Navbar/>
        <Outlet/>
        <Footer/>
        
    </>
  )
}

export default MainLayout
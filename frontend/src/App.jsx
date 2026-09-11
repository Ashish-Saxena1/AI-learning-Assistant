import React from 'react'
import { useState, useEffect } from 'react'
import {  Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
// import Navbar from './components/navbar'
import Homepage from './pages/homepage'
import Login from './pages/login'
import Signin from './pages/signin'
import Settings from './pages/settings'
import Documents from './pages/documents'
import Profile from './pages/profile'
// import Flashcards from './pages/flashcards'
import Pdfpage from './pages/pdfpage'
import { useThemeStore } from './store/useThemeStore'


const App = () => {
  const { theme } = useThemeStore();
  const{authUser, isCheckingAuth, checkAuth}=useAuthStore()
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  if(isCheckingAuth && !authUser)
  {
    return <div className="h-screen flex items-center justify-center font-bold text-blue-600">
      {/* <span className="loading loading-infinity loading-xl"></span> */}
      <span className="loading loading-spinner loading-xl"></span>
    </div>
  }
  return (
  <div data-theme={theme}>
    {/* <Navbar/> */}
    <Routes>
      <Route path='/' element={authUser ? <Homepage/> : <Navigate to='/login' />}/>
      <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/' />}/>
      <Route path='/signup' element={!authUser ? <Signin/> : <Navigate to='/' />}/>
      <Route path='/settings' element={<Settings/>}/>
      <Route path='/profile' element={<Profile/>}/>
      {/* <Route path='/flashcards' element={<Flashcards/>}/> */}
      <Route path='/documents' element={<Documents/>}/>
      <Route path='/document/:id' element={<Pdfpage/>}/>
      
      
    </Routes>
  </div>
  )
}

export default App

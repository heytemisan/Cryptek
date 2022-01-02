import React from 'react';
import {Navbar, Welcome, Footer, Services, Transactions} from './components/index'

function App() {

  return (
    <div className="min-h-screen">
      <div className="from-blue-600 via-teal-500 to-purple-500 bg-gradient-to-r w-full h-64 block">
        <Navbar/>
        <Welcome/>
      </div>
      <Services/>
      <Transactions/>
      <Footer/>
    </div>
  )
}

export default App

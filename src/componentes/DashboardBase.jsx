import React from 'react'
import Navbar from './Navbar'

function DashboardBase({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', marginLeft: '260px' }}>
        {children}
      </div>
    </div>
  )
}

export default DashboardBase

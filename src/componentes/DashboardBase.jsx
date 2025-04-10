import React from "react"

function DashboardBase({ children }) {
  return (
    <div style={{ padding: "2rem" }}>
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default DashboardBase

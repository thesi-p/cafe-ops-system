import React from 'react'

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="logo">
          <h2>Coffee Shop</h2>
        </div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </>
  )
}

export default Navbar

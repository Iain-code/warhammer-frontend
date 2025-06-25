import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "../components/Home";
import Upgrade from "../components/Upgrade";
import Donations from "../components/Donations";
import About from "../components/About";

const App = () => {
  return (
    <Router>
      <nav className="navBar">
        <a href="/" className="brand">
          <img src='logo.png' alt="Logo" className="logo" />
        </a>
        <h1 className="title">Average Dice</h1>
        <Link className="home" to="/">Home</Link>
        <Link className="about" to="/about">About</Link>
        <Link className="donations" to="/donations">Donations</Link>
        <Link className="update" to="/login">Login</Link>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/login" element={<Upgrade />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/auth";
import "../CSS/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="navbar">
      <Link to="/" className="home-link">
        <div className="logo">TRIP CLIP</div>
      </Link>
      <div className="button-container">
        {user ? (
          <>
            <div className="avatar">
              <Avatar>{user.username[0]}</Avatar>
            </div>
            <div className="btn">
              <button className="logout-btn" onClick={logout}>
                LogOut
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="btn">
              <Link to="/login">
                <button className="login-btn">Log In</button>
              </Link>
            </div>
            <div className="btn">
              <Link to="/register">
                <button className="login-btn">Register</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

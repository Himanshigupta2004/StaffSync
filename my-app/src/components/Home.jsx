import React from 'react'
import './Home.css'
import '../assets/bg1.jpg'
import { Link, useNavigate } from "react-router-dom";
export const Home = () => {
    const username=localStorage.getItem("username");
  return (
    <>
    <div className='home-container'>
        <div className='home-inner-div'>
        <h1 className='home-heading1'>{username ? `Welcome ${username}` : 'Hello!'}</h1>
        <h2 className='home-heading2'>The most certain way to succeed is always to try just one more time.</h2>
        <Link to="/dashboard"><button className='home-to-dash-btn'>Dashboard</button></Link>
        </div>
    </div>
    </>
  )
}
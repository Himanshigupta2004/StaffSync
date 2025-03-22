import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import logoimage from "../assets/logoimage.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../util/ApiRoutes';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // useEffect(() => {
    //     const token = localStorage.getItem('jwt-token');
    //     if (token) {
    //         navigate('/');
    //     }
    // }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username } = values;
            try {
                const { data } = await axios.post(loginRoute, {
                    username,
                    password,
                });
                console.log('Login response:', data);
                if (data.status === false) {
                    toast.error(data.msg, toastOptions);
                } else if (data.status === true) {
                    localStorage.setItem('jwt-token', data.token);
                    localStorage.setItem('username',username);
                    navigate("/");
                }
            } catch (error) {
                toast.error("Network error. Please try again later.", toastOptions);
                console.error("Login error:", error);
            }
        }
    };
    

    const handleValidation = () => {
        const { password, username } = values;
        if (password === "" || username === "") {
            toast.error("Username and password are required", toastOptions);
            return false;
        }
        return true;
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={logoimage} alt="logo" />
                        <h1>StaffSync</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        onChange={handleChange} 
                        min="3" 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        onChange={handleChange} 
                    />
                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link to="/signup">Register</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
            height: 5rem;
        }

        h1 {
            color: black;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color:rgba(241, 239, 239, 0.94);
         box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #e0e1dd;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }

        button {
            background-color: #778da9;
            color: white;

            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;

            &:hover {
                 background-color:rgb(62, 34, 138);
            }
        }

        span {
            color: black;
            text-transform: uppercase;

            a {
                color:rgb(247, 6, 6);
                text-decoration: none;
            }
        }
    }
`;

export default Login;

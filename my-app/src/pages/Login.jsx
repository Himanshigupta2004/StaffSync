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
        role: "",  // Added role field
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
            const { password, username, role } = values;  // Added role here
            try {
                const { data } = await axios.post(loginRoute, {
                    username,
                    password,
                    role,  // Include role in the request
                });
                console.log('Login response:', data);
                if (data.status === false) {
                    toast.error(data.msg, toastOptions);
                } else if (data.status === true) {
                    localStorage.setItem('jwt-token', data.token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('userRole', data.user.role);
                    navigate("/");  // Redirect to home/dashboard after login
                }
                
            } catch (error) {
                toast.error("Network error. Please try again later.", toastOptions);
                console.error("Login error:", error);
            }
        }
    };
    

    const handleValidation = () => {
        const { password, username, role } = values;
        if (password === "" || username === "") {
            toast.error("Username and password are required", toastOptions);
            return false;
        } else if (role === "") {  // Check for role
            toast.error("Please select a role", toastOptions);
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
                    <select
                            name="role"
                            onChange={handleChange}
                            placeholder="role"
                            value={values.role}  // Ensure the role is controlled
                            >
                        <option value="">Select Role</option>
                        <option value="employee">Employee</option>
                        <option value="hr">HR</option>
                    </select>
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

        input, select {
           background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #e0e1dd;
            border-radius: 0.4rem;
            color:black;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }

            option {
                background-color: white;
                color:black;
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
        @media (max-width: 480px) {
        padding: 0.5rem;

        .brand {
            flex-direction: column;
            gap: 0.5rem;
            img {
                height: 2rem;
            }
            h1 {
                font-size: 1rem;
            }
        }

        form {
            padding: 1rem;
            border-radius: 0.8rem;
            max-width: 95%;
        }

        input, select, button {
            font-size: 0.85rem;
            padding: 0.6rem;
        }

        span {
            font-size: 0.75rem;
        }
    }
`;

export default Login;

import React, { useState } from 'react';
import styled from "styled-components";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/Logo.jpeg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RegisterRoute } from '../util/ApiRoutes';
import logoimage from "../assets/logoimage.jpg"
function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",  
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const { password, username, email, role } = values;
            try {
                const { data } = await axios.post(RegisterRoute, {
                    username,
                    email,
                    password,
                    role,
                });
                if (data.status === false) {
                    toast.error(data.msg, toastOptions);
                } else {
                  
                    localStorage.setItem('userRole', role); 
                    toast.success("Registration successful", toastOptions);
                    navigate("/login");  
                }
            } catch (error) {
                console.error("Error during registration:", error);
                toast.error("An unexpected error occurred.", toastOptions);
            }
        }
    };
    
    const handleValidation = () => {
        const { password, username, email, role } = values;
        if (username.length < 3) {
            toast.error("Username should be greater than 3 characters", toastOptions);
            return false;
        } else if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        } else if (password.length < 8) {
            toast.error("Password should be equal or greater than 8 characters", toastOptions);
            return false;
        } 
        // else if (password !== values.confirmPassword) {
        //     toast.error("Passwords do not match", toastOptions);
        //     return false;
        // } 
        else if (role === "") {
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
                        <img src={logoimage} alt="logo" className='logoimage'/>
                        <h1>StaffSync</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                    />
                    {/* <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                    /> */}
                    <select
                        name="role"
                        onChange={handleChange}
                        placeholder="role"
                    >
                        <option value="">Select Role</option>
                        <option value="employee">Employee</option>
                        <option value="hr">HR</option>
                    </select>
                    <button type="submit">Create User</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
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
    .rolerole{
    color:black;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color:rgba(241, 239, 239, 0.94);
         box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        border-radius: 2rem;
        padding: 3rem 6rem; 
        width: 35%;
        max-width: 450px;

        input, select {
           background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #e0e1dd;
            border-radius: 0.4rem;
            color:grey;
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
            text-align: center;

            a {
                color:rgb(231, 6, 6);
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

export default Register;

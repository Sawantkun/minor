import React, { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../assets/googlelogo.png";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate } from 'react-router-dom';
import img from "../assets/image-1.png"
import icon1 from "../assets/Group.png"

const SignUp = () => {

    const [visibility, setVisibility] = useState({
        password: false,
        confirmPassword: false,
    });

    const [formField, setFormField] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate()

    const SignIn = () => {
        navigate("/Login")
    }


    return (
        <div className="w-full h-screen flex flex-col">
            <div className="w-full h-full relative flex flex-col">
                <div className="absolute top-8 right-8 flex items-center gap-4">
                    <div className="font-[300] font-inter text-[14px]">have an account?</div>
                    <div className="font-[300] font-inter text-[14px] text-blue-600 hover:underline cursor-pointer" onClick={SignIn}>Sign In</div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">
                    <div className="relative max-w-2xl w-full h-full flex-shrink-0 hidden md:flex">
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-fill"
                        />
                        <div className="absolute top-64 left-10 transform -translate-y-1/2 md:flex flex-col gap-5 hidden">
                            <div className="flex items-center space-x-3 px-2 pe-4 py-2 rounded-full bg-purple-700 text-white focus:outline-none bg-purple z-10 w-max">
                                <div className="relative flex justify-center items-center w-8 h-8 rounded-full">
                                    <div className="absolute inset-0 backdrop-blur-3xl bg-white rounded-2xl opacity-40 z-[-10]" />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#FFFFFF"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="#FFFFFF"
                                        className="w-5 h-5 relative z-50"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-[400] font-inter text-[14px]">Stay Inspired</span>
                            </div>
                            <div className="relative rounded-2xl w-52 p-4 mx-6">
                                <div className="absolute inset-0 backdrop-blur-xl bg-black/40 rounded-2xl z-[-10]" />
                                <div className="relative flex justify-center items-center w-8 h-8 rounded">
                                    <div className="absolute inset-0 backdrop-blur-xl bg-white/40 rounded-lg z-[-10]" />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#FFFFFF"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="#FFFFFF"
                                        className="w-5 h-5 relative z-50"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <div className="font-inter font-[400] text-white mt-3 leading-tight">Reconnect, Relive Reimagine</div>
                            </div>
                        </div>
                        <div className="space-x-3 bg-purple-700 text-white focus:outline-none bg-black z-10 w-max absolute bottom-28 right-10 px-2 pe-4 py-2 rounded-full md:flex items-center hidden">
                            <div className="relative flex justify-center items-center w-8 h-8 rounded-full">
                                <div className="absolute inset-0 backdrop-blur-3xl bg-white rounded-2xl opacity-40 z-[-10]" />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#FFFFFF"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="#FFFFFF"
                                    className="w-5 h-5 relative z-50"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <span className="font-[400] font-inter text-[14px]">Stay Connected</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center max-w-md mx-auto w-full h-screen">
                        <div className="flex flex-col gap-8 pt-8 w-full md:px-0 px-5">
                            <div>
                                <div className="text-[24px] text-center font-[600] font-inter">
                                    Begin Your Journey With Us Today
                                </div>
                                <div className="font-inter font-[400] text-[15px] text-center text-light">
                                    Getting started is easy
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="flex items-center gap-4 w-full justify-center">
                                    <button className="px-6 py-2 border border-gray-300 rounded-lg flex items-center gap-4 w-full justify-center">
                                        <div className='w-6 object-cover flex-shrink-0'>
                                            <img src={logo} alt='' className='w-full h-full object-cover' />
                                        </div>
                                        Sign in with Google
                                    </button>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="mx-4 text-[13px] font-[400] font-inter">
                                        Or Continue with
                                    </span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        className="p-5 border border-gray-300 focus:border-gray-700 rounded-lg w-full outline-none placeholder:text-[14px] font-inter"
                                        value={formField.name}
                                        onChange={(e) => setFormField({ ...formField, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Enter Email"
                                        className="p-5 border border-gray-300 focus:border-gray-700 rounded-lg w-full outline-none placeholder:text-[14px] font-inter"
                                        value={formField.email}
                                        onChange={(e) => setFormField({ ...formField, email: e.target.value })}
                                    />
                                    <div className="relative w-full">
                                        <input
                                            type={visibility.password ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Password"
                                            className="p-5 border border-gray-300 focus:border-gray-700 rounded-lg w-full outline-none placeholder:text-[14px] font-inter"
                                            value={formField.password}
                                            onChange={(e) => setFormField({ ...formField, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVisibility(prevState => ({ ...prevState, password: !prevState.password }))}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {visibility.password ? <VisibilityOff /> : <Visibility />}
                                        </button>
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type={visibility.confirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            className="p-5 border border-gray-300 focus:border-gray-700 rounded-lg w-full outline-none placeholder:text-[14px] font-inter"
                                            value={formField.confirmPassword}
                                            onChange={(e) => setFormField({ ...formField, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setVisibility(prevState => ({ ...prevState, confirmPassword: !prevState.confirmPassword }))}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {visibility.confirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </button>
                                    </div>
                                    <button className="bg-purple text-white p-4 rounded-lg w-full font-medium">
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default SignUp;

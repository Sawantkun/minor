import React, { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../assets/googlelogo.png";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate } from 'react-router-dom';
import img from "../assets/image.png"

const Login = () => {

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

    const SignUp = () => {
        navigate("/SignUp")
    }


    return (
        <div className="w-full h-screen flex flex-col">
            <div className="w-full h-full relative flex flex-col">
                <div className="absolute flex items-center justify-end top-8 left-[45%] gap-4">
                    <div className="font-[300] font-inter text-[14px]">Don't have an account?</div>
                    <div className="font-[300] font-inter text-[14px] text-purple hover:underline cursor-pointer" onClick={SignUp}>Sign In!</div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">
                    <div className="flex items-center justify-center max-w-md mx-auto w-full h-screen">
                        <div className="flex flex-col gap-8 pt-8 w-full md:px-0 px-5">
                            <div>
                                <div className="text-[36px] text-center font-[600] font-inter">
                                    Welcome Back
                                </div>
                                <div className="font-inter font-[400] text-[15px] text-center text-light">
                                    Login to your account
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-6 w-full">
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
                                        name="email"
                                        placeholder="Enter Email"
                                        className="p-5 border border-gray-300 focus:border-gray-700 rounded-xl w-full outline-none placeholder:text-[14px] font-inter"
                                        value={formField.email}
                                        onChange={(e) => setFormField({ ...formField, email: e.target.value })}
                                    />
                                    <div className="relative w-full">
                                        <input
                                            type={visibility.password ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Password"
                                            className="p-5 border border-gray-300 focus:border-gray-700 rounded-xl w-full outline-none placeholder:text-[14px] font-inter"
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
                                    <div className=' w-full flex justify-end'>
                                        <a href="" className=' text-[12px] font-[400] font-inter hover:underline'> Forgot Password?</a>
                                    </div>
                                    <button className="bg-purple text-white p-4 rounded-lg w-full font-medium">
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative max-w-xl w-full h-full flex-shrink-0 hidden md:flex">
                        <img
                            src={img}
                            alt=""
                            className="w-full h-full object-fill"
                        />

                        <div className="space-x-3 bg-purple-700 text-white focus:outline-none z-10 w absolute bottom-10 left-[-100px] rounded-2xl flex items-center overflow-visible w-full max-w-md">
                            <div className="relative rounded-2xl w-full p-6 mx-6 flex flex-col gap-4">
                                <div className="absolute inset-0 backdrop-blur-3xl bg-transparent-400/40 rounded-lg z-[-10] w-full" />

                                <div className=' font-[400] text-[12px] font-inter text-nowrap px-6 py-2 bg-purple text-white w-max rounded-lg text-center'>
                                    A Place to Learn and Thrive</div>

                                <div className="font-inter font-[400] text-white text-[15px] leading-5">Stay in a place where you can study, relax, and grow alongside a vibrant community of like minded individuals, allwhile enjoying top-notch facilities.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

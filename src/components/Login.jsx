import React, { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../assets/googlelogo.png";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate } from 'react-router-dom';

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
        <div className="w-full h-full">
            <div className="w-full max-h-screen h-full relative">
                <div className="absolute top-8 right-8 flex items-center gap-8">
                    <div className="font-medium">Don't Have an account?</div>
                    <div className="font-medium hover:underline cursor-pointer text-blue-600" onClick={SignUp}>Sign Up</div>
                </div>
                <div className="flex items-center justify-between w-full h-full">
                    <div className="relative w-[50%] h-screen object-cover flex-shrink-0 md:flex hidden">
                        <img
                            src="https://images.squarespace-cdn.com/content/v1/6213c340453c3f502425776e/1722636479289-OH0D6P61UQYXJ027RBA8/unsplash-image-nHFczgs6ppw.jpg?format=1500w"
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2/4 left-10 transform -translate- -translate-y-1/2 md:flex flex-col items-center gap-4 hidden">
                            <div className="w-full p-2 rounded-full bg-blue-600 text-white flex items-center gap-4 max-w-[250px]">
                                <ControlPointIcon className="text-lg text-white" />
                                <div className="font-medium text-nowrap">Safety and Convenience</div>
                            </div>
                            <div className="w-full p-2 rounded-2xl bg-blue-600 text-white flex items-start gap-4 max-w-[250px]">
                                <CopyAllIcon className="text-[40px] text-white" />
                                <div className="font-medium">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis!</div>
                            </div>
                        </div>
                        <div className="absolute bottom-8 right-8 w-full p-2 rounded-full bg-blue-600 text-white md:flex items-center gap-4 max-w-[250px] hidden">
                            <ControlPointIcon className="text-lg text-white" />
                            <div className="font-medium text-nowrap">Safety and Convenience</div>
                        </div>
                    </div>
                    <div className="w-full h-full flex justify-center items-center md:mt-10 mt-24">
                        <div className="flex flex-col gap-6 w-full md:mx-40 mx-10 h-full">
                            <div>
                                <div className="text-2xl font-semibold text-center">
                                    Welcome Back
                                </div>
                                <div className="text-lg text-gray-600 text-center mt-1">
                                    Lorem ipsum dolor sit.
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="flex items-center gap-4 w-full justify-center">
                                    <button className="px-6 py-2 border border-gray-300 focus:border-gray-700 rounded-lg flex items-center gap-3 h-10">
                                        <div className='w-6 object-cover flex-shrink-0'><img src={logo} alt='' className='w-full h-full object-cover' /></div>Google
                                    </button>
                                    <button className="px-6 py-2 border border-gray-300 focus:border-gray-700 rounded-lg h-10 flex items-center justify-center gap-3">
                                        <LocalPhoneIcon className='text-md' /> Phone
                                    </button>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="mx-4 text-md text-gray-600 text-center text-nowrap">
                                        Or Continue with
                                    </span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                                <div className="flex flex-col items-center gap-4 w-full" >
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Enter your Email"
                                        className="p-3 border border-gray-300 focus:border-gray-700 rounded-lg w-full"
                                        value={formField.email}
                                        onChange={(e) => setFormField({ ...formField, email: e.target.value })}
                                    />
                                    <div className="relative w-full">
                                        <input
                                            type={visibility.password ? 'text' : 'password'}
                                            name="password"
                                            placeholder="Enter your Password"
                                            className="p-3 border border-gray-300 focus:border-gray-700 rounded-lg w-full"
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
                                    <button className="border border-gray-300 p-3 rounded-lg w-full font-medium hover:bg-blue-600 hover:text-white">
                                        Login
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600 font-medium text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

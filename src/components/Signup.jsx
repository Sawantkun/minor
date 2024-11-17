import React, { useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from "../assets/googlelogo.png";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useNavigate } from 'react-router-dom';

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
        <div className="w-full h-full">
            <div className="w-full max-h-screen h-full relative">
                <div className="absolute top-8 right-8 flex items-center gap-8">
                    <div className="font-medium">Have an account?</div>
                    <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={SignIn}>Sign In</div>
                </div>
                <div className="flex items-center justify-between w-full h-full">
                    <div className="relative w-[50%] h-screen object-cover flex-shrink-0 md:flex hidden">
                        <img
                            src="https://media.licdn.com/dms/image/v2/C4E1BAQG3ZvjGd_5pAw/company-background_10000/company-background_10000/0/1632137816387/gbucrc_cover?e=2147483647&v=beta&t=eGPzVHgG6aYyJ43GGD1yzsMMU79tiroXlmNHXcpJVn0"
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
                                    Begin Your Journey With Us Today
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
                                        name="name"
                                        placeholder="Enter your name"
                                        className="p-3 border border-gray-300 focus:border-gray-700 rounded-lg w-full"
                                        value={formField.name}
                                        onChange={(e) => setFormField({ ...formField, name: e.target.value })}
                                    />
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
                                    <div className="relative w-full">
                                        <input
                                            type={visibility.confirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            placeholder="Enter Confirm Password"
                                            className="p-3 border border-gray-300 focus:border-gray-700 rounded-lg w-full"
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
                                    <button className="bg-blue-600 text-white p-3 rounded-lg w-full font-medium">
                                        Create Account
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

export default SignUp;

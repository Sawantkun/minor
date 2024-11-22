import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/image-2.png";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import logo from "../assets/fulllogogbu 1.png";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const SignIn = () => {
        navigate("/Login");
    };

    const SignUp = () => {
        navigate("/SignUp");
    };

    return (
        <div className="w-full min-h-screen flex flex-col fixed">
            <img
                src={img}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover"
            />

            {/* Navbar Section */}
            <div className="px-6 py-2 relative bg-white z-20">
                <div className="flex items-center justify-between w-full md:p-3 py-3 gap-4">
                    <div className="w-60 object-cover flex-shrink-0">
                       <a href="/"> <img
                            src={logo}
                            alt="Alumni"
                            className="w-full h-full object-cover"
                        /></a>
                    </div>
                    <div className="flex items-center gap-6 cursor-pointer">
    {/* Navbar Links */}
    <div className="flex gap-6">
        <a href="https://www.gbu.ac.in/page/directory" className="nav-link">Directory</a>
        <a href="#events" className="nav-link">Events</a>
        <a href="https://faculty.gbu.ac.in/" className="nav-link">Faculty</a>
        <a href="https://www.gbu.ac.in/contact-us" className="nav-link">Help</a>
    </div>
</div>

                </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center gap-2 md:p-0 p-5 bg-black/40 z-10 -translate-y-7 h-[100vh]">
                <div className="max-w-5xl w-full mx-auto flex flex-col gap-2 text-center font-inter">
                    <div className="md:text-[50px] text-[28px] font-semibold text-white leading-snug -translate-y-10">
                        Connecting Generation, Building Futures -
                        <span className="text-transparent bg-gradient-to-r from-white to-purple bg-clip-text italic md:px-6 md:py-4 px-4 font-thin">
                            Your Alumni Portal
                        </span>
                    </div>
                    <div className="md:text-[18px] font-[400] text-white mx-auto max-w-3xl text-[13px] tracking-widest -translate-y-10 opacity-70">
                        Reconnect with roots, rediscovered cherished memories, and unlock endless possibilities for personal growth and professional success.
                    </div>
                    <div className="flex flex-wrap items-center gap-14 mt-4 justify-center -translate-y-3">
                        <button onClick={SignUp} className="bg-purple text-2xl text-white px-12 py-4 rounded-full hover:bg-transparent hover:border-white border-purple border hover:text-white transition-all duration-300">
                            Get Started
                        </button>
                        <a href="https://www.gbu.ac.in/">
                            <button className="group border text-2xl border-gray-300 px-12 py-4 rounded-full text-white flex items-center gap-2 hover:bg-white hover:text-black transition-all duration-500">
                                GBU Site
                                <NorthEastIcon
                                    className="text-white group-hover:text-black group-hover:rotate-45"
                                    fontSize="small"
                                />
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

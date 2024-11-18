import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/image-2.png"
import NorthEastIcon from '@mui/icons-material/NorthEast';
import logo from "../assets/fulllogogbu 1.png"
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
        <div className="w-full min-h-screen flex flex-col relative ">
            <img
                src={img}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover "
            />

            <div className=" px-6 py-2 relative bg-white">
                <div className="flex items-center justify-between w-full md:p-3 py-3 gap-4">
                    <div className="w-60 object-cover flex-shrink-0">
                        <img
                            src={logo}
                            alt="Alumni"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="items-center gap-2 flex cursor-pointer">
                        <NotListedLocationIcon fontSize="medium" />
                        <div className=" text-lg font-[400] hover:underline cursor-pointer">Help</div>
                    </div>
                </div>

            </div>
            <div className="flex-grow flex flex-col items-center justify-center text-center gap-2 md:p-0 p-5 bg-black/5 bg-opacity-50 z-10">
                <div className=" max-w-4xl w-full mx-auto flex flex-col gap-2 text-center font-inter">
                    <div className="md:text-[50px] text-[28px] font-semibold text-white leading-relaxed"> Connecting Generation, Buildings Futures - <span className=" font-bold text-purple bg-white/70 md:px-6 md:py-4 px-4 py-2 rounded-xl"> Your Alumini Portal</span>
                    </div>
                    <div className=" md:text-[18px] font-[400] text-white mx-auto max-w-2xl text-[13px]">Reconnect with roots, rediscovered chreissedmemories, and unlock endless possiblities for personal growth and prfessional sucess.</div>
                    <div className="flex items-center gap-4 mt-4 justify-center">
                        <button className="bg-purple text-white px-8 py-2 rounded-full">
                            Get Started
                        </button>
                        <button className="border border-gray-300 px-8 py-2 rounded-full text-white flex items-center gap-2">
                            GBU Site
                            <NorthEastIcon className=" text-white" fontSize="small" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

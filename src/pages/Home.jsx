import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="w-full min-h-screen flex flex-col relative">
            <img
                src="https://media.licdn.com/dms/image/v2/C4E1BAQG3ZvjGd_5pAw/company-background_10000/company-background_10000/0/1632137816387/gbucrc_cover?e=2147483647&v=beta&t=eGPzVHgG6aYyJ43GGD1yzsMMU79tiroXlmNHXcpJVn0"
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            />

            <div className="bg-gray-300 bg-opacity-90 px-6 py-2 relative z-50">
                <div className="flex items-center justify-between w-full">
                    <div className="text-xl font-semibold">Alumni Portal</div>
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                    <div className="hidden md:flex items-center gap-6">
                        <div className="text-xl font-semibold flex items-center gap-2">
                            <div className="w-16 object-cover flex-shrink-0">
                                <img
                                    src="https://www.edusys.co/images/alumni-management.png"
                                    alt="Alumni"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            Alumni Portal
                        </div>
                    </div>
                    <div className="items-center gap-2 hidden md:flex">
                        <button
                            className="font-semibold hover:underline"
                            onClick={SignIn}
                        >
                            Login
                        </button>
                        <div className="font-semibold">/</div>
                        <button
                            className="font-semibold hover:underline"
                            onClick={SignUp}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-gray-100 mt-4 rounded-lg shadow-lg absolute right-4 mx-auto z-20">
                        <div className="flex items-center gap-2 px-6 py-3">
                            <button
                                className="font-semibold hover:underline"
                                onClick={SignIn}
                            >
                                Login
                            </button>
                            <div className="font-semibold">/</div>
                            <button
                                className="font-semibold hover:underline"
                                onClick={SignUp}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-grow flex flex-col items-center justify-center text-center gap-2 md:p-0 p-5 bg-gray-900 bg-opacity-50 z-10">
                <div className="md:text-[40px] text-[35px] font-semibold text-white">
                    Join A Network That Lasts a Lifetime
                </div>
                <div className="md:text-[20px] text-[20px] max-w-lg mx-auto text-white">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Aperiam, repellendus.
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium">
                        Get Started
                    </button>
                    <button className="border border-gray-300 px-4 py-2 font-medium rounded-full text-white">
                        GBU Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;

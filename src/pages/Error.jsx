const Error = () => {
    return (
        <div className=" w-full h-[100vh] flex items-center justify-center">
            <div className=" flex items-center gap-6">
                <div className=" text-3xl font-semibold">404</div>
                <div className=" h-12 border-l-2 border-gray-400"></div>
                <div className=" text- tracking-wide">This page could not be found.</div>
            </div>
        </div>
    )
}

export default Error;
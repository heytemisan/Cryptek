import React from 'react';
import logo from '../../images/logo.png'

const Footer = () => {
    return (
        <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer">
            <div className="w-full flex sm:flex-row justify-between items-center my-4">
                <div className="flex flex-[0.5] justify-center items-center">
                    <img src={logo} alt="logo" className='w-32'/>
                </div>
                <div className="flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
                    <p className="text-white text-base text-center mx-3 cursor-pointer">
                        Market
                    </p>
                    <p className="text-white text-base text-center mx-3 cursor-pointer">
                        Exchang
                    </p>
                    <p className="text-white text-base text-center mx-3 cursor-pointer">
                        Tutorials
                    </p>
                    <p className="text-white text-base text-center mx-3 cursor-pointer">
                        Wallet
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer

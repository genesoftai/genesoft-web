import React from "react";
import GenesoftLoading from "./GenesoftLoading";

type Props = {
    size?: number;
    text?: string;
    color?: string;
};

const PageLoading = ({ text = "Loading your information..." }: Props) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-primary-dark text-white">
            <GenesoftLoading size={50} />
            <p className="text-base md:text-2xl">{text}</p>
        </div>
    );
};

export default PageLoading;

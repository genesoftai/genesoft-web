import React from "react";
import SimpleLoading from "@/components/common/SimpleLoading";

type Props = {
    size?: number;
    text?: string;
    color?: string;
};

const PageLoading = ({
    size = 50,
    text = "Loading your information...",
    color = "#2563EB",
}: Props) => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-primary-dark text-white">
            <SimpleLoading color={color} size={size} />
            <p className="text-2xl">{text}</p>
        </div>
    );
};

export default PageLoading;

import React from "react";
import GenesoftLogo from "@public/assets/genesoft-logo-black.png";
import Image from "next/image";
import { BarLoader } from "react-spinners";

interface SimpleLoadingProps {
    color?: string;
    size?: number;
}

const GenesoftLoading: React.FC<SimpleLoadingProps> = ({ size = 50 }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <Image
                src={GenesoftLogo}
                alt="Genesoft Logo"
                width={size}
                height={size}
                className="animate-pulse rounded-full"
            />
            <BarLoader color="#2563EB" />
        </div>
    );
};

export default GenesoftLoading;

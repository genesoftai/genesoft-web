import React from "react";
import Image from "next/image";
import GenesoftNewLogo from "@public/assets/genesoft-new-logo.png";

interface LogoProps {
    size?: "big" | "medium" | "small" | "extra-small";
    isInCludeText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    size = "medium",
    isInCludeText = true,
}) => {
    let width, height;

    if (size === "big") {
        width = 120;
        height = 60;
    } else if (size === "medium") {
        width = 80;
        height = 40;
    } else if (size === "small") {
        width = 60;
        height = 30;
    } else if (size === "extra-small") {
        width = 40;
        height = 20;
    }

    return (
        <div className="flex justify-center items-center">
            <Image
                src={GenesoftNewLogo}
                alt={"Genesoft Logo"}
                width={width}
                height={height}
                // className={size === 'small' ? 'flex md:hidden' : 'hidden md:flex'}
            />
            {isInCludeText && (
                <span className="text-2xl font-bold text-white">Genesoft</span>
            )}
        </div>
    );
};

export default Logo;

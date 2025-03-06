import React from "react";
import Image from "next/image";
import GenesoftLogo from "@public/assets/genesoft.png";

interface LogoProps {
    size?: "big" | "medium" | "small";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
    let width, height;

    if (size === "big") {
        width = 160;
        height = 80;
    } else if (size === "medium") {
        width = 96;
        height = 48;
    } else if (size === "small") {
        width = 72;
        height = 36;
    }

    return (
        <div className="flex justify-center items-center">
            <Image
                src={GenesoftLogo}
                alt={"Genesoft Logo"}
                width={width}
                height={height}
                // className={size === 'small' ? 'flex md:hidden' : 'hidden md:flex'}
            />
        </div>
    );
};

export default Logo;

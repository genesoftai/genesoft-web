import { RGBColor } from "react-color";

export const rgbaToHex = (rgba: RGBColor) => {
    const { r, g, b, a = 1 } = rgba;

    const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const alphaHex = Math.round(a * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
};

export const hexToRgba = (hex: string): RGBColor => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;

    return {
        r,
        g,
        b,
        a,
    };
};

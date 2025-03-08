import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Curlent from "@public/image/showcase/project/curlent.png";
import PlayWithME from "@public/image/showcase/play-with-me-collection.png";
import Peachful from "@public/image/showcase/peachful.png";

function Showcases() {
    return (
        <section className="py-16 md:py-24 bg-tertiary-dark">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Showcases
                </h2>
                <p className="text-lg text-center text-subtext-in-dark-bg/80 mb-16 max-w-3xl mx-auto">
                    Take a look at some of the web applications built by our AI
                    agents
                </p>

                <div className="flex items-center justify-center">
                    <Carousel className="w-full max-w-4xl">
                        <CarouselContent>
                            <CarouselItem>
                                <div className="p-1">
                                    <div
                                        className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                        onClick={() => {
                                            window.open(
                                                "https://nextjs-web461237da-5b5d-4e98-9ea5-05a7c5328d8f.vercel.app",
                                                "_blank",
                                            );
                                        }}
                                    >
                                        <div className="relative w-full mb-6 overflow-hidden rounded-xl border border-line-in-dark-bg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-genesoft/20 to-genesoft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                            <Image
                                                src={PlayWithME}
                                                alt="PlayWithME"
                                                width={500}
                                                height={500}
                                                className="w-full rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold  text-white group-hover:text-genesoft transition-colors">
                                            Play with ME
                                        </h3>
                                        <p className="text-sm text-subtext-in-dark-bg mt-2">
                                            Art toy collection from the future
                                            of 2077
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>

                            <CarouselItem>
                                <div className="p-1">
                                    <div
                                        className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                        onClick={() => {
                                            window.open(
                                                "https://nextjs-webeddd871e-17d9-46d9-95b1-7054ed002ae5.vercel.app",
                                                "_blank",
                                            );
                                        }}
                                    >
                                        <div className="relative w-full mb-6 overflow-hidden rounded-xl border border-line-in-dark-bg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-genesoft/20 to-genesoft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                            <Image
                                                src={Curlent}
                                                alt="Curlent"
                                                width={500}
                                                height={500}
                                                className="w-full rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-genesoft transition-colors">
                                            Curlent
                                        </h3>
                                        <p className="text-sm text-subtext-in-dark-bg mt-2">
                                            AI-Powered US Stock Research
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>

                            <CarouselItem>
                                <div className="p-1">
                                    <div
                                        className="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                        onClick={() => {
                                            window.open(
                                                "https://nextjs-web9790eda0-f8de-477a-809d-9f31ad92738b.vercel.app",
                                                "_blank",
                                            );
                                        }}
                                    >
                                        <div className="relative w-full mb-6 overflow-hidden rounded-xl border border-line-in-dark-bg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-genesoft/20 to-genesoft/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                            <Image
                                                src={Peachful}
                                                alt="Peachful"
                                                width={500}
                                                height={500}
                                                className="w-full rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-genesoft transition-colors">
                                            Peachful
                                        </h3>
                                        <p className="text-sm text-subtext-in-dark-bg mt-2">
                                            Art Gallery for Artist
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="bg-secondary-dark border-line-in-dark-bg text-white hover:bg-genesoft/20 transition-colors duration-300" />
                        <CarouselNext className="bg-secondary-dark border-line-in-dark-bg text-white hover:bg-genesoft/20 transition-colors duration-300" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default Showcases;

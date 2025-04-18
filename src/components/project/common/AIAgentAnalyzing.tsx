import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import React from "react";

type Props = {
    projectType: string;
};

const AIAgentAnalyzing = ({ projectType }: Props) => {
    return (
        <Card className="flex flex-col items-center justify-center h-full bg-primary-dark text-white border-none">
            <CardContent>
                <div className="flex flex-col items-center justify-center h-64 space-y-6">
                    <motion.div
                        className="relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        />
                        <BrainCircuit className="h-16 w-16 text-genesoft" />
                    </motion.div>

                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-center space-y-2 flex flex-col items-center justify-center"
                    >
                        <p className="text-subtext-in-dark-bg max-w-md">
                            Genesoft AI Agents are analyzing your requirements
                            for{" "}
                            {projectType === "web"
                                ? "web development"
                                : "backend service development"}
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex space-x-4 mt-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="h-2 w-2 rounded-full bg-genesoft"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIAgentAnalyzing;

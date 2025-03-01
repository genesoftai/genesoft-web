"use client";

import React, { useState, useEffect } from "react";
import Conversation from "@/components/Conversation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "@/styles/conversation.css";

export default function ConversationExamplePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeSprintId, setActiveSprintId] = useState("sprint-2");
    const [messages, setMessages] = useState<any[]>([]);

    // Example sprint selections
    const sprintOptions = [
        { id: "sprint-1", name: "Sprint 1: Initial Design" },
        { id: "sprint-2", name: "Sprint 2: Homepage Development" },
        { id: "sprint-3", name: "Sprint 3: User Authentication" },
        { id: "sprint-4", name: "Sprint 4: Payment Integration" },
    ];

    // Initialize with sample messages
    useEffect(() => {
        setMessages([
            {
                id: "1",
                content:
                    "We receive your requirements well, let me revise again that you want ... details ... on A page?",
                sender: "ai",
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                user: {
                    name: "Project Manager",
                    avatar: "",
                },
            },
            {
                id: "2",
                content:
                    "Project manager is waiting for your confirmation (sent to user_email@gmail.com)",
                sender: "system",
                timestamp: new Date(Date.now() - 1000 * 60 * 25),
            },
            {
                id: "3",
                content: "Hi, sorry for late reply",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
            {
                id: "4",
                content:
                    "Yes, I want feature A to implement on section B of A Page",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
            {
                id: "5",
                content: "Please continue",
                sender: "user",
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                user: {
                    name: "User A",
                },
            },
        ]);
    }, []);

    // Handle sending a message
    const handleSendMessage = (message: string) => {
        setIsLoading(true);

        // Simulate AI response after a short delay
        setTimeout(() => {
            const newMessage = {
                id: Date.now().toString(),
                content: getAIResponse(message),
                sender: "ai",
                timestamp: new Date(),
                user: {
                    name: "Project Manager",
                    avatar: "",
                },
            };

            setMessages((prev) => [...prev, newMessage]);
            setIsLoading(false);
        }, 1500);
    };

    // Generate a simple AI response based on the user's message
    const getAIResponse = (message: string) => {
        const responses = [
            "I understand your requirements. We'll implement that feature in the next sprint.",
            "Thank you for the clarification. Could you provide more details about how you want this feature to work?",
            "Great! I'll make sure to include these specifications in the development plan.",
            "That makes sense. We'll need to consider some technical aspects before implementation.",
            "Got it! We'll use the Shopee marketplace UI reference to implement this feature on the A Page.",
        ];

        // Select a semi-random response based on the message length
        const index = Math.floor(message.length % responses.length);
        return responses[index];
    };

    // Handle starting a new sprint
    const handleStartSprint = () => {
        const sprintName =
            sprintOptions.find((s) => s.id === activeSprintId)?.name || "";

        setIsLoading(true);

        setTimeout(() => {
            const newMessage = {
                id: Date.now().toString(),
                content: `Starting ${sprintName}. Development team will begin implementing features based on our conversation.`,
                sender: "system",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newMessage]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Project Management Chat</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Sidebar */}
                <div className="col-span-1 md:col-span-3 lg:col-span-2">
                    <Card className="bg-[#1a1d21] border-0 shadow-lg h-full">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">
                                    Channels
                                </h2>

                                <div className="flex items-center gap-2 p-2 bg-[#1e62d0] rounded-md cursor-pointer">
                                    <span className="text-white">#</span>
                                    <span className="text-white">
                                        project-requirements
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#252a2e]">
                                    <span className="text-gray-400">#</span>
                                    <span className="text-gray-400">
                                        general
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#252a2e]">
                                    <span className="text-gray-400">#</span>
                                    <span className="text-gray-400">
                                        technical-support
                                    </span>
                                </div>

                                <h2 className="text-sm font-bold uppercase text-gray-400 mt-4 mb-2">
                                    Team Members
                                </h2>

                                <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#252a2e]">
                                    <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-sm">
                                        P
                                    </div>
                                    <span className="text-gray-400">
                                        Project Manager
                                    </span>
                                    <span className="ml-auto bg-green-500 w-2 h-2 rounded-full"></span>
                                </div>

                                <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#252a2e]">
                                    <div className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center text-white text-sm">
                                        U
                                    </div>
                                    <span className="text-gray-400">
                                        User A
                                    </span>
                                    <span className="ml-auto bg-green-500 w-2 h-2 rounded-full"></span>
                                </div>

                                <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[#252a2e]">
                                    <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white text-sm">
                                        U
                                    </div>
                                    <span className="text-gray-400">
                                        User B
                                    </span>
                                    <span className="ml-auto bg-red-500 w-2 h-2 rounded-full"></span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main chat area */}
                <div className="col-span-1 md:col-span-9 lg:col-span-10">
                    <Conversation
                        channelName="project-requirements"
                        initialMessages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        sprintSelection={sprintOptions}
                        selectedSprint={activeSprintId}
                        onSprintChange={setActiveSprintId}
                    />

                    <div className="mt-6 flex justify-center">
                        <Button
                            className="bg-[#1e62d0] hover:bg-[#1a56b8] text-white px-8 py-6"
                            onClick={handleStartSprint}
                        >
                            Start Sprint
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

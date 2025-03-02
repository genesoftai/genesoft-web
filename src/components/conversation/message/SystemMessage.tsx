import { Message } from "@/types/message";
import React from "react";

const SystemMessage = ({ message }: { message: Message }) => {
    return (
        <div className="flex justify-center my-2">
            <div className="bg-[#252a2e] text-gray-400 text-xs py-1 px-3 rounded-md">
                {message?.content}
            </div>
        </div>
    );
};

export default SystemMessage;

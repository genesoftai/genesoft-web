import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import React from "react";

const OnboardingUserMessage = ({ message }: { message: Message }) => {
    return (
        <div className="flex self-end items-end gap-3 group p-2 rounded-md overflow-hidden bg-[#2563EB] max-w-[600px] w-fit">
            <div className="flex flex-col w-full">
                <div className="flex items-baseline">
                    <span className="ml-2 text-xs md:text-sm text-gray-200">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                    {message.message_type === "image" &&
                    message.files?.[0]?.url ? (
                        <div className="mt-2">
                            <img
                                src={message.files?.[0]?.url}
                                alt="Image Message"
                                className="max-h-64 rounded-md cursor-pointer"
                                onClick={() => {
                                    window.open(
                                        message.files?.[0]?.url || "",
                                        "_blank",
                                    );
                                }}
                            />
                            {message.content && (
                                <p className="mt-2 text-white font-medium text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="mt-1 text-white font-medium text-xs sm:text-sm md:text-base break-words whitespace-pre-wrap">
                            {message.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingUserMessage;

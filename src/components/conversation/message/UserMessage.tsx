import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React from "react";

const UserMessage = ({ message }: { message: Message }) => {
    return (
        <div className="flex items-start gap-3 group p-2 rounded-md w-full overflow-hidden">
            <div className="flex items-center gap-2">
                <Avatar className={`h-9 w-9 rounded-md flex-shrink-0`}>
                    {message.sender?.image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={message.sender.image || ""}
                                alt={message.sender.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover block md:hidden"
                            />
                            <Image
                                src={message.sender.image || ""}
                                alt={message.sender.name}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover hidden md:block"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-white font-semibold">
                            {message.sender?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </Avatar>
            </div>

            <div className="flex flex-col w-full">
                <div className="flex items-baseline">
                    <span className="font-semibold text-sm text-white">
                        {message.sender?.name || "User"}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
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

export default UserMessage;

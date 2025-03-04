import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import Image from "next/image";
import React from "react";

const UserMessage = ({ message }: { message: Message }) => {
    return (
        <div className="flex items-start gap-3 group p-2 rounded-md">
            <Avatar className={`h-9 w-9 rounded-md `}>
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

            <div className="flex-1">
                <div className="flex flex-col items-baseline">
                    <span
                        className={`font-semibold text-sm text-subtext-in-dark-bg `}
                    >
                        {message.sender?.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>

                <div className="mt-1 text-white text-sm">{message.content}</div>
            </div>
        </div>
    );
};

export default UserMessage;

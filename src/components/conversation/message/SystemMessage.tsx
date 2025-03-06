import { Message } from "@/types/message";
import { formatDateToHumanReadable } from "@/utils/common/time";
import React from "react";

const SystemMessage = ({ message }: { message: Message }) => {
    return (
        <div className="flex items-start gap-3 group p-2 rounded-md w-full overflow-hidden">
            <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-baseline">
                    <span className="font-semibold text-sm text-gray-400">
                        System
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                        {formatDateToHumanReadable(
                            message?.created_at as unknown as string,
                        )}
                    </span>
                </div>

                <div className="mt-1 text-gray-400 text-xs break-words whitespace-pre-wrap overflow-hidden bg-[#252a2e] py-1 px-3 rounded-md">
                    {message.content}
                </div>
            </div>
        </div>
    );
};

export default SystemMessage;

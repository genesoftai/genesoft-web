"use server";

import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import axios from "axios";
import { csbApiKey } from "@/constants/code-sandbox";
import { CodeSandbox } from "@codesandbox/sdk";

export const getCodesandboxApiKey = async () => {
    const apiKey = process.env.CSB_API_KEY;
    return apiKey;
};

export const readFileFromCodesandboxWithHibernate = async (
    sandboxId: string,
    path: string,
) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/files/read/fast`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            path,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};

export const writeFileToCodesandboxWithoutHibernate = async (
    sandboxId: string,
    path: string,
    content: string,
) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/files/write/fast`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            path,
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};

export const runTaskInCodesandbox = async (sandboxId: string, task: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/task/run/background`;
    const response = await axios.post(
        url,
        {
            sandbox_id: sandboxId,
            task,
        },
        {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        },
    );
    return response.data;
};

export const restartSandbox = async (sandboxId: string) => {
    const url = `${genesoftCoreApiServiceBaseUrl}/codesandbox/${sandboxId}/restart`;
    try {
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
                },
            },
        );
        console.log("Sandbox restarted:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error restarting sandbox:", error);
        throw error;
    }
};

export const killAllShells = async (sandbox_id: string) => {
    try {
        const sdk = new CodeSandbox(csbApiKey);
        const sandbox = await sdk.sandbox.open(sandbox_id);
        const shells = await sandbox.shells.getShells();
        for (const shell of shells) {
            await shell.kill();
        }
        console.log({
            message: `Killed all shells`,
            metadata: {
                sandbox_id,
            },
        });
    } catch (error) {
        console.error({
            message: `Error killing all shells`,
            metadata: {
                error,
            },
        });
    }
};

export const runDevCommandInCodesandboxForWeb = async (sandboxId: string) => {
    console.log("Running command in codesandbox:", sandboxId, "pnpm run dev");
    console.log("CSB API KEY:", csbApiKey);
    const sdk = new CodeSandbox(csbApiKey);
    const sandbox = await sdk.sandbox.open(sandboxId);
    try {
        const shell = sandbox.shells.run("pnpm run dev");

        let allOutput = "";

        const output = await new Promise((resolve) => {
            shell.onOutput((output) => {
                // Accumulate all output
                allOutput += output + "\n";

                // Check if dev server is ready
                if (
                    output.includes("Ready in") ||
                    output.includes("Local:") ||
                    output.includes("localhost:") ||
                    output.includes("Command failed with exit code") ||
                    output.includes(
                        "npm ERR! A complete log of this run can be found in",
                    )
                ) {
                    resolve(allOutput);
                }
            });

            // Set a timeout in case the dev server doesn't report ready
            setTimeout(() => {
                if (allOutput) {
                    resolve(allOutput);
                }
            }, 180000); // 3 minutes timeout
        });

        console.log("Run Dev Command Output:", output);

        await sandbox.hibernate();

        return {
            sandboxId,
            output,
        };
    } catch (error) {
        await sandbox.hibernate();
        console.error("Error running dev task in codesandbox:", error);
        return {
            sandboxId,
            task: "dev",
            output: "Can't get dev task info",
        };
    }
};

export const runCommandInCodesandbox = async (
    sandboxId: string,
    command: string,
) => {
    console.log("Running command in codesandbox:", sandboxId, command);
    console.log("CSB API KEY:", csbApiKey);
    const sdk = new CodeSandbox(csbApiKey);
    const sandbox = await sdk.sandbox.open(sandboxId);
    try {
        // Run the command with a timeout of 180 seconds
        const shellPromise = sandbox.shells.run(command);
        const timeoutPromise: Promise<{
            sandboxId: string;
            command: string;
            output: string;
            exitCode: number;
        }> = new Promise((resolve) => {
            setTimeout(
                () =>
                    resolve({
                        sandboxId,
                        command,
                        output: "Command execution timed out after 180 seconds",
                        exitCode: 1,
                    }),
                180000,
            );
        });

        const shell = await Promise.race([shellPromise, timeoutPromise]);

        console.log("Shell:", shell);

        await sandbox.hibernate();

        return {
            output: shell?.output,
            exitCode: shell?.exitCode,
        };
    } catch (error) {
        await sandbox.hibernate();
        console.error("Error running command in codesandbox:", error);
        throw error;
    }
};

export const runDevCommandInCodesandboxForBackend = async (
    sandboxId: string,
) => {
    console.log(
        "Running command in codesandbox:",
        sandboxId,
        "pnpm run start:dev",
    );
    const sdk = new CodeSandbox(csbApiKey);
    const sandbox = await sdk.sandbox.open(sandboxId);
    try {
        const shell = sandbox.shells.run("pnpm run start:dev");

        let allOutput = "";

        const output = await new Promise((resolve) => {
            shell.onOutput((output) => {
                // Accumulate all output
                allOutput += output + "\n";

                // Check if dev server is ready
                if (
                    output.includes("ready in") ||
                    output.includes("started server on") ||
                    output.includes("Nest application successfully started") ||
                    output.includes("Command failed with exit code") ||
                    output.includes("erros. Watching for file changes") ||
                    output.includes(
                        "npm ERR! A complete log of this run can be found in",
                    ) ||
                    output.includes("ERROR [ExceptionHandler]")
                ) {
                    resolve(allOutput);
                }
            });

            // Set a timeout in case the dev server doesn't report ready
            setTimeout(() => {
                if (allOutput) {
                    resolve(allOutput);
                }
            }, 180000); // 3 minutes timeout
        });

        console.log("Run Dev Command Output:", output);

        await sandbox.hibernate();

        return {
            sandboxId,
            output,
        };
    } catch (error) {
        await sandbox.hibernate();
        console.error("Error running dev task in codesandbox:", error);
        return {
            sandboxId,
            task: "dev",
            output: "Can't get dev task info",
        };
    }
};

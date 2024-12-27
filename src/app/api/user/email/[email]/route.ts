import { genesoftCoreApiServiceBaseUrl } from "@/constants/api-service/url";
import { genesoftCoreApiServiceApiKey } from "@/constants/api-service/authorization";
import axios from "axios";

const routeName = "/api/user/[email]";

export async function GET(
    request: Request,
    { params }: { params: { email: string } },
) {
    const { email } = params;
    const url = `${genesoftCoreApiServiceBaseUrl}/user/email/${email}`;
    console.log({
        message: `${routeName} - [GET]: getting user by email from Core API Service`,
        url,
        email,
    });
    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
            },
        });
        const user = res.data;
        return Response.json(user);
    } catch (error) {
        console.log({
            message: `${routeName} - [GET]: error while getting user by email from Core API Service`,
            metadata: { error },
        });
        return new Response("Error getting user", { status: 500 });
    }
}

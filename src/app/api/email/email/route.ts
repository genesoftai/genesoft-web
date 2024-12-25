import { genesoftCoreApiServiceBaseUrl } from '@/constants/api-service/url';
import { genesoftCoreApiServiceApiKey } from '@/constants/api-service/authorization';
import axios from 'axios';

const routeName = '/api/email';

export async function POST(request: Request) {
  const payload = await request.json();
  const url = `${genesoftCoreApiServiceBaseUrl}/email/subscription`;
  console.log({
    url,
    payload,
  });
  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${genesoftCoreApiServiceApiKey}`,
      },
    });
    const portfolio = res.data;
    return Response.json(portfolio);
  } catch (error) {
    console.log({
      message: `${routeName} - [POST]: error while subscribe Genesoft email on Core API Service`,
      metadata: { error },
    });
  }
}

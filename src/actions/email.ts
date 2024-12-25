'use server';

import { nextAppBaseUrl } from '@/constants/web';
import axios from 'axios';

export async function subscribeGenesoftEmail({ email }: { email: string }) {
  const url = `${nextAppBaseUrl}/api/email`;
  try {
    const response = await axios.post(url, { email });
    const emailSubscription = await response.data;
    return emailSubscription;
  } catch (error) {
    throw error;
  }
}

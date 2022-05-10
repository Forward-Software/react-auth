import Client from './client';
import { createAuth } from '@forward-software/react-auth';

export const authClient = new Client();

export const { AuthProvider, useAuthClient } = createAuth(authClient);

import { createAuth } from '../../../../.';
import Client from './client';

export const authClient = new Client();

export const { AuthProvider, useAuthClient } = createAuth(authClient);

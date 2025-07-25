import { createAuthClient } from 'better-auth/vue';
import { defineStore } from 'pinia';

const authClient = createAuthClient();

type AuthState = {
  session: any;
};

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    session: null,
  }),

  getters: {
    user: state => state.session?.data?.user,
    loading: state => state.session?.isPending,
  },

  actions: {
    async init() {
      this.session = await authClient.useSession(useFetch);
    },

    async signIn() {
      const { csrf } = useCsrf();
      const headers = new Headers();

      headers.append('csrf-token', csrf);

      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/dashboard',
        errorCallbackURL: '/error',
        fetchOptions: {
          headers,
        },
      });
    },

    async signOut() {
      const { csrf } = useCsrf();
      const headers = new Headers();

      headers.append('csrf-token', csrf);

      await authClient.signOut({
        fetchOptions: {
          headers,
        },
      });

      navigateTo('/');
    },
  },
});

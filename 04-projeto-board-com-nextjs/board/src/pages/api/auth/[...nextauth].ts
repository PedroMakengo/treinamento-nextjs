import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import firebase from "../../../services/firebaseConnection";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  secret: process.env.JWT_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken;

      const lastDonate = await firebase
        .firestore()
        .collection("users")
        .doc(String(token.email))
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            return snapshot.data().lastDonate.toDate();
          } else {
            return null; // Não é apoiador
          }
        });

      let data = {
        ...session,
        vip: lastDonate ? true : false,
        lastDonate: lastDonate,
      };
      session = data;
      return session;
    },
  },
};
export default NextAuth(authOptions);

import { AppProps } from "next/app";
import { Header } from "../components/Header";
import { SessionProvider as NextAuthProvider } from "next-auth/react";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "../styles/global.scss";

const initialOptions = {
  "client-id":
    "ARh63Va5INuZb3S_iBlsdv_D0D8qPC0e4KIKhdmBNKeoA9-tLdmKiPDg24HMeWzeAeyJJoysqIi6y7jy",
  currency: "BRL",
  intent: "capture",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  );
}

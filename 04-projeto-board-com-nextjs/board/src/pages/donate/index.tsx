import Image from "next/image";

import { getServerSession } from "next-auth";
import { useState } from "react";
import Head from "next/head";
import { authOptions } from "../api/auth/[...nextauth]";

import firebase from "../../services/firebaseConnection";

import styles from "./styles.module.scss";

// CLIENT ID = ARh63Va5INuZb3S_iBlsdv_D0D8qPC0e4KIKhdmBNKeoA9-tLdmKiPDg24HMeWzeAeyJJoysqIi6y7jy
// <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

import { PayPalButtons } from "@paypal/react-paypal-js";

import rocket from "../../../public/images/rocket.svg";

interface DonateProps {
  user: {
    id: string;
    nome: string;
    image: string;
  };
}
export default function Donate({ user }: DonateProps) {
  const [vip, setVip] = useState(false);
  async function handleSaveDonate() {
    await firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .set({ donate: true, lastDonate: new Date(), image: user.image })
      .then(() => {
        setVip(true);
      });
  }
  return (
    <>
      <Head>
        <title>Página de apoio</title>
      </Head>
      <main className={styles.container}>
        <Image src={rocket} alt="Seja apoiador" />

        {vip && (
          <div className={styles.vip}>
            <Image width={50} height={50} src={user.image} alt={user.nome} />
            <span>Parabéns você é um novo apoiador</span>
          </div>
        )}

        <h1>Seja um apoiador deste projeto 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>

        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: "1" } }],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(function (details) {
              handleSaveDonate();
            });
          }}
        />
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanente: false,
      },
    };
  }

  const user = {
    nome: session?.user.name,
    id: session?.user.email,
    image: session?.user.image,
  };

  return {
    props: { user },
  };
}

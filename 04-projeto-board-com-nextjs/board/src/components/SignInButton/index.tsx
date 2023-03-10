import { signIn, signOut, useSession } from "next-auth/react";

import styles from "./style.module.scss";

import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import Image from "next/image";

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <Image
        width={35}
        height={35}
        src={session.user.image}
        alt={session.user.name}
      />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub color="#FFB800" />
      Entrar com o github
    </button>
  );
}

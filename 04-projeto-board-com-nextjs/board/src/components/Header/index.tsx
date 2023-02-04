import Link from "next/link";
import { SignInButton } from "../SignInButton";
import styles from "./style.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo Meu Board" />

        <nav>
          <Link href="/">Home</Link>
          <Link href="/board">Meu board</Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}

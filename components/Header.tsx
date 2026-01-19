import styles from "../styles/Header.module.css";
import { GithubIcon } from "./icons/GithubIcon";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>the bug is on the table</h1>
        <a
          href="https://github.com/rcrdk"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
          aria-label="Visit rcrdk on GitHub"
        >
          <GithubIcon className={styles.githubIcon} size={20} />
        </a>
      </div>
    </header>
  );
}


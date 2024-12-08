import Image from "next/image";
import { logout } from './login/actions'
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <h1>TOP PAGE</h1>
      <form>
        <button formAction={logout}>Log out</button>
      </form>
    </div>
  );
}

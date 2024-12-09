import Image from "next/image";
import { logout } from './login/actions'
import Map from "./map/Map";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <form className="mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" formAction={logout}>Log out</button>
      </form>
      <h1 className="text-2xl font-bold mb-4">TOP PAGE</h1>
      <div className="w-full h-4/5 mb-4">
        <Map />
      </div>
    </div>
  );
}

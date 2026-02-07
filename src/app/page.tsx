import Image from "next/image";
import BoardList from "../components/BoardList";

export default function Home() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#161616]">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here are your active boards.</p>
      </header>
      <section>
        <BoardList />
      </section>
    </div>
  );
}

'use client';
import { ArrowRight } from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";

export default function ButtonBuild() {
  const router = useRouter()
  return (
    <button
      onClick={() => {router.push("/select-version")}}
      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 cursor-pointer transition-colors rounded-lg pt-2.5 pr-2 pb-2.5 pl-2"
    >
      <span className="font-medium text-white">Собрать сборку</span>
      <ArrowRight className="font-medium text-white" />
    </button>
  );
}
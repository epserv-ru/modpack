import { ArrowRight } from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";

export default function ButtonMore() {
  const router = useRouter()
  return (
    <button
      onClick={() => {router.push("/download-app")}}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors rounded-lg px-2.5 py-2">
      <span className="font-medium text-white">Подробнее</span>
      <ArrowRight className="font-medium text-white" />
    </button>
  );
}
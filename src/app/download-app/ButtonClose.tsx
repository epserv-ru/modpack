import { Close } from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";
import { STORAGE_KEYS } from "@/constants/cache";

export default function ButtonClose() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ABOUT, 'true');
        router.push("/select-version");
      }}
      className="boder border-blue-500 cursor-pointer text-gray-400 hover:text-white transition-colors"
    >
      <Close size={28} />
    </button>
  )
}
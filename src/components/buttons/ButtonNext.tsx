import {ArrowRight} from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";

export default function ButtonNext({ nextPage, loaded } : { nextPage : string, loaded : boolean }) {
  const router = useRouter()
  return (
    <button
      onClick={() => {
        router.push(nextPage)
        const activeStep = Number(window.sessionStorage.getItem("activeStep"))
        const nextStep = String(activeStep + 1)
        window.sessionStorage.setItem("activeStep", nextStep)
      }}
      disabled={!loaded}
      className={`flex w-[151px] items-center justify-center gap-2 rounded-lg transition-colors px-2.5 py-2 ${ loaded ? `bg-primary-700 hover:bg-primary-800 cursor-pointer opacity-100 transition-all duration-300` : `bg-primary-700 opacity-50 transition-all duration-300`}`}>
      <span className="text-sm font-medium text-white">Продолжить</span>
      <ArrowRight className="font-medium text-white" />
    </button>
  );
}
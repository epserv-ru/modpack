import {ArrowRight} from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";

interface ButtonNextProps {
  nextPage?: string;
  onClick?: () => void;
  loaded: boolean;
  disabled: boolean;
}

export default function ButtonNext({ nextPage, onClick, loaded, disabled }: ButtonNextProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (nextPage) {
      router.push(nextPage);
      const activeStep = Number(window.sessionStorage.getItem("activeStep"));
      const nextStep = String(activeStep + 1);
      window.sessionStorage.setItem("activeStep", nextStep);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex w-[151px] items-center justify-center gap-2 rounded-lg px-2.5 py-2 transition-all duration-300 bg-primary-700 ${ loaded ? `hover:bg-primary-800 cursor-pointer opacity-100` : `opacity-50`}`}>
      <span className="text-sm font-medium text-white">Продолжить</span>
      <ArrowRight className="text-white" />
    </button>
  );
}

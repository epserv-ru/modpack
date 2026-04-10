import { Close } from "flowbite-react-icons/outline";

export default function ButtonClose ({ onClick } : {onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl cursor-pointer transition-all duration-200 ease-in-out">
      <Close size={20}/>
    </button>
  )
}
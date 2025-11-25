import { Download, Folder, Server } from "flowbite-react-icons/solid";
import AbstractInfoCard from "../about/AbstractInfoCard.tsx";

export function TextCard({ icon, title, description } : AbstractInfoCard) {
   return (
     <div className="flex gap-2">
       {icon}
       <div>
         <h4 className="text-sm font-semibold text-white">{title}</h4>
         <p className="text-sm text-gray-400">{description}</p>
       </div>
     </div>
   );
}

export default function AppBonusesCard() {
  return (
    <div className="rounded-lg border bg-gray-700 border-gray-600 p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Зачем нужно приложение?</h3>
      <div className="flex flex-col gap-4">
        <TextCard
          icon={<Folder className="text-purple-400 flex-shrink-0" size={20} />}
          title={"Прямая установка"}
          description={"Моды устанавливаются сразу в\u00A0папку игры\u00A0— не\u00A0нужно распаковывать архив"}/>
        <TextCard
          icon={<Server className="text-purple-400 flex-shrink-0" size={20} />}
          title={"Авто-добавление серверов"}
          description={"Все IP серверов ElectroPlay автоматически добавляются в\u00A0список"}/>
        <TextCard
          icon={<Download className="text-purple-400 flex-shrink-0" size={20} />}
          title={"Тот же функционал"}
          description={"Все возможности сайта + дополнительные удобства для\u00A0установки"}/>
      </div>
    </div>
  )
}
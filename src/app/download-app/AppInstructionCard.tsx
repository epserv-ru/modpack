interface ListItem {
  number: number
  context: string
}

export function TextCard({ number, context } : ListItem) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">{number}</div>
      <p className="leading-relaxed">{context}</p>
    </div>
  );
}

export default function AppInstructionCard() {
  return (
    <div className="rounded-lg border bg-gray-700 border-gray-600 p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Как работает приложение?</h3>
      <div className="space-y-4 text-sm text-gray-300">
        <TextCard number={1} context={"Скачиваете и\u00A0запускаете приложение"} />
        <TextCard number={2} context={"Собираете сборку"} />
        <TextCard number={3} context={"Указываете путь к\u00A0корневой папке Minecraft"} />
        <TextCard number={4} context={"IP добавляются в\u00A0список автоматически"} />
      </div>
    </div>
  )
}
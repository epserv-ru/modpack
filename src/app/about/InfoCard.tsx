import AbstractInfoCard from "./AbstractInfoCard.tsx";

export default function InfoCard({ icon, title, description } : AbstractInfoCard) {
  return (
    <div className="text-center p-2 bg-gray-700 rounded-lg border border-gray-600">
      {icon}
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}
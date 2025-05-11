import { CheckCircle } from "lucide-react"

interface ProgressIndicatorProps {
  steps: string[]
  currentStep: number
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                index < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : index === currentStep
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300 text-gray-300"
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-6 h-6" /> : <span>{index + 1}</span>}
            </div>
            <span className={`text-xs mt-2 text-center ${index <= currentStep ? "text-gray-700" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
        <div
          className="absolute top-0 h-1 bg-blue-500 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

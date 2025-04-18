"use client"

import { useState } from "react"
import { Button } from "@/components/ui/inputs/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/feedback/dialog"
import { Input } from "@/components/ui/inputs/input"
import { Slider } from "@/components/ui/inputs/slider"
import { ChevronUp, ChevronDown, HelpCircle, ArrowRight, Info } from "lucide-react"
import { usePositionStore } from "@/store/positionStore"

export default function DemoMode() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [demoCountry, setDemoCountry] = useState({
    id: "demo",
    name: "Demo Country",
    flagUrl: "https://flagcdn.com/w40/us.png",
    currentGdp: 20.5,
    markPrice: 20500,
    trend: "up",
    changePercent: 0.7,
    fundingRate: 0.01,
  })
  const [direction, setDirection] = useState(null)
  const [amount, setAmount] = useState("100")
  const [leverage, setLeverage] = useState(1)

  const addPosition = usePositionStore((state) => state.addPosition)

  const totalSteps = 5

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Create a demo position
      const newPosition = {
        id: `demo-${Date.now()}`,
        country: demoCountry,
        direction: direction,
        size: Number.parseFloat(amount),
        leverage: leverage,
        entryPrice: demoCountry.markPrice,
        markPrice: demoCountry.markPrice,
        openTime: new Date(),
        fundingRate: demoCountry.fundingRate,
        nextFundingTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      }

      addPosition(newPosition)
      setIsOpen(false)

      // Reset for next time
      setTimeout(() => {
        setCurrentStep(1)
        setDirection(null)
        setAmount("100")
        setLeverage(1)
      }, 500)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Welcome to Demo Mode!</h3>
            <p className="text-gray-400">
              This tutorial will guide you through making your first GDP prediction trade without using real funds.
            </p>
            <div className="flex items-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-400">
                You'll learn how to select a direction, set your margin amount, choose leverage, and place a trade.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 1: Select a Direction</h3>
            <p className="text-gray-400">
              Choose whether you think the GDP of Demo Country will go up (Long) or down (Short).
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                type="button"
                variant={direction === "long" ? "default" : "outline"}
                className={direction === "long" ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setDirection("long")}
              >
                <ChevronUp className="mr-2 h-4 w-4" />
                Long (Up)
              </Button>
              <Button
                type="button"
                variant={direction === "short" ? "default" : "outline"}
                className={direction === "short" ? "bg-red-600 hover:bg-red-700" : ""}
                onClick={() => setDirection("short")}
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                Short (Down)
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 2: Enter Margin Amount</h3>
            <p className="text-gray-400">
              Enter the amount you want to trade with. This is the capital you're committing to this position.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-400">Margin Amount</label>
                <span className="text-sm text-gray-400">Demo Balance: 1,000 USDC</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^\d*\.?\d*$/.test(value)) {
                      setAmount(value)
                    }
                  }}
                  placeholder="0.00"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>
                  Max
                </Button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 3: Select Leverage</h3>
            <p className="text-gray-400">
              Leverage multiplies your exposure and potential profits, but also increases risk.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                    {leverage}x
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`px-2 py-1 text-xs rounded ${
                        leverage === level ? "bg-blue-500 text-white" : "bg-[#262626] text-gray-300"
                      }`}
                      onClick={() => setLeverage(level)}
                    >
                      {level}x
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                value={[leverage]}
                min={1}
                max={5}
                step={0.1}
                onValueChange={(val) => setLeverage(val[0])}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-400">
                <span>1x</span>
                <span>2x</span>
                <span>3x</span>
                <span>4x</span>
                <span>5x</span>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-500">
              <p>
                <strong>Warning:</strong> Higher leverage means higher risk of liquidation if the market moves against
                your position.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Step 4: Review and Confirm</h3>
            <p className="text-gray-400">Review your trade details before placing your order.</p>

            <div className="space-y-2 pt-4 border-t border-[#333333]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Country</span>
                <span>{demoCountry.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Direction</span>
                <span className={direction === "long" ? "text-green-500" : "text-red-500"}>
                  {direction === "long" ? "Long (Up)" : "Short (Down)"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Margin Amount</span>
                <span>${amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Leverage</span>
                <span>{leverage}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Position Size</span>
                <span>${Number.parseFloat(amount) * leverage} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entry Price</span>
                <span>${demoCountry.markPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Liquidation Price</span>
                <span className="text-red-500">
                  $
                  {direction === "long"
                    ? (demoCountry.markPrice * (1 - 0.8 / leverage)).toFixed(2)
                    : (demoCountry.markPrice * (1 + 0.8 / leverage)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400">
              <p>
                <strong>Note:</strong> This is a demo trade. After placing this order, you can view and manage it in the
                Positions tab.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <HelpCircle className="h-4 w-4" />
        Try Demo Mode
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GDP Prediction Demo</DialogTitle>
            <DialogDescription>Learn how to make GDP predictions in a risk-free environment</DialogDescription>
          </DialogHeader>

          <div className="py-4">{renderStepContent()}</div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Step {currentStep} of {totalSteps}
              </span>
              <Button onClick={handleNextStep} disabled={currentStep === 2 && !direction}>
                {currentStep < totalSteps ? "Next" : "Place Demo Trade"}
                {currentStep < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

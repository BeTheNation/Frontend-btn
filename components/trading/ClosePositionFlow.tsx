import React, { useState } from 'react';
import { Position, PositionWithPnL } from '@/types/position';

interface ClosePositionFlowProps {
  position: Position | PositionWithPnL;
  onClose: () => void;
  onConfirm: () => void;
}

type Step = 'close_order' | 'check_pnl' | 'balance' | 'history';

export function ClosePositionFlow({ position, onClose, onConfirm }: ClosePositionFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('close_order');

  const {
    country,
    direction,
    size,
    entryPrice,
    markPrice,
    leverage,
  } = position;

  // Calculate PnL if not provided
  const unrealizedPnL = 'unrealizedPnL' in position 
    ? position.unrealizedPnL 
    : size * ((markPrice - entryPrice) / entryPrice) * (direction === 'long' ? 1 : -1);

  // Calculate PnL percentage
  const pnlPercentage = ((unrealizedPnL / size) * 100).toFixed(1);
  const isPnlPositive = unrealizedPnL >= 0;

  // Calculate fees (assuming 0.5% fee)
  const fees = size * 0.005;

  const renderStep = () => {
    switch (currentStep) {
      case 'close_order':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-2">Close Position</h3>
              <p className="text-[#697485]">Are you sure you want to close this position?</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Position</span>
                <span className="text-white">{country.name} {direction.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Size</span>
                <span className="text-white">${size.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Entry Price</span>
                <span className="text-white">{entryPrice.toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Mark Price</span>
                <span className="text-white">{markPrice.toFixed(2)}M</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 h-12 px-4 bg-transparent border border-[#323232] rounded-full text-white hover:bg-[#323232] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep('check_pnl')}
                className="flex-1 h-12 px-4 bg-[#155dee] rounded-full text-white hover:bg-[#1351d8] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'check_pnl':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-2">Confirm PnL</h3>
              <p className="text-[#697485]">Review your position's performance</p>
            </div>
            
            <div className="p-6 bg-[#1a1c1f] rounded-xl">
              <div className={`text-center ${isPnlPositive ? 'text-[#16b264]' : 'text-[#b21616]'} text-2xl font-bold mb-2`}>
                {isPnlPositive ? '+' : '-'}${Math.abs(unrealizedPnL).toFixed(2)}
              </div>
              <div className="text-center text-[#697485]">
                ({isPnlPositive ? '+' : '-'}{pnlPercentage}%)
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Trading Fees</span>
                <span className="text-white">-${fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#697485]">Net PnL</span>
                <span className={isPnlPositive ? 'text-[#16b264]' : 'text-[#b21616]'}>
                  {isPnlPositive ? '+' : '-'}${(Math.abs(unrealizedPnL) - fees).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('balance')}
              className="w-full h-12 px-4 bg-[#155dee] rounded-full text-white hover:bg-[#1351d8] transition-colors"
            >
              Continue
            </button>
          </div>
        );

      case 'balance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-2">Updated Balance</h3>
              <p className="text-[#697485]">Your new balance after closing position</p>
            </div>
            
            <div className="p-6 bg-[#1a1c1f] rounded-xl">
              <div className="text-center text-white text-2xl font-bold mb-2">
                $1,234.56
              </div>
              <div className="text-center text-[#697485]">
                Previous: $1,000.00
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('history')}
              className="w-full h-12 px-4 bg-[#155dee] rounded-full text-white hover:bg-[#1351d8] transition-colors"
            >
              View History
            </button>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-2">Trade History</h3>
              <p className="text-[#697485]">Position successfully closed</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#1a1c1f] rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#697485]">{country.name} {direction.toUpperCase()}</span>
                  <span className={isPnlPositive ? 'text-[#16b264]' : 'text-[#b21616]'}>
                    {isPnlPositive ? '+' : '-'}${Math.abs(unrealizedPnL).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#697485]">Closed at {new Date().toLocaleTimeString()}</span>
                  <span className="text-[#697485]">{pnlPercentage}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="w-full h-12 px-4 bg-[#155dee] rounded-full text-white hover:bg-[#1351d8] transition-colors"
            >
              Done
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {['close_order', 'check_pnl', 'balance', 'history'].map((step, index) => (
            <React.Fragment key={step}>
              {index > 0 && (
                <div className={`h-[2px] w-8 ${currentStep === step ? 'bg-[#155dee]' : 'bg-[#323232]'}`} />
              )}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step ? 'bg-[#155dee] text-white' : 'bg-[#323232] text-[#697485]'
                }`}
              >
                {index + 1}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
} 
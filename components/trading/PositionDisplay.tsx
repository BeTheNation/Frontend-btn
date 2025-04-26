import React, { useState } from 'react';
import { Position, PositionWithPnL } from '@/types/position';
import { ClosePositionFlow } from './ClosePositionFlow';

interface PositionDisplayProps {
  position: Position | PositionWithPnL;
  onClose?: () => void;
}

export function PositionDisplay({ position, onClose }: PositionDisplayProps) {
  const [isClosing, setIsClosing] = useState(false);

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

  // Calculate liquidation price if not provided
  const liquidationPrice = 'liquidationPrice' in position
    ? position.liquidationPrice
    : direction === 'long'
      ? entryPrice * (1 - 0.8 / leverage)
      : entryPrice * (1 + 0.8 / leverage);

  // Calculate PnL percentage
  const pnlPercentage = ((unrealizedPnL / size) * 100).toFixed(1);
  const isPnlPositive = unrealizedPnL >= 0;

  // Calculate fees (assuming 0.5% fee)
  const fees = size * 0.005;

  if (isClosing) {
    return (
      <ClosePositionFlow 
        position={position}
        onClose={() => setIsClosing(false)}
        onConfirm={() => {
          setIsClosing(false);
          if (onClose) onClose();
        }}
      />
    );
  }

  return (
    <>
      <div className="self-stretch inline-flex justify-start items-center gap-4">
        <div className="flex-1 justify-start text-white text-lg font-medium font-['Inter'] leading-7">Positions</div>
        {onClose && (
          <div 
            className="w-[116px] h-10 px-[10.75px] py-1 rounded-[67.21px] shadow-[0px_0.6720554232597351px_1.3441108465194702px_0px_rgba(0,0,0,0.12)] outline outline-1 outline-offset-[-1px] outline-[#155dee] flex justify-center items-center gap-[2.69px] cursor-pointer"
            onClick={() => setIsClosing(true)}
          >
            <div className="text-center justify-center text-[#155dee] text-base font-semibold font-['Inter'] leading-none">Close</div>
          </div>
        )}
      </div>
      <div className="self-stretch flex-1 flex flex-col justify-start items-start">
        <div className="self-stretch h-px relative">
          <div className="w-full h-px left-0 top-0 absolute bg-[#323232]" />
        </div>
        <div className="self-stretch py-4 inline-flex justify-between items-center">
          <div className="w-[71px] flex justify-between items-center">
            <div className={`w-4 h-[15px] ${direction === 'long' ? 'bg-[#16b264]' : 'bg-[#b21616]'} rounded-[100px]`} />
            <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">{country.name}</div>
          </div>
          <div className={`justify-start ${isPnlPositive ? 'text-[#16b264]' : 'text-[#b21616]'} text-sm font-normal font-['Inter'] leading-tight`}>
            {isPnlPositive ? '+' : '-'}${Math.abs(unrealizedPnL).toFixed(2)} ({isPnlPositive ? '+' : '-'}{pnlPercentage}%)
          </div>
        </div>
        <div className="self-stretch py-3.5 inline-flex justify-between items-center">
          <div className="w-[101px] flex justify-between items-center">
            <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Position Size</div>
          </div>
          <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">${size.toFixed(2)}</div>
        </div>
        <div className="self-stretch py-3.5 inline-flex justify-between items-center">
          <div className="w-[101px] flex justify-between items-center">
            <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Entry Price</div>
          </div>
          <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">{entryPrice.toFixed(2)}M</div>
        </div>
        <div className="self-stretch py-3.5 inline-flex justify-between items-center">
          <div className="w-[101px] flex justify-between items-center">
            <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Liquidation Price</div>
          </div>
          <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">{liquidationPrice.toFixed(2)}M</div>
        </div>
        <div className="self-stretch py-3.5 inline-flex justify-between items-center">
          <div className="w-[101px] flex justify-between items-center">
            <div className="justify-start text-[#697485] text-sm font-medium font-['Inter'] leading-tight">Fees</div>
          </div>
          <div className="justify-start text-[#697586] text-sm font-normal font-['Inter'] leading-tight">${fees.toFixed(2)}</div>
        </div>
      </div>
    </>
  );
} 
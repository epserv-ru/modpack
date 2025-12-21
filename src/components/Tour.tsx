'use client';

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "flowbite-react-icons/outline";
import ButtonClose from "@/components/buttons/ButtonClose.tsx";

export interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  maxHighlightHeight?: number;
}

interface TourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

interface TooltipPosition {
  top?: string;
  left?: string;
  transform?: string;
}

interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export default function Tour({ steps, onComplete, onSkip }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState<ElementPosition>({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        });
        setIsVisible(true);
      }
    };

    updatePosition();
    const handleResize = () => { updatePosition() };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize) };
  }, [step.target, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = (): TooltipPosition => {
    const tooltipWidth = 360;
    const tooltipHeight = 255;
    const offset = 16;

    if (step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const spaceAbove = position.top;
    const spaceBelow = window.innerHeight - position.bottom;
    const spaceLeft = position.left;
    const spaceRight = window.innerWidth - position.right;

    const positions = [
      {
        name: 'top',
        top: position.top - tooltipHeight - offset,
        left: position.left + position.width / 2 - tooltipWidth / 2,
        condition: spaceAbove >= tooltipHeight + offset,
      },
      {
        name: 'bottom',
        top: position.bottom + offset,
        left: position.left + position.width / 2 - tooltipWidth / 2,
        condition: spaceBelow >= tooltipHeight + offset,
      },
      {
        name: 'left',
        top: position.top + position.height / 2 - tooltipHeight / 2,
        left: position.left - tooltipWidth - offset,
        condition: spaceLeft >= tooltipWidth + offset,
      },
      {
        name: 'right',
        top: position.top + position.height / 2 - tooltipHeight / 2,
        left: position.right + offset,
        condition: spaceRight >= tooltipWidth + offset,
      },
    ];

    const preferred = positions.find(p => p.name === step.position);
    if (preferred?.condition) {
      return {
        top: `${preferred.top}px`,
        left: `${preferred.left}px`,
      };
    }

    const available = positions.find(p => p.condition);
    if (available) {
      return {
        top: `${available.top}px`,
        left: `${available.left}px`,
      };
    }

    const fallback = preferred || positions[0];

    return {
      top: `${fallback.top}px`,
      left: `${fallback.left}px`,
    };
  };

  const tooltipPos = getTooltipPosition();

  const highlightHeight = step.maxHighlightHeight
    ? Math.min(position.height, step.maxHighlightHeight)
    : position.height;

  if (!isVisible) return null;

  // Находим границы header и footer для overlay
  const isNative = !!document.querySelector('[class*="titlebar-drag-region"]');
  const header = document.querySelector('[class*="titlebar-drag-region"], header[class*="flex"]');
  const footer = document.querySelector('[id*="footer"], footer[class*="flex"]');

  const headerBottom = (isNative && header) ? header.getBoundingClientRect().bottom : 0;
  const footerTop = footer ? footer.getBoundingClientRect().top : window.innerHeight;

  return (
    <>
      <Border headerBottom={headerBottom} footerTop={footerTop} />
      <div
        ref={overlayRef}
        className="fixed z-50 w-90 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-5 transition-all duration-200 ease-out"
        style={tooltipPos}
      >
        <ButtonClose onClick={onSkip} />
        <Content />
        <ProgressBar />
        <NavigationButtons />
      </div>
    </>
  );

  function Border({ headerBottom, footerTop }: { headerBottom: number; footerTop: number }) {
    const overlayTop = headerBottom;
    const overlayHeight = footerTop - headerBottom;

    const maxBorderBottom = footerTop;
    const borderTop = Math.max(headerBottom + 4, position.top - 4);
    const borderHeight = Math.min(highlightHeight + 8, maxBorderBottom - borderTop);

    return (
      <>
        <div
          className="fixed z-40 bg-black/60 backdrop-blur-[2px]"
          style={{
            top: `${overlayTop}px`,
            height: `${overlayHeight}px`,
            left: '0',
            right: '0',
            clipPath: `polygon(
              0px 0px,
              0px ${overlayHeight}px,
              ${position.left}px ${overlayHeight}px,
              ${position.left}px ${Math.max(0, position.top - overlayTop)}px,
              ${position.left + position.width}px ${Math.max(0, position.top - overlayTop)}px,
              ${position.left + position.width}px ${Math.max(0, position.top + highlightHeight - overlayTop)}px,
              ${position.left}px ${Math.max(0, position.top + highlightHeight - overlayTop)}px,
              ${position.left}px ${overlayHeight}px,
              100% ${overlayHeight}px,
              100% 0px
            )`,
          }}
        />
        <div
          className="fixed z-50"
          style={{
            top: `${borderTop}px`,
            left: `${position.left - 4}px`,
            width: `${position.width + 8}px`,
            height: `${borderHeight}px`,
            borderRadius: '12px',
            border: '3px solid #3b82f6',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        />
      </>
    );
  }

  function Content() {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {currentStep + 1}
          </div>
          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{step.content}</p>
      </div>
    );
  }

  function ProgressBar() {
    return (
      <div className="w-full bg-gray-700 rounded-full h-1.5 mb-4">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    );
  }

  function NavigationButtons() {
    return (
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            currentStep === 0 ? 'text-gray-500' : 'text-gray-300 hover:bg-gray-700 cursor-pointer'
          }`}
        >
          <ArrowLeft />
          Назад
        </button>

        <span className="text-gray-400 text-sm font-medium">
          {currentStep + 1} из {steps.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-lg px-4 py-2 bg-primary-700 hover:bg-primary-800 transition-all duration-300 cursor-pointer"
        >
          <span className="text-sm font-medium text-white">
            {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
          </span>
          <ArrowRight className="text-white" />
        </button>
      </div>
    );
  }
}
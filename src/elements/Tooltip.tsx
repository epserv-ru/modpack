import React, { useState, useRef } from "react";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    placement?: "top" | "right" | "bottom" | "left";
    className?: string;
}

export function Tooltip(
    {content, children, placement = "top", className = ""}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<number>(100);

    const show = () => {
        clearTimeout(timeoutRef.current);
        setVisible(true);
    };

    const hide = () => {
        timeoutRef.current = window.setTimeout(() => setVisible(false), 50);
    };

    const tooltipPosition = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-4",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-4",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-4",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-4",
    };

    const arrowPosition = {
        top: "bottom-[-12px] left-1/2 transform -translate-x-1/2",
        right: "left-[-12px] top-1/2 transform -translate-y-1/2",
        bottom: "top-[-12px] left-1/2 transform -translate-x-1/2",
        left: "right-[-12px] top-1/2 transform -translate-y-1/2",
    };

    const arrowBorderColor = {
        top: "#1F2937 transparent transparent transparent",
        right: "transparent #1F2937 transparent transparent",
        bottom: "transparent transparent #1F2937 transparent",
        left: "transparent transparent transparent #1F2937",
    };

    return (
        <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide} onFocus={show}>
            {children}
            {visible && (
                <div className={`z-50 absolute rounded whitespace-nowrap select-none ${tooltipPosition[placement]} ${className}`}>
                    {content}
                    <span
                        className={`absolute border-solid border-transparent ${arrowPosition[placement]}`}
                        style={{
                            borderWidth: "6px",
                            borderColor: arrowBorderColor[placement],
                        }}
                    />
                </div>
            )}
        </div>
    );
}

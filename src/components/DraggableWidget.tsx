import React, { useState, useEffect, useRef } from 'react';
import { GripHorizontal } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DraggableWidgetProps {
  id: string;
  defaultPosition: Position;
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
  onFocus?: () => void;
  title?: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  defaultPosition,
  children,
  className = '',
  zIndex = 30,
  onFocus,
  title,
}) => {
  const [position, setPosition] = useState<Position>(() => {
    try {
      const saved = localStorage.getItem(`rwm_pos_${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return defaultPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<{ mouseX: number; mouseY: number; elemX: number; elemY: number }>({
    mouseX: 0,
    mouseY: 0,
    elemX: 0,
    elemY: 0,
  });

  // Clamp position to viewport on resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!dragRef.current) return prev;
        const rect = dragRef.current.getBoundingClientRect();
        const maxX = Math.max(0, window.innerWidth - rect.width);
        const maxY = Math.max(0, window.innerHeight - rect.height);
        return {
          x: Math.min(Math.max(0, prev.x), maxX),
          y: Math.min(Math.max(0, prev.y), maxY),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartDrag = (clientX: number, clientY: number) => {
    if (onFocus) onFocus();
    setIsDragging(true);
    startPosRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      elemX: position.x,
      elemY: position.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore clicks on buttons, inputs, sliders, textareas, iframes, links
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, iframe, select, [data-no-drag="true"]')) {
      return;
    }
    e.preventDefault();
    handleStartDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, iframe, select, [data-no-drag="true"]')) {
      return;
    }
    const touch = e.touches[0];
    handleStartDrag(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.mouseX;
      const deltaY = e.clientY - startPosRef.current.mouseY;

      let newX = startPosRef.current.elemX + deltaX;
      let newY = startPosRef.current.elemY + deltaY;

      if (dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const maxX = Math.max(0, window.innerWidth - rect.width);
        const maxY = Math.max(0, window.innerHeight - rect.height);
        newX = Math.max(0, Math.min(maxX, newX));
        newY = Math.max(0, Math.min(maxY, newY));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPosRef.current.mouseX;
      const deltaY = touch.clientY - startPosRef.current.mouseY;

      let newX = startPosRef.current.elemX + deltaX;
      let newY = startPosRef.current.elemY + deltaY;

      if (dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const maxX = Math.max(0, window.innerWidth - rect.width);
        const maxY = Math.max(0, window.innerHeight - rect.height);
        newX = Math.max(0, Math.min(maxX, newX));
        newY = Math.max(0, Math.min(maxY, newY));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleEndDrag = () => {
      setIsDragging(false);
      setPosition((current) => {
        try {
          localStorage.setItem(`rwm_pos_${id}`, JSON.stringify(current));
        } catch {
          // Ignore
        }
        return current;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEndDrag);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEndDrag);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEndDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEndDrag);
    };
  }, [isDragging, id]);

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={() => onFocus?.()}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        zIndex: isDragging ? 60 : zIndex,
      }}
      className={`fixed top-0 left-0 transition-shadow select-none group ${
        isDragging ? 'cursor-grabbing shadow-2xl scale-[1.01]' : 'cursor-grab'
      } ${className}`}
    >
      {/* Subtle drag handle indicator on top edge */}
      <div
        className="w-full flex items-center justify-center pb-1 pt-0.5 text-white/20 group-hover:text-white/40 transition-colors pointer-events-none"
        title={title ? `${title} (Taşımak için sürükleyin)` : 'Taşımak için sürükleyin'}
      >
        <GripHorizontal className="w-5 h-2.5" />
      </div>
      {children}
    </div>
  );
};

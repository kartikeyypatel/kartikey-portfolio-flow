
"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onClick,
    className,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onClick: () => void;
    className?: string;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={onClick}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full transition-all duration-300 ease-out cursor-pointer",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        className
      )}
    >
      <img
        src={card.image}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium text-white">
          {card.title}
        </div>
      </div>
    </div>
  )
);

Card.displayName = "Card";

export type CardType = {
  id: string;
  title: string;
  image: string;
  [key: string]: any;
};

export function FocusCards({
  cards,
  onCardClick,
  className,
  getCardClassName,
}: {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  className?: string;
  getCardClassName?: (card: CardType) => string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onClick={() => onCardClick(card)}
          className={getCardClassName ? getCardClassName(card) : ""}
        />
      ))}
    </div>
  );
}

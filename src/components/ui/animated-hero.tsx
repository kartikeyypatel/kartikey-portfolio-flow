
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  texts: string[];
  className?: string;
}

function AnimatedText({ texts, className = "" }: AnimatedTextProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === texts.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, texts]);

  return (
    <span className={`relative flex justify-center overflow-hidden ${className}`}>
      {texts.map((text, index) => (
        <motion.span
          key={index}
          className="absolute font-normal"
          initial={{ opacity: 0, y: "-100" }}
          transition={{ type: "spring", stiffness: 50 }}
          animate={
            titleNumber === index
              ? {
                  y: 0,
                  opacity: 1,
                }
              : {
                  y: titleNumber > index ? -150 : 150,
                  opacity: 0,
                }
          }
        >
          {text}
        </motion.span>
      ))}
    </span>
  );
}

export { AnimatedText };

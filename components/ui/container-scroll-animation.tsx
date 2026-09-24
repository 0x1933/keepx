"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";

export function ContainerScroll({
  titleComponent,
  children
}: {
  titleComponent?: ReactNode;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({ target: containerRef });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.86] : [0.76, 0.88]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -14]);

  return (
    <div className="container-scroll" ref={containerRef}>
      <div className="container-scroll-perspective">
        {titleComponent ? <Header translate={translate}>{titleComponent}</Header> : null}
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({ translate, children }: { translate: MotionValue<number>; children: ReactNode }) {
  return (
    <motion.div className="container-scroll-header" style={{ y: translate }}>
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="container-scroll-card"
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 20px 34px rgba(0,0,0,.3), 0 62px 58px rgba(0,0,0,.26), 0 128px 84px rgba(0,0,0,.16)"
      }}
    >
      {children}
    </motion.div>
  );
}

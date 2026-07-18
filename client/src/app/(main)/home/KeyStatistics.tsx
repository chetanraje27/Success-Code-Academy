"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { statistics } from "@/data/home";

function AnimatedCounter({
  target,
  suffix,
  isVisible,
}: {
  target: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <span className="counter-value">
      {count.toLocaleString()}
      <span className="counter-suffix">{suffix}</span>
    </span>
  );
}

export default function KeyStatistics() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="key-statistics">
      <motion.div className="container" style={{ y: yContent }}>
        <div className="stats-header">
          <h2>A Legacy of Medical Selections</h2>
          <p>Our results speak for themselves. We don't just teach, we build careers.</p>
        </div>

        <div className="stats-grid">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
            >
              <div className="stat-glass">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        .key-statistics {
          position: relative;
          padding: 8rem 0;
          background-color: transparent;
          overflow: hidden;
          color: var(--text-primary);
        }

        .container {
          position: relative;
          z-index: 2;
        }

        .stats-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .stats-header h2 {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stats-header p {
          font-size: 1.2rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
          }
        }

        .stat-card {
          position: relative;
        }

        .stat-glass {
          padding: 3rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1);
          transition: transform 0.4s ease, border-color 0.4s ease, background 0.4s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .stat-card:hover .stat-glass {
          transform: translateY(-10px);
          border-color: rgba(64, 181, 193, 0.3);
          background: rgba(255, 255, 255, 0.95);
        }

        .counter-value {
          display: block;
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          text-shadow: 0 0 40px rgba(64, 181, 193, 0.2);
        }

        .counter-suffix {
          color: #40b5c1;
          font-size: 2.5rem;
          margin-left: 2px;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .stats-header h2 {
            font-size: 2.2rem;
          }
          .counter-value {
            font-size: 2.8rem;
          }
          .counter-suffix {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
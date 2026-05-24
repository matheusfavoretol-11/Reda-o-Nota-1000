
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';

export const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: string, subtitle?: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-20 px-6 font-sans">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 shadow-xl"
    >
      {badge}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 text-xl font-medium leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = React.useRef<HTMLSpanElement>(null);
  
  const targetStr = value.replace(/[^0-9.]/g, '');
  const target = parseFloat(targetStr) || 0;
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(progress * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, target, duration]);

  return <span ref={elementRef}>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

export const Countdown = ({ compact = false }: { compact?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 14, m: 32, s: 45 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (compact) {
    return (
      <div className="flex gap-2 items-center justify-center bg-primary/10 border border-primary/20 p-2 rounded-xl">
        <Clock size={14} className="text-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          Oferta expira em: {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
        </span>
      </div>
    );
  }
  
  return (
    <div className="flex gap-4 justify-center">
      {[
        { v: timeLeft.h, l: "Hrs", c: "text-primary" },
        { v: timeLeft.m, l: "Min", c: "text-secondary" },
        { v: timeLeft.s, l: "Seg", c: "text-accent" }
      ].map((time, i) => (
        <div key={i} className="glass w-20 h-20 rounded-[24px] flex flex-col items-center justify-center border-white/5 bg-white/[0.02]">
          <div className={`text-3xl font-display font-black ${time.c}`}>{time.v.toString().padStart(2, '0')}</div>
          <div className="text-[8px] uppercase font-black opacity-30">{time.l}</div>
        </div>
      ))}
    </div>
  );
};

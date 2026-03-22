import { motion } from 'framer-motion';

interface DeviceMockupProps {
  src: string;
  alt: string;
  className?: string;
  glowColor?: string;
}

export default function DeviceMockup({ src, alt, className = '', glowColor = 'rgba(29, 185, 84, 0.25)' }: DeviceMockupProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 blur-[60px] rounded-full scale-90 -z-10"
        style={{ background: glowColor }}
      />
      {/* Device frame */}
      <div className="relative rounded-[2.5rem] overflow-hidden border-[3px] border-white/10 shadow-2xl bg-black max-w-[280px] sm:max-w-[320px] mx-auto">
        {/* Notch removed so text is fully visible */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

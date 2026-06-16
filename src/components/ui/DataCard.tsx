import type { ReactNode } from 'react';

interface DataCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DataCard({
  title,
  icon,
  children,
  className = '',
  contentClassName = '',
}: DataCardProps) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(10, 25, 41, 0.8) 100%)',
      }}
    >
      <div
        className="absolute inset-0 rounded-xl p-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 144, 255, 0.6) 0%, rgba(24, 144, 255, 0.1) 50%, rgba(24, 144, 255, 0.4) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <div className="relative z-10 h-full flex flex-col bg-space-900/95 backdrop-blur-sm">
        {title && (
          <div className="flex items-center gap-2 px-5 py-3 border-b border-accent-500/20">
            {icon && <span className="text-accent-500">{icon}</span>}
            <h3 className="text-accent-50 font-orbitron text-sm font-semibold tracking-wider">
              {title}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-accent-500/50 to-transparent" />
          </div>
        )}
        <div className={`flex-1 min-h-0 p-4 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

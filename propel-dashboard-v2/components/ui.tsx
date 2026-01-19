import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components ---
export const Card = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("rounded-xl border border-border bg-surface text-foreground shadow-sm transition-colors", className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

export const CardContent = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
      outline: "border border-border bg-transparent hover:bg-surface text-foreground",
      ghost: "hover:bg-border text-foreground hover:text-foreground/80",
      destructive: "bg-red-900 text-red-100 hover:bg-red-900/90",
      secondary: "bg-surface text-foreground hover:bg-surface/80 border border-border",
    };
    
    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Badge Component ---
export const Badge = ({ className, variant = 'default', children }: { className?: string; variant?: 'default' | 'destructive' | 'outline' | 'success' | 'warning', children?: React.ReactNode }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    destructive: "border-transparent bg-red-900 text-red-100",
    success: "border-transparent bg-emerald-900/50 text-emerald-200 border border-emerald-800",
    warning: "border-transparent bg-amber-900/50 text-amber-200 border border-amber-800",
    outline: "text-foreground border-border",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2", variants[variant], className)}>
      {children}
    </div>
  );
};

// --- Input Component ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Select Component (Native Wrapper) ---
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

// --- Checkbox Component ---
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-border text-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

// --- Separator ---
export const Separator = ({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) => (
  <div
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
  />
);

// --- Switch Component ---
export const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-border"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}

// --- Dialog ---
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">{title}</h2>
        </div>
        {children}
        <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-surface data-[state=open]:text-muted"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
            <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

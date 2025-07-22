
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-md shadow-neutral-200 hover:bg-primary-hover active:bg-primary-hover transform active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md shadow-neutral-200 hover:bg-destructive/90 active:bg-destructive/90 transform active:scale-[0.98]",
        outline:
          "border-2 border-primary bg-transparent text-primary shadow-md shadow-neutral-200 hover:bg-primary hover:text-white active:bg-primary active:text-white transform active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md shadow-neutral-200 hover:bg-secondary/80 active:bg-secondary/80 transform active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "bg-primary text-white shadow-md shadow-neutral-200 hover:bg-green-400 active:bg-green-400 transform active:scale-[0.98] gap-2",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-12 w-12",
        full: "h-12 w-full px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

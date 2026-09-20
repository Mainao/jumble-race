import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
    "font-display inline-flex items-center justify-center gap-2 border-2 border-ink transition-transform disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer",
    {
        variants: {
            variant: {
                yellow: "rounded-xl bg-yellow text-ink font-black uppercase tracking-wider brutal-btn brutal-shadow hover:brightness-105",
                blue: "rounded-xl bg-blue text-white font-black uppercase tracking-wider brutal-btn brutal-shadow hover:brightness-105",
                secondary:
                    "rounded-xl bg-white text-ink font-black uppercase tracking-wider brutal-btn brutal-shadow-sm hover:bg-slate-50",
                danger: "rounded-xl bg-white text-ink font-black uppercase tracking-wider brutal-btn brutal-shadow-sm hover:bg-rose-50",
                ghost: "border-0 bg-transparent shadow-none font-bold text-slate-500 underline-offset-4 hover:underline",
            },
            size: {
                sm: "text-sm px-4 py-1.5",
                md: "text-lg px-6 py-2.5",
                lg: "text-xl px-8 py-3",
            },
        },
        defaultVariants: {
            variant: "yellow",
            size: "md",
        },
    },
);

interface ButtonProps
    extends
        ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    ref?: React.Ref<HTMLButtonElement>;
}

const Button = ({
    className,
    variant,
    size,
    children,
    ref,
    ...props
}: ButtonProps) => {
    return (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </button>
    );
};

Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components -- shadcn/ui convention: variants live alongside the component
export { Button, buttonVariants };
export type { ButtonProps };

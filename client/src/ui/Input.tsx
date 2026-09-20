import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const inputVariants = cva(
    "w-full bg-cream border-ink rounded-xl text-ink focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                code: "font-display border-[2.5px] py-3 px-4 font-black text-xl sm:text-2xl uppercase tracking-widest brutal-shadow-sm",
                text: "border-2 py-3 px-4 font-bold text-lg",
            },
            accent: {
                yellow: "",
                blue: "",
            },
        },
        compoundVariants: [
            {
                variant: "code",
                accent: "yellow",
                class: "focus:border-yellow",
            },
            {
                variant: "code",
                accent: "blue",
                class: "focus:border-blue",
            },
            {
                variant: "text",
                accent: "yellow",
                class: "focus:ring-2 focus:ring-yellow",
            },
            {
                variant: "text",
                accent: "blue",
                class: "focus:ring-2 focus:ring-blue",
            },
        ],
        defaultVariants: {
            variant: "text",
            accent: "blue",
        },
    },
);

interface InputProps
    extends ComponentProps<"input">, VariantProps<typeof inputVariants> {}

function Input({ className, variant, accent, ...props }: InputProps) {
    return (
        <input
            className={cn(inputVariants({ variant, accent }), className)}
            {...props}
        />
    );
}

// eslint-disable-next-line react-refresh/only-export-components -- shadcn/ui convention: variants live alongside the component
export { Input, inputVariants };
export type { InputProps };

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
    "font-display inline-flex items-center gap-1.5 px-2.5 py-0.5 border-2 border-ink rounded-lg text-xs font-black uppercase tracking-wider",
    {
        variants: {
            variant: {
                yellow: "bg-yellow text-ink",
                blue: "bg-blue text-white",
            },
        },
        defaultVariants: {
            variant: "yellow",
        },
    },
);

interface BadgeProps
    extends ComponentProps<"span">,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        >
            {children}
        </span>
    );
}

// eslint-disable-next-line react-refresh/only-export-components -- shadcn/ui convention: variants live alongside the component
export { Badge, badgeVariants };
export type { BadgeProps };

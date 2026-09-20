import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div">;

function Card({ className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white border-[3.5px] border-ink rounded-3xl p-5 sm:p-7 brutal-shadow-xl relative overflow-hidden",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export { Card };
export type { CardProps };

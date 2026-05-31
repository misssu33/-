import { cn } from "@/shared/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition",
        variant === "primary" &&
          "bg-brand text-brand-foreground hover:opacity-90",
        variant === "ghost" && "text-zinc-400 hover:text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}

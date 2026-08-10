import { cn } from "@/lib/utils";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
}

/** Small uppercase caption — the one used for kickers, years and section headers. */
const Label = ({ children, className, as: Tag = "span" }: LabelProps) => (
  <Tag className={cn("label", className)}>{children}</Tag>
);

export default Label;

import { cn } from "@/lib/utils";

interface EmailLinksProps {
  /** General enquiries — always shown. */
  email: string;
  /** Music enquiries. Omitted or empty renders the general address alone. */
  musicEmail?: string;
  className?: string;
  /** Right-aligns the labels, for the footer's right-hand column. */
  align?: "left" | "right";
  linkClassName?: string;
}

/**
 * The pair of contact addresses, each behind its own caption so visitors can
 * tell the creative practice from YΛSYNTHΛ. Used by the footer, the About page
 * and the Contact page, which previously each inlined a single mailto link.
 */
const EmailLinks = ({
  email,
  musicEmail,
  className,
  align = "left",
  linkClassName,
}: EmailLinksProps) => {
  const entries = [
    { label: "Creative", address: email },
    { label: "Music", address: musicEmail },
  ].filter((entry): entry is { label: string; address: string } =>
    Boolean(entry.address)
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "right" && "md:items-end",
        className
      )}
    >
      {entries.map(({ label, address }) => (
        <div
          key={label}
          className={cn(
            "flex flex-col gap-1",
            align === "right" && "md:items-end"
          )}
        >
          <span className="label text-ink/60">{label}</span>
          <a
            href={`mailto:${address}`}
            className={cn(
              "text-base md:text-lg font-semibold text-ink underline underline-offset-[6px] decoration-ink/40 hover:decoration-ink transition-colors",
              linkClassName
            )}
          >
            {address}
          </a>
        </div>
      ))}
    </div>
  );
};

export default EmailLinks;

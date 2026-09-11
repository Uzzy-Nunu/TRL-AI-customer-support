type IconName = "arrow" | "package" | "truck" | "rotate" | "racket" | "card" | "user" | "menu" | "close" | "check" | "alert" | "clock" | "external";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></>,
    package: <><path d="m21 8-9 5-9-5 9-5 9 5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    rotate: <><path d="M3 12a9 9 0 0 1 15.2-6.5L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.2 6.5L3 16" /><path d="M3 21v-5h5" /></>,
    racket: <><path d="M14 14 7 21" /><path d="m17 17-3-3" /><ellipse cx="11" cy="8" rx="5" ry="7" transform="rotate(-35 11 8)" /><path d="m8 5 6 5M7 8l6 5M11 2l5 6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5M12 17h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    external: <><path d="M14 5h5v5M19 5l-8 8" /><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>
  };
  return <svg {...common}>{paths[name]}</svg>;
}

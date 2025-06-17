import { Toaster as Sonner } from "sonner";


const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          fontFamily: "'Inter', system-ui, sans-serif",
        },
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      richColors
      closeButton
      visibleToasts={1}
      {...props}
    />
  );
};

export { Toaster };
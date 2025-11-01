/**
 * Theme Provider Component
 * Script to initialize theme before React hydration
 */

import Script from "next/script";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Initialize theme before React hydration to prevent flash */}
      <Script
        id="theme-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                // Fallback to dark if localStorage is unavailable
                document.documentElement.classList.add('dark');
              }
            })();
          `,
        }}
      />
      {children}
    </>
  );
}


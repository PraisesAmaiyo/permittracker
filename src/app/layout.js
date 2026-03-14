// // src/app/layout.js
// import './globals.css';
// import StyledComponentsRegistry from '../lib/registry';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning>
//         <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
//       </body>
//     </html>
//   );
// }

import './globals.css';
import StyledComponentsRegistry from '../lib/registry';
import { NotificationProvider } from '@/context/NotificationContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function() {
          try {
            const savedTheme = localStorage.getItem('theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}
        })();
      `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LayoutProvider>
          <NotificationProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
            <Toaster position="top-right" richColors closeButton />
            <SpeedInsights />
          </NotificationProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}

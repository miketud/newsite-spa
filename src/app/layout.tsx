import './globals.css';
import type { Metadata } from 'next';
import { CustomCursor } from './CustomCursor';

export const metadata: Metadata = {
  title: 'FRAMEWORx',
  description: 'Single-page scroll experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

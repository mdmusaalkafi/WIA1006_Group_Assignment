import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Binary Classification of Relationship Success',
  description: 'Interactive dashboard for the WIA1006/WID3006 machine learning group project.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="nav no-print">
          <div className="nav-inner">
            <div className="brand">
              <strong>Binary Classification of Relationship Success</strong>
              <span>User behavioral metrics dashboard</span>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

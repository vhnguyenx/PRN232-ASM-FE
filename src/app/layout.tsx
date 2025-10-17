'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Navbar from '../components/Navbar';
import AuthProvider from '../components/AuthProvider';
import { ToastProvider } from '../components/ToastProvider';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Provider store={store}>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="pt-16 min-h-screen bg-gray-50">
                {children}
              </main>
            </ToastProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}

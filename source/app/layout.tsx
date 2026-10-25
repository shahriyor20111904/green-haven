import type { Metadata } from 'next';
import './globals.css';
import './extended.css';
export const metadata: Metadata = { title: 'GREEN HAVEN — Махалля будущего', description: 'Школьный проект 10 класса. 14 сцен о природе, ответственности и будущем нашего двора. СОР-1.' };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>;}

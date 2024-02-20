'use client';
import { NextUIProvider } from '@nextui-org/react';
import Navbar from '@/components/navbar';

import Image from 'next/image';
import Card from '@/components/section- card';

export default function Home() {
  return (
    <NextUIProvider>
      <main className=' light text-foreground bg-background'>
        <Navbar />
        <div className="px-4 bg-gray-100 w-screen h-screen">
          <Card />
        </div>
      </main>
    </NextUIProvider>
  );
}

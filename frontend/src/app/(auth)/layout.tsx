import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-full w-full items-center justify-center bg-gray-100 p-4">
      {children}
    </main>
  );
}

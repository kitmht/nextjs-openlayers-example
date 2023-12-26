import { BaseMapProvider } from '@/app/_components/base-map';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <BaseMapProvider>
      <main className="w-screen h-screen">{children}</main>
    </BaseMapProvider>
  );
}

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Content from './Content';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {children || <Content />}
      </div>
    </div>
  );
}

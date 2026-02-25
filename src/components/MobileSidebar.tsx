import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sidebar } from './Sidebar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const MobileSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

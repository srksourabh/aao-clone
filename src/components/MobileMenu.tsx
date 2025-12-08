
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, MessageCircle, Briefcase, Home, Info, FileText } from "lucide-react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Home className="w-5 h-5 mr-3" />
              Home
            </Button>
          </Link>
          <Link href="/#services" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Info className="w-5 h-5 mr-3" />
              Services
            </Button>
          </Link>
          <Link href="/corporate" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <Briefcase className="w-5 h-5 mr-3" />
              Corporate Bookings
            </Button>
          </Link>
          <Link href="/#testimonials" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start" size="lg">
              <FileText className="w-5 h-5 mr-3" />
              Testimonials
            </Button>
          </Link>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-gray-600 mb-3 px-4">Contact Us</p>
            <a href="tel:+917890302302" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full justify-start mb-2" size="lg">
                <Phone className="w-5 h-5 mr-3" />
                +91 78903 02302
              </Button>
            </a>
            <a href="https://wa.me/917890302302" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <Button className="w-full justify-start bg-brand-primary hover:bg-brand-secondary" size="lg">
                <MessageCircle className="w-5 h-5 mr-3" />
                WhatsApp
              </Button>
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

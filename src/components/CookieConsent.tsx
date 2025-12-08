
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("aaocab-cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("aaocab-cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("aaocab-cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-brand-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Cookie Consent</h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. By clicking "Accept", you consent to our use of cookies. You can manage your preferences at any time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAccept} className="bg-brand-primary hover:bg-brand-secondary">
                  Accept All
                </Button>
                <Button onClick={handleDecline} variant="outline">
                  Decline
                </Button>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

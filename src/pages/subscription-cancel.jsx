import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Home, CreditCard } from "lucide-react";

export default function SubscriptionCancel() {
  const [location, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleTryAgain = () => {
    setLocation("/#upgrade");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscription Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Your subscription upgrade was cancelled.
            </p>
            <p className="text-sm text-gray-500">
              No charges have been made to your account. You can try upgrading
              again anytime.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

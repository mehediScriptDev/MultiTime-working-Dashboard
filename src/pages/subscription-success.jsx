import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { subscriptionService } from "@/lib/subscription-service";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertTriangle, Home, Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const { user, subscription, refreshSubscription } = useAuth();
  const [isFixing, setIsFixing] = useState(false);
  const [fixComplete, setFixComplete] = useState(false);
  const [fixError, setFixError] = useState(null);

  // Extract session info from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");

  useEffect(() => {
    const fixSubscription = async () => {
      if (!user || fixComplete || fixError) return;

      setIsFixing(true);
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Call the subscription fix endpoint
        const returnUrl = `${window.location.origin}/subscription/success?upgrade=success`;
        const cancelUrl = `${window.location.origin}/subscription/success?upgrade=cancel`;

        const response = await subscriptionService.fixUpgrade(
          token,
          returnUrl,
          cancelUrl,
        );

        if (response?.success) {
          setFixComplete(true);
          // Navigate to home with a full page reload so AuthProvider re-fetches
          // the fresh subscription/premium status from the backend.
          // Using replace() avoids adding a back-history entry for the success page.
          setTimeout(() => {
            window.location.replace("/");
          }, 2000);
        } else {
          throw new Error(response?.message || "Failed to fix subscription");
        }
      } catch (error) {
        console.error("Failed to fix subscription:", error);
        setFixError(error.message);
      } finally {
        setIsFixing(false);
      }
    };

    // Auto-fix subscription after successful payment
    if (sessionId && user) {
      fixSubscription();
    }
  }, [sessionId, user, fixComplete, fixError]);

  const handleGoHome = async () => {
    // Refresh subscription state so the dashboard shows premium immediately
    if (refreshSubscription) {
      await refreshSubscription();
    }
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {isFixing ? (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            ) : fixComplete ? (
              <CheckCircle className="h-16 w-16 text-green-600" />
            ) : fixError ? (
              <AlertTriangle className="h-16 w-16 text-yellow-600" />
            ) : (
              <Crown className="h-16 w-16 text-yellow-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFixing
              ? "Setting Up Your Premium Account"
              : fixComplete
                ? "Welcome to Premium!"
                : fixError
                  ? "Almost There!"
                  : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFixing && (
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                We're setting up your premium features...
              </p>
              <p className="text-sm text-gray-500">
                This may take a few moments.
              </p>
            </div>
          )}

          {fixComplete && (
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Your subscription has been activated successfully!
              </p>
              <p className="text-sm text-gray-500">
                You now have access to unlimited timezones and premium features.
              </p>
            </div>
          )}

          {fixError && (
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your payment was successful, but we encountered an issue
                  setting up your premium features. Please contact support or
                  try refreshing the page.
                </AlertDescription>
              </Alert>
              <p className="text-sm text-gray-500 text-center">
                Error: {fixError}
              </p>
            </div>
          )}

          {!isFixing && (
            <div className="space-y-3">
              {sessionId && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Session ID:</strong> {sessionId.slice(0, 20)}...
                  </p>
                </div>
              )}

              {subscription && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Plan:</strong> {subscription.plan}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Status:</strong> {subscription.status}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button onClick={handleGoHome} className="w-full" disabled={isFixing}>
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

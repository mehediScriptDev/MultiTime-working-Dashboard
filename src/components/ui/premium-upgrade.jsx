import { useAuth } from "@/hooks/use-auth";
import { FiCheck } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function PremiumUpgrade({ timezoneCount }) {
  const { upgradeMutation, subscription } = useAuth();

  const handleUpgrade = () => {
    // Use backend-documented return/cancel URLs (backend will handle redirects)
    const backendBase = import.meta.env.VITE_API_BASE_URL;
    const returnUrl = `${backendBase}/docs`;
    const cancelUrl = `${backendBase}/docs`;
    upgradeMutation.mutate({ returnUrl, cancelUrl });
  };

  // Get max timezone count from subscription status or default to 3
  const maxTimezones = subscription?.limits?.maxTimezones || 3;
  const currentCount = timezoneCount || 0;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-primary text-white rounded-lg shadow-lg overflow-hidden dark:from-slate-800 dark:to-slate-700 dark:text-slate-100">
      <div className="md:flex">
        <div className="p-6 flex-1">
          <h2 className="text-xl font-bold mb-2">Upgrade to Premium</h2>
          <p className="mb-4">
            You're currently using <span className="font-semibold">{currentCount} of {maxTimezones}</span> available timezones on the free plan.
          </p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Unlimited timezones</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Ad-free experience</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Priority email support</span>
            </li>
          </ul>
          <Button
            variant="secondary"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            onClick={handleUpgrade}
            disabled={upgradeMutation.isPending}
          >
            <FaPaypal className="mr-2" />
            {upgradeMutation.isPending ? "Processing..." : "Upgrade Now"}
          </Button>
        </div>
        <div className="md:flex-1 md:flex md:items-center md:justify-center bg-indigo-600/20 p-6 dark:bg-slate-900/40">
          <div className="text-center">
            <div className="text-5xl xl:text-6xl font-bold mb-2">${subscription?.pricing?.amount || 18}</div>
            <div className="text-lg mb-6">per {subscription?.pricing?.interval || "year"}</div>
            <div className="text-sm opacity-80">Billed {subscription?.pricing?.interval || "annually"} • Cancel anytime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

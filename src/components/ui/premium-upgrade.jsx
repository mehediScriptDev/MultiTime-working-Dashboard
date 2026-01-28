import { useAuth } from "@/hooks/use-auth";
import { FiCheck } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function PremiumUpgrade({ timezoneCount }) {
  const { upgradeMutation } = useAuth();

  const handleUpgrade = () => {
    upgradeMutation.mutate();
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-primary text-white rounded-lg shadow-lg overflow-hidden dark:from-slate-800 dark:to-slate-700 dark:text-slate-100">
      <div className="md:flex">
        <div className="p-6 flex-1">
          <h2 className="text-xl font-bold mb-2">Upgrade to Premium</h2>
          <p className="mb-4">
            You're currently using <span className="font-semibold">{timezoneCount} of 3</span> available timezones on the free plan.
          </p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Unlimited timezones</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Advanced scheduling features</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>Save meeting suggestions</span>
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
            <div className="text-5xl xl:text-6xl font-bold mb-2">$18</div>
            <div className="text-lg mb-6">per year</div>
            <div className="text-sm opacity-80">Billed annually • Cancel anytime</div>
          </div>
        </div>
      </div>
    </div>
  );
}

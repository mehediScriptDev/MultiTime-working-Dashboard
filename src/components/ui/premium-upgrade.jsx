import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from 'react-i18next';
import { FiCheck } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function PremiumUpgrade({ timezoneCount }) {
  const { upgradeMutation, subscription } = useAuth();
  const { t } = useTranslation();

  const handleUpgrade = () => {
    const returnUrl = `${window.location.origin}/?upgrade=success`;
    const cancelUrl = `${window.location.origin}/?upgrade=cancel`;
    upgradeMutation.mutate({ returnUrl, cancelUrl });
  };

  // Get max timezone count from subscription status or default to 3
  const maxTimezones = subscription?.limits?.maxTimezones || 3;
  const currentCount = timezoneCount || 0;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-primary text-white rounded-lg shadow-lg overflow-hidden dark:from-slate-800 dark:to-slate-700 dark:text-slate-100">
      <div className="md:flex">
        <div className="p-6 flex-1">
          <h2 className="text-xl font-bold mb-2">{t('premium.upgradeTitle')}</h2>
          <p className="mb-4">
            {t('premium.currentUsage')} <span className="font-semibold">{currentCount} {t('premium.of')} {maxTimezones}</span> {t('premium.availableTimezones')}
          </p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>{t('premium.feature1')}</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>{t('premium.feature2')}</span>
            </li>
            <li className="flex items-center">
              <FiCheck className="mr-2 text-white dark:text-slate-100" />
              <span>{t('premium.feature3')}</span>
            </li>
          </ul>
          <Button
            variant="secondary"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            onClick={handleUpgrade}
            disabled={upgradeMutation.isPending}
          >
            <FaPaypal className="mr-2" />
            {upgradeMutation.isPending ? t('premium.processing') : t('premium.upgradeNow')}
          </Button>
        </div>
        <div className="md:flex-1 md:flex md:items-center md:justify-center bg-indigo-600/20 p-6 dark:bg-slate-900/40">
          <div className="text-center">
            <div className="text-5xl xl:text-6xl font-bold mb-2">${subscription?.pricing?.amount || 18}</div>
            <div className="text-lg mb-6">{subscription?.pricing?.interval === 'month' ? t('premium.perMonth') : t('premium.perYear')}</div>
            <div className="text-sm opacity-80">{subscription?.pricing?.interval === 'month' ? t('premium.billedMonthly') : t('premium.billedAnnually')} • {t('premium.cancelAnytime')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

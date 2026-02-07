import { useTranslation } from 'react-i18next';
import { HelpCircle, Shield, FileText } from "lucide-react";
import { GuideModal } from "@/components/ui/guide-modal";
import { HelpModal } from "@/components/ui/help-modal";
import { PrivacyModal } from "@/components/ui/privacy-modal";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex justify-center sm:justify-start space-x-6 sm:space-x-8">
            <HelpModal>
              <button className="group inline-flex items-center transition-transform hover:scale-110">
                <span className="sr-only">Help</span>
                <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            </HelpModal>
            <PrivacyModal>
              <button className="group inline-flex items-center transition-transform hover:scale-110">
                <span className="sr-only">Privacy</span>
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            </PrivacyModal>
            <GuideModal>
              <button className="group inline-flex items-center transition-transform hover:scale-110">
                <span className="sr-only">Guide</span>
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-600 dark:text-slate-400 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            </GuideModal>
          </div>
          <div>
            <p className="text-center sm:text-right text-xs sm:text-sm text-gray-400 dark:text-slate-400">
              &copy; {new Date().getFullYear()} TimeSync. {t('common.allRightsReserved')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


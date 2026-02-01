import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { HelpCircle, Shield, FileText } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="#">
              <span className="sr-only">Help</span>
              <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-slate-300 dark:hover:text-white" />
            </Link>
            <Link href="#">
              <span className="sr-only">Privacy</span>
              <Shield className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-slate-300 dark:hover:text-white" />
            </Link>
            <Link to="guide">
              <span className="sr-only">Guide</span>
              <FileText className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-slate-300 dark:hover:text-white" />
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-400 dark:text-slate-300">
              &copy; {new Date().getFullYear()} TimeSync.{" "}
              {t("common.allRightsReserved")}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

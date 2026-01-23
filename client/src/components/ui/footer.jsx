import { Link } from "wouter";
import { HelpCircle, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="#">
              <span className="sr-only">Help</span>
              <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </Link>
            <Link href="#">
              <span className="sr-only">Privacy</span>
              <Shield className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </Link>
            <Link href="#">
              <span className="sr-only">Terms</span>
              <FileText className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TimeSync. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

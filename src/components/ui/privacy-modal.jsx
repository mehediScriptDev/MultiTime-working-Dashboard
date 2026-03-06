import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PrivacyModal({ children }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('privacy.title')}
            </DialogTitle>
            <DialogDescription>
              {t('privacy.lastUpdated')} {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section1Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section1Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section2Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-2">
                  {t('privacy.section2Intro')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-slate-300 space-y-1 ml-2">
                  <li>{t('privacy.section2Item1')}</li>
                  <li>{t('privacy.section2Item2')}</li>
                  <li>{t('privacy.section2Item3')}</li>
                  <li>{t('privacy.section2Item4')}</li>
                  <li>{t('privacy.section2Item5')}</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section3Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section3Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section4Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section4Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section5Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section5Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section6Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section6Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section7Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-2">
                  {t('privacy.section7Intro')}
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-slate-300 space-y-1 ml-2">
                  <li>{t('privacy.section7Item1')}</li>
                  <li>{t('privacy.section7Item2')}</li>
                  <li>{t('privacy.section7Item3')}</li>
                  <li>{t('privacy.section7Item4')}</li>
                  <li>{t('privacy.section7Item5')}</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section8Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section8Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section9Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section9Content')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('privacy.section10Title')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('privacy.section10Content')}{' '}
                  <a href="mailto:timesync.mgmt@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('privacy.contactEmail')}
                  </a>
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

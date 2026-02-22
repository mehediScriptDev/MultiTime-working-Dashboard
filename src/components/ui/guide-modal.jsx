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

export function GuideModal({ children }) {
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
              {t('guide.title')}
            </DialogTitle>
            <DialogDescription>
              {t('guide.intro')}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">{t('guide.addTitle')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('guide.addDescription')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('guide.editTitle')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('guide.editDescription')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('guide.premiumTitle')}</h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {t('guide.premiumDescription')}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">{t('guide.tipsTitle')}</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-slate-300 space-y-1 ml-2">
                  <li>{t('guide.tip1')}</li>
                  <li>{t('guide.tip2')}</li>
                  <li>{t('guide.tip3')}</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

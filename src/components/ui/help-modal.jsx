import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle } from 'lucide-react';

export function HelpModal({ children }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const faqs = [
    {
      question: t('help.q1'),
      answer: t('help.a1')
    },
    {
      question: t('help.q2'),
      answer: t('help.a2')
    },
    {
      question: t('help.q3'),
      answer: t('help.a3')
    },
    {
      question: t('help.q4'),
      answer: t('help.a4')
    },
    {
      question: t('help.q5'),
      answer: t('help.a5')
    },
    {
      question: t('help.q6'),
      answer: t('help.a6')
    },
    {
      question: t('help.q7'),
      answer: t('help.a7')
    },
    {
      question: t('help.q8'),
      answer: t('help.a8')
    }
  ];

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('help.title')}
            </DialogTitle>
            <DialogDescription>
              {t('help.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-600 dark:text-slate-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <h3 className="font-semibold mb-3">Still need help?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.location.href = 'mailto:support@timesync.com'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
                
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

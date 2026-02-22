import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function GuidePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/">
          <span className="inline-flex items-center text-sm text-blue-500 hover:underline">
            <ArrowLeft className="mr-2" /> {t('guide.back')}
          </span>
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-4">{t('guide.title')}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{t('guide.intro')}</p>

      <section className="mb-6">
        <h2 className="text-xl font-medium mb-2">{t('guide.addTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('guide.addDescription')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-medium mb-2">{t('guide.editTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('guide.editDescription')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-medium mb-2">{t('guide.premiumTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-300">{t('guide.premiumDescription')}</p>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-2">{t('guide.tipsTitle')}</h2>
        <ul className="list-disc ml-6 text-gray-600 dark:text-gray-300">
          <li>{t('guide.tip1')}</li>
          <li>{t('guide.tip2')}</li>
          <li>{t('guide.tip3')}</li>
        </ul>
      </section>
    </div>
  );
}

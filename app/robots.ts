import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://your-domain.ir';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // بستن دسترسی موتورهای جستجو به پنل ادمین و APIها
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
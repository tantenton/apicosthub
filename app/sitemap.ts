import { MetadataRoute } from 'next';
import { AI_MODELS, POPULAR_COMPARISONS } from '@/data/models';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://apicosthub.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing-table`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculator/gpu-vs-api`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const modelRoutes: MetadataRoute.Sitemap = AI_MODELS.map((m) => ({
    url: `${baseUrl}/model/${m.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const compareRoutes: MetadataRoute.Sitemap = POPULAR_COMPARISONS.map((c) => ({
    url: `${baseUrl}/compare/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...modelRoutes, ...compareRoutes];
}

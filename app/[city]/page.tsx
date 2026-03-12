import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import CityArticles from '@/components/CityArticles';
import SocialLinks from '@/components/SocialLinks';

export function generateStaticParams() {
  return CITIES.map((city) => ({ city }));
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (!CITIES.includes(city as City)) notFound();

  return (
    <div className="city-page">
      <CityArticles city={city as City} />
      <SocialLinks city={city as City} />
    </div>
  );
}

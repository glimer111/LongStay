import { notFound } from 'next/navigation';
import { CITIES, type City } from '@/lib/constants';
import FormatsPage from '@/components/FormatsPage';

export function generateStaticParams() {
  return CITIES.map((city) => ({ city }));
}

export default function CooperationCityPage({
  params,
}: {
  params: { city: string };
}) {
  const { city } = params;
  if (!CITIES.includes(city as City)) notFound();

  return <FormatsPage city={city as City} />;
}

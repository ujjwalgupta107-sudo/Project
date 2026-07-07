import { Hero } from '../../features/public/Hero';
import { TrustMetrics } from '../../features/public/TrustMetrics';
import { HowKavachWorks } from '../../features/public/HowKavachWorks';
import { PlatformModules } from '../../features/public/PlatformModules';
import { FinalCTA } from '../../features/public/FinalCTA';

export function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Hero />
      <TrustMetrics />
      <HowKavachWorks />
      <PlatformModules />
      <FinalCTA />
    </div>
  );
}

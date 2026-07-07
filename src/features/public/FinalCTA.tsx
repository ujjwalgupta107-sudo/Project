import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 bg-surface-elevated relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-blue/10 via-surface-elevated to-surface-elevated"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          One report can reveal an entire network.
        </h2>
        <p className="text-lg text-text-secondary mb-10">
          Join the ecosystem that protects citizens and empowers investigators to dismantle fraud networks before they scale.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shield">
            <Button size="lg" className="w-full sm:w-auto">
              Analyze Suspicious Activity
            </Button>
          </Link>
          <Link to="/intelligence">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Fraud Intelligence
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

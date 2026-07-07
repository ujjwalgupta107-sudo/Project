import { Code, MessageCircle, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function About() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About KAVACH AI</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Building the next generation of public safety infrastructure to combat organized cyber fraud.
        </p>
      </div>

      <div className="prose prose-invert prose-lg max-w-none mb-16 text-text-secondary">
        <p>
          Cyber fraud has evolved from isolated incidents into highly organized, transnational syndicates. Traditional methods of fighting fraud—relying on post-incident reporting and isolated investigations—are no longer sufficient.
        </p>
        <p>
          <strong>KAVACH AI</strong> was born out of the necessity to shift the paradigm from reactive investigation to proactive disruption. By leveraging advanced Artificial Intelligence, natural language processing, and graph theory, we aim to detect scams in real-time, protect citizens before financial loss occurs, and provide law enforcement with the intelligence needed to dismantle entire fraud networks.
        </p>
        
        <h3 className="text-text-primary text-2xl font-bold mt-12 mb-6">Our Mission</h3>
        <p>
          To empower citizens with real-time AI protection and equip investigators with the predictive intelligence required to secure the digital economy.
        </p>
      </div>

      <div className="flex justify-center gap-6 pb-20">
        <Button variant="secondary" className="flex items-center gap-2">
          <Code className="w-5 h-5" /> GitHub
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Twitter
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <Mail className="w-5 h-5" /> Contact Us
        </Button>
      </div>
    </div>
  );
}

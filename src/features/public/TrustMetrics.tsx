import { motion } from 'framer-motion';

const metrics = [
  { value: '24,000+', label: 'Interactions Analyzed' },
  { value: '1,280+', label: 'Suspicious Entities Identified' },
  { value: '340+', label: 'Potential Fraud Clusters' },
  { value: '< 3 sec', label: 'Average Analysis Response' },
];

export function TrustMetrics() {
  return (
    <section className="py-12 border-y border-surface-raised bg-surface-base">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-surface-raised">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`text-center ${index !== 0 ? 'pl-8' : ''}`}
            >
              <div className="text-3xl md:text-4xl font-bold font-mono text-brand-cyan mb-2">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-text-secondary">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

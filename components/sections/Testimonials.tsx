import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Client Name',
    role: 'Founder',
    company: 'Company Name',
    text: 'Working with Rayida Tech was a game-changer for our brand. The design quality and attention to detail exceeded our expectations.',
  },
  {
    name: 'Client Name',
    role: 'CEO',
    company: 'Company Name',
    text: 'They transformed our digital presence completely. Professional, creative, and results-driven every step of the way.',
  },
  {
    name: 'Client Name',
    role: 'Product Manager',
    company: 'Company Name',
    text: 'The team delivered beyond what we asked for. Our users love the new interface and we have seen a significant improvement in engagement.',
  },
];

export default function Testimonials() {
  return (
    <Section>
      <Container size="default">
        <Reveal>
          <div className="text-center mb-12">
            <Quote className="w-10 h-10 text-secondary/30 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              What Our Clients{' '}
              <span className="gradient-text">Say</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <Reveal key={index} index={index}>
              <GlassCard className="p-6 group relative">
                <p className="text-sm text-mist-1 leading-relaxed mb-6 italic border-l-2 border-(--line-strong) pl-4">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="border-t border-(--line) pt-4">
                  <p className="font-display text-sm font-semibold text-paper group-hover:text-secondary transition-colors duration-300">
                    {item.name}
                  </p>
                  <p className="text-xs text-mist-2">
                    {item.role}, {item.company}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
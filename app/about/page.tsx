// app/about/page.tsx
import { Briefcase, Code, Palette, Users, Award, Rocket } from 'lucide-react';

const skills = [
  { name: 'UI/UX Design', icon: Palette },
  { name: 'Product Design', icon: Briefcase },
  { name: 'Brand Identity', icon: Award },
  { name: 'Graphic Design', icon: Code },
  { name: 'Figma', icon: Palette },
  { name: 'Adobe Illustrator', icon: Code },
  { name: 'Adobe Photoshop', icon: Code },
  { name: 'CorelDRAW', icon: Code },
  { name: 'WordPress', icon: Code },
  { name: 'TypeScript', icon: Code },
  { name: 'React', icon: Code },
  { name: 'Next.js', icon: Code },
  { name: 'Python', icon: Code },
];

const experiences = [
  {
    role: 'Graphics Designer',
    company: 'Armstrong Corp',
    duration: 'Jan 2025 - Present',
    description: 'Creative Direction & Visual Storytelling for marketing campaigns.',
  },
  {
    role: 'Social Media Manager',
    company: 'The Link PR & Marketing Solution',
    duration: 'Nov 2024 - Present',
    description: 'Developed social media strategies and creative graphics.',
  },
  {
    role: 'Product Designer',
    company: 'ProptVerse',
    duration: 'Nov 2024',
    description: 'UI/UX design, wireframing, prototyping, and usability testing.',
  },
  {
    role: 'UI/UX Designer',
    company: 'NEA Group of Global Giants',
    duration: 'Project Base',
    description: 'Led design for user-centered websites and e-commerce platforms.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-teal-400">Me</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Product Designer &amp; AI Engineer building digital experiences people can trust.
          </p>
        </div>

        {/* Bio */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-12">
          <p className="text-gray-300 leading-relaxed mb-4">
            Im <span className="text-teal-400">Raymond Gaius</span>, a creative and detail-oriented
            designer with a passion for visual storytelling, branding, and digital design.
          </p>
          <p className="text-gray-300 leading-relaxed">
            I help businesses and startups grow through innovative design, strategic thinking,
            and technology-driven solutions. From branding and product design to digital
            transformation, I turn bold ideas into meaningful experiences.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Rocket className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="font-semibold mb-1">Mission</h3>
            <p className="text-gray-400 text-sm">Empower startups through design and technology.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="font-semibold mb-1">Vision</h3>
            <p className="text-gray-400 text-sm">Build a global technology ecosystem.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="font-semibold mb-1">Values</h3>
            <p className="text-gray-400 text-sm">Trust, Excellence, Innovation.</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Skills &amp; Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-full text-sm hover:border-teal-500/30 hover:bg-teal-500/5 transition-all"
              >
                <skill.icon className="w-4 h-4 text-teal-400" />
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-teal-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{exp.role}</h3>
                  <span className="text-sm text-gray-500">{exp.duration}</span>
                </div>
                <p className="text-teal-400 text-sm mb-2">{exp.company}</p>
                <p className="text-gray-400 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
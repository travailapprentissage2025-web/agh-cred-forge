import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, Sparkles, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import logo from '@/assets/logo.jpg';

const features = [
  {
    icon: Sparkles,
    title: 'Remote Internships',
    description: 'Join cutting-edge programs from anywhere in the world',
  },
  {
    icon: Award,
    title: 'Digital Badges',
    description: 'Earn verifiable credentials to showcase your skills',
  },
  {
    icon: Shield,
    title: 'Blockchain Verified',
    description: 'Your achievements are permanently secured and verifiable',
  },
  {
    icon: Zap,
    title: 'LinkedIn Ready',
    description: 'Share your badges directly to your professional profile',
  },
];

const steps = [
  {
    number: '01',
    title: 'Enroll',
    description: 'Choose from our curated internship programs',
  },
  {
    number: '02',
    title: 'Learn & Grow',
    description: 'Complete projects with mentorship from experts',
  },
  {
    number: '03',
    title: 'Get Certified',
    description: 'Receive your verified digital badge',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Empowering Remote Internships</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Build Your Future with
            <span className="block gradient-primary bg-clip-text text-transparent">
              Verified Credentials
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Rejoignez la plateforme de stage premium AGH Data Agency Holding. Acquérez une 
            expérience concrète, obtenez des badges vérifiés par blockchain et valorisez vos compétences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg hover:scale-105 transition-smooth"
              onClick={() => navigate('/auth?mode=signup')}
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg hover:scale-105 transition-smooth"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Floating Badge Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="w-64 h-64 mx-auto bg-gradient-card rounded-full flex items-center justify-center floating glow-primary">
            <Award className="h-32 w-32 text-primary" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Pourquoi Choisir AGH?</h2>
          <p className="text-muted-foreground text-lg">
            Tout ce dont vous avez besoin pour une expérience de stage premium
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover-lift gradient-card border-0">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Comment ça Marche?</h2>
          <p className="text-muted-foreground text-lg">
            Votre parcours vers le succès vérifié en trois étapes simples
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-card rounded-3xl p-12 text-center max-w-4xl mx-auto glow-primary"
        >
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Prêt à Commencer?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines de stagiaires qui ont obtenu leurs certifications vérifiées
            et accéléré leur carrière avec AGH Data Agency Holding.
          </p>
          <Button
            size="lg"
            className="text-lg hover:scale-105 transition-smooth"
            onClick={() => navigate('/auth?mode=signup')}
          >
            Join as Intern
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="AGH Logo" className="h-6 w-6 object-contain" />
              <span className="font-semibold">AGH Data Agency Holding</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Agh Data Agency Holding SA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

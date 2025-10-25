import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, Sparkles, Shield, Zap, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import logo from '@/assets/logo.jpg';

const features = [
  {
    icon: Sparkles,
    title: 'Stages à Distance',
    description: 'Rejoignez des programmes innovants depuis partout dans le monde',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Award,
    title: 'Badges Numériques',
    description: 'Obtenez des credentials vérifiables pour valoriser vos compétences',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Vérification Blockchain',
    description: 'Vos réalisations sont sécurisées de manière permanente et vérifiables',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: 'Optimisé LinkedIn',
    description: 'Partagez vos badges directement sur votre profil professionnel',
    gradient: 'from-orange-500 to-red-500',
  },
];

const steps = [
  {
    number: '01',
    title: 'Inscription',
    description: 'Choisissez parmi nos programmes de stage sélectionnés',
    icon: CheckCircle,
  },
  {
    number: '02',
    title: 'Apprentissage',
    description: 'Réalisez des projets avec le mentorat d\'experts',
    icon: Star,
  },
  {
    number: '03',
    title: 'Certification',
    description: 'Recevez votre badge numérique vérifié',
    icon: Award,
  },
];

const stats = [
  { number: '500+', label: 'Stagiaires Actifs' },
  { number: '95%', label: 'Taux de Réussite' },
  { number: '50+', label: 'Entreprises Partenaires' },
  { number: '24h', label: 'Support Réactif' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container relative mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Enhanced Logo & Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border">
                  <img 
                    src={logo} 
                    alt="AGH Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border mb-8"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-slate-700">
                Plateforme de stages certifiés • Rejoignez-nous aujourd'hui
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Construisez Votre Avenir
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                avec AGH Data
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Rejoignez la plateforme de stage premium d'AGH Data Agency Holding. 
              Acquérez une expérience concrète, obtenez des badges vérifiés par blockchain 
              et boostez votre carrière.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <span className="flex items-center gap-2">
                  Commencer Maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl border-2 hover:bg-white hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Se Connecter
              </Button>
            </div>
          </motion.div>

          {/* Enhanced Floating Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-20 relative"
          >
            <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center relative backdrop-blur-sm border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl animate-pulse" />
              <Award className="h-40 w-40 text-blue-600 relative z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Pourquoi Choisir AGH?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une expérience de stage premium conçue pour votre succès professionnel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-8 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 group">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Comment ça Marche?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Votre parcours vers le succès vérifié en trois étapes simples
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-3/4 w-1/2 h-1 bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-slate-300 mb-2">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]" />
            </div>
            
            <div className="relative z-10">
              <Award className="h-20 w-20 mx-auto mb-6 text-white/90" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt à Commencer?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Rejoignez des centaines de stagiaires qui ont obtenu leurs certifications vérifiées
                et accéléré leur carrière avec AGH Data Agency Holding.
              </p>
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-2xl bg-white text-blue-600 hover:bg-slate-100 hover:scale-105 transition-all duration-300 shadow-2xl font-semibold"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <span className="flex items-center gap-2">
                  Rejoindre en Tant que Stagiaire
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="AGH Logo" 
                  className="w-6 h-6 object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg">AGH Data Agency Holding</span>
                <p className="text-sm text-slate-500">Votre partenaire pour l'excellence professionnelle</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 text-center md:text-right">
              © 2025 AGH Data Agency Holding SA. Tous droits réservés.
              <br />
              <span className="text-slate-400">Innovation • Excellence • Confiance</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Brain, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }) => {
  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay
      }
    }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
      variants={cardVariants}
    >
      <div className="bg-green-100 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const featuresData = [
    {
      icon: <Crosshair size={32} className="text-green-600" />,
      title: "Precision Analysis",
      description: "Our model analyzes leaf patterns with high precision to detect subtle signs of disease, ensuring accurate and early diagnosis.",
    },
    {
      icon: <Brain size={32} className="text-green-600" />,
      title: "Deep Learning Core",
      description: "Powered by a state-of-the-art convolutional neural network (CNN), the system recognizes a wide array of plant diseases.",
    },
    {
      icon: <ShieldCheck size={32} className="text-green-600" />,
      title: "Actionable Treatments",
      description: "Receive instant, research-backed treatment recommendations to protect your crops and maximize yield.",
    },
  ];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

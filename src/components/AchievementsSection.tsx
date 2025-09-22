import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, BookOpen } from 'lucide-react';
import { GridMotion } from './ui/grid-motion';

const AchievementsSection = () => {
  const achievements = [
    {
      icon: <Trophy className="h-8 w-8 text-portfolio-cyan" />,
      title: "Hackathon Winner",
      description: "1st Place - University Innovation Challenge",
      year: "2023"
    },
    {
      icon: <Users className="h-8 w-8 text-portfolio-cyan" />,
      title: "Teaching Assistant", 
      description: "Computer Science Department - Data Structures & Algorithms",
      year: "2022-2023"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-portfolio-cyan" />,
      title: "Office Analyst",
      description: "Academic Office - Student Records & Database Management", 
      year: "2021-2022"
    }
  ];

  const gridItems = [
    "🏆 Winner",
    "🎯 Innovation", 
    "💡 Problem Solving",
    "👥 Leadership",
    "📚 Teaching",
    "🔬 Research",
    "💻 Development",
    "🏆 1st Place",
    "🎓 Academic Excellence",
    "📊 Data Analysis",
    "🚀 Project Lead",
    "⭐ Recognition",
    "🎯 Goal Oriented",
    "💪 Mentorship",
    "🔍 Detail Focused",
    "🌟 Achievement",
    "📈 Growth",
    "🎊 Success",
    "🏅 Award Winner",
    "💎 Excellence",
    "🎪 Innovation Hub",
    "🚀 Future Ready",
    "⚡ High Impact",
    "🎯 Target Achieved",
    "🌊 Flow State",
    "🎨 Creative Solutions",
    "🔥 Performance",
    "✨ Outstanding"
  ];

  return (
    <section id="achievements" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-portfolio-gray">
      {/* Background Grid Motion */}
      <div className="absolute inset-0 opacity-30">
        <GridMotion 
          items={gridItems}
          gradientColor="rgba(34, 211, 238, 0.1)"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-portfolio-text mb-4">
            Achievements
          </h2>
          <p className="text-lg md:text-xl text-portfolio-text-muted max-w-2xl mx-auto">
            Recognition for leadership, innovation, and academic excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-portfolio-gray-lighter/50 backdrop-blur-sm border border-portfolio-cyan/20 rounded-xl p-8 hover:border-portfolio-cyan/40 transition-all duration-300 hover:transform hover:-translate-y-2">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-portfolio-cyan/10 group-hover:bg-portfolio-cyan/20 transition-colors duration-300">
                    {achievement.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-portfolio-text">
                      {achievement.title}
                    </h3>
                    <p className="text-portfolio-text-muted text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                    <div className="inline-block px-3 py-1 bg-portfolio-cyan/20 text-portfolio-cyan text-xs font-medium rounded-full">
                      {achievement.year}
                    </div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-portfolio-cyan/0 via-portfolio-cyan/5 to-portfolio-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
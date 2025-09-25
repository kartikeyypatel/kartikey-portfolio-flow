import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, BookOpen } from 'lucide-react';
import { GridMotion } from './ui/grid-motion';

const AchievementsSection = () => {
  const achievements = [
    {
      icon: <Trophy className="h-8 w-8 text-portfolio-cyan" />,
      title: "Hackathon Winner",
      description: "Okada Leasing Agent AI - Intelligent leasing agent with FastAPI backend and RAG system for property listings",
      year: "2024",
      image: "/lovable-uploads/hackathon-winner.jpg",
      link: "https://github.com/kartikeyypatel/okada-leasing-agent"
    },
    {
      icon: <Trophy className="h-8 w-8 text-portfolio-cyan" />,
      title: "Innovation Award",
      description: "Parshwa Builders - Recognized for innovative real estate platform solutions",
      year: "2021"
    },
    {
      icon: <Users className="h-8 w-8 text-portfolio-cyan" />,
      title: "Star Performer Award", 
      description: "TCS - Outstanding performance in software development and automation",
      year: "2022"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-portfolio-cyan" />,
      title: "Best Project Award",
      description: "University of Mumbai - Excellence in Computer Science capstone project", 
      year: "2020"
    },
    {
      icon: <Users className="h-8 w-8 text-portfolio-cyan" />,
      title: "Graduate Teaching Assistant",
      description: "NJIT - Computer Science Department for Data Structures & Algorithms", 
      year: "2023-2024"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-portfolio-cyan" />,
      title: "Office Analyst",
      description: "NJIT - Academic Office for Student Records & Database Management", 
      year: "2022-2023"
    },
    {
      icon: <Trophy className="h-8 w-8 text-portfolio-cyan" />,
      title: "McKinsey Forward Program",
      description: "Completed advanced business strategy and leadership program", 
      year: "2024",
      link: "https://www.credly.com/badges/016261aa-5785-4736-9e36-c409a1180ff8/public_url"
    }
  ];

  const gridItems = [
    "🏆 Innovation Excellence",
    "⭐ Star Performer", 
    "🎯 Best Project Award",
    "👨‍🏫 Teaching Excellence",
    "📊 McKinsey Forward",
    "🔬 Academic Achievement",
    "🏅 Leadership Award",
    "💡 Creative Problem Solving",
    "🎓 Graduate Assistant",
    "📈 Performance Excellence",
    "🚀 Innovation Leader",
    "⚡ Outstanding Results",
    "🌟 Recognition",
    "💎 Excellence in Action",
    "🎪 Strategic Thinking",
    "🔥 High Performance",
    "✨ Distinguished Service",
    "🎯 Goal Achievement",
    "🌊 Continuous Growth",
    "🎨 Creative Solutions",
    "💪 Leadership Impact",
    "🔍 Analytical Skills",
    "🎊 Success Stories",
    "🏆 Award Winner",
    "📚 Knowledge Sharing",
    "🚀 Future Ready",
    "⭐ Excellence Recognized",
    "💫 Outstanding Achievement"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-portfolio-gray-lighter/50 backdrop-blur-sm border border-portfolio-cyan/20 rounded-xl p-8 hover:border-portfolio-cyan/40 transition-all duration-300 hover:transform hover:-translate-y-2 h-full flex flex-col">
                {achievement.image && (
                  <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                  <div className="p-4 rounded-full bg-portfolio-cyan/10 group-hover:bg-portfolio-cyan/20 transition-colors duration-300">
                    {achievement.icon}
                  </div>
                  
                  <div className="space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-portfolio-text mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-portfolio-text-muted text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <div className="inline-block px-3 py-1 bg-portfolio-cyan/20 text-portfolio-cyan text-xs font-medium rounded-full">
                        {achievement.year}
                      </div>
                      {achievement.link && (
                        <a 
                          href={achievement.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-portfolio-cyan hover:text-portfolio-cyan/80 text-xs underline transition-colors duration-200"
                        >
                          {achievement.link.includes('github') ? 'View Project' : 'View Credential'}
                        </a>
                      )}
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
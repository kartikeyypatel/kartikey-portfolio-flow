
'use client';

import React from 'react';
import { Timeline } from '@/components/ui/timeline';

const EducationSection = () => {
  const data = [
    {
      title: '2023 - 2025',
      content: (
        <div className="bg-portfolio-gray/20 p-6 rounded-lg border border-portfolio-gray-lighter">
          <h3 className="text-xl md:text-2xl font-bold text-portfolio-text mb-2">
            New Jersey Institute of Technology
          </h3>
          <p className="text-portfolio-text text-lg mb-1">
            Masters in Computer Science (GPA: 3.85/4.0)
          </p>
          <p className="text-portfolio-text-muted">Newark, NJ</p>
        </div>
      ),
    },
    {
      title: '2016 - 2020',
      content: (
        <div className="bg-portfolio-gray/20 p-6 rounded-lg border border-portfolio-gray-lighter">
          <h3 className="text-xl md:text-2xl font-bold text-portfolio-text mb-2">
            University of Mumbai
          </h3>
          <p className="text-portfolio-text text-lg mb-1">
            Bachelors in Computer Science (GPA: 3.8/4.0)
          </p>
          <p className="text-portfolio-text-muted">Mumbai, India</p>
        </div>
      ),
    },
  ];

  return (
    <section id="education" className="section-padding bg-portfolio-black">
      <Timeline data={data} />
    </section>
  );
};

export default EducationSection;

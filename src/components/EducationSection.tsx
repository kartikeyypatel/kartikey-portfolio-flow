
'use client';

import React from 'react';
import { Timeline } from '@/components/ui/timeline';

const EducationSection = () => {
  const data = [
    {
      title: '2023 - 2025',
      content: (
        <div className="bg-portfolio-gray/20 p-6 rounded-lg border border-portfolio-gray-lighter">
          <img
            src="/lovable-uploads/2497ec71-a338-4440-8c70-d9e85d5df394.png"
            alt="New Jersey Institute of Technology"
            className="rounded-lg mb-4 object-cover w-full h-48"
          />
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
          <img
            src="/lovable-uploads/d22d6c8b-e05e-4741-82ac-223f409656f8.png"
            alt="University of Mumbai"
            className="rounded-lg mb-4 object-cover w-full h-48"
          />
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

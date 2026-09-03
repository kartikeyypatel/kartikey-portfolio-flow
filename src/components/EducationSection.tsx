
'use client';

import React from 'react';
import { Timeline } from '@/components/ui/timeline';

const EducationSection = () => {
  const data = [
    {
      title: '2023 - 2025',
      content: (
        <div className="w-full max-w-[680px] rounded-xl border border-portfolio-gray-lighter bg-portfolio-gray/20 p-4 sm:p-5">
          <div className="mb-5 aspect-[3/2] overflow-hidden rounded-lg bg-portfolio-gray">
            <img
              src="/uploads/2497ec71-a338-4440-8c70-d9e85d5df394.png"
              alt="New Jersey Institute of Technology campus"
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-portfolio-text md:text-2xl">
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
        <div className="w-full max-w-[680px] rounded-xl border border-portfolio-gray-lighter bg-portfolio-gray/20 p-4 sm:p-5">
          <div className="mb-5 aspect-[3/2] overflow-hidden rounded-lg bg-portfolio-gray">
            <img
              src="/uploads/d22d6c8b-e05e-4741-82ac-223f409656f8.png"
              alt="University of Mumbai campus"
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mb-2 text-xl font-bold text-portfolio-text md:text-2xl">
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
    <section id="education" className="section-padding">
      <Timeline data={data} />
    </section>
  );
};

export default EducationSection;

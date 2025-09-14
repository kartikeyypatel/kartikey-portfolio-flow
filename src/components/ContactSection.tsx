'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { ArrowRight, Linkedin, Github, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import locales from '../locales/en.json';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useStarryBackground } from '@/hooks/useStarryBackground';
import { StarryCanvas } from './ui/StarryCanvas';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backgroundImage } = useStarryBackground();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem sending your message. Please try again later.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.section
      id="contact"
      style={{ backgroundImage }}
      className="section-padding bg-black relative overflow-hidden"
      ref={ref}
    >
      <StarryCanvas />
      <div className="container-custom relative z-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-portfolio-cyan font-mono text-lg mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locales.contact.subtitle}
          </motion.p>

          <motion.h2
            className="text-5xl md:text-6xl font-bold text-portfolio-text mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {locales.contact.title}
          </motion.h2>

          <motion.p
            className="text-xl text-portfolio-text-muted leading-relaxed mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {locales.contact.description}
          </motion.p>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="pointer-events-auto text-left">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-portfolio-text-muted">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="bg-black/30 border-slate-700 backdrop-blur-sm focus:ring-portfolio-cyan focus:border-portfolio-cyan text-portfolio-text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-portfolio-text-muted">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Email"
                              type="email"
                              {...field}
                              className="bg-black/30 border-slate-700 backdrop-blur-sm focus:ring-portfolio-cyan focus:border-portfolio-cyan text-portfolio-text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-portfolio-text-muted">Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is this about?"
                            {...field}
                            className="bg-black/30 border-slate-700 backdrop-blur-sm focus:ring-portfolio-cyan focus:border-portfolio-cyan text-portfolio-text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-portfolio-text-muted">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message..."
                            {...field}
                            className="bg-black/30 border-slate-700 backdrop-blur-sm min-h-[120px] focus:ring-portfolio-cyan focus:border-portfolio-cyan text-portfolio-text"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-center pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-3 bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center gap-x-8 gap-y-4 pt-8 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-3 text-portfolio-text-muted">
                <Phone className="h-5 w-5 text-portfolio-cyan" />
                <span>{locales.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-portfolio-text-muted">
                <MapPin className="h-5 w-5 text-portfolio-cyan" />
                <span>{locales.contact.location}</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.a
                href="https://www.linkedin.com/in/patel-kartikey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.linkedin}</span>
                <Linkedin className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://github.com/kartikeyypatel?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.github}</span>
                <Github className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://x.com/senseikartikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.twitter}</span>
                <Twitter className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://www.facebook.com/senseikartikey/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.facebook}</span>
                <Facebook className="h-6 w-6" />
              </motion.a>
              
              <motion.a
                href="mailto:kartikey.patel1398@gmail.com"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-20 pt-8 border-t border-portfolio-gray-lighter"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-portfolio-text-muted leading-relaxed">
            {locales.contact.footerLine1} <br />
            {locales.contact.footerLine2}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;

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
        description: "The form could not send your message. Please email me directly at kartikey.patel1398@gmail.com.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.section
      id="contact"
      className="section-padding relative overflow-hidden"
      ref={ref}
    >
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
            <div className="pointer-events-auto rounded-2xl border border-portfolio-gray-lighter bg-portfolio-gray/70 p-5 text-left shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
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
                    <p className="mt-4 text-xs text-portfolio-text-muted">
                      Prefer email?{' '}
                      <a className="text-portfolio-cyan underline underline-offset-4 hover:text-white" href="mailto:kartikey.patel1398@gmail.com">
                        kartikey.patel1398@gmail.com
                      </a>
                    </p>
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
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg text-portfolio-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-portfolio-cyan"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.linkedin}</span>
                <Linkedin className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://github.com/kartikeyypatel?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg text-portfolio-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-portfolio-cyan"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.github}</span>
                <Github className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://x.com/senseikartikey"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg text-portfolio-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-portfolio-cyan"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.twitter}</span>
                <Twitter className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://www.facebook.com/senseikartikey/"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg text-portfolio-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-portfolio-cyan"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.facebook}</span>
                <Facebook className="h-6 w-6" />
              </motion.a>
              
              <motion.a
                href="mailto:kartikey.patel1398@gmail.com"
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg text-portfolio-text-muted transition-colors duration-200 hover:bg-white/5 hover:text-portfolio-cyan"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="mt-20 border-t border-white/[0.1] pt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="grid gap-8 text-left sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <a href="#home" className="font-['Fraunces'] text-2xl font-semibold text-portfolio-text hover:text-portfolio-cyan">
                Kartikey Patel<span className="italic text-portfolio-cyan">.</span>
              </a>
              <p className="mt-2 max-w-md text-sm leading-6 text-portfolio-text-muted">
                Full-stack software engineer building reliable cloud products, data platforms, and AI-enabled experiences.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-portfolio-text-muted sm:justify-end">
                <li><a className="hover:text-portfolio-cyan" href="mailto:kartikey.patel1398@gmail.com">Email</a></li>
                <li><a className="hover:text-portfolio-cyan" href="https://www.linkedin.com/in/patel-kartikey/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                <li><a className="hover:text-portfolio-cyan" href="https://github.com/senseikartikey" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a className="hover:text-portfolio-cyan" href="/Kartikey-Patel-Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a></li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.07] py-5 font-mono text-[10px] uppercase tracking-[0.08em] text-portfolio-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Designed &amp; built by Kartikey Patel</span>
            <span>© {new Date().getFullYear()} · React, TypeScript &amp; Tailwind CSS</span>
          </div>
        </motion.footer>
      </div>
    </motion.section>
  );
};

export default ContactSection;

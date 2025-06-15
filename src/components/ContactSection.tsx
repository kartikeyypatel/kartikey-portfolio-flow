'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Linkedin, Github, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import locales from '../locales/en.json';
import { Boxes } from './ui/background-boxes';
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <section id="contact" className="section-padding bg-portfolio-black relative overflow-hidden" ref={ref}>
      <Boxes />
      <div className="absolute inset-0 w-full h-full bg-portfolio-black z-10 [mask-image:radial-gradient(transparent_30%,white)] pointer-events-none" />
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
                      className="inline-flex items-center space-x-3 bg-transparent border-2 border-portfolio-cyan text-portfolio-cyan hover:bg-portfolio-cyan hover:text-portfolio-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Send Message</span>
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
                href="https://linkedin.com/in/kartikey-patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.linkedin}</span>
                <Linkedin className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://github.com/kartikey-patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.github}</span>
                <Github className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://twitter.com/kartikey_patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.twitter}</span>
                <Twitter className="h-6 w-6" />
              </motion.a>

              <motion.a
                href="https://facebook.com/kartikey.patel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portfolio-text-muted hover:text-portfolio-cyan transition-colors duration-200 pointer-events-auto"
                whileHover={{ y: -2 }}
              >
                <span className="sr-only">{locales.contact.social.facebook}</span>
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="mailto:contact@kartikeypatel.dev"
                target="_blank"
                rel="noopener noreferrer"
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
    </section>
  );
};

export default ContactSection;

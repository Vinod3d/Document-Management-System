"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full py-8 flex items-center justify-center px-6 md:px-12 bg-secondary">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Text Content */}
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
            Secure & Efficient <br /> Document Management
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Store, organize, and retrieve your documents effortlessly using AI-powered search.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button size="lg" className="bg-primary text-white">
              Upload Documents
            </Button>
            <Button size="lg" variant="outline">
              Search Documents
            </Button>
          </div>
        </motion.div>

        {/* Right Side - Image / Illustration */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Document Management Illustration"
            width={600}
            height={400}
            className="w-full max-w-md md:max-w-lg h-auto rounded-xl shadow-lg"
          />
        </motion.div>
        
      </div>
    </section>
  );
}

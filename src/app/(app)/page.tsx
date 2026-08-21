"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
const Home = () => {
  return (
    <>
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-4 py-4 px-6">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold">
            Dive into the mystery world of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base">
            Explore Mystery Message - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="backdrop-blur-md bg-white/60 border border-white/30 shadow-xl rounded-2xl">
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <span className="text-lg font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-white/50 shadow-md" />
          <CarouselNext className="rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-white/50 shadow-md" />
        </Carousel>
      </main>
      <footer className="w-full text-center py-4 bg-transparent text-gray-700 text-sm mt-auto">
        © 2026 Mystery Message. All rights reserved.
      </footer>
    </>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { banners } from "@/constant/data";
import { useCarousel } from "@/hooks/useCarousel";

const Timer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1 font-mono font-bold text-white">
      {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(
        (value, index) => (
          <div key={index} className="flex items-center">
            <Button
              variant="accent"
              size="lg"
              className={`bg-white/20 hover:bg-white/30 text-white rounded text-3xl ${
                index === 2 ? "animate-pulse" : ""
              }`}
            >
              {String(value).padStart(2, "0")}
            </Button>
            {index < 2 && <span className="px-0.5">:</span>}
          </div>
        )
      )}
    </div>
  );
};

const Banner = () => {
  const navigate = useNavigate();
  const { api, setApi, current, plugin, carouselOptions } = useCarousel({
    delay: 5000, // 5 seconds
    stopOnInteraction: false,
  });

  return (
    <Carousel
      className="relative"
      setApi={setApi}
      plugins={[plugin.current]}
      opts={carouselOptions}
    >
      <CarouselContent>
        {banners.map((banner, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[600px] w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center px-5 md:px-10">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {banner.badge && (
                    <Badge className={`mb-5 ${banner.badge.className}`}>
                      {banner.badge.text}
                    </Badge>
                  )}

                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
                    {banner.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg text-gray-200 mb-8 font-['Inter']">
                    {banner.description}
                  </p>

                  {/* Timer if exists */}
                  {banner.timer && (
                    <div className="mb-8">
                      <p className="text-gray-300 mb-2">{banner.timer.label}</p>
                      <Timer endDate={banner.timer.endDate} />
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-5">
                    {banner.primaryLink.href === "/how-it-works" ? (
                      <Button
                        size="lg"
                        variant="accent"
                        onClick={() => {
                          navigate("/");
                          // Wait for navigation to complete, then scroll to section
                          setTimeout(() => {
                            const element =
                              document.getElementById("how-it-works");
                            if (element) {
                              element.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 100);
                        }}
                      >
                        {banner.primaryLink.text}
                      </Button>
                    ) : (
                      <Button size="lg" variant="accent">
                        <Link to={banner.primaryLink.href}>
                          {banner.primaryLink.text}
                        </Link>
                      </Button>
                    )}

                    {banner.showVideoButton && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" variant="secondary">
                            <Play className="h-5 w-5" />
                            Watch Video
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none">
                          <iframe
                            src={banner.videoUrl}
                            width="100%"
                            height="450"
                            allow="autoplay"
                            className="rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dot Navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === current
                ? "w-5 bg-accent"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default Banner;

// Animated banner commented out for now

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Play } from "lucide-react";
// import { motion } from "motion/react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from "@/components/ui/carousel";
// import { Badge } from "@/components/ui/badge";
// import { banners } from "@/constant/data";
// import { useCarousel } from "@/hooks/useCarousel";
// import {
//   fadeIn,
//   slideDown,
//   slideUp,
//   slideLeft,
//   slideRight
// } from "@/hooks/animationConfig";

// const Timer = ({ endDate, animate }) => {
//   const [timeLeft, setTimeLeft] = useState(null);

//   useEffect(() => {
//     const updateTimer = () => {
//       const now = new Date();
//       const end = new Date(endDate);
//       const diff = end.getTime() - now.getTime();

//       if (diff <= 0) {
//         setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//       setTimeLeft({ hours, minutes, seconds });
//     };

//     updateTimer();
//     const timer = setInterval(updateTimer, 1000);
//     return () => clearInterval(timer);
//   }, [endDate]);

//   if (!timeLeft) return null;

//   return (
//     <motion.div
//       {...animate}
//       className="flex items-center gap-1 font-mono font-bold text-white"
//     >
//       {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(
//         (value, index) => (
//           <div key={index} className="flex items-center">
//             <Button
//               variant="accent"
//               size="lg"
//               className={`bg-white/20 hover:bg-white/30 text-white rounded text-3xl ${
//                 index === 2 ? "animate-pulse" : ""
//               }`}
//             >
//               {String(value).padStart(2, "0")}
//             </Button>
//             {index < 2 && <span className="px-0.5">:</span>}
//           </div>
//         )
//       )}
//     </motion.div>
//   );
// };

// const Banner = () => {
//   const { api, setApi, current, plugin, carouselOptions } = useCarousel({
//     delay: 8000, // 8 seconds
//     stopOnInteraction: false,
//   });

//   // Animation key to force re-animation when current slide changes
//   const [animationKey, setAnimationKey] = useState(0);

//   // Update animation key when current slide changes
//   useEffect(() => {
//     setAnimationKey(prev => prev + 1);
//   }, [current]);

//   // Define animation delays
//   const badgeAnimation = {...slideDown, transition: { duration: 0.7, delay: 0.2 }};
//   const titleAnimation = {...slideUp, transition: { duration: 0.8, delay: 0.4 }};
//   const descriptionAnimation = {...slideUp, transition: { duration: 0.8, delay: 0.6 }};
//   const timerAnimation = {...fadeIn, transition: { duration: 1, delay: 0.8 }};
//   const buttonAnimation = {...slideUp, transition: { duration: 0.8, delay: 1.0 }};

//   return (
//     <Carousel
//       className="relative"
//       setApi={setApi}
//       plugins={[plugin.current]}
//       opts={carouselOptions}
//     >
//       <CarouselContent>
//         {banners.map((banner, index) => (
//           <CarouselItem key={index}>
//             <div className="relative h-[600px] w-full">
//               {/* Background Image */}
//               <div className="absolute inset-0">
//                 <img
//                   src={banner.image}
//                   alt={banner.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
//               </div>

//               {/* Content */}
//               <div className="relative h-full flex items-center px-5 md:px-10">
//                 <div className="max-w-2xl">
//                   {/* Badge */}
//                   {banner.badge && (
//                     <motion.div
//                       key={`badge-${animationKey}-${index}`}
//                       {...badgeAnimation}
//                       // Only animate when this is the current slide
//                       initial={current === index ? badgeAnimation.initial : false}
//                     >
//                       <Badge className={`mb-5 ${banner.badge.className}`}>
//                         {banner.badge.text}
//                       </Badge>
//                     </motion.div>
//                   )}

//                   {/* Title */}
//                   <motion.h1
//                     key={`title-${animationKey}-${index}`}
//                     {...titleAnimation}
//                     initial={current === index ? titleAnimation.initial : false}
//                     className="text-5xl md:text-7xl font-bold text-white mb-5"
//                   >
//                     {banner.title}
//                   </motion.h1>

//                   {/* Description */}
//                   <motion.p
//                     key={`desc-${animationKey}-${index}`}
//                     {...descriptionAnimation}
//                     initial={current === index ? descriptionAnimation.initial : false}
//                     className="text-lg text-gray-200 mb-8 font-['Inter']"
//                   >
//                     {banner.description}
//                   </motion.p>

//                   {/* Timer if exists */}
//                   {banner.timer && (
//                     <div className="mb-8">
//                       <motion.p
//                         key={`timer-label-${animationKey}-${index}`}
//                         {...timerAnimation}
//                         initial={current === index ? timerAnimation.initial : false}
//                         className="text-gray-300 mb-2"
//                       >
//                         {banner.timer.label}
//                       </motion.p>
//                       <Timer
//                         endDate={banner.timer.endDate}
//                         animate={{
//                           ...timerAnimation,
//                           initial: current === index ? timerAnimation.initial : false,
//                           key: `timer-${animationKey}-${index}`
//                         }}
//                       />
//                     </div>
//                   )}

//                   {/* Buttons */}
//                   <motion.div
//                     key={`buttons-${animationKey}-${index}`}
//                     {...buttonAnimation}
//                     initial={current === index ? buttonAnimation.initial : false}
//                     className="flex flex-wrap gap-5"
//                   >
//                     <Button size="lg" variant="accent">
//                       <Link to={banner.primaryLink.href}>
//                         {banner.primaryLink.text}
//                       </Link>
//                     </Button>

//                     {banner.showVideoButton && (
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button size="lg" variant="secondary">
//                             <Play className="h-5 w-5 mr-2" />
//                             Watch Video
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none">
//                           <iframe
//                             src={banner.videoUrl}
//                             width="100%"
//                             height="450"
//                             allow="autoplay"
//                             className="rounded-lg"
//                           />
//                         </DialogContent>
//                       </Dialog>
//                     )}
//                   </motion.div>
//                 </div>
//               </div>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>

//       {/* Dot Navigation */}
//       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
//         {banners.map((_, index) => (
//           <button
//             key={index}
//             className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
//               index === current
//                 ? "w-5 bg-accent"
//                 : "w-2 bg-white/50 hover:bg-white/75"
//             }`}
//             onClick={() => api?.scrollTo(index)}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </Carousel>
//   );
// };

// export default Banner;

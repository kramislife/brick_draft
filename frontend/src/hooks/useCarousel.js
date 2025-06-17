import { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export const useCarousel = (options = {}) => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);

  const defaultOptions = {
    delay: 5000,
    stopOnInteraction: false,
    ...options,
  };

  // Initialize autoplay plugin
  const plugin = useRef(Autoplay(defaultOptions));

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return {
    api,
    setApi,
    current,
    plugin,
    carouselOptions: {
      align: "start",
      loop: true,
    },
  };
};
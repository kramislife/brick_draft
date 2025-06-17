export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

export const slideUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export const slideDown = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export const slideLeft = {
  initial: { x: -50, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export const slideRight = {
  initial: { x: 50, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 1 },
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.1 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
};

export const hoverRotate = {
  whileHover: { rotate: 360 },
  transition: { duration: 0.6 },
};

// Helper function to create staggered animations
export const staggered = (animation, index, baseDelay = 0.1) => {
  return {
    ...animation,
    transition: {
      ...animation.transition,
      delay: baseDelay + index * 0.1,
    },
  };
};

// Specialized animations for specific sections
export const heroCircleAnimations = [
  { ...scaleIn },
  { ...scaleIn, transition: { duration: 1, delay: 0.2 } },
  { ...scaleIn, transition: { duration: 1, delay: 0.4 } },
];

// Common animation for section headers
export const sectionHeaderAnimation = {
  initial: { y: 20, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Card animations for grids
export const cardGridAnimation = (index, columns = 3) => ({
  initial: { y: 50, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: index * (0.2 / columns) },
});

// Feature card animations
export const featureAnimation = (index) => ({
  initial: { x: -50, opacity: 0 },
  whileInView: { x: 0, opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: index * 0.1 },
});

export const sectionFadeIn = (index) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: index * 0.05 },
});

export const listItemFadeIn = (index) => ({
  initial: { opacity: 0, x: -10 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.3, delay: index * 0.1 },
});

// ----------------------------------------- Bundled Animations ------------------------------------------

// About page animations
export const aboutAnimations = {
  page: fadeIn,
  hero: {
    titleAnimation: slideUp,
    descriptionAnimation: {
      ...slideUp,
      transition: { duration: 0.8, delay: 0.2 },
    },
    circleAnimations: heroCircleAnimations,
  },
  story: {
    imageAnimation: slideLeft,
    contentAnimation: slideRight,
    paragraphAnimation: (index) => staggered(slideUp, index, 0.2),
  },
  works: {
    headerAnimation: sectionHeaderAnimation,
    stepAnimation: (index) => cardGridAnimation(index, 3),
    tipsHeaderAnimation: sectionHeaderAnimation,
    tipAnimation: (index) => cardGridAnimation(index, 4),
    numberAnimation: hoverScale,
  },
  choose: {
    headerAnimation: sectionHeaderAnimation,
    featureAnimation: featureAnimation,
    iconAnimation: hoverRotate,
  },
};

// Contact page animations
export const contactAnimations = {
  page: fadeIn,
  hero: {
    titleAnimation: slideUp,
    descriptionAnimation: {
      ...slideUp,
      transition: { duration: 0.8, delay: 0.2 },
    },
    circleAnimations: heroCircleAnimations,
  },
  form: slideLeft,
  sidebar: slideRight,
};

// Legal page animations
export const legalPageAnimations = {
  container: fadeIn,
  header: slideUp,
  section: sectionFadeIn,
  listItem: listItemFadeIn,
};

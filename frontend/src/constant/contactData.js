// Hero section data
export const contactHeroData = {
  title: "Get in Touch with ",
  titleAccent: "Moc Supply",
  description:
    "Have questions or suggestions? Contact Brick Draft through our form.",
};

// FAQ section data
export const faqData = {
  title: "Frequently Asked Questions",
  items: [
    {
      question: "Where are you located?",
      answer: "We're located in Lehi, Utah, 84043",
    },
    {
      question: "Do you have a physical store?",
      answer:
        "We currently don't have a physical store yet. All transactions were fulfilled online.",
    },
    {
      question: "Where did you source your LEGO® products?",
      answer: "We only source from official and authorized LEGO® stores.",
    },
    {
      question: "Are your LEGO® products new and authentic?",
      answer:
        "Our products are guaranteed to be 100% LEGO®. You can check the reviews in our online shops for legitimacy.",
    },
    {
      question: "Is MOC Supply officially affiliated with LEGO?",
      answer:
        "No, MOC Supply is an independent platform. We are not endorsed or sponsored by The LEGO Group.",
    },
    {
      question: "How long does shipping take for the items I selected?",
      answer:
        "Shipping occurs within 1-3 business days after the draw concludes. Delivery times vary by location, typically ranging from 3-7 days within the U.S.",
    },
  ],
};

// Form fields data
export const formFieldsData = {
  fields: [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter your name",
      required: true,
      gridSpan: "md:col-span-1",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
      gridSpan: "md:col-span-1",
    },
    {
      id: "subject",
      label: "Subject",
      type: "text",
      placeholder: "What is this regarding?",
      required: false,
      gridSpan: "md:col-span-2",
    },
  ],
  messageField: {
    id: "message",
    label: "Message",
    placeholder: "Enter your message",
    required: true,
  },
  title: "Send us a message",
  subtitle:
    "Fill out the form below and we'll get back to you as soon as possible",
};

// Social section data
export const socialsData = {
  title: "Let's be connected!",
  subtitle: "Alternatively, you can reach us through",
};

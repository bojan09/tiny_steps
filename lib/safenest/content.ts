import type { RoomId, TopicId } from "./model";
// Planning prompts only. These are not verified safe/unsafe demonstrations.
export type NestTopic = {
  id: TopicId;
  title: string;
  prompt: string;
  question: string;
};
export type NestRoom = {
  id: RoomId;
  title: string;
  subtitle: string;
  topics: NestTopic[];
};
export const rooms: NestRoom[] = [
  {
    id: "nursery",
    title: "Nursery & bedroom",
    subtitle: "Make space for careful questions about sleep and furniture.",
    topics: [
      {
        id: "sleep-space",
        title: "Sleep-space guidance",
        prompt:
          "Read current sleep-space guidance from your local health service. Keep questions for your healthcare team.",
        question: "Which sleep-space questions would you like to discuss?",
      },
      {
        id: "furniture",
        title: "Furniture instructions",
        prompt:
          "Find the manufacturer’s instructions for the furniture you use. Note any instructions you need help understanding.",
        question: "Where can you find the current instructions for each item?",
      },
      {
        id: "nursery-sharing",
        title: "A shared conversation",
        prompt:
          "Make time to discuss the guidance with other caregivers so everyone knows where to find it.",
        question: "Who else needs access to the same guidance?",
      },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen",
    subtitle: "Plan a thoughtful review of the room’s everyday routines.",
    topics: [
      {
        id: "kitchen-storage",
        title: "Storage questions",
        prompt:
          "Use current home-safety guidance to make a list of storage questions for your household.",
        question: "Which cupboards or products do you want to ask about?",
      },
      {
        id: "kitchen-heat",
        title: "Heat and appliances",
        prompt:
          "Find the safety instructions for appliances you use, and review relevant guidance with the people who share this room.",
        question: "Which appliance instructions need another look?",
      },
      {
        id: "kitchen-sharing",
        title: "Sharing the plan",
        prompt:
          "Choose a time to discuss kitchen safety guidance together. Mark follow-up when a question remains.",
        question: "Who can help you follow up on an unanswered question?",
      },
    ],
  },
  {
    id: "bathroom",
    title: "Bathroom",
    subtitle: "Find the guidance you need before planning routines.",
    topics: [
      {
        id: "bath-water",
        title: "Water-safety guidance",
        prompt:
          "Read current baby water-safety guidance from your health service. Ask a qualified professional about anything unclear.",
        question:
          "What would you like to clarify about water-related routines?",
      },
      {
        id: "bath-storage",
        title: "Products and instructions",
        prompt:
          "Locate current product labels and home-safety guidance for the items kept in this room.",
        question: "Which labels or instructions should your household review?",
      },
      {
        id: "bath-sharing",
        title: "Caregiver conversations",
        prompt:
          "Discuss the guidance with everyone involved in care. This reading checklist does not replace supervision or a home assessment.",
        question: "Which routine needs a shared conversation?",
      },
    ],
  },
  {
    id: "living",
    title: "Living room & entryway",
    subtitle: "Bring everyday spaces into the learning conversation.",
    topics: [
      {
        id: "living-furniture",
        title: "Furniture review",
        prompt:
          "Find the manufacturer’s setup and safety instructions for furniture in your shared spaces.",
        question: "Which items need their instructions located or clarified?",
      },
      {
        id: "living-cords",
        title: "Home-safety reading",
        prompt:
          "Use current authoritative home-safety guidance to identify questions about your room’s layout and household items.",
        question: "What would you like a qualified adviser to help you review?",
      },
      {
        id: "living-entry",
        title: "Outings and transitions",
        prompt:
          "Locate the instructions and local safety guidance relevant to the equipment you use when leaving home.",
        question: "Which guidance should everyone who helps with outings know?",
      },
    ],
  },
];
export const safetyReference = {
  title: "NHS: Baby and toddler safety (UK)",
  url: "https://www.nhs.uk/baby/safety-and-accidents/baby-and-toddler-safety/",
};

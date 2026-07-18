export interface CourseDetail {
  id: number;
  type: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  category: "freshers" | "repeaters" | "test-series";
  link: string;
}

export const coursesData: CourseDetail[] = [
  {
    id: 1,
    type: "Classroom Course",
    badge: "Starts: 9 July",
    title: "NEET Fresher",
    description: "Offline classroom program for Class 11th students preparing for NEET 2027.",
    highlights: [
      "Expert faculty-led classroom teaching",
      "Regular tests & performance tracking",
      "Doubt solving & mentorship support"
    ],
    category: "freshers",
    link: "/courses/1"
  },
  {
    id: 3,
    type: "Classroom Course",
    badge: "Starts: 15 July",
    title: "NEET Repeaters",
    description: "Intensive offline classroom program tailored for droppers/repeaters preparing for NEET 2026.",
    highlights: [
      "Daily worksheets (DPP) & analytical tracking",
      "Physics & Chemistry shortcut tips & tricks",
      "Syllabus completion by Jan with extensive mock series"
    ],
    category: "repeaters",
    link: "/courses/3"
  },
  {
    id: 4,
    type: "Test Series",
    badge: "Starts: 1 August",
    title: "Online Test Series",
    description: "Highly simulated online & offline mock tests matching the exact NEET pattern.",
    highlights: [
      "National percentile & ranking benchmark",
      "In-depth video solutions for all mock papers",
      "Part-tests and Full-syllabus simulation"
    ],
    category: "test-series",
    link: "/courses/4"
  },
  {
    id: 5,
    type: "Test Series",
    badge: "Starts: 1 August",
    title: "Offline Test Series",
    description: "Offline classroom mock tests providing the real NEET exam environment.",
    highlights: [
      "OMR based offline testing at center",
      "Detailed post-test paper analysis",
      "Part-tests and Full-syllabus simulation"
    ],
    category: "test-series",
    link: "/courses/5"
  }
];

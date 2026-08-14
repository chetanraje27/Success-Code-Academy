export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  points?: string[];
};

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const faqSections: FaqSection[] = [
  {
    title: "About Success Code Academy",
    items: [
      { id: 1, question: "What is Success Code Academy?", answer: "Success Code Academy is a dedicated NEET coaching institute in Baramati that focuses exclusively on helping students prepare for the NEET examination through concept-driven teaching, personalized mentorship, regular assessments, and structured academic support." },
      { id: 2, question: "Where is Success Code Academy located?", answer: "Success Code Academy is located in Baramati, Maharashtra." },
      { id: 3, question: "Which entrance examinations do you provide coaching for?", answer: "Success Code Academy is dedicated exclusively to NEET preparation." },
      { id: 4, question: "Why should I choose Success Code Academy for NEET preparation?", answer: "Success Code Academy combines concept-driven classroom learning, personalized mentorship, regular testing, performance analytics, quality study material, and individual academic support to help students prepare effectively for NEET." },
      { id: 5, question: "Who can join Success Code Academy?", answer: "Students preparing for NEET can join our programs based on their academic stage and preparation requirements." },
    ],
  },
  {
    title: "Courses & Batches",
    items: [
      { id: 6, question: "What NEET batches are available at Success Code Academy?", answer: "We offer two major NEET preparation programs:", points: ["NEET Freshers Batch - For students preparing for NEET for the first time.", "NEET Repeaters Batch - For students who have already appeared for NEET and want to improve their performance."] },
      { id: 7, question: "Who should join the NEET Freshers Batch?", answer: "The NEET Freshers Batch is designed for students beginning their NEET preparation and looking to build strong fundamentals in Physics, Chemistry, and Biology." },
      { id: 8, question: "Who should join the NEET Repeaters Batch?", answer: "The NEET Repeaters Batch is designed for students who have previously appeared for NEET and want to improve their concepts, accuracy, strategy, time management, and overall score." },
      { id: 9, question: "How do I know which batch is right for me?", answer: "You can choose a batch based on your current academic level and NEET preparation status. Our team can also guide you regarding the most suitable program." },
    ],
  },
  {
    title: "Concept-Driven Learning",
    items: [
      { id: 10, question: "What is the teaching approach at Success Code Academy?", answer: "Our teaching approach focuses on deep conceptual understanding rather than rote memorization. We help students understand the fundamentals and learn how to apply concepts to NEET-level questions." },
      { id: 11, question: "Do you follow the NCERT syllabus?", answer: "Yes. Our academic approach gives strong importance to NCERT, especially for NEET preparation, while also helping students develop conceptual understanding and application skills." },
      { id: 12, question: "Are classes focused only on memorization?", answer: "No. We believe that strong fundamentals and conceptual clarity are essential for effective NEET preparation. Our teaching focuses on understanding concepts and applying them to different types of questions." },
      { id: 13, question: "Are the classes interactive?", answer: "Yes. Our classroom learning environment encourages interaction and helps students actively engage with concepts and problem-solving." },
      { id: 14, question: "How do you help students with weak concepts?", answer: "Through regular assessments, faculty guidance, performance analysis, and focused academic support, students can identify and work on areas that require improvement." },
    ],
  },
  {
    title: "Personalized Mentorship",
    items: [
      { id: 15, question: "Do students receive personal mentorship?", answer: "Yes. Success Code Academy provides personalized mentorship to support students throughout their NEET preparation journey." },
      { id: 16, question: "What does one-on-one mentoring include?", answer: "One-on-one mentoring may include academic guidance, preparation planning, performance discussions, problem identification, and exam strategy support." },
      { id: 17, question: "Do students receive personalized study plans?", answer: "Yes. Students can receive guidance based on their preparation level, strengths, weaknesses, and academic requirements." },
      { id: 18, question: "How do you track a student's progress?", answer: "Student progress is monitored through regular tests, performance analysis, faculty feedback, and continuous academic evaluation." },
      { id: 19, question: "Do parents receive updates about student performance?", answer: "Yes. Regular parent interaction helps keep parents informed about the student's academic progress and areas that need attention." },
      { id: 20, question: "Do you provide exam strategy guidance?", answer: "Yes. Students receive guidance on preparation strategy, revision planning, test-taking approach, accuracy, and time management." },
    ],
  },
  {
    title: "Study Material & Daily Practice",
    items: [
      { id: 21, question: "Is study material provided by Success Code Academy?", answer: "Yes. Students receive structured academic resources to support their NEET preparation." },
      { id: 22, question: "What study material is provided?", answer: "Our academic resources include:", points: ["Printed notes", "Daily Practice Papers (DPPs)", "Topic-wise assignments", "NEET question bank", "Revision booklets", "Previous Year Questions (PYQs)"] },
      { id: 23, question: "What are Daily Practice Papers (DPPs)?", answer: "DPPs are regular practice sheets designed to help students strengthen concepts and maintain consistency in their preparation." },
      { id: 24, question: "Are topic-wise assignments provided?", answer: "Yes. Topic-wise assignments help students practice individual chapters and concepts in a structured manner." },
      { id: 25, question: "Do students practice Previous Year Questions?", answer: "Yes. Previous Year Questions are an important part of NEET preparation and are included to help students understand question patterns and important concepts." },
      { id: 26, question: "Is revision material provided?", answer: "Yes. Revision booklets and other structured resources are provided to help students revise important concepts effectively." },
    ],
  },
  {
    title: "Tests & Assessment System",
    items: [
      { id: 27, question: "How often are students tested?", answer: "Students undergo regular assessments throughout their preparation to evaluate their conceptual understanding and academic progress." },
      { id: 28, question: "What types of tests are conducted?", answer: "Our assessment system includes:", points: ["Topic-wise tests", "Revision tests", "Full syllabus tests", "NEET-pattern mock examinations"] },
      { id: 29, question: "Are the mock tests based on the NEET pattern?", answer: "Yes. Mock examinations are designed to help students practice in a NEET-oriented examination environment." },
      { id: 30, question: "How do tests help students improve?", answer: "Regular testing helps students identify weak areas, improve accuracy, develop time-management skills, and become more comfortable with the examination pattern." },
      { id: 31, question: "Do students get time-management practice?", answer: "Yes. Regular tests and mock examinations help students practice completing questions efficiently within the required time." },
    ],
  },
  {
    title: "Personalized Performance Analytics",
    items: [
      { id: 32, question: "Do students receive performance reports?", answer: "Yes. Student performance is analyzed to provide meaningful feedback about academic progress." },
      { id: 33, question: "What information is included in performance analysis?", answer: "Performance analysis may include:", points: ["Detailed performance reports", "Error analysis", "Chapter-wise performance", "Areas for improvement", "Faculty feedback"] },
      { id: 34, question: "What is error analysis?", answer: "Error analysis helps students understand why mistakes occurred, whether due to conceptual gaps, calculation errors, incorrect interpretation, lack of revision, or time-management issues." },
      { id: 35, question: "How does chapter-wise performance analysis help?", answer: "It helps students identify strong and weak chapters so that they can focus their preparation more effectively." },
      { id: 36, question: "Do students receive an improvement roadmap?", answer: "Yes. Based on performance and academic requirements, students can receive guidance on the areas they should focus on for improvement." },
      { id: 37, question: "Do faculty members provide feedback?", answer: "Yes. Faculty feedback helps students understand their performance and work on specific areas requiring improvement." },
    ],
  },
  {
    title: "Student Wellness & Motivation",
    items: [
      { id: 38, question: "Does Success Code Academy support students beyond academics?", answer: "Yes. NEET preparation can be demanding, so we also focus on maintaining a positive and supportive learning environment." },
      { id: 39, question: "How do you help students manage exam stress?", answer: "Students receive guidance, motivation, and a supportive environment to help them manage the challenges and pressure associated with competitive examination preparation." },
      { id: 40, question: "Do you focus on student confidence?", answer: "Yes. Building confidence is an important part of effective preparation. Through mentorship, regular practice, and continuous improvement, we encourage students to become more confident in their abilities." },
      { id: 41, question: "How do you keep students motivated during long-term preparation?", answer: "Through continuous mentorship, academic guidance, progress tracking, encouragement, and a positive learning environment, we help students stay focused on their goals." },
    ],
  },
  {
    title: "Scholarship Test",
    items: [
      { id: 42, question: "Does Success Code Academy conduct a scholarship test?", answer: "Yes. Success Code Academy conducts a scholarship test every year." },
      { id: 43, question: "Who can register for the scholarship test?", answer: "Students can check the eligibility criteria and registration details announced for the respective scholarship test." },
      { id: 44, question: "How can I register for the scholarship test?", answer: "Students can register for the scholarship test through the Success Code Academy website when registrations are open." },
      { id: 45, question: "What is the purpose of the scholarship test?", answer: "The scholarship test helps evaluate a student's academic and conceptual understanding and provides eligible students with an opportunity to receive scholarship benefits according to the applicable criteria." },
      { id: 46, question: "Where can I find scholarship test dates and updates?", answer: "The latest scholarship test information, registration dates, eligibility details, and announcements will be available on the official Success Code Academy website." },
    ],
  },
  {
    title: "Admissions & Registration",
    items: [
      { id: 47, question: "How can I register for a NEET course?", answer: "Students can register for the NEET Freshers or NEET Repeaters program through the Success Code Academy website." },
      { id: 48, question: "Can I register online?", answer: "Yes. Students can register online through the official website when admissions or registrations are open." },
      { id: 49, question: "Can parents contact the academy before admission?", answer: "Yes. Parents and students can contact Success Code Academy for information regarding courses, admissions, batches, and scholarship opportunities." },
      { id: 50, question: "What information should I check before registering?", answer: "Students should check the course details, eligibility, batch information, admission process, important dates, and other applicable details before completing registration." },
    ],
  },
  {
    title: "Results & Achievements",
    items: [
      { id: 51, question: "How have Success Code Academy students performed in NEET?", answer: "Success Code Academy has achieved strong NEET results, with 36+ selections in NEET 2025." },
      { id: 52, question: "Have your students been selected for AIIMS Delhi?", answer: "Yes. Three students from Success Code Academy have been selected for AIIMS Delhi." },
      { id: 53, question: "Do your students get admission to government medical colleges?", answer: "Yes. Our students have secured selections and admissions to top Government Medical Colleges across Maharashtra." },
      { id: 54, question: "What are some of your notable NEET achievements?", answer: "Our results include outstanding performances, including AIR 26 in NEET 2025 and AIR 5 in NEET 2026, along with selections to prestigious medical institutions." },
      { id: 55, question: "What is special about your selection ratio?", answer: "Success Code Academy is proud to have one of the best selection ratios in Maharashtra, reflecting our focus on quality teaching, consistent practice, mentorship, and personalized academic support." },
      { id: 56, question: "Where can I see the detailed results of Success Code Academy?", answer: "Students and parents can visit the Results section of our website to explore detailed student achievements, selections, ranks, and success stories." },
    ],
  },
  {
    title: "General Questions",
    items: [
      { id: 57, question: "Is Success Code Academy suitable for serious NEET aspirants?", answer: "Yes. Our programs are designed for students who are serious about NEET and want structured preparation, conceptual learning, regular practice, testing, mentorship, and performance tracking." },
      { id: 58, question: "How does Success Code Academy maintain individual attention?", answer: "We focus on maintaining an effective student-to-teacher ratio that supports better interaction, personalized guidance, and individual academic attention." },
      { id: 59, question: "What makes Success Code Academy different from other coaching institutes?", answer: "Our approach combines:", points: ["Exclusive focus on NEET", "Concept-driven teaching", "NCERT-first learning", "Personalized mentorship", "One-on-one guidance", "Structured study material", "Daily practice", "Regular testing", "Performance analytics", "Parent interaction", "Student motivation and wellness support", "Strong NEET results"] },
      { id: 60, question: "How can I get the latest updates from Success Code Academy?", answer: "You can visit the official Success Code Academy website for the latest information regarding admissions, new batches, scholarship tests, results, and other announcements." },
      { id: 61, question: "Can I contact Success Code Academy for more information?", answer: "Yes. Students and parents can contact the academy through the contact details available on the official website." },
    ],
  },
];

import { Banner, Notification, StarStudent, NewsArticle, AcademyVideo } from './models';

export async function seedDatabase() {
  try {
    // Check if banners exist
    const bannerCount = await Banner.count();
    if (bannerCount === 0) {
      console.log('Seeding initial banners...');
      await Banner.bulkCreate([
        { altText: 'Hero Banner 1', image: '/images/banners/HeroPoster1.png', type: 'HOME', isActive: true, orderIndex: 1 },
        { altText: 'Hero Banner 2', image: '/images/banners/HeroPoster2.png', type: 'HOME', isActive: true, orderIndex: 2 },
        { altText: 'Hero Banner 3', image: '/images/banners/HeroPoster3.png', type: 'HOME', isActive: true, orderIndex: 3 },
        { altText: 'Hero Banner 4', image: '/images/banners/HeroPoster4.png', type: 'HOME', isActive: true, orderIndex: 4 },
        { altText: 'Results Banner 1', image: '/images/banners/Results_Hero.png', type: 'RESULTS', isActive: true, orderIndex: 1 },
        { altText: 'Results Banner 2', image: '/images/banners/Results_Hero2_.png', type: 'RESULTS', isActive: true, orderIndex: 2 },
        { altText: 'Results Banner 3', image: '/images/banners/Results_Hero3.png', type: 'RESULTS', isActive: true, orderIndex: 3 },
      ]);
    }

    // Check if notifications exist
    const notifCount = await Notification.count();
    if (notifCount === 0) {
      console.log('Seeding initial notifications...');
      await Notification.bulkCreate([
        { text: '🎉 Admissions Open 2026-27 for NEET & JEE batches!', isActive: true, orderIndex: 1 },
        { text: '🧪 Free Demo Classes available — Book your slot today.', isActive: true, orderIndex: 2 },
        { text: '📝 Scholarship Test (SCST) registration started — up to 100% fee waiver!', isActive: true, orderIndex: 3 },
        { text: '🚀 JEE & NEET new batch starting July 15 — Limited seats!', isActive: true, orderIndex: 4 },
      ]);
    }

    // Check if star students exist
    const starsCount = await StarStudent.count();
    if (starsCount === 0) {
      console.log('Seeding initial star students...');
      await StarStudent.bulkCreate([
        { name: 'Siddhi Badhe', score: '665/720', rank: 'AIR 26', course: 'NEET Freshers Batch', year: 'NEET UG 2025', image: '/images/results/2025/SiddhiBadhe.png', colorHex: '#0ca678', isActive: true, orderIndex: 1 },
        { name: 'Samruddhi Lokhande', score: '602/720', rank: 'AIR 1204', course: 'NEET Freshers Batch', year: 'NEET UG 2025', image: '/images/results/2025/SamruddhiLokhande.png', colorHex: '#097969', isActive: true, orderIndex: 2 },
        { name: 'Mahesh Bhosale', score: '550/720', rank: 'AIR 6000', course: 'NEET Freshers Batch', year: 'NEET UG 2025', image: '/images/results/2025/MaheshBhosale.png', colorHex: '#d9480f', isActive: true, orderIndex: 3 },
        { name: 'Aprupa Patil', score: '550/720', rank: 'AIR 1610', course: 'NEET Freshers Batch', year: 'NEET UG 2025', image: '/images/results/2025/AprupaPatil.png', colorHex: '#1c7ed6', isActive: true, orderIndex: 4 },
        { name: 'Darshana Dhoka', score: '550/720', rank: 'AIR 1980', course: 'NEET Freshers Batch', year: 'NEET UG 2025', image: '/images/results/2025/DarshanaDhoka.png', colorHex: '#7048e8', isActive: true, orderIndex: 5 },
        { name: 'Piyush Kale', score: '681/720', rank: 'AIR 2840', course: 'NEET Freshers Batch', year: 'NEET UG 2024', image: '/images/results/2024/PiyushKale.png', colorHex: '#f08c00', isActive: true, orderIndex: 6 },
        { name: 'Rushikesh Kale', score: '660/720', rank: 'AIR 2840', course: 'NEET Freshers Batch', year: 'NEET UG 2024', image: '/images/results/2024/RushikeshKale.png', colorHex: '#f08c00', isActive: true, orderIndex: 7 }
      ]);
    }

    // Check if news articles exist
    const newsCount = await NewsArticle.count();
    if (newsCount === 0) {
      console.log('Seeding initial news articles...');
      await NewsArticle.bulkCreate([
        { category: "TOI Feature", title: '"Stayed away from phone and social media for a year": Highest ranked female candidate Shravani Kudale shares what got her AIR 5 in NEET', shortTitle: '"No phone for a year": Shravani Kudale secures AIR 5', excerpt: "Shravani Kudale stays away from phone and social media for NEET preparation and gets AIR 5.", date: "18 JUL 2026", author: "TOI DESK", readTime: "4 min read", image: "/images/results/heroes/Shravani2.png", slug: "shravani-kudale-toi-feature", externalUrl: "https://timesofindia.indiatimes.com/life-style/parenting/moments/stayed-away-from-phone-and-social-media-for-a-year-highest-ranked-female-candidate-shravani-kudale-shares-what-got-her-air-5-in-neet/articleshow/132477313.cms", isActive: true, orderIndex: 1 },
        { category: "Sakal Feature", title: "NEET Exam Result : बारामतीची सिद्धी मुलींमधून राज्यात पहिली; नीट परीक्षेत 665 गुण; ऑल इंडिया रँक 26", shortTitle: "NEET Result: बारामतीची सिद्धी राज्यात पहिली", excerpt: "बारामती येथील सिद्धीने 'नीट' परीक्षेत तब्बल 665 गुण मिळवीत मुलींमधून संपूर्ण देशात तिसरा क्रमांक पटकावला.", date: "17 JUL 2026", author: "SAKAL DESK", readTime: "3 min read", image: "/images/press/siddhi_sakal.png", slug: "siddhi-badhe-sakal-feature", externalUrl: "https://www.esakal.com/pune/neet-exam-result-baramati-siddhi-badhe-tops-state-among-girls-with-neet-score-of-665-all-india-rank-26-success-motivation-pjp78", isActive: true, orderIndex: 2 },
        { category: "HT Feature", title: "No phone, no social media for a year: How Maharashtra's NEET topper Shravani Kudale secured AIR 5", shortTitle: "Maharashtra's NEET Topper Shravani Kudale (AIR 5)", excerpt: "Maharashtra's NEET 2026 topper Shravani Kudale from Pune district scored 710 out of 720.", date: "17 JUL 2026", author: "HT DESK", readTime: "5 min read", image: "/images/press/Hindutan1.png", slug: "shravani-kudale-ht-feature", externalUrl: "https://www.hindustantimes.com/education/exam-results/stayed-away-from-mobile-phones-says-maharashtra-neet-topper-shravani-kudale-101784295153769.html", isActive: true, orderIndex: 3 },
        { category: "Campus Life", title: "Interactive Classrooms & Late-Night Doubt Desks at SCA", shortTitle: "Interactive Classrooms & Doubt Support", excerpt: "A look at how our subject expert mentors resolve individual student doubts post-lectures.", date: "18 JUN 2026", author: "PROF. K. JADHAV", readTime: "3 min read", image: "/images/blogs/classroom_doubts.png", slug: "interactive-classrooms-doubt-desks", isActive: true, orderIndex: 4 },
        { category: "Academic Edge", title: "Analyzing the SCA NEET Offline Mock Test Edge", shortTitle: "SCA NEET Mock Test Advantage", excerpt: "Discover how our All India Test Series simulates exact NTA pressures.", date: "22 MAY 2026", author: "MOCK DEPT", readTime: "5 min read", image: "/images/blogs/mock_test.png", slug: "sca-mock-test-edge", isActive: true, orderIndex: 5 }
      ]);
    }

    // Check if videos exist
    const videoCount = await AcademyVideo.count();
    if (videoCount === 0) {
      console.log('Seeding initial academy videos...');
      await AcademyVideo.bulkCreate([
        { category: "Campus Tour", title: "Success Code Academy Campus Tour", excerpt: "Take a virtual tour of our state-of-the-art digital classrooms, advanced study cabins, and library resource center.", date: "June 15, 2026", duration: "4:02", image: "/images/about/infra.png", videoUrl: "/videos/SCA_Campus_Tour.mp4", isActive: true, orderIndex: 1 },
        { category: "Student Journey", title: "Siddhi Badhe: My Journey to AIIMS Delhi", excerpt: "Siddhi shares her study schedule, organic chemistry notes, and biology charts that led her to secure a seat at AIIMS Delhi.", date: "May 12, 2026", duration: "0:58", image: "/images/results/heroes/HoneSiddhi.png", videoUrl: "/videos/Siddhi_Journey_Video.mp4", isActive: true, orderIndex: 2 },
        { category: "Award Ceremony", title: "2025 Students Award Ceremony", excerpt: "Hear from our top rankers about their daily revision habits, NCERT reading tricks, and how they managed exam-day stress.", date: "June 02, 2026", duration: "2:21", image: "/videos/Cover/Award_Cere_Cover.png", videoUrl: "/videos/Award_Ceremony.mp4", isActive: true, orderIndex: 3 },
        { category: "Student Journey", title: "Samruddhi Lokhande : My Journey to AIIMS Nagpur", excerpt: "Her formula flashcard strategy, mock test timing practices, and advice for fellow repeaters.", date: "June 08, 2026", duration: "7:45", image: "/images/results/heroes/HomeSamruddhi.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isActive: true, orderIndex: 4 },
        { category: "Study Tips", title: "Mastering Physics Numericals", excerpt: "Expert faculty breaks down the approach to solve complex physics problems quickly.", date: "July 10, 2026", duration: "12:15", image: "/images/blogs/classroom_doubts.png", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", isActive: true, orderIndex: 5 },
        { category: "Motivation", title: "Never Give Up - Director's Message", excerpt: "An inspiring talk by our founder on staying focused and motivated during tough times.", date: "August 01, 2026", duration: "5:30", image: "/images/banners/upcoming_batches_hero.png", videoUrl: "/videos/SCA_Campus_Tour.mp4", isActive: true, orderIndex: 6 }
      ]);
    }

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

import { Banner, Notification, StarStudent } from './models';

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

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

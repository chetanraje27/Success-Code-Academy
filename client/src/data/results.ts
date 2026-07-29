export interface StudentResult {
  id: number;
  name: string;
  image: string;
  year: number;
  college?: string;
  city?: string;
  marks?: number;
  rank?: number;
  isCustomCard?: boolean;
}

export const resultsData: StudentResult[] = [
  // ─── YEAR 2026 RESULTS ───
  { id: 81, name: "Tanishka Adsul", image: "/images/results/2026/tanishka_adsul.png", year: 2026, marks: 645, isCustomCard: true },
  { id: 82, name: "Aryan Dolas", image: "/images/results/2026/aryan_dolas.png", year: 2026, marks: 631, isCustomCard: true },
  { id: 83, name: "Shruti Chavan", image: "/images/results/2026/shruti_chavan.png", year: 2026, marks: 618, isCustomCard: true },
  { id: 84, name: "Gouri Zirape", image: "/images/results/2026/gouri_zirape.png", year: 2026, marks: 611, isCustomCard: true },
  { id: 85, name: "Abhishek Murumkar", image: "/images/results/2026/abhishek_murumkar.png", year: 2026, marks: 609, isCustomCard: true },
  { id: 86, name: "Aryan Unde", image: "/images/results/2026/aryan_unde.png", year: 2026, marks: 606, isCustomCard: true },
  { id: 87, name: "Vedhant Gandhi", image: "/images/results/2026/vedhant_gandhi.png", year: 2026, marks: 600, isCustomCard: true },
  { id: 88, name: "Anushka Kakade", image: "/images/results/2026/anushka_kakade.png", year: 2026, marks: 567, isCustomCard: true },
  { id: 89, name: "Namtrata Bondre", image: "/images/results/2026/namtrata_bondre.png", year: 2026, marks: 557, isCustomCard: true },
  { id: 90, name: "Prerana Yewale", image: "/images/results/2026/prerana_yewale.png", year: 2026, marks: 554, isCustomCard: true },
  { id: 91, name: "Samruddhi Devkar", image: "/images/results/2026/samruddhi_devkar.png", year: 2026, marks: 544, isCustomCard: true },
  { id: 92, name: "Shruti Borkar", image: "/images/results/2026/shruti_borkar.png", year: 2026, marks: 543, isCustomCard: true },
  { id: 93, name: "Anushka Bhise", image: "/images/results/2026/anushka_bhise.png", year: 2026, marks: 540, isCustomCard: true },
  { id: 94, name: "Smith Dhaygude", image: "/images/results/2026/smith_dhaygude.png", year: 2026, marks: 537, isCustomCard: true },
  { id: 95, name: "Sanskruti Gawand", image: "/images/results/2026/sanskruti_gawand.png", year: 2026, marks: 535, isCustomCard: true },
  { id: 96, name: "Kunal Gurav", image: "/images/results/2026/kunal_gurav.png", year: 2026, marks: 533, isCustomCard: true },
  { id: 97, name: "Bhumika Atole", image: "/images/results/2026/bhumika_atole.png", year: 2026, marks: 530, isCustomCard: true },
  { id: 98, name: "Alankar Gophane", image: "/images/results/2026/alankar_gophane.png", year: 2026, marks: 530, isCustomCard: true },
  { id: 99, name: "Darshan Shelake", image: "/images/results/2026/darshan_shelake.png", year: 2026, marks: 528, isCustomCard: true },
  { id: 100, name: "Shivraj Barkade", image: "/images/results/2026/shivraj_barkade.png", year: 2026, marks: 528, isCustomCard: true },
  { id: 101, name: "Prathmesh Bhise", image: "/images/results/2026/prathmesh_bhise.png", year: 2026, marks: 525, isCustomCard: true },
  { id: 102, name: "Sanjivini Malave", image: "/images/results/2026/sanjivini_malave.png", year: 2026, marks: 525, isCustomCard: true },
  { id: 103, name: "Krupa Shigade", image: "/images/results/2026/krupa_shigade.png", year: 2026, marks: 524, isCustomCard: true },
  { id: 104, name: "Shravani Dhalpe", image: "/images/results/2026/shravani_dhalpe.png", year: 2026, marks: 520, isCustomCard: true },
  { id: 105, name: "Janhavi Bhuse", image: "/images/results/2026/janhavi_bhuse.png", year: 2026, marks: 519, isCustomCard: true },
  { id: 106, name: "Kunal Agam", image: "/images/results/2026/kunal_agam.png", year: 2026, marks: 518, isCustomCard: true },
  { id: 107, name: "Mangesh Virkar", image: "/images/results/2026/mangesh_virkar.png", year: 2026, marks: 515, isCustomCard: true },
  { id: 108, name: "Abhishek Hande", image: "/images/results/2026/abhishek_hande.png", year: 2026, marks: 511, isCustomCard: true },
  { id: 109, name: "Sanjana Kamthe", image: "/images/results/2026/sanjana_kamthe.png", year: 2026, marks: 509, isCustomCard: true },
  { id: 110, name: "Bhavesh Shide", image: "/images/results/2026/bhavesh_shide.png", year: 2026, marks: 507, isCustomCard: true },
  { id: 111, name: "Sanika Pawar", image: "/images/results/2026/sanika_pawar.png", year: 2026, marks: 506, isCustomCard: true },
  { id: 112, name: "Pushkar Thombare", image: "/images/results/2026/pushkar_thombare.png", year: 2026, marks: 506, isCustomCard: true },
  { id: 113, name: "Lehar Devkate", image: "/images/results/2026/lehar_devkate.png", year: 2026, marks: 504, isCustomCard: true },
  { id: 114, name: "Arya Shinde", image: "/images/results/2026/arya_shinde.png", year: 2026, marks: 504, isCustomCard: true },

  // ─── YEAR 2025 RESULTS ───
  { id: 1, name: "Siddhi Badhe", image: "/images/results/2025/SiddhiBadhe.png", year: 2025, college: "AIIMS", city: "Delhi", marks: 665, rank: 26, isCustomCard: true },
  { id: 2, name: "Samruddhi Lokhande", image: "/images/results/2025/SamruddhiLokhande.png", year: 2025, college: "AIIMS", city: "Nagpur", marks: 602, rank: 1204, isCustomCard: true },

  // Row 1 of Grid
  { id: 3, name: "Mahesh Bhosale", image: "/images/results/2025/MaheshBhosale.png", year: 2025, college: "B.J. Government Medical College", city: "Pune", isCustomCard: true },
  { id: 4, name: "Aprupa Patil", image: "/images/results/2025/AprupaPatil.png", year: 2025, college: "Grant Government Medical College", city: "Mumbai", isCustomCard: true },
  { id: 5, name: "Darshana Dhoka", image: "/images/results/2025/DarshanaDhoka.png", year: 2025, college: "Punyashlok Ahilyadevi Holkar Government Medical College & General Hospital", city: "Baramati", isCustomCard: true },
  { id: 6, name: "Aniruddha Dhyagude", image: "/images/results/2025/AniruddhaDhyagude.png", year: 2025, college: "Government Medical College", city: "Miraj", isCustomCard: true },
  { id: 7, name: "Omkar Khadke", image: "/images/results/2025/OmkarKhade.png", year: 2025, college: "Topiwala National Medical College & BYL Nair Hospital", city: "Mumbai", isCustomCard: true },
  { id: 8, name: "Sarthak Gawade", image: "/images/results/2025/SarthakGawade.png", year: 2025, college: "Government Medical College", city: "Sangli", isCustomCard: true },

  // Row 2 of Grid
  { id: 9, name: "Mujib Mulani", image: "/images/results/2025/MujibMulani.png", year: 2025, college: "Dr Vaishampayan Memorial Medical College", city: "Solapur", isCustomCard: true },
  { id: 10, name: "Shantanu Badkumbe", image: "/images/results/2025/Shantanubhadkumbe.png", year: 2025, college: "Dr Vaishampayan Memorial Medical College", city: "Solapur", isCustomCard: true },
  { id: 11, name: "Anushka Kadam", image: "/images/results/2025/AnushkaJadhav.png", year: 2025, college: "Punyashlok Ahilyadevi Holkar Government Medical College & General Hospital", city: "Baramati", isCustomCard: true },
  { id: 12, name: "Pruthviraj Takale", image: "/images/results/2025/Pruthvirajtakle.png", year: 2025, college: "Government Medical College", city: "Jalgaon", isCustomCard: true },
  { id: 13, name: "Varad Lonkar", image: "/images/results/2025/VaradLonkar.png", year: 2025, college: "Maharashtra Institute of Medical Education and Research", city: "Talegaon", isCustomCard: true },
  { id: 14, name: "Muskan Namdar", image: "/images/results/2025/MuskanInamdar.png", year: 2025, college: "Punyashlok Ahilyadevi Holkar Government Medical College & General Hospital", city: "Baramati", isCustomCard: true },

  // Row 3 of Grid
  { id: 15, name: "Atharva Kanse", image: "/images/results/2025/Atharvakanse.png", year: 2025, college: "Mahatma Gandhi Institute of Medical Sciences", city: "Wardha", isCustomCard: true },
  { id: 16, name: "Omkar Mokashi", image: "/images/results/2025/Omkarmokashi.png", year: 2025, college: "Government Medical College", city: "Alibag", isCustomCard: true },
  { id: 17, name: "Vedang Pataskar", image: "/images/results/2025/VedantPataskar.png", year: 2025, college: "Visaro Deshmukh Government Medical College", city: "Latur", isCustomCard: true },
  { id: 18, name: "Arpita Borate", image: "/images/results/2025/ArpitaBorate.png", year: 2025, college: "Government Medical College", city: "Hingoli", isCustomCard: true },
  { id: 19, name: "Gauri Joshi", image: "/images/results/2025/GauriJoshi.png", year: 2025, college: "Government Medical College", city: "Alibag", isCustomCard: true },
  { id: 20, name: "Manish Pondkule", image: "/images/results/2025/ManishPondkule.png", year: 2025, college: "Government Medical College", city: "Gondia", isCustomCard: true },

  // Row 4 of Grid
  { id: 21, name: "Prashant Bhosale", image: "/images/results/2025/PrashantBhosale.png", year: 2025, college: "Dr. N.J. Cooper Hospital & HBT Medical College", city: "Mumbai", isCustomCard: true },
  { id: 22, name: "Vidhita Waghmare", image: "/images/results/2025/Vidhitawaghmare.png", year: 2025, college: "Government Medical College", city: "Satara", isCustomCard: true },
  { id: 23, name: "Ashay Vora", image: "/images/results/2025/Ashayvora.png", year: 2025, college: "Rajarshi Chhatrapati Shahu Medical Government Medical College", city: "Kolhapur", isCustomCard: true },
  { id: 24, name: "Reshma Gosavi", image: "/images/results/2025/ReshmaGosavi.png", year: 2025, college: "Government Medical College & Hospital", city: "Miraj", isCustomCard: true },
  { id: 25, name: "Vivek Sable", image: "/images/results/2025/VivekSable.png", year: 2025, college: "Shree Bhausaheb Hire Govt Medical College", city: "Dhule", isCustomCard: true },
  { id: 26, name: "Prakruti Kamble", image: "/images/results/2025/PrakrutiKambale.png", year: 2025, college: "Government Medical College", city: "Hingoli", isCustomCard: true },

  // ─── YEAR 2024 RESULTS ───
  { id: 27, name: "Piyush Kale", image: "/images/results/2024/PiyushKale.png", year: 2024, marks: 681, isCustomCard: true },
  { id: 28, name: "Rushikesh Kale", image: "/images/results/2024/RushikeshKale.png", year: 2024, marks: 676, isCustomCard: true },
  { id: 29, name: "Chinmayi Gadekar", image: "/images/results/2024/ChinmayiGadekar.png", year: 2024, marks: 666, isCustomCard: true },
  { id: 30, name: "Jeenat Shaikh", image: "/images/results/2024/JeenatShaikh.png", year: 2024, marks: 661, isCustomCard: true },
  { id: 31, name: "Shivani Takale", image: "/images/results/2024/ShivaniTakle.png", year: 2024, marks: 651, isCustomCard: true },
  { id: 32, name: "Shravani Kshirsagar", image: "/images/results/2024/ShravaniKrishnasagar.png", year: 2024, marks: 642, isCustomCard: true },
  { id: 33, name: "Pranav Mulik", image: "/images/results/2024/PranavMulik.png", year: 2024, marks: 640, isCustomCard: true },
  { id: 34, name: "Arya Sapkal", image: "/images/results/2024/Aryasapkal.png", year: 2024, marks: 639, isCustomCard: true },
  { id: 35, name: "Gauri Jamdade", image: "/images/results/2024/GauriJamdade.png", year: 2024, marks: 637, isCustomCard: true },
  { id: 36, name: "Vedankita Patil", image: "/images/results/2024/Vedikapatil.png", year: 2024, marks: 626, isCustomCard: true },
  { id: 37, name: "Tanvi Dobhada", image: "/images/results/2024/TanviDhobada.png", year: 2024, marks: 625, isCustomCard: true },
  { id: 38, name: "Samiksha Gadiya", image: "/images/results/2024/Samikshagadiya.png", year: 2024, marks: 624, isCustomCard: true },
  { id: 39, name: "Satyapriya Dhumal", image: "/images/results/2024/Satyapriyadhumal;.png", year: 2024, marks: 622, isCustomCard: true },
  { id: 40, name: "Vishwajeet Mahamuni", image: "/images/results/2024/Vishvajeetmahamuni.png", year: 2024, marks: 618, isCustomCard: true },
  { id: 41, name: "Snehal Nimbalkar", image: "/images/results/2024/snehalnimbalkar.png", year: 2024, marks: 617, isCustomCard: true },
  { id: 42, name: "Dhiraj Jadhav", image: "/images/results/2024/Dhirajjadhav.png", year: 2024, marks: 617, isCustomCard: true },
  { id: 43, name: "Sakshi Newase", image: "/images/results/2024/sakshinewase.png", year: 2024, marks: 603, isCustomCard: true },
  { id: 44, name: "Vaishnavi Kadam", image: "/images/results/2024/VaishnaviKadam.png", year: 2024, marks: 598, isCustomCard: true },
  { id: 45, name: "Omkar Mokashi", image: "/images/results/2024/omkarmokashi.png", year: 2024, marks: 596, isCustomCard: true },
  { id: 46, name: "Rajvardhan Yadav", image: "/images/results/2024/Rajvarshanyadav.png", year: 2024, marks: 594, isCustomCard: true },
  { id: 47, name: "Pruthviraj Takale", image: "/images/results/2024/PruthvirajTakle.png", year: 2024, marks: 590, isCustomCard: true },
  { id: 48, name: "Samruddhi Patil", image: "/images/results/2024/Samruddhipatil.png", year: 2024, marks: 588, isCustomCard: true },
  { id: 49, name: "Utkarsha Metkari", image: "/images/results/2024/UtkarshaMetkari.png", year: 2024, marks: 582, isCustomCard: true },
  { id: 50, name: "Dnyaneshwari Borate", image: "/images/results/2024/DnyaneshwariBorate.png", year: 2024, marks: 581, isCustomCard: true },
  { id: 51, name: "Atharva Gaikwad", image: "/images/results/2024/AtharvaGaikwad.png", year: 2024, marks: 574, isCustomCard: true },
  { id: 52, name: "Izzan Tamboli", image: "/images/results/2024/Izzantamboli.png", year: 2024, marks: 571, isCustomCard: true },
  { id: 53, name: "Shubham Choudhar", image: "/images/results/2024/ShubhamChoudhar.png", year: 2024, marks: 568, isCustomCard: true },
  { id: 54, name: "Bhavana Nagale", image: "/images/results/2024/Bhavananagale.png", year: 2024, marks: 567, isCustomCard: true },
  { id: 55, name: "Reshma Gosavi", image: "/images/results/2024/reshmagosavi.png", year: 2024, marks: 567, isCustomCard: true },
  { id: 56, name: "Siddhi Pol", image: "/images/results/2024/siddhipol.png", year: 2024, marks: 562, isCustomCard: true },
  { id: 57, name: "Amruta Beldar", image: "/images/results/2024/AmrutaBeldar.png", year: 2024, marks: 560, isCustomCard: true },
  { id: 58, name: "Arya Atole", image: "/images/results/2024/AryaAtole.png", year: 2024, marks: 556, isCustomCard: true },
  { id: 59, name: "Jaydeep Thombare", image: "/images/results/2024/Jaydeepthombre.png", year: 2024, marks: 553, isCustomCard: true },
  { id: 60, name: "Sakshi Vyawahare", image: "/images/results/2024/sakshivyawahare.png", year: 2024, marks: 550, isCustomCard: true },

  // ─── YEAR 2023 RESULTS ───
  { id: 61, name: "Swamini Gadekar", image: "/images/results/2023/SwaminiGadekar.png", year: 2023, marks: 665, isCustomCard: true },
  { id: 62, name: "Mandar Chavan", image: "/images/results/2023/MandarChavhan.png", year: 2023, marks: 648, isCustomCard: true },
  { id: 63, name: "Atharva Divase", image: "/images/results/2023/AtharvaDivase.png", year: 2023, marks: 630, isCustomCard: true },
  { id: 64, name: "Sneha Jagtap", image: "/images/results/2023/SnehaJagtap.png", year: 2023, marks: 613, isCustomCard: true },
  { id: 65, name: "Harsha Naykude", image: "/images/results/2023/HarshaNaykude.png", year: 2023, marks: 597, isCustomCard: true },
  { id: 66, name: "Sakshi Tekawade", image: "/images/results/2023/SakshiTekawade.png", year: 2023, marks: 584, isCustomCard: true },
  { id: 67, name: "Chinmayi Gadekar", image: "/images/results/2023/ChinamayiGadekar.png", year: 2023, marks: 576, isCustomCard: true },
  { id: 68, name: "Radhika Mahamuni", image: "/images/results/2023/RadhikaMahamuni.png", year: 2023, marks: 562, isCustomCard: true },

  // ─── YEAR 2022 RESULTS ───
  { id: 69, name: "Harsh Rajput", image: "/images/results/2022/HarshRajput.png", year: 2022, marks: 620, isCustomCard: true },
  { id: 70, name: "Prajyot Sabale", image: "/images/results/2022/PrajyotSabale.png", year: 2022, marks: 615, isCustomCard: true },
  { id: 71, name: "Amruta Ingule", image: "/images/results/2022/AmrutaIngole.png", year: 2022, marks: 605, isCustomCard: true },
  { id: 72, name: "Parth Thombare", image: "/images/results/2022/ParthThombare.png", year: 2022, marks: 600, isCustomCard: true },
  { id: 73, name: "Sarthak Patil", image: "/images/results/2022/SarthakPatil.png", year: 2022, marks: 597, isCustomCard: true },
  { id: 74, name: "Pratik Gawade", image: "/images/results/2022/PratikGawade.png", year: 2022, marks: 594, isCustomCard: true },
  { id: 75, name: "Aditya Gambare", image: "/images/results/2022/AdityaGambre.png", year: 2022, marks: 585, isCustomCard: true },
  { id: 76, name: "Gauri Bandal", image: "/images/results/2022/GauriBandal.png", year: 2022, marks: 583, isCustomCard: true },
  { id: 77, name: "Ashwin Mandan", image: "/images/results/2022/AshwinMandan.png", year: 2022, marks: 580, isCustomCard: true },
  { id: 78, name: "Nabhanya Zargad", image: "/images/results/2022/NabhanyaZargad.png", year: 2022, marks: 579, isCustomCard: true },
  { id: 79, name: "Vivek Kadam", image: "/images/results/2022/VivekKadam.png", year: 2022, marks: 566, isCustomCard: true },
  { id: 80, name: "Gauri Kalkhaire", image: "/images/results/2022/GauriKalkhaire.png", year: 2022, marks: 553, isCustomCard: true }
];

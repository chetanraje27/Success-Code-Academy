const fs = require('fs');
const path = require('path');

const directoryMap = {
  // Banners
  "aiims_banner.jpg": "banners",
  "repeater_banner.jpg": "banners",
  "student_banner.png": "banners",
  "student_banner_mr.jpg": "banners",
  "target_batch_banner.jpg": "banners",
  "Student_banner_template.png": "banners",
  "upcoming_batches_hero.png": "banners",
  "Award_Cere_Cover.png": "banners",
  "Award_Cere_Cover1.png": "banners",
  "ContactPoster.png": "banners",
  "contact_hero.png": "banners",
  "ScholorshipHero.png": "banners",
  "ScholorshipHero1.png": "banners",
  "Scholorship Registation template.png": "banners",

  // UI
  "logo.png": "ui",
  "logo1.png": "ui",
  "logo2.png": "ui",
  "logo - Copy.png": "ui",
  "Success Code Academy Logo.png": "ui",
  "Success Code Academy Logo .png b.png": "ui",
  "clock (1).png": "ui",
  "email.png": "ui",
  "location.png": "ui",
  "phone-ringing.png": "ui",

  // Results
  "2026.png": "results",
  "Resulltfinal.png": "results",
  "Result_Template.png": "results",
  "Result_Template1.png": "results",
  "SuccessStories_Template.png": "results",
  "neet-achievements.jpg": "results",
  "Toppers.jpg": "results",

  // Results Heroes
  "NeetUG2026AchiversShravani.png": "results/heroes",
  "SharavaniKudale_HeroResult.png": "results/heroes",
  "Sharavani_Kudale.jpg": "results/heroes",
  "Shravani2.png": "results/heroes",
  "ShravaniKudaleHero.png": "results/heroes",
  "TanishkaAdrsulresult.png": "results/heroes",
  "TanishkaAdsulResulthero.png": "results/heroes",
  "HomeSamruddhi.png": "results/heroes",
  "HoneSiddhi.png": "results/heroes",

  // Press
  "shravani_ht.png": "press",
  "shravani_toi.png": "press",
  "siddhi_sakal.png": "press",
  "Hindutan1.png": "press",

  // About
  "About1.png": "about",
  "infra.png": "about",
  "map.png": "about",
  "india_states_map.png": "about"
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.tsx', '.ts', '.css', '.js', '.jsx'].includes(ext)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace references
  for (const [filename, subdir] of Object.entries(directoryMap)) {
    // Escape special characters in filename for regex
    const escapedFilename = filename.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    
    // Look for `/images/filename` or `images/filename` (not preceded by another directory)
    const regex = new RegExp(`(/images/)(?!${subdir.replace(/\//g, '\\/')}/)${escapedFilename}`, 'g');
    content = content.replace(regex, `$1${subdir}/${filename}`);
    
    // Also handle possible relative paths like `../public/images/filename`
    const regex2 = new RegExp(`(images/)(?!${subdir.replace(/\//g, '\\/')}/)${escapedFilename}`, 'g');
    content = content.replace(regex2, `$1${subdir}/${filename}`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir(path.join(__dirname, 'src'), processFile);

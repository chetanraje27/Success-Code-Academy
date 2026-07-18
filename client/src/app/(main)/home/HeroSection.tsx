"use client";

import Image from "next/image";

function SuccessEmblem() {
  return (
    <svg viewBox="0 0 120 92" aria-hidden="true">
      <g className="laurel laurel-left">
        <path d="M42 69C22 59 15 39 23 19" />
        <path d="M29 57c-9-1-14-6-17-12 8-1 14 3 17 12Zm-5-14c-7-4-10-10-10-16 8 2 12 8 10 16Zm2-15c-5-6-5-12-3-18 7 5 9 11 3 18Zm7-11c-2-7 0-12 4-17 5 7 4 13-4 17Z" />
      </g>
      <g className="laurel laurel-right">
        <path d="M78 69c20-10 27-30 19-50" />
        <path d="M91 57c9-1 14-6 17-12-8-1-14 3-17 12Zm5-14c7-4 10-10 10-16-8 2-12 8-10 16Zm-2-15c5-6 5-12 3-18-7 5-9 11-3 18Zm-7-11c2-7 0-12-4-17-5 7-4 13 4 17Z" />
      </g>
      <path className="emblem-star" d="m60 12 8.2 16.6 18.3 2.7-13.3 12.9 3.2 18.2L60 53.8 43.6 62.4l3.2-18.2-13.3-12.9 18.3-2.7L60 12Z" />
      <path className="emblem-arc" d="M39 72c13 7 29 7 42 0" />
    </svg>
  );
}

function CampusSilhouette() {
  return (
    <svg viewBox="0 0 620 430" aria-hidden="true">
      <g fill="currentColor">
        <path d="M244 164h132v23H244zM219 187h182v22H219zM184 209h252v30H184z" />
        <path d="M264 111h92c0 42 34 43 34 76H230c0-33 34-34 34-76Z" />
        <path d="M284 84h52v30h-52zM298 54h24v31h-24zM305 30h10v25h-10z" />
        <path d="M87 238h446v27H87zM48 265h524v34H48zM18 299h584v21H18zM0 320h620v77H0z" />
        <path d="M77 213h80v27H77zM463 213h80v27h-80zM97 186h40v28H97zM483 186h40v28h-40z" />
      </g>
      <g className="campus-windows" fill="currentColor" opacity="0.24">
        {Array.from({ length: 11 }).map((_, index) => (
          <rect key={`top-${index}`} x={62 + index * 48} y="276" width="17" height="29" rx="2" />
        ))}
        {Array.from({ length: 13 }).map((_, index) => (
          <rect key={`bottom-${index}`} x={21 + index * 47} y="337" width="19" height="38" rx="2" />
        ))}
        <rect x="276" y="223" width="18" height="28" rx="2" />
        <rect x="326" y="223" width="18" height="28" rx="2" />
      </g>
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 8h18v9c0 7-4 12-9 12s-9-5-9-12V8Z" />
      <path d="M15 12H8v3c0 6 3 9 9 9M33 12h7v3c0 6-3 9-9 9M24 29v7M17 40h14M20 36h8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 5 39 11v11c0 10-6 17-15 21C15 39 9 32 9 22V11l15-6Z" />
      <path d="m17 23 5 5 10-11" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="achievement-hero" aria-labelledby="hero-heading">
      <div className="ambient-glow ambient-glow-left" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-right" aria-hidden="true" />

      <div className="achievement-wrap animate-fade-up delay-100">
        <article className="achievement-poster">
          <div className="poster-surface" aria-hidden="true" />
          <div className="top-gold-slash" aria-hidden="true" />

          <div className="success-ribbon">
            <div className="ribbon-inner">
              <SuccessEmblem />
              <span>Success</span>
              <span>Story</span>
            </div>
          </div>

          <div className="student-heading">
            <h1 id="hero-heading">
              <span>Samruddhi</span>
              <span>Lokhande</span>
            </h1>
          </div>

          <div className="heading-divider" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>

          <div className="attempt-line">
            <span className="attempt-star" aria-hidden="true">★</span>
            <p>1st Attempt (Fresher)</p>
          </div>

          <div className="aiims-plaque">
            <span className="plaque-shine" aria-hidden="true" />
            <strong>AIIMS</strong>
            <div className="plaque-city">
              <span />
              <b>Nagpur</b>
              <span />
            </div>
          </div>

          <div className="portrait-zone">
            <div className="portrait-blueprint" aria-hidden="true">
              <CampusSilhouette />
            </div>
            <div className="portrait-dots" aria-hidden="true" />
            <Image
              src="/images/results/2025/SamruddhiLokhande.png"
              width={454}
              height={457}
              sizes="(max-width: 720px) 92vw, 46vw"
              loading="eager"
              alt="Samruddhi Lokhande, selected at AIIMS Nagpur"
              className="student-portrait"
            />
          </div>

          <div className="corner-waves" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="recognition-strip">
            <div className="trophy-seal">
              <TrophyIcon />
            </div>
            <div className="recognition-copy">
              <strong>Dedication. Discipline. Destination.</strong>
              <span>We celebrate your success.</span>
            </div>
            <div className="proud-moment">
              <span>Proud Moment</span>
              <ShieldIcon />
            </div>
          </div>
        </article>
      </div>

      <style jsx>{`
        .achievement-hero {
          --poster-navy: #03285d;
          --deep-navy: #021d47;
          --royal-blue: #0e58b5;
          --gold: #f4bf35;
          --gold-light: #ffe487;
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 100svh;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 106px 2vw 24px;
          background:
            linear-gradient(to bottom, #f8fafc 0, #f8fafc 80px, transparent 80px),
            radial-gradient(circle at 52% 10%, #0a4385 0, #042b60 30%, #021c43 72%, #011632 100%);
          isolation: isolate;
        }

        .achievement-hero::before {
          content: "";
          position: absolute;
          inset: 80px 0 0;
          z-index: -2;
          opacity: 0.28;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(circle at center, black, transparent 76%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 76%);
        }

        .achievement-hero::after {
          content: "";
          position: absolute;
          right: 7%;
          bottom: -32%;
          z-index: -1;
          width: 52vw;
          height: 52vw;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          box-shadow: 0 0 0 7vw rgba(255, 255, 255, 0.018), 0 0 0 14vw rgba(255, 255, 255, 0.012);
        }

        .ambient-glow {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .ambient-glow-left {
          bottom: 3%;
          left: 0;
          width: 32vw;
          height: 17vw;
          background: rgba(15, 91, 177, 0.27);
        }

        .ambient-glow-right {
          top: 13%;
          right: 0;
          width: 30vw;
          height: 24vw;
          background: rgba(37, 109, 206, 0.22);
        }

        .achievement-wrap {
          container-type: inline-size;
          width: min(96vw, 2400px, calc((100svh - 130px) * 1.885));
          filter: drop-shadow(0 2.2vw 2.6vw rgba(0, 8, 28, 0.48));
        }

        .achievement-poster {
          position: relative;
          width: 100%;
          aspect-ratio: 1.885 / 1;
          overflow: hidden;
          border: 0.52cqw solid rgba(255, 255, 255, 0.96);
          border-radius: 2.65cqw;
          background: #f8fafc;
          box-shadow:
            inset 0 0 0 0.42cqw rgba(35, 92, 168, 0.42),
            inset 0 0.22cqw 0 rgba(255, 255, 255, 0.9),
            0 0.6cqw 1.2cqw rgba(0, 17, 46, 0.22);
          isolation: isolate;
        }

        .poster-surface {
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            radial-gradient(circle at 43% 34%, #ffffff 0, #ffffff 25%, transparent 48%),
            linear-gradient(112deg, #eef3f8 0%, #ffffff 34%, #f9fafc 56%, #e8eef6 75%, #dbe6f1 100%);
        }

        .poster-surface::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.55;
          background:
            linear-gradient(116deg, transparent 0 55%, rgba(255, 255, 255, 0.86) 55.3% 57%, transparent 57.3%),
            radial-gradient(ellipse at 11% 4%, rgba(8, 63, 127, 0.1), transparent 27%);
        }

        .poster-surface::after {
          content: "";
          position: absolute;
          left: 3.5%;
          top: -21%;
          width: 16%;
          height: 75%;
          transform: rotate(-18deg);
          background: linear-gradient(90deg, transparent, rgba(7, 51, 108, 0.08), transparent);
          filter: blur(1.1cqw);
        }

        .top-gold-slash {
          position: absolute;
          top: -9%;
          right: 31.4%;
          z-index: 1;
          width: 2.1%;
          height: 31%;
          transform: rotate(38deg);
          background: linear-gradient(90deg, #e6a81c, var(--gold-light), #efbb33);
          box-shadow: 0 0 0.6cqw rgba(244, 191, 53, 0.24);
        }

        .success-ribbon {
          position: absolute;
          top: -0.35%;
          left: 4.45%;
          z-index: 9;
          width: 10.8%;
          height: 31.7%;
          padding: 0 0.55%;
          clip-path: polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%);
          background: linear-gradient(90deg, #e2a921, #ffe174 50%, #d99b13);
          filter: drop-shadow(0 0.8cqw 0.62cqw rgba(2, 22, 55, 0.3));
        }

        .ribbon-inner {
          display: flex;
          width: 100%;
          height: 96%;
          flex-direction: column;
          align-items: center;
          padding-top: 19%;
          clip-path: polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%);
          background:
            linear-gradient(90deg, rgba(255, 255, 255, 0.09), transparent 35% 65%, rgba(0, 0, 0, 0.18)),
            linear-gradient(180deg, #073474, #03255a 78%, #021b43);
          box-shadow: inset 0 0 0 0.12cqw rgba(255, 255, 255, 0.18);
        }

        .ribbon-inner :global(svg) {
          width: 68%;
          height: auto;
          margin-bottom: 2%;
          overflow: visible;
        }

        .ribbon-inner :global(.laurel path),
        .ribbon-inner :global(.emblem-arc) {
          fill: var(--gold);
          stroke: var(--gold-light);
          stroke-width: 1.6;
        }

        .ribbon-inner :global(.laurel > path:first-child),
        .ribbon-inner :global(.emblem-arc) {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
        }

        .ribbon-inner :global(.emblem-star) {
          fill: url(#gold);
          fill: var(--gold-light);
          filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
        }

        .ribbon-inner span {
          color: #ffd65a;
          font-size: 1.44cqw;
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: 0.015em;
          text-transform: uppercase;
          text-shadow: 0 0.12cqw 0.2cqw rgba(0, 0, 0, 0.45);
        }

        .student-heading {
          position: absolute;
          top: 10.25%;
          left: 18.1%;
          z-index: 5;
          width: 38.5%;
        }

        .student-heading h1 {
          margin: 0;
          font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
          font-size: 5.35cqw;
          font-weight: 800;
          line-height: 0.91;
          letter-spacing: 0.012em;
          text-transform: uppercase;
        }

        .student-heading h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(180deg, #073a7b 0%, #02245a 72%, #0a3975 100%);
          background-clip: text;
          -webkit-background-clip: text;
          filter: drop-shadow(0 0.12cqw 0 rgba(255, 255, 255, 0.9));
        }

        .heading-divider {
          position: absolute;
          top: 34.2%;
          left: 18.1%;
          z-index: 5;
          display: flex;
          width: 30.5%;
          align-items: center;
          gap: 0.7cqw;
        }

        .heading-divider span {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(2, 38, 89, 0.26));
        }

        .heading-divider span:last-child {
          transform: scaleX(-1);
        }

        .heading-divider i {
          width: 0.58cqw;
          height: 0.58cqw;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 0 0.18cqw rgba(244, 191, 53, 0.13);
        }

        .attempt-line {
          position: absolute;
          top: 37.25%;
          left: 18.1%;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 1.2cqw;
        }

        .attempt-star {
          display: grid;
          width: 3.05cqw;
          height: 3.05cqw;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          color: #06346e;
          background: radial-gradient(circle at 32% 25%, #ffe99c, #f3bc31 63%, #cd8b0e);
          box-shadow: 0 0.35cqw 0.8cqw rgba(140, 93, 4, 0.2);
          font-size: 1.3cqw;
        }

        .attempt-line p {
          margin: 0;
          color: #17191d;
          font-family: "Barlow Condensed", "Arial Narrow", var(--font-sans);
          font-size: 2.4cqw;
          font-weight: 500;
          letter-spacing: 0.005em;
        }

        .aiims-plaque {
          position: absolute;
          top: 48.7%;
          left: 6.3%;
          z-index: 7;
          display: flex;
          width: 47%;
          height: 30.3%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 0.2cqw solid #2366ac;
          border-radius: 1.45cqw;
          background:
            radial-gradient(circle at 85% 15%, rgba(25, 105, 211, 0.76), transparent 36%),
            linear-gradient(135deg, #062b63 0%, #073d84 44%, #0a56af 100%);
          box-shadow:
            0 1.25cqw 1.7cqw rgba(4, 35, 78, 0.28),
            inset 0 0 0 0.1cqw rgba(255, 255, 255, 0.15),
            inset 0 -1.3cqw 2.2cqw rgba(0, 18, 56, 0.24);
        }

        .aiims-plaque::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.14;
          background-image: radial-gradient(rgba(255, 255, 255, 0.8) 0.065cqw, transparent 0.065cqw);
          background-size: 0.85cqw 0.85cqw;
          mask-image: linear-gradient(100deg, transparent 0 52%, black 92%);
          -webkit-mask-image: linear-gradient(100deg, transparent 0 52%, black 92%);
        }

        .aiims-plaque::after {
          content: "";
          position: absolute;
          inset: 0.45cqw;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.05cqw;
          pointer-events: none;
        }

        .plaque-shine {
          position: absolute;
          top: -4%;
          left: 50%;
          width: 18%;
          height: 0.42cqw;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 0.9cqw 0.38cqw rgba(255, 255, 255, 0.72);
        }

        .aiims-plaque strong {
          position: relative;
          z-index: 2;
          color: transparent;
          background: linear-gradient(180deg, #fff2a5 0%, #fbd064 26%, #e5a523 72%, #ffd76c 100%);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: "Barlow Condensed", "Arial Narrow", Impact, sans-serif;
          font-size: 12.6cqw;
          font-weight: 800;
          line-height: 0.76;
          letter-spacing: 0.035em;
          text-shadow: 0 0.35cqw 0.5cqw rgba(0, 0, 0, 0.24);
          filter: drop-shadow(0 0.08cqw 0 rgba(255, 255, 255, 0.45));
          transform: scaleX(1.28);
        }

        .plaque-city {
          position: relative;
          z-index: 2;
          display: flex;
          width: 72%;
          align-items: center;
          justify-content: center;
          gap: 1.5cqw;
          margin-top: 1.3cqw;
        }

        .plaque-city span {
          height: 0.13cqw;
          flex: 1;
          background: linear-gradient(90deg, transparent, #e9b13a);
        }

        .plaque-city span:last-child {
          transform: scaleX(-1);
        }

        .plaque-city b {
          color: #fff;
          font-size: 2.55cqw;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          text-shadow: 0 0.2cqw 0.25cqw rgba(0, 0, 0, 0.3);
        }

        .portrait-zone {
          position: absolute;
          top: -1.5%;
          right: -1.1%;
          z-index: 4;
          width: 46.5%;
          height: 89.5%;
          overflow: hidden;
          border-left: 1.15cqw solid var(--gold);
          border-radius: 52% 0 0 47% / 52% 0 0 48%;
          background:
            radial-gradient(circle at 52% 28%, rgba(61, 139, 230, 0.72), transparent 38%),
            linear-gradient(140deg, #0b60be 0%, #084896 42%, #032b66 100%);
          box-shadow:
            -1.35cqw 0 0 #ffffff,
            -1.75cqw 0.4cqw 1.15cqw rgba(3, 35, 76, 0.13),
            inset 0.25cqw 0 0 rgba(255, 255, 255, 0.18);
          isolation: isolate;
        }

        .portrait-zone::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 22%),
            radial-gradient(circle at 82% 53%, transparent 0 31%, rgba(255, 255, 255, 0.025) 31.3% 31.8%, transparent 32.1%);
        }

        .portrait-zone::after {
          content: "";
          position: absolute;
          right: -8%;
          bottom: -4%;
          z-index: 6;
          width: 44%;
          height: 10%;
          transform: rotate(-12deg);
          transform-origin: right bottom;
          background: linear-gradient(90deg, #d79a13, #ffe27a, #e6a622);
          clip-path: polygon(0 45%, 100% 0, 100% 100%, 10% 100%);
        }

        .portrait-blueprint {
          position: absolute;
          top: 13%;
          left: 1%;
          z-index: -1;
          width: 78%;
          color: #021f4b;
          opacity: 0.13;
          filter: blur(0.12cqw);
        }

        .portrait-blueprint :global(svg) {
          width: 100%;
          height: auto;
        }

        .portrait-dots {
          position: absolute;
          right: -4%;
          bottom: 17%;
          z-index: 1;
          width: 27%;
          height: 33%;
          opacity: 0.22;
          transform: rotate(-8deg);
          background-image: radial-gradient(#8ac4ff 0.15cqw, transparent 0.16cqw);
          background-size: 1.05cqw 1.05cqw;
          mask-image: radial-gradient(ellipse, black 30%, transparent 72%);
          -webkit-mask-image: radial-gradient(ellipse, black 30%, transparent 72%);
        }

        .portrait-zone :global(.student-portrait) {
          position: absolute;
          right: -0.5%;
          bottom: -0.4%;
          z-index: 4;
          width: 88%;
          height: 95%;
          object-fit: contain;
          object-position: right bottom;
          filter: drop-shadow(-0.65cqw 0.8cqw 0.7cqw rgba(0, 12, 40, 0.3));
        }

        .corner-waves {
          position: absolute;
          bottom: 11.5%;
          left: -1%;
          z-index: 6;
          width: 12%;
          height: 8%;
          overflow: hidden;
        }

        .corner-waves span {
          position: absolute;
          bottom: -57%;
          left: -9%;
          width: 120%;
          aspect-ratio: 1;
          border: 0.13cqw solid rgba(52, 105, 164, 0.22);
          border-radius: 50%;
        }

        .corner-waves span:nth-child(2) {
          bottom: -74%;
          left: -3%;
        }

        .corner-waves span:nth-child(3) {
          bottom: -91%;
          left: 3%;
        }

        .recognition-strip {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 12;
          display: flex;
          height: 12.4%;
          align-items: center;
          background:
            linear-gradient(110deg, rgba(232, 239, 247, 0.95), #ffffff 33%, #f2f5f8 67%, #ffffff 100%);
          border-top: 0.12cqw solid rgba(15, 62, 116, 0.08);
          box-shadow: 0 -0.5cqw 1.4cqw rgba(17, 62, 113, 0.08);
        }

        .trophy-seal {
          display: grid;
          width: 5.35cqw;
          height: 5.35cqw;
          margin-left: 4.25%;
          flex: 0 0 auto;
          place-items: center;
          border: 0.11cqw solid #eeb634;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.72);
        }

        .trophy-seal :global(svg) {
          width: 2.65cqw;
          height: 2.65cqw;
          fill: rgba(244, 191, 53, 0.12);
          stroke: #e7ab21;
          stroke-width: 2.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .recognition-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          height: 52%;
          margin-left: 1.55%;
          padding-left: 1.7%;
          border-left: 1px solid rgba(4, 42, 91, 0.22);
          text-transform: uppercase;
        }

        .recognition-copy strong {
          color: #052d68;
          font-family: "Barlow Condensed", "Arial Narrow", var(--font-sans);
          font-size: 1.23cqw;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: 0.08em;
        }

        .recognition-copy span {
          margin-top: 0.35cqw;
          color: #738197;
          font-size: 1.03cqw;
          font-weight: 500;
          line-height: 1;
          letter-spacing: 0.11em;
        }

        .proud-moment {
          position: absolute;
          top: -0.05cqw;
          right: 0;
          bottom: 0;
          display: flex;
          width: 22%;
          align-items: center;
          justify-content: center;
          gap: 1.2cqw;
          clip-path: polygon(12% 0, 100% 0, 100% 100%, 0 100%);
          background:
            linear-gradient(115deg, rgba(255, 255, 255, 0.22), transparent 37%),
            linear-gradient(135deg, #d99b17, #f4c140 55%, #d99b18);
          box-shadow: inset 0 0.16cqw 0 rgba(255, 255, 255, 0.42);
        }

        .proud-moment::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.7) 50%, transparent 52%);
          background-size: 3.5cqw 3.5cqw;
        }

        .proud-moment span {
          position: relative;
          z-index: 1;
          color: #052c65;
          font-family: "Barlow Condensed", "Arial Narrow", var(--font-sans);
          font-size: 1.55cqw;
          font-style: italic;
          font-weight: 800;
          letter-spacing: 0.055em;
          text-transform: uppercase;
        }

        .proud-moment :global(svg) {
          position: relative;
          z-index: 1;
          width: 2.25cqw;
          height: 2.25cqw;
          fill: none;
          stroke: #052f6c;
          stroke-width: 2.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @media (max-width: 720px) {
          .achievement-hero {
            min-height: auto;
            padding: 100px 0.75rem 2.25rem;
          }

          .achievement-wrap {
            width: min(100%, 430px);
            filter: drop-shadow(0 1.5rem 1.6rem rgba(0, 8, 28, 0.5));
          }

          .achievement-poster {
            min-height: 760px;
            aspect-ratio: auto;
            border-width: 4px;
            border-radius: 26px;
            box-shadow: inset 0 0 0 3px rgba(35, 92, 168, 0.42), 0 10px 20px rgba(0, 17, 46, 0.22);
          }

          .poster-surface {
            background:
              radial-gradient(circle at 48% 16%, #ffffff 0, #ffffff 17%, transparent 42%),
              linear-gradient(155deg, #edf3f8 0%, #fff 36%, #eef3f8 70%, #dfe8f2 100%);
          }

          .top-gold-slash {
            top: 8%;
            right: -2%;
            width: 7px;
            height: 30%;
            transform: rotate(17deg);
          }

          .success-ribbon {
            top: 0;
            left: 19px;
            width: 88px;
            height: 177px;
            padding: 0 4px;
            filter: drop-shadow(0 7px 7px rgba(2, 22, 55, 0.28));
          }

          .ribbon-inner {
            padding-top: 17px;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
          }

          .ribbon-inner :global(svg) {
            width: 64px;
          }

          .ribbon-inner span {
            font-size: 15px;
          }

          .student-heading {
            top: 53px;
            left: 124px;
            width: calc(100% - 140px);
          }

          .student-heading h1 {
            font-size: clamp(38px, 11.2vw, 48px);
            line-height: 0.9;
          }

          .heading-divider {
            top: 143px;
            left: 123px;
            width: calc(100% - 150px);
            gap: 7px;
          }

          .heading-divider i {
            width: 6px;
            height: 6px;
          }

          .attempt-line {
            top: 158px;
            left: 121px;
            gap: 8px;
          }

          .attempt-star {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .attempt-line p {
            font-size: clamp(19px, 5.3vw, 23px);
          }

          .portrait-zone {
            top: 202px;
            right: -58px;
            width: 390px;
            height: 370px;
            border-left-width: 9px;
            border-radius: 50% 0 0 48% / 50% 0 0 48%;
            box-shadow: -10px 0 0 #fff, -14px 3px 10px rgba(3, 35, 76, 0.13);
          }

          .portrait-dots {
            background-image: radial-gradient(#8ac4ff 1.5px, transparent 1.6px);
            background-size: 10px 10px;
          }

          .portrait-zone :global(.student-portrait) {
            right: 1%;
            width: 88%;
            height: 96%;
          }

          .aiims-plaque {
            top: 520px;
            left: 18px;
            width: calc(100% - 36px);
            height: 148px;
            border-width: 2px;
            border-radius: 15px;
            box-shadow: 0 13px 20px rgba(4, 35, 78, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.15);
          }

          .aiims-plaque::after {
            inset: 5px;
            border-radius: 10px;
          }

          .plaque-shine {
            height: 4px;
            box-shadow: 0 0 9px 4px rgba(255, 255, 255, 0.72);
          }

          .aiims-plaque strong {
            font-size: 94px;
            line-height: 0.74;
          }

          .plaque-city {
            gap: 14px;
            margin-top: 14px;
          }

          .plaque-city span {
            height: 2px;
          }

          .plaque-city b {
            font-size: 24px;
          }

          .corner-waves {
            bottom: 80px;
            width: 108px;
            height: 60px;
          }

          .corner-waves span {
            border-width: 1px;
          }

          .recognition-strip {
            height: 84px;
            border-top-width: 1px;
          }

          .trophy-seal {
            width: 48px;
            height: 48px;
            margin-left: 12px;
            border-width: 1px;
          }

          .trophy-seal :global(svg) {
            width: 26px;
            height: 26px;
          }

          .recognition-copy {
            width: 43%;
            margin-left: 8px;
            padding-left: 8px;
          }

          .recognition-copy strong {
            font-size: 10px;
            line-height: 1.2;
          }

          .recognition-copy span {
            margin-top: 4px;
            font-size: 8px;
          }

          .proud-moment {
            width: 42%;
            gap: 8px;
          }

          .proud-moment span {
            font-size: 16px;
          }

          .proud-moment :global(svg) {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 385px) {
          .achievement-poster {
            min-height: 720px;
          }

          .student-heading {
            left: 116px;
            width: calc(100% - 128px);
          }

          .student-heading h1 {
            font-size: 37px;
          }

          .heading-divider {
            left: 115px;
            width: calc(100% - 136px);
          }

          .attempt-line {
            left: 113px;
          }

          .attempt-line p {
            font-size: 18px;
          }

          .portrait-zone {
            top: 198px;
            right: -68px;
            width: 365px;
            height: 346px;
          }

          .aiims-plaque {
            top: 495px;
            height: 142px;
          }

          .aiims-plaque strong {
            font-size: 84px;
          }

          .recognition-strip {
            height: 80px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .achievement-wrap {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

import {
  FaTrophy,
  FaHospital,
  FaBrain,
  FaUserGroup,
  FaChartLine,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

const proofPoints = [
  {
    id: 1,
    title: "AIR 5",
    description: (
      <EditableText contentKey="why.capsule.1.desc" kind="multiline" label="capsule 1 description">
        {`NEET 2026\nAll India Girls Topper\nMaharashtra Girls Rank 1`}
      </EditableText>
    ),
    icon: <FaTrophy />,
  },
  {
    id: 2,
    title: "AIR 26",
    description: (
      <EditableText contentKey="why.capsule.2.desc" kind="multiline" label="capsule 2 description">
        Outstanding NEET 2025 performance reflecting our dedication and expertise.
      </EditableText>
    ),
    icon: <FaTrophy />,
  },
  {
    id: 4,
    title: "Best Selection Ratio",
    description: (
      <EditableText contentKey="why.capsule.4.desc" kind="multiline" label="capsule 4 description">
        In 2025 – 36+ students got selected for MBBS in Government Medical Colleges.
      </EditableText>
    ),
    icon: <FaHospital />,
  },
];

const learningPath = [
  {
    id: 5,
    title: "Concept-Based Learning",
    description: (
      <EditableText contentKey="why.capsule.5.desc" kind="multiline" label="capsule 5 description">
        Strong conceptual foundation before problem-solving for long-term understanding.
      </EditableText>
    ),
    icon: <FaBrain />,
  },
  {
    id: 6,
    title: "Personalized Mentorship",
    description: (
      <EditableText contentKey="why.capsule.6.desc" kind="multiline" label="capsule 6 description">
        Individual attention, doubt solving, progress tracking and confidence-building guidance.
      </EditableText>
    ),
    icon: <FaUserGroup />,
  },
  {
    id: 7,
    title: "Regular Tests & Analysis",
    description: (
      <EditableText contentKey="why.capsule.7.desc" kind="multiline" label="capsule 7 description">
        NEET pattern tests with detailed performance analysis to improve accuracy and confidence.
      </EditableText>
    ),
    icon: <FaChartLine />,
  },
  {
    id: 8,
    title: "Experienced Faculty",
    description: (
      <EditableText contentKey="why.capsule.8.desc" kind="multiline" label="capsule 8 description">
        Passionate and experienced mentors focused on your success at every step.
      </EditableText>
    ),
    icon: <FaGraduationCap />,
  },
  {
    id: 9,
    title: "Student-First Environment",
    description: (
      <EditableText contentKey="why.capsule.9.desc" kind="multiline" label="capsule 9 description">
        A disciplined, motivating and supportive atmosphere where every dream matters.
      </EditableText>
    ),
    icon: <FaHeart />,
  },
];

export default function WhySCA() {
  return (
    <section className="why-sca-section">
      <div className="container">
        <div className="section-header">
          <h2 className="header-title">
            <EditableText contentKey="why.heading" label="why SCA heading">
              Why Success Code Academy?
            </EditableText>
          </h2>
          <p className="header-subtitle">
            <EditableText contentKey="why.description" label="why SCA introduction">
              Conceptual Learning. Personalized Mentorship. Proven Results.
            </EditableText>
          </p>
        </div>

        <div className="why-story-content">
          <div className="why-proof-list">
            {proofPoints.map((point) => (
              <article className="why-proof-point" key={point.id}>
                <span className="why-proof-icon" aria-hidden="true">{point.icon}</span>
                <div>
                  <h3>
                    <EditableText
                      contentKey={`why.feature-${point.id}.title`}
                      label={`${point.title} feature title`}
                      showInlineControls={false}
                    >
                      {point.title}
                    </EditableText>
                  </h3>
                  <div className="why-proof-description">{point.description}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="why-learning-list">
            {learningPath.map((point) => (
              <article className="why-learning-point" key={point.id}>
                <span className="why-learning-icon" aria-hidden="true">{point.icon}</span>
                <div>
                  <h3>
                    <EditableText
                      contentKey={`why.feature-${point.id}.title`}
                      label={`${point.title} feature title`}
                      showInlineControls={false}
                    >
                      {point.title}
                    </EditableText>
                  </h3>
                  <div className="why-learning-description">{point.description}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Industry Risk Scores (0–100) ────────────────────────────────────────────

export const INDUSTRY_RISK: Record<string, number> = {
  // High risk
  "Media & Publishing": 82,
  "EdTech": 78,
  "Crypto & Web3": 85,
  "Gaming": 72,
  "AdTech": 75,
  "Retail Tech": 70,
  "Social Media": 74,
  "Travel Tech": 68,
  "Real Estate Tech": 72,
  "Ride-sharing & Mobility": 65,
  // Medium-high
  "Software / SaaS": 58,
  "FinTech": 60,
  "E-commerce": 62,
  "Telecom": 55,
  "IT Services / Outsourcing": 52,
  "Consulting": 50,
  "Manufacturing": 48,
  "Logistics & Supply Chain": 52,
  "Retail": 60,
  "Consumer Electronics": 55,
  "Semiconductor": 45,
  "Aerospace & Defence": 35,
  // Medium
  "Banking & Finance": 45,
  "Insurance": 40,
  "Automotive": 48,
  "Energy & Utilities": 38,
  "Chemical": 35,
  "Agriculture Tech": 42,
  "Food & Beverage": 38,
  "Hospitality & Travel": 55,
  "Marketing & PR": 58,
  "Legal Tech": 50,
  "HR Tech": 55,
  "Cybersecurity": 28,
  "Cloud Infrastructure": 30,
  // Low-medium
  "Healthcare Tech": 35,
  "Pharma & Biotech": 30,
  "Medical Devices": 32,
  "AI / Machine Learning": 38,
  "Data & Analytics": 35,
  "DevOps & Infrastructure": 28,
  "Robotics": 40,
  "SpaceTech": 42,
  "CleanTech & Sustainability": 38,
  "Government & Public Sector": 15,
  // Low risk
  "Healthcare (Clinical)": 18,
  "Education (Traditional)": 15,
  "Defence & Military": 10,
  "Utilities & Power": 20,
  "Construction": 30,
  "Research & Academia": 18,
  "Non-Profit": 22,
};

// ─── Department Risk Scores (0–100) ──────────────────────────────────────────

export const DEPARTMENT_RISK: Record<string, number> = {
  "Recruiting / Talent Acquisition": 88,
  "HR / People Operations": 70,
  "Marketing": 72,
  "Sales (Inside)": 65,
  "Sales (Enterprise / Field)": 52,
  "Customer Support": 75,
  "Operations": 60,
  "Finance & Accounting": 50,
  "Legal & Compliance": 42,
  "Product Management": 55,
  "Engineering / Software Dev": 40,
  "DevOps / Infrastructure": 35,
  "Data Science & ML": 38,
  "Data Engineering": 36,
  "Security / InfoSec": 28,
  "Research & Development": 35,
  "Design / UX": 60,
  "Content & Editorial": 78,
  "Public Relations / Communications": 72,
  "Business Development": 58,
  "Strategy & Consulting (internal)": 55,
  "Supply Chain & Logistics": 50,
  "Manufacturing / Production": 45,
  "Quality Assurance (QA)": 55,
  "IT Support / Helpdesk": 65,
  "Program / Project Management": 52,
  "Analytics & Business Intelligence": 42,
  "Admin / Executive Support": 68,
  "Real Estate / Facilities": 65,
  "Diversity, Equity & Inclusion": 80,
  "Corporate Social Responsibility": 78,
  "Learning & Development": 72,
};

// ─── AI Automation Risk by Role (0–100) ──────────────────────────────────────

export const AI_ROLE_RISK: Record<string, { score: number; reason: string }> = {
  "Data Entry Operator":        { score: 95, reason: "Highly automatable with OCR and AI parsing tools." },
  "Customer Support Executive": { score: 85, reason: "LLM-based chatbots handle most tier-1 support." },
  "Content Writer":             { score: 78, reason: "Generative AI can produce drafts at scale." },
  "Graphic Designer":           { score: 65, reason: "AI image tools automate routine design work." },
  "Accountant":                 { score: 70, reason: "AI handles bookkeeping, reconciliation, and reports." },
  "HR Executive":               { score: 68, reason: "ATS, screening, and onboarding increasingly automated." },
  "Recruiter":                  { score: 80, reason: "AI sourcing, screening, and scheduling tools reduce need." },
  "Social Media Manager":       { score: 72, reason: "AI handles scheduling, copy, and basic analytics." },
  "Translator / Interpreter":   { score: 82, reason: "LLMs handle most routine translation tasks." },
  "Legal Researcher":           { score: 70, reason: "AI can scan case law and summarise documents quickly." },
  "Financial Analyst":          { score: 60, reason: "AI handles modelling and data analysis; judgment still needed." },
  "Business Analyst":           { score: 58, reason: "AI assists with requirements but stakeholder work remains." },
  "Data Analyst":               { score: 62, reason: "AI tools accelerate analysis; interpretation roles remain." },
  "Data Scientist":             { score: 45, reason: "Complex modelling and strategy less automatable." },
  "Data Engineer":              { score: 35, reason: "Pipeline design and architecture still require humans." },
  "ML Engineer":                { score: 30, reason: "Training, fine-tuning, and deployment expertise is scarce." },
  "AI Engineer":                { score: 25, reason: "Building AI systems is in high demand globally." },
  "Software Engineer":          { score: 38, reason: "Copilots assist but architecture and review still human." },
  "Frontend Developer":         { score: 50, reason: "AI generates UI code; complex UX still needs humans." },
  "Backend Developer":          { score: 35, reason: "System design and performance tuning remain manual." },
  "Full Stack Developer":       { score: 40, reason: "Mix of automatable and non-automatable tasks." },
  "Mobile Developer":           { score: 38, reason: "Platform-specific nuances limit full automation." },
  "DevOps Engineer":            { score: 30, reason: "Infrastructure as code and reliability still human-led." },
  "Cloud Architect":            { score: 25, reason: "Strategic cloud design is scarce and valued." },
  "Cybersecurity Engineer":     { score: 22, reason: "Threat response and red-teaming require human creativity." },
  "Security Analyst":           { score: 35, reason: "AI monitors threats but triage still needs humans." },
  "Network Engineer":           { score: 40, reason: "SDN reduces some roles; complex infra still manual." },
  "Database Administrator":     { score: 50, reason: "Managed cloud DBs reduce DBA footprint." },
  "QA / Test Engineer":         { score: 60, reason: "AI testing tools automate regression; exploratory testing remains." },
  "Product Manager":            { score: 42, reason: "Customer discovery and strategy less automatable." },
  "Product Designer / UX":      { score: 50, reason: "AI generates mockups; user research still human." },
  "Project Manager":            { score: 55, reason: "AI tools handle scheduling; stakeholder management remains." },
  "Scrum Master":               { score: 60, reason: "Agile ceremonies partially assisted by AI tools." },
  "Solutions Architect":        { score: 28, reason: "Complex enterprise design remains human." },
  "Sales Executive":            { score: 55, reason: "AI handles prospecting; relationship sales remains human." },
  "Account Manager":            { score: 48, reason: "Client relationships still human-led." },
  "Marketing Manager":          { score: 62, reason: "AI handles campaigns; strategy still needs humans." },
  "SEO Specialist":             { score: 68, reason: "AI generates content; technical SEO still human." },
  "Growth Hacker":              { score: 58, reason: "Experimentation still human; execution increasingly AI." },
  "Supply Chain Manager":       { score: 45, reason: "AI optimises routes; disruption response still human." },
  "Operations Manager":         { score: 50, reason: "Workflow optimisation increasingly AI-assisted." },
  "Finance Manager":            { score: 48, reason: "Reporting automated; strategic finance still human." },
  "CFO":                        { score: 18, reason: "Strategic financial leadership rarely replaced." },
  "CTO":                        { score: 15, reason: "Technology vision and leadership not automatable." },
  "CEO":                        { score: 10, reason: "Leadership, vision, and accountability remain human." },
  "General Counsel":            { score: 22, reason: "Legal judgment and strategy not replaceable by AI." },
  "Research Scientist":         { score: 30, reason: "Hypothesis generation and novel research still human." },
  "Medical Doctor":             { score: 20, reason: "Clinical judgment, ethics, and patient trust are human." },
  "Nurse / Healthcare Worker":  { score: 15, reason: "Physical care and empathy cannot be automated." },
  "Teacher / Educator":         { score: 28, reason: "AI assists but mentorship and motivation are human." },
  "Training & L&D Specialist":  { score: 65, reason: "AI delivers training content; design roles remain." },
  "Executive Assistant":        { score: 72, reason: "AI handles scheduling, drafting, and research tasks." },
  "Journalist / Reporter":      { score: 65, reason: "AI writes summaries; investigative journalism remains." },
  "Video Editor":               { score: 60, reason: "AI automates cuts and colour; creative editing remains." },
  "Animator":                   { score: 55, reason: "AI generates assets; direction and storytelling remain." },
  "3D Artist":                  { score: 50, reason: "AI tools assist but complex scene work is human." },
  "Game Developer":             { score: 38, reason: "AI assists asset creation; core development still human." },
  "Embedded Systems Engineer":  { score: 25, reason: "Hardware constraints require specialised human expertise." },
  "Hardware Engineer":          { score: 22, reason: "Physical design and testing require human engineers." },
  "Mechanical Engineer":        { score: 28, reason: "Complex design and prototyping still human-led." },
  "Civil Engineer":             { score: 20, reason: "On-site work and structural judgment not automatable." },
  "Biotech Researcher":         { score: 28, reason: "Lab work and hypothesis testing remain human-driven." },
  "Pharmacist":                 { score: 35, reason: "Dispensing AI exists; patient counselling remains human." },
  "Logistics Coordinator":      { score: 65, reason: "Route planning increasingly AI-handled." },
  "Procurement Manager":        { score: 52, reason: "AI handles sourcing analytics; negotiation remains human." },
  "Risk Manager":               { score: 40, reason: "AI models risk; strategic response still human." },
  "Compliance Officer":         { score: 42, reason: "AI scans for violations; interpretation still human." },
  "Tax Specialist":             { score: 58, reason: "AI handles filing; complex tax strategy remains human." },
  "Auditor":                    { score: 55, reason: "AI automates sampling; judgment and attestation remain human." },
  "Investment Banker":          { score: 38, reason: "Deal structuring and relationships remain human." },
  "Trader / Quant":             { score: 45, reason: "Algorithms automate execution; strategy still human." },
  "Portfolio Manager":          { score: 40, reason: "AI assists analysis; fiduciary judgment remains human." },
  "Actuary":                    { score: 35, reason: "AI models risk; regulatory sign-off still human." },
  "Insurance Underwriter":      { score: 62, reason: "AI underwrites standard policies; complex cases human." },
  "Real Estate Agent":          { score: 55, reason: "AI handles listings; negotiation and trust remain human." },
  "Interior Designer":          { score: 48, reason: "AI generates concepts; client relationships human." },
  "Event Manager":              { score: 45, reason: "Logistics AI-assisted; creativity and execution human." },
  "PR Specialist":              { score: 65, reason: "AI drafts releases; relationship-building still human." },
  "Brand Manager":              { score: 55, reason: "AI handles analytics; brand strategy still human." },
  "Customer Success Manager":   { score: 50, reason: "AI monitors health scores; relationship management human." },
  "Technical Support Engineer": { score: 60, reason: "AI resolves tier-1 issues; complex debugging human." },
  "Solutions Consultant":       { score: 40, reason: "Pre-sales technical work still needs human expertise." },
  "IT Manager":                 { score: 42, reason: "Infrastructure automation reduces some tasks." },
  "ERP Consultant (SAP/Oracle)":{ score: 38, reason: "Specialised knowledge high in demand globally." },
  "Salesforce Developer":       { score: 35, reason: "Platform expertise remains scarce." },
  "Blockchain Developer":       { score: 40, reason: "Niche but AI tooling is still catching up." },
  "AR/VR Developer":            { score: 35, reason: "Emerging field with limited AI automation." },
  "Robotics Engineer":          { score: 25, reason: "Building automation systems still requires humans." },
  "Prompt Engineer":            { score: 50, reason: "Role itself may evolve as models improve." },
  "Other / Not Listed":         { score: 50, reason: "Estimated based on average automation exposure." },
};

// ─── High-demand skills (reduce risk) ────────────────────────────────────────

export const SKILL_DEMAND: Record<string, number> = {
  "AI / LLM Engineering":     -18,
  "Machine Learning":         -15,
  "Cybersecurity":            -14,
  "Cloud (AWS/GCP/Azure)":    -12,
  "Data Engineering":         -12,
  "DevOps / SRE":             -11,
  "Generative AI":            -16,
  "Kubernetes / Docker":      -10,
  "Rust / Go":                -8,
  "SAP / ERP":                -10,
  "Salesforce":               -9,
  "React / Next.js":          -7,
  "TypeScript":               -6,
  "System Design":            -8,
  "Product Strategy":         -7,
  "Data Science / Python":    -9,
  "Healthcare Domain":        -8,
  "Finance / Fintech Domain": -7,
  "Full Stack Development":   -6,
  "No high-demand skills":    +8,
};

// ─── Scoring engine ───────────────────────────────────────────────────────────

export interface LayoffRiskInputs {
  // Company (40%)
  companySize: string;
  fundingStage: string;
  revenueGrowth: string;
  profitability: string;
  stockPerformance: string;
  hiringTrend: string;
  recentLayoffs: string;
  leadershipStability: string;

  // Department (20%)
  department: string;
  teamBudgetTrend: string;
  recentTeamLayoffs: string;

  // Individual (20%)
  tenureYears: string;
  performanceRating: string;
  visibilityToLeadership: string;
  remoteStatus: string;
  hasUniqueDomain: string;

  // AI Risk (10%)
  jobRole: string;
  skillDemand: string;

  // Industry (10%)
  industry: string;
  geographyRisk: string;
}

interface ScoreBreakdown {
  companyScore: number;
  departmentScore: number;
  individualScore: number;
  aiScore: number;
  industryScore: number;
  finalScore: number;
  riskBand: RiskBand;
  topRiskFactors: string[];
  topProtectiveFactors: string[];
}

export interface RiskBand {
  label: string;
  range: string;
  color: string;
  description: string;
  urgency: string;
  actions: string[];
}

export const RISK_BANDS: RiskBand[] = [
  {
    label: "Very Safe",
    range: "0–20",
    color: "#16a34a",
    description: "Your profile shows very low layoff risk. Multiple strong protective factors are in place.",
    urgency: "No immediate action needed",
    actions: ["Keep upskilling in emerging areas", "Maintain strong performance", "Build your network proactively"],
  },
  {
    label: "Low Risk",
    range: "21–40",
    color: "#65a30d",
    description: "Your position is generally stable. Some minor risk factors exist but are not alarming.",
    urgency: "Stay alert but don't panic",
    actions: ["Review your emergency fund (3 months expenses)", "Update your resume annually", "Start learning one in-demand skill"],
  },
  {
    label: "Moderate Risk",
    range: "41–60",
    color: "#d97706",
    description: "Noticeable risk factors present. Worth taking proactive steps now rather than waiting.",
    urgency: "Take proactive steps",
    actions: ["Build 6-month emergency fund", "Actively update resume and LinkedIn", "Start upskilling immediately", "Quietly network with peers in your industry"],
  },
  {
    label: "High Risk",
    range: "61–80",
    color: "#ea580c",
    description: "Multiple high-risk signals detected. Begin job search preparations now.",
    urgency: "Begin job search preparation",
    actions: ["Start active job search", "Build 9-month emergency fund", "Reach out to recruiters", "Identify transferable skills", "Consider role or company switch"],
  },
  {
    label: "Critical Risk",
    range: "81–100",
    color: "#dc2626",
    description: "Severe risk signals. Treat this as an immediate priority.",
    urgency: "Act immediately",
    actions: ["Begin active job applications now", "Secure emergency fund of 12 months", "Contact recruiters this week", "Consider pivoting to adjacent roles or industries", "Consult a career coach"],
  },
];

export function getRiskBand(score: number): RiskBand {
  if (score <= 20) return RISK_BANDS[0];
  if (score <= 40) return RISK_BANDS[1];
  if (score <= 60) return RISK_BANDS[2];
  if (score <= 80) return RISK_BANDS[3];
  return RISK_BANDS[4];
}

// Score maps for inputs
const COMPANY_SIZE_SCORE: Record<string, number> = {
  "1–50 (Startup)": 75, "51–200 (Early)": 65, "201–1000 (Growth)": 50,
  "1001–5000 (Mid)": 40, "5000+ (Enterprise)": 30,
};
const FUNDING_STAGE_SCORE: Record<string, number> = {
  "Bootstrapped / Profitable": 25, "Pre-Seed / Seed": 80, "Series A": 70,
  "Series B": 60, "Series C+": 48, "Pre-IPO": 42, "Public Company": 35, "Government / PSU": 15,
};
const REVENUE_GROWTH_SCORE: Record<string, number> = {
  "Growing >20% YoY": 15, "Growing 5–20% YoY": 28, "Flat (0–5%)": 50,
  "Declining slightly": 72, "Declining significantly": 90,
};
const PROFITABILITY_SCORE: Record<string, number> = {
  "Profitable": 20, "Break-even": 45, "Burning cash but funded": 65, "Burning cash, low runway": 88,
};
const STOCK_SCORE: Record<string, number> = {
  "Not applicable (private)": 50, "Up >20% last 6mo": 18, "Up 0–20%": 30,
  "Down 0–20%": 58, "Down >20%": 80, "Down >40%": 92,
};
const HIRING_TREND_SCORE: Record<string, number> = {
  "Actively hiring": 15, "Selective hiring": 35, "Hiring freeze": 72, "Backfill only": 60,
};
const RECENT_LAYOFFS_SCORE: Record<string, number> = {
  "No layoffs in 2+ years": 10, "Minor layoffs (<5%) last year": 50,
  "Significant layoffs (5–15%) last year": 78, "Major layoffs (>15%) last year": 92,
};
const LEADERSHIP_SCORE: Record<string, number> = {
  "Stable leadership for 2+ years": 20, "Recent C-suite changes": 55,
  "Multiple leaders left recently": 75, "New CEO / major restructuring": 85,
};
const TEAM_BUDGET_SCORE: Record<string, number> = {
  "Budget increasing": 15, "Budget flat": 40, "Budget cut <20%": 68, "Budget cut >20%": 88,
};
const TEAM_LAYOFF_SCORE: Record<string, number> = {
  "No one on my team laid off": 10, "1–2 people laid off": 55, "3+ people laid off": 80,
};
const TENURE_SCORE: Record<string, number> = {
  "<6 months": 78, "6–12 months": 65, "1–2 years": 52, "2–4 years": 40,
  "4–7 years": 30, "7+ years": 22,
};
const PERFORMANCE_SCORE: Record<string, number> = {
  "Top performer / Exceeds expectations": 15, "Meets expectations": 40,
  "Below expectations / PIP": 85, "Not formally reviewed": 50,
};
const VISIBILITY_SCORE: Record<string, number> = {
  "High — known to senior leaders": 20, "Medium — known within team/dept": 40,
  "Low — mostly invisible": 70,
};
const REMOTE_SCORE: Record<string, number> = {
  "Fully in-office (same city as HQ)": 25, "Hybrid (2–3 days office)": 30,
  "Fully remote (same country)": 50, "Fully remote (different country)": 72,
};
const UNIQUE_DOMAIN_SCORE: Record<string, number> = {
  "Yes — I hold unique knowledge or relationships": 15,
  "Somewhat — my work could be done by others with effort": 45,
  "No — my role is fairly replaceable": 72,
};
const GEOGRAPHY_SCORE: Record<string, number> = {
  "US / UK / Europe (Tier 1 market)": 35, "India / Southeast Asia (tech hub)": 42,
  "India / Southeast Asia (non-tech)": 55, "Emerging market": 60, "High-cost city vs remote team": 68,
};

export function calculateLayoffRisk(inputs: LayoffRiskInputs): ScoreBreakdown {
  // ── Company score (average of 8 signals, 0–100) ───────────────────────────
  const companyRaw = [
    COMPANY_SIZE_SCORE[inputs.companySize] ?? 50,
    FUNDING_STAGE_SCORE[inputs.fundingStage] ?? 50,
    REVENUE_GROWTH_SCORE[inputs.revenueGrowth] ?? 50,
    PROFITABILITY_SCORE[inputs.profitability] ?? 50,
    STOCK_SCORE[inputs.stockPerformance] ?? 50,
    HIRING_TREND_SCORE[inputs.hiringTrend] ?? 50,
    RECENT_LAYOFFS_SCORE[inputs.recentLayoffs] ?? 50,
    LEADERSHIP_SCORE[inputs.leadershipStability] ?? 50,
  ];
  const companyScore = companyRaw.reduce((a, b) => a + b, 0) / companyRaw.length;

  // ── Department score ──────────────────────────────────────────────────────
  const deptBase = DEPARTMENT_RISK[inputs.department] ?? 50;
  const deptRaw = [deptBase, TEAM_BUDGET_SCORE[inputs.teamBudgetTrend] ?? 50, TEAM_LAYOFF_SCORE[inputs.recentTeamLayoffs] ?? 10];
  const departmentScore = deptRaw.reduce((a, b) => a + b, 0) / deptRaw.length;

  // ── Individual score ──────────────────────────────────────────────────────
  const indRaw = [
    TENURE_SCORE[inputs.tenureYears] ?? 50,
    PERFORMANCE_SCORE[inputs.performanceRating] ?? 50,
    VISIBILITY_SCORE[inputs.visibilityToLeadership] ?? 50,
    REMOTE_SCORE[inputs.remoteStatus] ?? 50,
    UNIQUE_DOMAIN_SCORE[inputs.hasUniqueDomain] ?? 50,
  ];
  const individualScore = indRaw.reduce((a, b) => a + b, 0) / indRaw.length;

  // ── AI score ──────────────────────────────────────────────────────────────
  const aiBase = AI_ROLE_RISK[inputs.jobRole]?.score ?? 50;
  const skillAdj = SKILL_DEMAND[inputs.skillDemand] ?? 0;
  const aiScore = Math.min(100, Math.max(0, aiBase + skillAdj));

  // ── Industry score ────────────────────────────────────────────────────────
  const indBase = INDUSTRY_RISK[inputs.industry] ?? 50;
  const geoAdj = GEOGRAPHY_SCORE[inputs.geographyRisk] ?? 50;
  const industryScore = (indBase + geoAdj) / 2;

  // ── Weighted final score ──────────────────────────────────────────────────
  const finalScore = Math.round(
    companyScore    * 0.40 +
    departmentScore * 0.20 +
    individualScore * 0.20 +
    aiScore         * 0.10 +
    industryScore   * 0.10
  );

  // ── Risk factors ──────────────────────────────────────────────────────────
  const factors: { label: string; score: number; direction: "risk" | "safe" }[] = [
    { label: "Company recent layoffs",    score: RECENT_LAYOFFS_SCORE[inputs.recentLayoffs] ?? 50,        direction: RECENT_LAYOFFS_SCORE[inputs.recentLayoffs] > 50 ? "risk" : "safe" },
    { label: "Revenue trajectory",       score: REVENUE_GROWTH_SCORE[inputs.revenueGrowth] ?? 50,        direction: REVENUE_GROWTH_SCORE[inputs.revenueGrowth] > 50 ? "risk" : "safe" },
    { label: "Hiring trend",             score: HIRING_TREND_SCORE[inputs.hiringTrend] ?? 50,             direction: HIRING_TREND_SCORE[inputs.hiringTrend] > 50 ? "risk" : "safe" },
    { label: "Team budget",              score: TEAM_BUDGET_SCORE[inputs.teamBudgetTrend] ?? 50,          direction: TEAM_BUDGET_SCORE[inputs.teamBudgetTrend] > 50 ? "risk" : "safe" },
    { label: "Performance rating",       score: PERFORMANCE_SCORE[inputs.performanceRating] ?? 50,        direction: PERFORMANCE_SCORE[inputs.performanceRating] > 50 ? "risk" : "safe" },
    { label: "Job role AI risk",         score: aiBase,                                                    direction: aiBase > 50 ? "risk" : "safe" },
    { label: "Department risk",          score: deptBase,                                                   direction: deptBase > 50 ? "risk" : "safe" },
    { label: "Company profitability",    score: PROFITABILITY_SCORE[inputs.profitability] ?? 50,           direction: PROFITABILITY_SCORE[inputs.profitability] > 50 ? "risk" : "safe" },
    { label: "Leadership stability",     score: LEADERSHIP_SCORE[inputs.leadershipStability] ?? 50,        direction: LEADERSHIP_SCORE[inputs.leadershipStability] > 50 ? "risk" : "safe" },
    { label: "Your tenure",              score: TENURE_SCORE[inputs.tenureYears] ?? 50,                    direction: TENURE_SCORE[inputs.tenureYears] > 50 ? "risk" : "safe" },
    { label: "Unique domain knowledge",  score: UNIQUE_DOMAIN_SCORE[inputs.hasUniqueDomain] ?? 50,         direction: UNIQUE_DOMAIN_SCORE[inputs.hasUniqueDomain] > 50 ? "risk" : "safe" },
    { label: "Visibility to leadership", score: VISIBILITY_SCORE[inputs.visibilityToLeadership] ?? 50,     direction: VISIBILITY_SCORE[inputs.visibilityToLeadership] > 50 ? "risk" : "safe" },
    { label: "Industry outlook",         score: indBase,                                                    direction: indBase > 50 ? "risk" : "safe" },
  ];

  const topRiskFactors = factors
    .filter(f => f.direction === "risk")
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(f => f.label);

  const topProtectiveFactors = factors
    .filter(f => f.direction === "safe")
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map(f => f.label);

  return {
    companyScore: Math.round(companyScore),
    departmentScore: Math.round(departmentScore),
    individualScore: Math.round(individualScore),
    aiScore: Math.round(aiScore),
    industryScore: Math.round(industryScore),
    finalScore: Math.min(100, Math.max(0, finalScore)),
    riskBand: getRiskBand(Math.min(100, Math.max(0, finalScore))),
    topRiskFactors,
    topProtectiveFactors,
  };
}

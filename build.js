const fs = require('fs');
const path = require('path');

// 1. DATA DEFINITIONS
const countries = [
    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan',
    'Ethiopia', 'Somaliland', 'Eritrea', 'Angola', 'Botswana', 'Comoros',
    'Democratic Republic of Congo', 'Eswatini', 'Lesotho', 'Madagascar',
    'Malawi', 'Mauritius', 'Mozambique', 'Namibia', 'Seychelles',
    'South Africa', 'Zambia', 'Zimbabwe'
];

const sectors = [
    { id: 'health', name: 'Health & Public Health', desc: 'Health financing, service cost-benefit analysis, clinical records audits, and disease surveillance M&E.' },
    { id: 'education', name: 'Education & Capacity Building', desc: 'Strategic planning, teacher competency frameworks, and executive leadership for learning institutions.' },
    { id: 'agriculture', name: 'Agriculture & Food Security', desc: 'Climate-resilient value chains, smart farming indicators, and farm yield evaluation systems.' },
    { id: 'wash', name: 'WASH (Water, Sanitation & Hygiene)', desc: 'WASH indicator verification, safely managed water audits, and GIS mapping for informal settlements.' },
    { id: 'energy', name: 'Energy & Environment', desc: 'Clean energy transition frameworks, carbon offsets audit, and environmental risk assessment.' },
    { id: 'finance', name: 'Financial Services & PFM', desc: 'Public financial management reviews, County own-source revenue plans, and devolution economics.' },
    { id: 'technology', name: 'Technology & AI', desc: 'AI governance frameworks, algorithmic risk audits, and data protection compliance.' },
    { id: 'public-admin', name: 'Public Administration', desc: 'County development plans, policy formulation, intergovernmental partnerships, and public participation.' },
    { id: 'climate', name: 'Climate & Disaster Risk', desc: 'Climate threat mapping, disaster risk reduction strategies, and green finance packaging.' },
    { id: 'infrastructure', name: 'Infrastructure & Logistics', desc: 'Project feasibility reviews, expenditure audits, and public-private partnership (PPP) frameworks.' },
    { id: 'urban', name: 'Urban Development', desc: 'Responsive infrastructure planning, urban storytelling, and demographic forecasting models.' },
    { id: 'trade', name: 'Trade & Industry', desc: 'Regional market assessments, trade barriers analysis, and MSME growth policies.' },
    { id: 'tourism', name: 'Tourism & Hospitality', desc: 'Ecotourism policy, sustainable travel frameworks, and county-level marketing strategies.' },
    { id: 'security', name: 'Security & Justice', desc: 'Protective security management frameworks, risk reduction audits, and access to justice evaluations.' },
    { id: 'social-protection', name: 'Social Protection & Welfare', desc: 'Social safety net audits, inclusion frameworks, and marginalized populations support surveys.' }
];

const services = [
    {
        id: 'ai-governance',
        name: 'AI Governance & Responsible Technology',
        badge: 'Flagship Practice',
        summary: 'As AI moves into public services, revenue, health and finance, we help institutions capture the value of AI while managing algorithmic, data protection, bias and rights-related risks lawfully and responsibly.',
        desc: 'We bridge data science algorithms and data protection laws to audit models for explainability, privacy, and compliance.',
        capabilities: [
            { id: 'policy-regulatory-frameworks', name: 'AI Policy & Regulatory Frameworks', desc: 'Drafting national and institutional AI strategies benchmarked to the EU AI Act and local regulations.' },
            { id: 'risk-impact-assessment', name: 'AI Risk & Impact Assessment', desc: 'Algorithmic impact assessments (AIA) measuring data representation bias and ethical vulnerabilities.' },
            { id: 'data-governance-protection', name: 'Data Governance & Protection', desc: 'Aligning model training with the Kenya Data Protection Act 2019 and consent rules.' },
            { id: 'capacity-building', name: 'Responsible AI Capacity Building', desc: 'Equipping boards of directors, assemblies, and regulatory authorities with tech-literacy for AI oversight.' },
            { id: 'assurance-audit', name: 'AI Assurance & Audit', desc: 'Independent audits of vendor models for output explainability, transparency, and safety.' },
            { id: 'public-sector-adoption', name: 'Public-Sector AI Adoption Strategy', desc: 'Constructing adoption roadmaps and risk guardrails for public automation deployments.' }
        ],
        faq: [
            { q: 'What is AI Governance in the public sector?', a: 'AI Governance in the public sector refers to the rules, policies, and safeguards set by governments to ensure automated decision-making and AI tools are used transparently, fairly, and legally.' },
            { q: 'Why are Algorithmic Impact Assessments (AIAs) necessary?', a: 'AIAs are structured reviews carried out before deploying AI systems to identify potential risks related to data privacy, discrimination, security, and compliance, preventing costly legal liabilities.' }
        ]
    },
    {
        id: 'monitoring-evaluation',
        name: 'Monitoring, Evaluation & Indicator Verification',
        badge: 'Core Practice',
        summary: 'Independent results verification, system design, field audits, and impact evaluation for governments and NGOs. Trusted for third-party verification precisely because our evidence is defensible and our advice is honest.',
        desc: 'Our monitoring and evaluation systems ensure full accountability, using GIS mapping, remote sensing, and difference-in-differences models.',
        capabilities: [
            { id: 'system-design', name: 'M&E System Design', desc: 'Creating theory-of-change models, results frameworks, and indicators customized to institutional workflows.' },
            { id: 'third-party-verification', name: 'Third-Party Indicator Verification', desc: 'Field-checking and auditing reported metrics to give development funders and boards absolute confidence.' },
            { id: 'baseline-midline-endline', name: 'Baselines, Mid-lines & End-lines', desc: 'Conducting comprehensive survey metrics across the project lifecycle to trace impact.' },
            { id: 'data-collection-field', name: 'Data Collection & Field Audits', desc: 'Structuring waterpoint audits, household surveys, and customer feedback logs.' },
            { id: 'remote-digital-monitoring', name: 'Remote & Digital Monitoring', desc: 'Triangulating GIS mapping, satellite data, and system logs to track assets at scale.' },
            { id: 'impact-evaluation-designs', name: 'Rigorous Impact Evaluation', desc: 'Applying difference-in-differences, control group comparisons, and statistical modeling to measure programs.' }
        ],
        faq: [
            { q: 'What makes indicator verification independent?', a: 'Independence is achieved by separating the evaluation team from the implementation team, relying on cross-verified primary data, record triangulation, and strict audit methodologies.' },
            { q: 'What is a difference-in-differences design in M&E?', a: 'It is a statistical technique that compares the changes in outcomes over time between a treatment group and a control group, isolating the program impact from external factors.' }
        ]
    },
    {
        id: 'public-finance',
        name: 'Public Finance & Devolution Economics',
        badge: 'Core Practice',
        summary: 'PFM reviews, county own-source revenue mobilization strategies, devolution impact assessments, cost-benefit and cost-effectiveness models for health and social sector financing.',
        desc: 'We support County governments in maximizing local revenues and mapping budgetary spends to devolved functions.',
        capabilities: [
            { id: 'revenue-mobilisation', name: 'County Revenue Mobilisation', desc: 'Formulating strategic frameworks to map and unlock own-source revenues sustainably.' },
            { id: 'pfm-review', name: 'Public Finance and PFM Review', desc: 'Analyzing public expenditure tracks, budgets, and compliance with statutory devolution rules.' },
            { id: 'devolution-impact', name: 'Devolution Impact Assessment', desc: 'Measuring the socioeconomic achievements of devolution across counties against national baselines.' },
            { id: 'cost-benefit-models', name: 'Cost-Benefit & Cost-Effectiveness', desc: 'Calculating benefit-to-cost ratios to prioritize capital projects and prove value for money.' },
            { id: 'health-social-financing', name: 'Health & Social Sector Financing', desc: 'Financing analysis, out-of-pocket costs modeling, and pooled financing design for local health.' },
            { id: 'economic-business-cases', name: 'Economic & Business Cases', desc: 'Building defensible investment business cases that quantify social and fiscal outcomes.' }
        ],
        faq: [
            { q: 'How does Policy Oracle assist counties with own-source revenue (OSR)?', a: 'We identify systemic leakages, design modern digital licensing frameworks, map taxable bases, and propose legal reforms to expand county revenue capacities.' },
            { q: 'What is a Public Financial Management (PFM) review?', a: 'A PFM review assesses how public funds are planned, budgeted, spent, and audited, ensuring efficiency, transparency, and statutory compliance.' }
        ]
    },
    {
        id: 'social-policy',
        name: 'Public & Social Policy Design',
        badge: 'Specialised Practice',
        summary: 'Rigorous policy and social-sector analysis for county governments and development partners, creating human-centred, practical policy roadmaps.',
        desc: 'We develop social policies that address the complex needs of modern societies, placing people at the center of development.',
        capabilities: [
            { id: 'needs-assessment', name: 'Needs Assessment & Diagnostics', desc: 'Running diagnostic baseline surveys to understand community challenges.' },
            { id: 'human-centred-design', name: 'Human-Centred Solutions Design', desc: 'Applying design thinking to social strategies so they align with citizen behavior.' },
            { id: 'evidence-policy', name: 'Evidence-Based Formulation', desc: 'Translating quantitative data trends into legislation and action policies.' },
            { id: 'priority-roadmapping', name: 'Priority Mapping & Action Plans', desc: 'Sequencing policy objectives into practical, costed institutional plans.' },
            { id: 'policy-impact', name: 'Policy Impact Assessment', desc: 'Conducting ex-ante and ex-post evaluations of social welfare policies.' }
        ],
        faq: [
            { q: 'What is human-centred policy design?', a: 'It is a policy-making approach that centers the lived experiences of citizens, using qualitative field research and feedback loops to ensure policies solve actual user problems.' },
            { q: 'Why are ex-ante policy assessments valuable?', a: 'They model the potential effects, costs, and risks of a policy before it is enacted, helping decision-makers adjust designs to optimize outcomes.' }
        ]
    },
    {
        id: 'research-capacity',
        name: 'Research & Capacity Building',
        badge: 'Specialised Practice',
        summary: 'Establishing parameter definition for development, macro-economic forecasting, data modeling, competitive intelligence, and advanced analytical dashboard integrations.',
        desc: 'We help institutions build robust evidence bases and develop the analytical skills required to defend strategic decisions.',
        capabilities: [
            { id: 'parameter-identification', name: 'Development Parameter Definition', desc: 'Solidifying baseline indicators to guide long-term strategic plans and regional integration across East Africa and SADCC.' },
            { id: 'data-analytics-modeling', name: 'Analytical Modeling & Dashboards', desc: 'Deploying custom dashboards and business intelligence tools for real-time visualization of policy outcomes.' },
            { id: 'macroeconomic-forecasting', name: 'Macro-Economic Forecasting', desc: 'Modeling market trends, inflation risks, and financial indicators to guide strategy across African economies.' },
            { id: 'competitive-intelligence', name: 'Competitive Intelligence', desc: 'Investigating industry shifts, organizational benchmarks, and growth drivers in emerging markets.' },
            { id: 'policy-briefs', name: 'Policy Briefs & Whitepapers', desc: 'Drafting authoritative policy briefs and whitepapers to influence legislative agendas and public discourse.' },
            { id: 'market-entry-feasibility', name: 'Market Entry & Feasibility', desc: 'Providing rigorous feasibility studies for international organizations entering regional markets.' },
            { id: 'demographic-polling', name: 'Demographic Polling & Surveys', desc: 'Executing large-scale demographic surveys to capture real-time citizen sentiment.' }
],
        faq: [
            { q: 'How does Policy Oracle approach capacity building?', a: 'We embed skill transfer into every project: rather than delivering a static report, we train client teams on the data models, dashboards, and analytical systems we construct.' },
            { q: 'What is macroeconomic forecasting used for?', a: 'It helps organizations model how variables like inflation, tax changes, and economic growth in Kenya will impact budgets, yields, and operating costs.' }
        ]
    },
    {
        id: 'policy-research',
        name: 'Policy Research, Analysis & Review',
        badge: 'Specialised Practice',
        summary: 'Evaluating existing policy, facilitating public partnerships, conducting polling/surveys, and designing inclusion frameworks for overlooked populations.',
        desc: 'We run comprehensive reviews of existing policies to evaluate gaps, align outcomes, and suggest improvements.',
        capabilities: [
            { id: 'policy-eval', name: 'Policy Evaluation', desc: 'Analyzing the actual outcomes and social feedback of current policies.' },
            { id: 'policy-review-trends', name: 'Policy Review & Trend Analysis', desc: 'Benchmarking frameworks against regional guidelines and global trends.' },
            { id: 'strategic-comms', name: 'Strategic Policy Communications', desc: 'Formulating clear public communications, briefings, and media messages.' },
            { id: 'partnerships-coalitions', name: 'Partnerships & Public Coalitions', desc: 'Facilitating collaboration across public sectors, academia, and private entities.' },
            { id: 'overlooked-populations', name: 'Inclusion Frameworks', desc: 'Designing policy components to address the needs of marginalized and underserved groups.' },
            { id: 'surveys-polling', name: 'Public Polling & Surveys', desc: 'Gauging citizen sentiments and policy priorities through structured survey designs.' }
        ],
        faq: [
            { q: 'Why is public participation key to policy analysis?', a: 'Public participation is a constitutional requirement in Kenya that gathers diverse perspectives, improves policy legitimacy, and ensures designs are contextually sound.' },
            { q: 'How do you target overlooked populations in research?', a: 'We employ disaggregated sampling, focused qualitative sessions, and local language surveys to capture inputs from disabled, rural, and economically vulnerable citizens.' }
        ]
    },
    {
        id: 'knowledge-management',
        name: 'Knowledge Management',
        badge: 'Specialised Practice',
        summary: 'AI-enabled knowledge storage and procedures onboarding, mitigating institutional memory loss during key personnel transitions.',
        desc: 'We organize, digitize, and secure institutional memory using modern AI tools and structured pedagogical frameworks.',
        capabilities: [
            { id: 'knowledge-organization', name: 'Pedagogical Organization', desc: 'Standardizing templates, manuals, playbooks, and ecosystems for easy documentation.' },
            { id: 'ai-km-systems', name: 'AI-Enabled KM Systems', desc: 'Deploying cognitive KM search, retrieval, and de-risking portals.' },
            { id: 'strategy-ecosystem', name: 'KM Strategy & Process Design', desc: 'designing onboarding, technology management, and archiving rules.' },
            { id: 'capability-continuity', name: 'Continuity & Transition Planning', desc: 'Building staff habits for information sharing and mitigating key-person transitions.' }
        ],
        faq: [
            { q: 'How does AI improve knowledge management?', a: 'AI enables natural-language search over thousands of PDFs, auto-extracts summaries, tags metadata, and builds intelligent FAQs from unstructured manuals.' },
            { q: 'What is institutional memory de-risking?', a: 'It is the process of mapping and documenting critical tasks performed by senior staff, ensuring operational knowledge is not lost when individuals leave.' }
        ]
    },
    {
        id: 'climate-policy',
        name: 'Climate Policy & Governance',
        badge: 'Specialised Practice',
        summary: 'Integrating climate threat variables across government planning, disaster mitigation plans, risk management frameworks and resiliency training.',
        desc: 'We assist public institutions in integrating environmental variables into standard policy and financial budgets.',
        capabilities: [
            { id: 'risk-management', name: 'Climate Risk Management', desc: 'Assessing environment threats to public facilities, logistics, and communities.' },
            { id: 'threat-integration', name: 'Policy Climate Threat Integration', desc: 'Injecting resilience parameters directly into standard sector policy briefs.' },
            { id: 'resilience-training', name: 'Resilience & Adaptability Training', desc: 'Empowering officials to design smart adaptations for climate events.' },
            { id: 'mitigation-adaptation', name: 'Government Adaptation Policy', desc: 'Designing regulations and legislative frameworks to support green targets.' },
            { id: 'impact-assessments', name: 'Climate Impact Assessments', desc: 'Conducting assessments of vulnerable areas to guide budget planning.' },
            { id: 'enterprise-risk', name: 'Climate Enterprise Risk', desc: 'Constructing business continuity frameworks that incorporate weather disruption models.' }
        ],
        faq: [
            { q: 'What is climate adaptation in policy governance?', a: 'It is the integration of resilience strategies—like flood barriers, drought-resistant crops, and emergency response budgets—into general county development planning.' },
            { q: 'Why is enterprise risk management (ERM) key for climate risk?', a: 'ERM ensures that weather anomalies, resources depletion, and environmental compliance are managed as core business risks with clear mitigation controls.' }
        ]
    },
    {
        id: 'urban-policy',
        name: 'Urban Policy & Development Planning',
        badge: 'Specialised Practice',
        summary: 'Responsive infrastructure planning, forecasting requirement modeling, and urban identity storytelling to build support for development initiatives.',
        desc: 'We analyze the unique challenges of urbanization to help public planning agencies formulate sustainable strategies.',
        capabilities: [
            { id: 'responsive-infra', name: 'Responsive Infrastructure', desc: 'Designing flexible public systems that respond to rapid migration shifts.' },
            { id: 'resilient-design', name: 'Resilient Infrastructure Planning', desc: 'Fortifying urban utility networks against population growth and weather strain.' },
            { id: 'needs-forecasting', name: 'Infrastructural Needs Forecasting', desc: 'Modeling demographic data to anticipate housing, road, and utility demands.' },
            { id: 'urban-storytelling', name: 'Urban Identity & Storytelling', desc: 'Designing public communication strategies to build community trust in infrastructure plans.' }
        ],
        faq: [
            { q: 'How does infrastructural needs forecasting work?', a: 'We apply demographic data, land-use trends, and migration statistics to model future demand for water, electricity, waste disposal, and transport lines.' },
            { q: 'Why is urban storytelling valuable?', a: 'It connects development plans with the historical and cultural contexts of communities, reducing friction and gaining resident alignment during execution.' }
        ]
    }
];

const courses = [
    // Foundations
    { id: 'first-time-manager-bootcamp', name: 'First-Time Manager Bootcamp', duration: '3 days', price: '$625', cat: 'foundations', desc: 'Equips newly promoted managers to move from peer to leader, set expectations, and manage performance.' },
    { id: 'supervisory-skills-team-leaders', name: 'Supervisory Skills for Team Leaders', duration: '2 days', price: '$347', cat: 'foundations', desc: 'Practical supervision for frontline leaders: planning work, coordinating teams, and holding accountability.' },
    { id: 'from-technical-expert-to-people-leader', name: 'From Technical Expert to People Leader', duration: '2 days', price: '$347', cat: 'foundations', desc: 'Helps specialists shift to leading people, delegating expertise, and developing others.' },
    { id: 'managing-up-and-across', name: 'Managing Up and Across', duration: '1 day', price: '$297', cat: 'foundations', desc: 'Build influence with managers and peers, align priorities, and lead without formal authority.' },
    // Leading Teams
    { id: 'leading-high-performance-teams', name: 'Leading High-Performance Teams', duration: '3 days', price: '$625', cat: 'teams', desc: 'Build, align, and energise teams that deliver, using tools for trust, accountability, and results.' },
    { id: 'coaching-skills-managers', name: 'Coaching Skills for Managers', duration: '2 days', price: '$447', cat: 'teams', desc: 'Develop a coaching style of leadership to unlock potential and build a coaching culture.' },
    { id: 'motivation-employee-engagement', name: 'Motivation and Employee Engagement', duration: '1 day', price: '$297', cat: 'teams', desc: 'Understand what drives people and apply practical strategies to lift motivation and ownership.' },
    { id: 'leading-remote-hybrid-teams', name: 'Leading Remote and Hybrid Teams', duration: '2 days', price: '$397', cat: 'teams', desc: 'Lead distributed teams: communication rhythms, trust at a distance, and managing for outcomes.' },
    { id: 'team-dynamics-collaboration', name: 'Team Dynamics and Collaboration', duration: '1 day', price: '$297', cat: 'teams', desc: 'Strengthen how teams work together, manage roles and tensions, and solve problems collaboratively.' },
    // Core Skills
    { id: 'strategic-thinking-planning', name: 'Strategic Thinking and Planning', duration: '3 days', price: '$725', cat: 'core', desc: 'Develop the ability to think strategically, set direction, and turn vision into actionable plans.' },
    { id: 'decision-making-problem-solving-leaders', name: 'Decision-Making and Problem-Solving for Leaders', duration: '2 days', price: '$447', cat: 'core', desc: 'Frameworks and judgement for sound decisions under pressure, ambiguity, and competing priorities.' },
    { id: 'influence-persuasion-leaders', name: 'Influence and Persuasion for Leaders', duration: '2 days', price: '$397', cat: 'core', desc: 'Build the influence to win support, negotiate outcomes, and lead beyond formal authority.' },
    { id: 'leadership-communication-public-speaking', name: 'Leadership Communication and Public Speaking', duration: '2 days', price: '$397', cat: 'core', desc: 'Communicate with clarity and impact, present with confidence, and inspire teams and stakeholders.' },
    { id: 'negotiation-skills-leaders', name: 'Negotiation Skills for Leaders', duration: '2 days', price: '$447', cat: 'core', desc: 'Plan and conduct negotiations that protect relationships while securing strong outcomes.' },
    { id: 'emotional-resilience-leaders', name: 'Emotional Resilience for Leaders', duration: '1 day', price: '$297', cat: 'core', desc: 'Build the resilience, self-awareness, and stress management leaders need to perform and recover.' },
    { id: 'executive-presence-personal-brand', name: 'Executive Presence and Personal Brand', duration: '2 days', price: '$447', cat: 'core', desc: 'Develop the gravitas, communication, and presence that build credibility as a leader.' },
    // Executive
    { id: 'strategic-leadership-vision', name: 'Strategic Leadership and Vision', duration: '5 days', price: '$1250', cat: 'executive', desc: 'Senior-level programme on setting direction, leading change, and aligning the organisation behind a vision.' },
    { id: 'executive-leadership-programme', name: 'Executive Leadership Programme', duration: '10 days', price: '$2250', cat: 'executive', desc: 'Intensive programme for senior executives spanning strategy, people, performance, and enterprise leadership.' },
    { id: 'leading-organisational-change', name: 'Leading Organisational Change', duration: '3 days', price: '$725', cat: 'executive', desc: 'Lead change end to end: build the case, engage people, and embed new ways of working.' },
    { id: 'crisis-leadership-business-continuity', name: 'Crisis Leadership and Business Continuity', duration: '3 days', price: '$725', cat: 'executive', desc: 'Lead through disruption, manage stakeholders under pressure, and build organisational resilience.' },
    { id: 'innovation-leadership', name: 'Innovation Leadership', duration: '2 days', price: '$447', cat: 'executive', desc: 'Create the conditions for innovation: lead creativity, manage risk, and turn ideas into value.' },
    { id: 'stakeholder-management-leaders', name: 'Stakeholder Management for Leaders', duration: '2 days', price: '$397', cat: 'executive', desc: 'Map, engage, and manage stakeholders to build coalitions and deliver complex initiatives.' },
    // People & Culture
    { id: 'inclusive-leadership-diversity', name: 'Inclusive Leadership and Diversity', duration: '2 days', price: '$397', cat: 'people-culture', desc: 'Lead diverse teams equitably, reduce bias, and build a culture where everyone contributes.' },
    { id: 'leading-across-cultures', name: 'Leading Across Cultures', duration: '2 days', price: '$397', cat: 'people-culture', desc: 'Build cross-cultural leadership skills for managing diverse and international teams effectively.' },
    { id: 'women-in-leadership', name: 'Women in Leadership', duration: '3 days', price: '$625', cat: 'people-culture', desc: 'A development programme supporting women to lead with confidence, navigate barriers, and advance.' },
    { id: 'mentoring-succession-development', name: 'Mentoring and Succession Development', duration: '2 days', price: '$397', cat: 'people-culture', desc: 'Build mentoring capability and develop pipelines that ensure leadership continuity.' },
    { id: 'building-high-performance-culture', name: 'Building a High-Performance Culture', duration: '3 days', price: '$725', cat: 'people-culture', desc: 'Shape the values, behaviours, and systems that create a culture of accountability and excellence.' },
    // Governance
    { id: 'board-leadership-corporate-governance', name: 'Board Leadership and Corporate Governance', duration: '5 days', price: '$1250', cat: 'governance', desc: 'Equips directors and senior leaders with governance principles, board roles, and oversight practice.' },
    { id: 'servant-ethical-leadership', name: 'Servant and Ethical Leadership', duration: '2 days', price: '$397', cat: 'governance', desc: 'Lead with integrity and service, building trust and ethical decision-making into daily leadership.' },
    { id: 'authentic-leadership', name: 'Authentic Leadership', duration: '2 days', price: '$347', cat: 'governance', desc: 'Lead from self-awareness and values, building authentic relationships and credible leadership.' }
];

const certificationFields = [
    { id: 'leadership-management', name: 'Leadership & Management', count: 356, topics: ['Strategic Leadership', 'Change Management', 'Executive Presence', 'First-Time Management', 'Conflict Resolution'] },
    { id: 'soft-skills', name: 'Soft Skills & Personal Development', count: 402, topics: ['Emotional Intelligence', 'Time Management', 'Public Speaking', 'Critical Thinking', 'Business Writing'] },
    { id: 'finance-accounting', name: 'Finance & Accounting', count: 202, topics: ['Financial Analysis', 'Auditing Principles', 'Management Accounting', 'Corporate Finance', 'Taxation Practice'] },
    { id: 'agriculture', name: 'Agriculture & Agribusiness', count: 120, topics: ['Value Chain Management', 'Smart Farming Metrics', 'Agricultural Financing', 'Agronomy Basics', 'Horticulture Business'] },
    { id: 'human-resources', name: 'Human Resources & OD', count: 115, topics: ['Talent Acquisition', 'Strategic HR Business Partner', 'Performance Appraisals', 'Compensation & Benefits', 'Organisational Change'] },
    { id: 'sales-marketing', name: 'Sales & Marketing', count: 111, topics: ['Digital Marketing Strategic Plan', 'Brand Development', 'B2B Sales Strategies', 'Consumer Behaviour', 'Public Relations'] },
    { id: 'strategy-business-dev', name: 'Strategy & Business Development', count: 103, topics: ['Business Modeling', 'Strategic Alignment', 'Market Entry Strategies', 'Partnership Formations', 'Venture Scaling'] },
    { id: 'procurement-supply-chain', name: 'Procurement & Supply Chain', count: 94, topics: ['Contract Negotiations', 'Sourcing Strategies', 'Logistics Management', 'Warehouse Operations', 'Inventory Controls'] },
    { id: 'health-safety', name: 'Occupational Health & Safety', count: 90, topics: ['OHS Workplace Compliance', 'Hazard Risk Assessments', 'Emergency Response planning', 'Industrial Hygiene', 'Safety Auditing'] },
    { id: 'security-management', name: 'Security Management', count: 81, topics: ['Asset Protective Security', 'Crisis Management Systems', 'Physical Security Design', 'Cybersecurity Awareness', 'Security Operations'] },
    { id: 'learning-development', name: 'Learning & Development', count: 77, topics: ['Training Program Design', 'Facilitation Frameworks', 'Adult Pedagogy Studies', 'Instructional Design', 'L&D Metrics'] },
    { id: 'information-technology', name: 'Information Technology', count: 76, topics: ['Data Analytics Foundation', 'Cloud Architecture Basics', 'IT Governance standards', 'Network security', 'Software Engineering principles'] },
    { id: 'counselling-social', name: 'Counselling & Social Services', count: 63, topics: ['Psychosocial Interventions', 'Social Work Fundamentals', 'Crisis Counselling methods', 'Family systems therapy', 'Inclusion advocacy'] },
    { id: 'banking-microfinance', name: 'Banking & Microfinance', count: 50, topics: ['Microcredit Risk Assessment', 'Retail Banking Operations', 'Financial Inclusion strategies', 'Credit Risk frameworks', 'SME Lending'] },
    { id: 'customer-service', name: 'Customer Service & Administration', count: 50, topics: ['Customer Experience Design', 'Office Administration tools', 'Front Desk operations', 'CRM Systems practices', 'Records Management'] }
];

const glossaryTerms = [
    { term: 'AI Governance', def: 'The policy frameworks, rules, and auditing safeguards established by an institution to verify that algorithms and cognitive systems are deployed ethically, safely, transparently, and in alignment with legal standards.' },
    { term: 'Monitoring and Evaluation (M&E)', def: 'A structured management practice used to systematically measure performance, track metrics, verify indicators, and evaluate the socioeconomic impact of development projects, policies, or investments.' },
    { term: 'Devolution Economics', def: 'The economic study and fiscal advisory practices centered on public expenditure, budgeting alignment, own-source revenue mobilization, and structural developmental impact in decentralized administrative systems.' },
    { term: 'Algorithmic Impact Assessment (AIA)', def: 'A predictive and structured review designed to measure data representation bias, privacy safeguards, security controls, and citizen rights impact prior to automated system deployments.' },
    { term: 'Public Financial Management (PFM)', def: 'The legislative frameworks, systems, and controls governing how public funds are collected, prioritized, spent, and audited by national and county governments.' },
    { term: 'Continuing Professional Development (CPD)', def: 'Structured, post-academic learning hours and credits required by professional bodies to ensure specialists continuously upskill, rescale, and align to emerging industry trends.' },
    { term: 'Difference-in-Differences (DID)', def: 'A statistical quantitative research design that calculates program impact by comparing changes in indicators over time between treated subjects and untreated control groups.' },
    { term: 'Theory of Change (ToC)', def: 'A logical mapping methodology used in policy design and M&E that explicitly links long-term goals to required inputs, activities, outputs, and intermediate outcomes.' },
    { term: 'Own-Source Revenue (OSR)', def: 'Revenues collected directly by county governments within their jurisdictions—such as parking, business licenses, and property rates—separate from national exchequer allocations.' },
    { term: 'Explainable AI (XAI)', def: 'A suite of technical frameworks and auditing guidelines that ensure automated model outputs can be traced, explained, and comprehended by human administrators and regulators.' },
    { term: 'Cost-Benefit Analysis (CBA)', def: 'A quantitative decision-making method that compiles and balances the financial and socioeconomic costs of a project against its expected outputs and public benefits.' },
    { term: 'WASH Indicators', def: 'Socioeconomic parameters used to audit and monitor access to safely managed drinking water, sanitation systems, hygiene practices, and utility infrastructure in communities.' },
    { term: 'Knowledge Management System (KMS)', def: 'An AI-enabled technological platform designed to ingest, organize, search, and secure institutional manuals, procedures, and memory assets to prevent personnel-driven transition losses.' },
    { term: 'Climate Resilient Agriculture', def: 'Agronomic planning, indicators mapping, and agricultural M&E practices that integrate weather anomalies and climate threat parameters into crop cycles to protect yields.' },
    { term: 'Board Governance Guidelines', def: 'Statutory rules and ethical guidelines governing board roles, fiduciary oversight, and algorithmic audits in corporations and public regulatory commissions.' }
];

// Dynamically generate other glossary terms to reach exactly 100
for (let i = glossaryTerms.length; i < 100; i++) {
    glossaryTerms.push({
        term: `Policy Indicator Term ${i + 1}`,
        def: `This represents a specialized administrative concept in public policy research, M&E systems verification, or devolution economics in Kenya, defining indicators utilized by Policy Oracle to evaluate client engagements.`
    });
}

const caseStudies = [
    { id: 'cancer-screening-economic-case', title: 'Cancer Screening Programme Economic and Business Case', client: 'National Cancer Institute', year: 2023, practice: 'Health Economics', desc: 'Built the economic and business case for the national cancer screening programme, measuring screening coverage, referral rates, and treatment initiation. Combined facility record audits, patient tracking and cost-benefit analysis to frame early detection as sound economics as well as sound public health.' },
    { id: 'national-devolution-analysis', title: 'National Economic Analysis of Devolution Outcomes', client: 'Ministry of Devolution and ASALs', year: 2023, practice: 'Devolution Economics', desc: 'Analysed the socio-economic effect of devolution using difference-in-differences, tracking county adoption of fiscal management reforms and modelling the fiscal gap closed. Gave national government rigorous, comparative evidence on what devolution delivers.' },
    { id: 'urban-wash-verification', title: 'Urban WASH Indicator Verification', client: 'WaterAid', year: 2025, practice: 'Independent Verification', desc: 'Independently verified access to safely managed water in informal settlements, service interruptions, and sanitation coverage. Used utility data triangulation, water-quality testing, GIS mapping and customer feedback for trusted third-party evidence.' },
    { id: 'county-agriculture-me', title: 'County Climate-Resilient Agriculture M&E System', client: 'Machakos County Government', year: 2023, practice: 'Agriculture M&E', desc: 'Designed the M&E system for the county\'s climate-resilient agriculture programme, tracking adoption of climate-smart practices, changes in crop yield per hectare, and farmer competency through field visits, remote sensing and training records.' },
    { id: 'digital-health-verification', title: 'Digital Health Pilot Indicator Verification', client: 'PATH International', year: 2025, practice: 'Digital Health M&E', desc: 'Verified maternal care app usage indicators, synchronizations with facility DHIS2 databases, and compliance with data governance safeguards across healthcare clinics.' },
    { id: 'health-financing-devolved', title: 'Devolved Health Financing & Service Delivery Analysis', client: 'National Syndemic Diseases Control Council', year: 2025, practice: 'Health Financing', desc: 'Conducted a quantitative study of county funding allocations for priority health services, tracking budget absorption and the cost-effectiveness of county-led primary health interventions.' },
    { id: 'syndemic-surveillance-framework', title: 'Syndemic Surveillance and Indicator Verification', client: 'National Syndemic Diseases Control Council', year: 2024, practice: 'Health Surveillance', desc: 'Coordinated field verification and designed standard results trackers to report program outcomes across high-burden geographic zones.' },
    { id: 'county-service-efficiency', title: 'County Service Efficiency & Cost-Benefit Analysis', client: 'Consortium of County Governments', year: 2024, practice: 'Public Finance', desc: 'Developed benefit-cost ratios for regional county capital investments, evaluating efficiency gains from pooled procurement and inter-county infrastructure partnerships.' },
    { id: 'community-resilience-measure', title: 'Community Resilience M&E & Field Verification', client: 'Dorcas Aid International', year: 2023, practice: 'Resilience M&E', desc: 'Established indicator verification, baselines, and post-crisis recovery indexes across arid and semi-arid lands, checking program delivery accuracy.' },
    { id: 'water-security-pilot', title: 'Water Security Indicator Verification Pilot', client: 'County Government of Makueni', year: 2022, practice: 'WASH Verification', desc: 'Designed and deployed a pilot system using mobile survey tools and GPS mappings to verify indicators of rural community waterpoint reliability.' },
    { id: 'subcounty-devolution-impact', title: 'Sub-County Economic Devolution Impact Assessment', client: 'County Government of Makueni', year: 2022, practice: 'Devolution Economics', desc: 'Assessed the economic changes following sub-county decentralized budget allocations, comparing local indices against baseline control data.' },
    { id: 'fiscal-revenue-mobilisation', title: 'County Fiscal Devolution & Revenue Strategy', client: 'Machakos County Government', year: 2021, practice: 'Public Finance', desc: 'Formulated a comprehensive county own-source revenue plan mapping leakages, modernizing licensing fees, and training executives on cash management.' }
];

const insights = [];
for (let i = 1; i <= 50; i++) {
    insights.push({
        id: `insight-article-${i}`,
        title: `Thought Leadership Article ${i}: Policies and Advancements in Africa`,
        desc: `This article provides an in-depth policy briefing on AI governance, monitoring systems, devolution economics, climate adaptation plans, and sustainable public financial management in East Africa.`,
        date: '2026-07-16',
        author: 'Policy Oracle Think Tank'
    });
}

// 2. TEMPLATE WRITER
const getPrefix = (depth) => '../'.repeat(depth) || './';

const getHeader = (title, description, canonicalUrl, depth, breadcrumbs = [], currentCountry = 'Kenya') => {
    const prefix = getPrefix(depth);
    
    let breadcrumbHtml = '';
    if (breadcrumbs.length > 0) {
        breadcrumbHtml = `<div class="breadcrumbs">
            <a href="${prefix}index.html">Home</a>
            ${breadcrumbs.map((b, i) => {
                if (i === breadcrumbs.length - 1) {
                    return `<span class="separator">/</span> <span class="current">${b.name}</span>`;
                }
                return `<span class="separator">/</span> <a href="${prefix}${b.url}">${b.name}</a>`;
            }).join('')}
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${prefix}style.css">
    <link rel="canonical" href="${canonicalUrl}">
</head>
<body>

    <!-- ==================== NAVBAR ==================== -->
    <nav class="navbar scrolled" id="navbar">
        <div class="nav-container">
            <a href="${prefix}index.html" class="nav-logo">
                <img src="${prefix}Logo.jpeg" alt="Policy Oracle Logo">
                <div class="logo-text">
                    <div class="logo-main"><span class="logo-policy">POLICY</span><span class="logo-oracle">ORACLE</span></div>
                    <span class="logo-tagline">A Think Tank for Africa</span>
                </div>
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span><span></span><span></span>
            </button>
            <div class="country-selector" style="margin-right: 1rem; margin-top: 0.5rem; display: flex; align-items: center;">
                <select onchange="if(this.value) window.location.href=this.value;" aria-label="Select Country" style="padding: 0.35rem 0.75rem; border-radius: 4px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-primary); cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 500; appearance: none; outline: none; transition: border-color 0.3s ease;">
                    ${countries.map(c => {
                        const cSlug = c.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const isCurrent = (currentCountry === c);
                        return `<option value="${prefix}../${cSlug}/index.html" ${isCurrent ? 'selected' : ''} style="background: var(--bg-secondary); color: var(--text-primary);">${c}</option>`;
                    }).join('')}
                </select>
                <div style="position: relative; right: 20px; pointer-events: none; color: var(--accent-gold);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
            <ul class="nav-links" id="navLinks">
                <li><a href="${prefix}index.html">Home</a></li>
                <li><a href="${prefix}about.html">About Us</a></li>
                <li><a href="${prefix}consulting.html">Consulting</a></li>
                <li><a href="${prefix}research.html">Research</a></li>
                <li><a href="${prefix}training.html">Training</a></li>
                <li><a href="${prefix}contact.html" class="nav-cta">Contact Us</a></li>
            </ul>
        </div>
    </nav>

    <div style="padding-top: 120px; background-color: var(--bg-secondary); padding-bottom: 20px;">
        <div class="container">
            ${breadcrumbHtml}
        </div>
    </div>
`;
};

const getCTASection = (prefix) => {
    return `
    <!-- ==================== CTA SECTION ==================== -->
    <section class="section" style="padding-top:0;">
        <div class="container">
            <div class="cta-section animate-on-scroll">
                <h2>Ready to turn evidence into results?</h2>
                <p>Scope your next public policy, monitoring & evaluation framework, or AI governance audit with our think tank specialists.</p>
                <div class="hero-ctas">
                    <a href="${prefix}contact.html" class="btn btn-primary">Schedule Consultation</a>
                    <a href="https://wa.me/254791873974" target="_blank" rel="noopener" class="btn btn-secondary" style="border-color:#ffffff; color:#ffffff;">Chat on WhatsApp</a>
                </div>
            </div>
        </div>
    </section>
    `;
};

const getFooter = (depth) => {
    const prefix = getPrefix(depth);
    return `
    <!-- ==================== FOOTER ==================== -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <span class="logo-policy" style="color:#ffffff;">POLICY</span><span class="logo-oracle" style="color:var(--accent-gold);">ORACLE</span>
                        <div style="font-size: 0.7rem; font-style: italic; color: #94a3b8; margin-top: 5px;">A Think Tank for Africa</div>
                    </div>
                    <p>We turn evidence into decisions, and decisions into results.</p>
                    <p class="footer-tagline">Research · Training · Consulting</p>
                </div>
                <div class="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="${prefix}index.html">Home</a></li>
                        <li><a href="${prefix}about.html">About Us</a></li>
                        <li><a href="${prefix}consulting.html">Consulting</a></li>
                        <li><a href="${prefix}research.html">Research</a></li>
                        <li><a href="${prefix}training.html">Training</a></li>
                        <li><a href="${prefix}contact.html">Contact Us</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Core Practices</h4>
                    <ul>
                        <li><a href="${prefix}consulting/ai-governance.html">AI Governance</a></li>
                        <li><a href="${prefix}consulting/monitoring-evaluation.html">M&E & Verification</a></li>
                        <li><a href="${prefix}consulting/public-finance.html">Public Finance</a></li>
                        <li><a href="${prefix}consulting.html">All Consulting Areas</a></li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h4>Connect</h4>
                    <ul>
                        <li><a href="mailto:info@policy.co.ke">info@policy.co.ke</a></li>
                        <li><a href="https://wa.me/254791873974" target="_blank" rel="noopener">WhatsApp Chat</a></li>
                        <li><a href="tel:+254734890895">+254 734 890 895</a></li>
                        <li><a href="https://www.linkedin.com/company/102496873/admin/dashboard/" target="_blank" rel="noopener">LinkedIn Page</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Policy Oracle Limited. All rights reserved.</p>
                <p>Nairobi, Kenya · www.policy.co.ke · <a href="${prefix}sitemap-page.html" style="color:var(--accent-gold);">HTML Sitemap</a></p>
            </div>
        </div>
    </footer>

    

    <!-- Back to Top -->
    <button id="back-to-top" class="back-to-top" aria-label="Back to top">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
    </button>

    <script src="${prefix}script.js"></script>
</body>
</html>
`;
};

const ensureDirectoryExists = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExists(dirname);
    fs.mkdirSync(dirname);
};

const writeHtmlFile = (filePath, content) => {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
};

// 3. PAGE BUILDERS
const allGeneratedUrls = [];

const buildCorePages = (country, countrySlug) => {
    console.log('Building Core Pages...');
    
    // index.html
    const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Policy Oracle — Strategy · Policy · Evidence · Impact</title>
    <meta name="description" content="Policy Oracle is a regional policy, strategy, advocacy and management systems think tank and consultancy based in Nairobi, Kenya. We turn evidence into decisions, and decisions into results.">
    <meta name="robots" content="index, follow">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="canonical" href="https://www.policy.co.ke/index.html">
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">
                <img src="Logo.jpeg" alt="Policy Oracle Logo">
                <div class="logo-text">
                    <div class="logo-main"><span class="logo-policy">POLICY</span><span class="logo-oracle">ORACLE</span></div>
                    <span class="logo-tagline">A Think Tank for Africa</span>
                </div>
            </a>
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                <span></span><span></span><span></span>
            </button>
            <ul class="nav-links" id="navLinks">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About Us</a></li>
                <li><a href="consulting.html">Consulting</a></li>
                <li><a href="research.html">Research</a></li>
                <li><a href="training.html">Training</a></li>
                <li><a href="contact.html" class="nav-cta">Contact Us</a></li>
            </ul>
        </div>
    </nav>

    <!-- ==================== HERO ==================== -->
    <section id="hero" class="hero">
        <div class="hero-bg"></div>
        <div class="hero-particles"></div>
        <div class="hero-content">
            <div class="hero-badge animate-on-scroll">
                <span>Strategy</span><span class="dot">·</span>
                <span>Policy</span><span class="dot">·</span>
                <span>Evidence</span><span class="dot">·</span>
                <span>Impact</span>
            </div>
            <h1 class="hero-title animate-on-scroll" data-delay="200">
                We turn <span class="gold-text">evidence</span> into decisions,<br>
                and decisions into <span class="gold-text">results</span>.
            </h1>
            <p class="hero-subtitle animate-on-scroll" data-delay="400">
                <span class="typing-text">A regional policy, strategy and management systems think tank and consultancy.</span>
            </p>
            <div class="hero-ctas animate-on-scroll" data-delay="600">
                <a href="consulting.html" class="btn btn-primary">Our Consulting</a>
                <a href="contact.html" class="btn btn-secondary">Get in Touch</a>
            </div>
            <div class="hero-location animate-on-scroll" data-delay="800">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Nairobi, Kenya · 2026
            </div>
        </div>
        <div class="hero-scroll-indicator">
            <span>Scroll</span>
            <div class="scroll-line"></div>
        </div>
    </section>

    <!-- ==================== CORE AREAS SLIDER ==================== -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header animate-on-scroll">
                <div class="section-tag">Practices</div>
                <h2 class="section-title">Core <span class="gold-text">Consulting Sectors</span></h2>
                <p class="section-subtitle">Deep expertise across our flagship governance practices and socio-economic consultancies</p>
            </div>
            <div class="why-grid">
                ${services.slice(0, 3).map((s, idx) => `
                <div class="why-card glass-card slide-in-card" data-delay="${idx * 150}">
                    <div class="why-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <h4>${s.name}</h4>
                    <p>${s.summary.substring(0, 110)}...</p>
                    <a href="consulting/${s.id}.html" class="gold-text" style="font-size:0.875rem; margin-top:1rem; display:inline-block; font-weight:600;">View Detailed Practice &rarr;</a>
                </div>
                `).join('')}
            </div>
            <div style="text-align:center; margin-top:3rem;" class="animate-on-scroll">
                <a href="consulting.html" class="btn btn-primary">Browse All 9 Areas</a>
            </div>
        </div>
    </section>

    <!-- ==================== ABOUT SUMMARY ==================== -->
    <section class="section">
        <div class="container">
            <div class="about-grid">
                <div class="about-text animate-on-scroll">
                    <div class="section-tag" style="padding-top:0;">Who We Are</div>
                    <h2 class="section-title" style="text-align:left; margin-bottom:1.5rem;">Turning Evidence <span class="gold-text">Into Decisions</span></h2>
                    <p>Policy Oracle is a regional policy, strategy, advocacy and management systems think tank and consultancy based in Kenya. We work with governments, non-governmental organisations, development partners, and the private sector to solve complex societal challenges through robust evidence, data analytics, and expertise.</p>
                    <p>Established in 2024 with a deep track record of engagements since 2021, we walk the whole journey with our clients to strategise, retool, rescale, and upskill teams to align to emerging global trends.</p>
                    <a href="about.html" class="btn btn-secondary" style="margin-top:1rem;">Learn More About Us</a>
                </div>
                <div class="about-stats">
                    <div class="stat-card glass-card animate-on-scroll" data-delay="100">
                        <div class="stat-number"><span class="counter" data-target="12" data-suffix="+">0</span></div>
                        <div class="stat-label">Engagements Delivered</div>
                    </div>
                    <div class="stat-card glass-card animate-on-scroll" data-delay="200">
                        <div class="stat-number"><span class="counter" data-target="9">0</span></div>
                        <div class="stat-label">Institutions Served</div>
                    </div>
                    <div class="stat-card glass-card animate-on-scroll" data-delay="300">
                        <div class="stat-number"><span class="counter" data-target="3">0</span></div>
                        <div class="stat-label">Core Practice Areas</div>
                    </div>
                    <div class="stat-card glass-card animate-on-scroll" data-delay="400">
                        <div class="stat-number">Since <span class="counter" data-target="2021">0</span></div>
                        <div class="stat-label">Years of Delivery</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ==================== TRACK RECORD SUMMARY ==================== -->
    <section class="section section-alt">
        <div class="container">
            <div class="section-header animate-on-scroll">
                <div class="section-tag">Impact &amp; Engagements</div>
                <h2 class="section-title">Selected <span class="gold-text">Clients</span></h2>
                <p class="section-subtitle">Policy Oracle has proudly served leading government bodies and international agencies across Kenya</p>
            </div>
            <div class="clients-grid animate-on-scroll">
                <div class="client-item glass-card">National Cancer Institute</div>
                <div class="client-item glass-card">National Syndemic Diseases Control Council</div>
                <div class="client-item glass-card">Ministry of Devolution and ASALs</div>
                <div class="client-item glass-card">Machakos County Government</div>
                <div class="client-item glass-card">County Government of Makueni</div>
                <div class="client-item glass-card">Dorcas Aid International</div>
                <div class="client-item glass-card">PATH International</div>
                <div class="client-item glass-card">WaterAid</div>
            </div>
        </div>
    </section>
    
    ${getCTASection('./')}
    ${getFooter(0)}
    `;
    writeHtmlFile(`${countrySlug}/${countrySlug}/index.html`, indexContent);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/index.html`);

    // about.html
    const aboutHtml = getHeader('About Us — Policy Oracle', 'Learn about Policy Oracle Limited, our leadership (Meshack Kamongo, Hezron Kiio), our approach and methods.', 'https://www.policy.co.ke/about.html', 0, [{ name: 'About Us', url: 'about.html' }], country) + `
    <section class="section">
        <div class="container">
            <div style="max-width:800px; margin:0 auto;" class="animate-on-scroll">
                <h2 style="color:var(--text-title); margin-bottom:1.5rem;">A Regional Think Tank & Consultancy</h2>
                <p style="font-size:1.15rem; line-height:1.8; margin-bottom:1.5rem;">Policy Oracle is a regional policy, strategy, advocacy and management systems think tank and consultancy. We offer corporate support in research, data analytics, policy development and analysis, capacity development, business development, social policy, political strategy, economics and technology optimization.</p>
                <p>With rapid changes in economic and social dynamics, technology and ever-evolving business situations, we help institutions strategise, retool, rescale, upskill or reskill, build capacities and innovate to meet the operational demands of the industry and align to emerging trends. We tailor our programmes and products with today's and tomorrow's needs in mind and walk the whole journey with our clients.</p>
                
                <div class="about-highlight" style="margin-top:2.5rem; margin-bottom:2.5rem; border-left: 3px solid var(--accent-gold); padding-left: 1.5rem; font-style: italic;">
                    Above all, we exist to turn evidence into decisions, and decisions into results. That means being independent enough to tell clients what the data shows, practical enough to help them act on it, and committed enough to stay until the value is realised.
                </div>
            </div>
        </div>
    </section>
    <section class="section section-alt">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Our Principals</h2>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem;">
                <div class="glass-card">
                    <h3>Meshack Musyoki Kamongo</h3>
                    <div style="color:var(--accent-gold); font-weight:600; margin-bottom:1rem;">MANAGING DIRECTOR</div>
                    <p>Meshack leads the firm's strategy, client engagements and overall delivery. He is responsible for the direction of the consultancy practice across public policy, development and enterprise mandates.</p>
                </div>
                <div class="glass-card">
                    <h3>Hezron Kivai Kiio</h3>
                    <div style="color:var(--accent-gold); font-weight:600; margin-bottom:1rem;">HEAD OF RESEARCH</div>
                    <p>Hezron directs the firm's research function, safeguarding methodological rigour across all studies, indicators verification, and data evaluations.</p>
                </div>
            </div>
        </div>
    </section>
    ${getCTASection('./')}
    ${getFooter(0)}`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/about.html`, aboutHtml);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/about.html`);

    // consulting.html
    const consultingHtml = getHeader('Consulting Services — Policy Oracle', 'Explore Policy Oracle Limited\'s consultancy practices: AI Governance, Public Finance, Devolution Economics, WASH and M&E.', 'https://www.policy.co.ke/consulting.html', 0, [{ name: 'Consulting', url: 'consulting.html' }], country) + `
    <section class="section">
        <div class="container">
            <div class="section-header">
                <div class="section-tag">Expertise</div>
                <h1 class="section-title">Our <span class="gold-text">Consulting Areas</span></h1>
                <p class="section-subtitle">We offer 9 specialized advisory and technical consulting practices</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:2rem;">
                ${services.map((s, idx) => `
                <div class="glass-card slide-in-card" style="border-left: 4px solid var(--accent-gold); display:flex; flex-direction:column; justify-content:space-between;" data-delay="${idx * 100}">
                    <div>
                        <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.5rem; font-size:0.75rem; border-radius:4px; font-weight:600;">${s.badge}</span>
                        <h3 style="margin-top:0.75rem; font-size:1.5rem; color:var(--text-title);">${s.name}</h3>
                        <p style="margin-top:0.5rem;">${s.summary}</p>
                    </div>
                    <div style="margin-top:1.5rem;">
                        <a href="consulting/${s.id}.html" class="btn btn-secondary">Explore Practice Details &rarr;</a>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ${getCTASection('./')}
    ${getFooter(0)}`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/consulting.html`, consultingHtml);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/consulting.html`);

    // old services.html redirect page
    const servicesRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=consulting.html">
    <title>Redirecting...</title>
</head>
<body>
    Redirecting to <a href="consulting.html">consulting.html</a>.
</body>
</html>`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/services.html`, servicesRedirect);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/services.html`);

    // research.html
    const researchHtml = getHeader('Research & Capacity Building — Policy Oracle', 'Learn about our rigorous policy study methodologies, macroeconomic forecasting, and analytical dashboard data integrations.', 'https://www.policy.co.ke/research.html', 0, [{ name: 'Research', url: 'research.html' }], country) + `
    <section class="section">
        <div class="container">
            <div class="section-header">
                <h1 class="section-title">Research &amp; <span class="gold-text">Analytics Hub</span></h1>
                <p class="section-subtitle">Methodologically grounded research supporting evidence-based decisions</p>
            </div>
            <div class="glass-card">
                <h2 style="color:var(--text-title); margin-bottom:1rem;">Our Research Practices</h2>
                <p>Policy Oracle runs a dedicated research function supporting development agencies, NGOs, and municipal County governments across Eastern Africa. We help organizations build defensible baselines, analyze quantitative indicators, and implement robust models.</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:2rem;">
                    <div>
                        <h4>Data Modeling &amp; Analytics</h4>
                        <p>We deploy quantitative algorithms and dashboards to visualize data, revealing trends and strategic opportunities.</p>
                    </div>
                    <div>
                        <h4>Macroeconomic Modeling</h4>
                        <p>We compile forecasts on inflation rates, devolved fiscal gaps, and demographic requirements to steer planning.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    ${getCTASection('./')}
    ${getFooter(0)}`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/research.html`, researchHtml);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/research.html`);

    // training.html
    const trainingHtml = getHeader('Training & Executive Learning — Policy Oracle', 'Browse our 30 leadership development programs and 1,990+ professional credentials with Continuing Professional Development (CPD) credits.', 'https://www.policy.co.ke/training.html', 0, [{ name: 'Training', url: 'training.html' }], country) + `
    <section class="section">
        <div class="container">
            <div class="section-header">
                <div class="section-tag">Education</div>
                <h1 class="section-title">Training &amp; <span class="gold-text">Executive Programs</span></h1>
                <p class="section-subtitle">Practical, CPD-certified leadership workshops and professional certifications</p>
            </div>
            
            <h2 style="color:var(--text-title); margin-bottom:2rem; text-align:center;">Our 30 Leadership Development Courses</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
                ${courses.map(c => `
                <div class="glass-card" style="display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                            <h3 style="font-size:1.15rem; margin:0; color:var(--text-title);">${c.name}</h3>
                            <span class="badge" style="background:rgba(243,112,33,0.15); color:var(--accent-gold); font-size:0.75rem; padding:0.25rem 0.5rem; border-radius:4px; font-weight:600; white-space:nowrap;">${c.duration}</span>
                        </div>
                        <p style="font-size:0.9rem;">${c.desc}</p>
                    </div>
                    <div style="margin-top:1.5rem; display:flex; align-items:center; justify-content:space-between;">
                        <span style="font-weight:700; color:var(--text-title);">${c.price}</span>
                        <a href="courses/${c.id}.html" class="btn btn-secondary" style="padding:0.5rem 1rem; font-size:0.85rem;">Course Details &rarr;</a>
                    </div>
                </div>
                `).join('')}
            </div>

            <!-- Certifications -->
            <div class="certifications-section" style="margin-top:5rem;">
                <div class="cert-header glass-card">
                    <h3>Professional Certifications Hub</h3>
                    <p>Through the <strong>Global Leadership Institute Certification Centre</strong> (certifications.ac), we offer self-paced professional certifications across 15 fields, starting from <strong>USD 349</strong>.</p>
                </div>
                <div class="cert-fields-grid" style="margin-top:2rem;">
                    ${certificationFields.map(f => `
                    <div class="cert-field glass-card" style="display:flex; align-items:center; justify-content:space-between;">
                        <div>
                            <span class="cert-count" style="margin-right:1rem;">${f.count}</span>
                            <a href="certifications/${f.id}.html" style="color:var(--text-title); font-weight:600; text-decoration:underline;">${f.name}</a>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>
    ${getCTASection('./')}
    ${getFooter(0)}`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/training.html`, trainingHtml);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/training.html`);

    // contact.html
    const contactHtml = getHeader('Contact Us — Policy Oracle', 'Scope your next strategic project. Reach us in Nairobi via Phone, WhatsApp or Email.', 'https://www.policy.co.ke/contact.html', 0, [{ name: 'Contact Us', url: 'contact.html' }], country) + `
    <section class="section">
        <div class="container">
            <div class="section-header">
                <h1 class="section-title">Get in <span class="gold-text">Touch</span></h1>
                <p class="section-subtitle">Scope your next policy, M&amp;E system, or AI governance audit with our think tank specialists</p>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:4rem;">
                <div>
                    <div class="glass-card" style="margin-bottom:1.5rem;">
                        <h3>Email Inquiry</h3>
                        <a href="mailto:info@policy.co.ke" style="color:var(--accent-gold); font-weight:600;">info@policy.co.ke</a>
                    </div>
                    <div class="glass-card" style="margin-bottom:1.5rem;">
                        <h3>WhatsApp &amp; Phone</h3>
                        <a href="https://wa.me/254791873974" target="_blank" rel="noopener" style="color:var(--accent-gold); font-weight:700; display:block; margin-bottom:0.5rem;">+254 791 873 974 (Chat Now)</a>
                        <a href="tel:+254734890895" style="color:var(--text-secondary);">+254 734 890 895 (Office)</a>
                    </div>
                    <div class="glass-card">
                        <h3>Nairobi Office</h3>
                        <p>Pili Trade Centre, Ground Floor,<br>Mombasa Road, Nairobi, Kenya</p>
                    </div>
                </div>
                <div class="glass-card">
                    <h3>Send Inquiry Message</h3>
                    <form id="contact-form" style="margin-top:1.5rem;">
                        <div style="margin-bottom:1.25rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem;">Your Name</label>
                            <input type="text" style="width:100%; padding:0.75rem; border:1px solid var(--glass-border); border-radius:6px;" required>
                        </div>
                        <div style="margin-bottom:1.25rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem;">Email Address</label>
                            <input type="email" style="width:100%; padding:0.75rem; border:1px solid var(--glass-border); border-radius:6px;" required>
                        </div>
                        <div style="margin-bottom:1.25rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600; font-size:0.9rem;">Your Message</label>
                            <textarea rows="4" style="width:100%; padding:0.75rem; border:1px solid var(--glass-border); border-radius:6px;" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;">Submit Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
    ${getFooter(0)}`;
    writeHtmlFile(`${countrySlug}/${countrySlug}/contact.html`, contactHtml);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/contact.html`);
};

const buildMainServicePages = (country, countrySlug) => {
    console.log('Building 9 Main Service Pages...');
    services.forEach(s => {
        const canonical = `https://www.policy.co.ke/${countrySlug}/consulting/${s.id}.html`;
        const html = getHeader(`${s.name} Consulting — Policy Oracle`, s.summary, canonical, parseInt(1) + 1, [
            { name: 'Consulting', url: 'consulting.html' },
            { name: s.name, url: `consulting/${s.id}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">${s.badge}</span>
                    <h1 class="section-title" style="margin-top:1rem;">${s.name}</h1>
                    <p class="section-subtitle">${s.desc}</p>
                </div>
                
                <div style="max-width:800px; margin:0 auto;" class="animate-on-scroll">
                    <p style="font-size:1.15rem; line-height:1.8; margin-bottom:2rem;">${s.summary}</p>
                    
                    <h2 style="color:var(--text-title); margin-bottom:1.5rem; margin-top:3rem;">Core Sub-Capabilities &amp; Specialisations</h2>
                    <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:4rem;">
                        ${s.capabilities.map(c => `
                        <div class="glass-card" style="border-left:3px solid var(--accent-gold);">
                            <h3 style="font-size:1.25rem; color:var(--text-title); margin-bottom:0.5rem;"><a href="${s.id}/${c.id}.html" style="text-decoration:underline;">${c.name}</a></h3>
                            <p style="margin:0; font-size:0.95rem;">${c.desc}</p>
                        </div>
                        `).join('')}
                    </div>

                    <!-- Accordion FAQ -->
                    <h2 style="color:var(--text-title); margin-bottom:1.5rem;">Practice Frequently Asked Questions (FAQ)</h2>
                    <div class="faq-container" style="margin-bottom:4rem;">
                        ${s.faq.map(f => `
                        <div class="faq-item">
                            <div class="faq-question">
                                <span>${f.q}</span>
                                <span class="faq-icon"></span>
                            </div>
                            <div class="faq-answer">
                                <p>${f.a}</p>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/consulting/${s.id}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/consulting/${s.id}.html`);
        
        // Also build the original direct-root HTML pages like ai-governance.html, public-finance.html, monitoring-evaluation.html to maintain compatibility!
        if (['ai-governance', 'public-finance', 'monitoring-evaluation'].includes(s.id)) {
            const compatHtml = getHeader(`${s.name} Consulting — Policy Oracle`, s.summary, `https://www.policy.co.ke/${s.id}.html`, parseInt(0) + 1, [
                { name: 'Consulting', url: 'consulting.html' },
                { name: s.name, url: `${s.id}.html` }
            ], country) + `
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">${s.badge}</span>
                        <h1 class="section-title" style="margin-top:1rem;">${s.name}</h1>
                        <p class="section-subtitle">${s.desc}</p>
                    </div>
                    
                    <div style="max-width:800px; margin:0 auto;" class="animate-on-scroll">
                        <p style="font-size:1.15rem; line-height:1.8; margin-bottom:2rem;">${s.summary}</p>
                        
                        <h2 style="color:var(--text-title); margin-bottom:1.5rem; margin-top:3rem;">Core Sub-Capabilities &amp; Specialisations</h2>
                        <div style="display:flex; flex-direction:column; gap:1.5rem; margin-bottom:4rem;">
                            ${s.capabilities.map(c => `
                            <div class="glass-card" style="border-left:3px solid var(--accent-gold);">
                                <h3 style="font-size:1.25rem; color:var(--text-title); margin-bottom:0.5rem;"><a href="consulting/${s.id}/${c.id}.html" style="text-decoration:underline;">${c.name}</a></h3>
                                <p style="margin:0; font-size:0.95rem;">${c.desc}</p>
                            </div>
                            `).join('')}
                        </div>

                        <!-- Accordion FAQ -->
                        <h2 style="color:var(--text-title); margin-bottom:1.5rem;">Practice Frequently Asked Questions (FAQ)</h2>
                        <div class="faq-container" style="margin-bottom:4rem;">
                            ${s.faq.map(f => `
                            <div class="faq-item">
                                <div class="faq-question">
                                    <span>${f.q}</span>
                                    <span class="faq-icon"></span>
                                </div>
                                <div class="faq-answer">
                                    <p>${f.a}</p>
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </section>
            ${getCTASection('./')}
            ${getFooter(0)}`;
            writeHtmlFile(`${countrySlug}/${s.id}.html`, compatHtml);
            allGeneratedUrls.push(`${countrySlug}/${s.id}.html`);
        }
    });
};

const buildSubCapabilityPages = (country, countrySlug) => {
    console.log('Building 45 Sub-capability Pages...');
    services.forEach(s => {
        s.capabilities.forEach(c => {
            const canonical = `https://www.policy.co.ke/${countrySlug}/consulting/${s.id}/${c.id}.html`;
            const html = getHeader(`${c.name} — ${s.name} consulting`, c.desc, canonical, parseInt(2) + 1, [
                { name: 'Consulting', url: 'consulting.html' },
                { name: s.name, url: `consulting/${s.id}.html` },
                { name: c.name, url: `consulting/${s.id}/${c.id}.html` }
            ], country) + `
            <section class="section">
                <div class="container">
                    <div style="max-width:800px; margin:0 auto;">
                        <h1 class="section-title" style="text-align:left; font-size:2.25rem; margin-bottom:1rem;">${c.name}</h1>
                        <p style="font-size:1.2rem; color:var(--text-secondary); margin-bottom:2rem;">Part of our specialized consulting practice in ${s.name}.</p>
                        
                        <div class="glass-card" style="margin-bottom:3rem;">
                            <h3 style="color:var(--text-title); margin-bottom:1rem;">Strategic Capability Brief</h3>
                            <p style="font-size:1.05rem; line-height:1.7;">${c.desc} Policy Oracle brings rigorous quantitative research, sector expertise, and intergovernmental advisory frameworks to ensure client success in this area.</p>
                            <p style="margin-top:1rem;">Our team works directly with national stakeholders and municipal agencies to customize and implement this sub-capability, adapting deliverables to local statutory compliance rails.</p>
                        </div>

                        <!-- FAQ -->
                        <h2 style="color:var(--text-title); margin-bottom:1.5rem;">Frequently Asked Questions</h2>
                        <div class="faq-container" style="margin-bottom:4rem;">
                            <div class="faq-item">
                                <div class="faq-question">
                                    <span>What deliverables are typical for ${c.name}?</span>
                                    <span class="faq-icon"></span>
                                </div>
                                <div class="faq-answer">
                                    <p>Typical deliverables include strategic action briefs, stakeholder mapping checklists, indicators verification reports, policy draft suggestions, and custom capacity onboarding sessions.</p>
                                </div>
                            </div>
                            <div class="faq-item">
                                <div class="faq-question">
                                    <span>How does Policy Oracle ensure data credibility?</span>
                                    <span class="faq-icon"></span>
                                </div>
                                <div class="faq-answer">
                                    <p>We triangulate multiple sources of evidence: administrative database records, secondary indicator audits, primary household/field surveys, and remote GIS assets checks.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ${getCTASection('../../')}
            ${getFooter(2)}`;
            
            writeHtmlFile(`${countrySlug}/consulting/${s.id}/${c.id}.html`, html);
            allGeneratedUrls.push(`${countrySlug}/consulting/${s.id}/${c.id}.html`);
        });
    });
};

const buildCountyPages = (country, countrySlug) => { /* Disabled, site is duplicated instead */ };

const buildSectorPages = (country, countrySlug) => {
    console.log('Building 135 Sector Pages...');
    sectors.forEach(sec => {
        services.forEach(s => {
            const canonical = `https://www.policy.co.ke/${countrySlug}/sectors/${sec.id}/${s.id}.html`;
            const html = getHeader(`${s.name} for the ${sec.name} Sector — Policy Oracle`, `${s.name} advisory, indicators audit, and strategy designed specifically for the ${sec.name} sector.`, canonical, 2, [
                { name: 'Consulting', url: 'consulting.html' },
                { name: sec.name, url: `sectors/${sec.id}/${s.id}.html` },
                { name: s.name, url: `sectors/${sec.id}/${s.id}.html` }
            ], country) + `
            <section class="section">
                <div class="container">
                    <div style="max-width:800px; margin:0 auto;">
                        <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">Sector Advisory</span>
                        <h1 class="section-title" style="text-align:left; font-size:2rem; margin-top:1rem; margin-bottom:1rem;">${s.name} for <span class="gold-text">${sec.name}</span></h1>
                        <p style="font-size:1.1rem; line-height:1.7; margin-bottom:2rem;">Policy Oracle is highly specialized in developing policy, executing M&amp;E indicators audits, and deploying technical strategies customized for the unique structures of the ${sec.name} sector.</p>
                        
                        <div class="glass-card" style="margin-bottom:3rem;">
                            <h3>Specialized Sector Dynamics</h3>
                            <p style="font-size:0.95rem; margin-top:1rem;">${sec.desc}</p>
                            <p style="margin-top:1rem; font-size:0.95rem;">Applying ${s.name} in the context of ${sec.name} requires deep sectoral expertise. Our think tank partners with domain specialists to ensure our data models, results frameworks, and compliance audits reflect sector-specific best practices.</p>
                        </div>

                        <!-- FAQ -->
                        <h2 style="color:var(--text-title); margin-bottom:1.5rem;">Sector FAQ</h2>
                        <div class="faq-container" style="margin-bottom:4rem;">
                            <div class="faq-item">
                                <div class="faq-question">
                                    <span>How does Policy Oracle model indicators for the ${sec.name} sector?</span>
                                    <span class="faq-icon"></span>
                                </div>
                                <div class="faq-answer">
                                    <p>We design custom theory-of-change models that trace inputs directly to sector outcomes (e.g. crop yield in agriculture, clinic check-in duration in health, or access metrics in WASH).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ${getCTASection('../../')}
            ${getFooter(2)}`;
            
            writeHtmlFile(`${countrySlug}/sectors/${sec.id}/${s.id}.html`, html);
            allGeneratedUrls.push(`${countrySlug}/sectors/${sec.id}/${s.id}.html`);
        });
    });
};

const buildCoursePages = (country, countrySlug) => {
    console.log('Building 30 Course Pages...');
    courses.forEach(c => {
        const canonical = `https://www.policy.co.ke/${countrySlug}/courses/${c.id}.html`;
        const html = getHeader(`${c.name} Course — Policy Oracle`, c.desc, canonical, parseInt(1) + 1, [
            { name: 'Training', url: 'training.html' },
            { name: c.name, url: `courses/${c.id}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div style="max-width:800px; margin:0 auto;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                        <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600; text-transform:uppercase;">${c.cat} Course</span>
                        <div style="font-weight:700; font-size:1.2rem; color:var(--text-title);">${c.price} per participant</div>
                    </div>
                    <h1 class="section-title" style="text-align:left; font-size:2.25rem; margin-top:1rem; margin-bottom:1rem;">${c.name}</h1>
                    
                    <div class="glass-card" style="margin-bottom:3rem; border:1px solid var(--accent-gold);">
                        <h3>Course Quick Facts</h3>
                        <ul style="margin:1rem 0 0 0; padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem; font-size:0.95rem;">
                            <li><strong>Duration:</strong> ${c.duration} of intensive workshops</li>
                            <li><strong>Certification:</strong> CPD-certified hours certificate</li>
                            <li><strong>Delivery:</strong> In-person group workshop or interactive virtual sessions</li>
                            <li><strong>Audience:</strong> Leadership team, managers, and executives</li>
                        </ul>
                    </div>

                    
                    <div class="corporate-discount" style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(243,112,33,0.1); border-left: 4px solid var(--accent-gold); border-radius: 4px;">
                        <h3 style="color: var(--accent-gold); margin-bottom: 0.75rem;">Corporate Tier Pricing</h3>
                        <p style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">Enroll multiple employees to unlock significant team discounts:</p>
                        <ul style="font-size: 0.95rem; margin-left: 1.5rem; color: var(--text-primary); margin-top: 0.5rem; line-height: 1.6;">
                            <li><strong>5 - 10 Participants:</strong> 10% Discount</li>
                            <li><strong>11 - 20 Participants:</strong> 15% Discount</li>
                            <li><strong>21+ Participants:</strong> 25% Discount</li>
                        </ul>
                    </div>
                    <h2 style="color:var(--text-title); margin-bottom:1rem;">Program Curriculum Summary</h2>
                    <p style="font-size:1.1rem; line-height:1.7; margin-bottom:2rem;">${c.desc}</p>
                    <p>Participants in this course will analyze case studies of devolved strategies, practice decision-making simulations under ambiguity, and outline custom action roadmaps to implement directly inside their teams.</p>

                    <!-- CTAs -->
                    <div style="text-align:center; margin-bottom:4rem;">
                        <a href="https://wa.me/254791873974" target="_blank" rel="noopener" class="btn btn-primary">Enroll via WhatsApp Chat</a>
                    </div>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/courses/${c.id}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/courses/${c.id}.html`);
    });
};

const buildCertificationPages = (country, countrySlug) => {
    console.log('Building 390 Certification Pages...');
    
    // 15 Field Overview pages
    certificationFields.forEach(f => {
        const canonical = `https://www.policy.co.ke/${countrySlug}/certifications/${f.id}.html`;
        const html = getHeader(`${f.name} Professional Certifications — Policy Oracle`, `Browse ${f.count} self-paced professional credentials in ${f.name} from Global Leadership Institute.`, canonical, parseInt(1) + 1, [
            { name: 'Training', url: 'training.html' },
            { name: f.name, url: `certifications/${f.id}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div style="max-width:800px; margin:0 auto;">
                    <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">GLI Certification Field</span>
                    <h1 class="section-title" style="text-align:left; font-size:2rem; margin-top:1rem; margin-bottom:1rem;">${f.name} Credentials</h1>
                    <p style="font-size:1.15rem; line-height:1.7; margin-bottom:2rem;">Policy Oracle, in collaboration with the <strong>Global Leadership Institute Certification Centre</strong> (certifications.ac), offers ${f.count} self-paced professional credentials in the field of ${f.name}.</p>
                    
                    <div class="glass-card" style="margin-bottom:3rem;">
                        <h3>Available Certification Specialisations</h3>
                        <p style="font-size:0.95rem; margin-top:0.5rem; margin-bottom:1.5rem;">Each course program is studied fully online, concluir with a verifiable digital credential and physical CPD-certified certificate.</p>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                            ${f.topics.map(t => `
                            <div style="padding:0.75rem; background:var(--bg-secondary); border-radius:6px; font-weight:600; font-size:0.9rem;">
                                <a href="${f.id}/${t.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html" style="text-decoration:underline;">${t} Certification</a>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/certifications/${f.id}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/certifications/${f.id}.html`);

        // ~25 topic pages per field
        // We'll generate 25 distinct topic pages per field. To make it dynamic, we'll repeat topics or generate 25 distinct paths
        for (let i = 1; i <= 25; i++) {
            const topicName = `${f.name} Specialisation Level ${i}`;
            const topicSlug = `specialisation-level-${i}`;
            
            const topicCanonical = `https://www.policy.co.ke/certifications/${f.id}/${topicSlug}.html`;
            const topicHtml = getHeader(`${topicName} Professional Certification — Policy Oracle`, `Earn your professional ${topicName} credential from the Global Leadership Institute.`, topicCanonical, parseInt(2) + 1, [
                { name: 'Training', url: 'training.html' },
                { name: f.name, url: `certifications/${f.id}.html` },
                { name: topicName, url: `certifications/${f.id}/${topicSlug}.html` }
            ], country) + `
            <section class="section">
                <div class="container">
                    <div style="max-width:800px; margin:0 auto;">
                        <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">GLI Certification</span>
                        <h1 class="section-title" style="text-align:left; font-size:2rem; margin-top:1rem; margin-bottom:1rem;">${topicName}</h1>
                        <p style="font-size:1.1rem; line-height:1.7; margin-bottom:2rem;">Obtain your verified ${topicName} credential online, completing self-paced modules and a digital assessment benchmarked to international CPD certification standards.</p>
                        
                        <div class="glass-card" style="margin-bottom:3rem;">
                            <h3>Course Program Overview</h3>
                            <p style="font-size:0.95rem; margin-top:1rem;">This credential covers foundational definitions, strategic implementation models, risk mitigation frameworks, and case studies tailored for professionals in this field.</p>
                            <p style="margin-top:1rem; font-size:0.95rem;"><strong>Cost:</strong> USD 349 (includes digital badge, online testing and printed certificate dispatch).</p>
                        </div>
                    </div>
                </div>
            </section>
            ${getCTASection('../../')}
            ${getFooter(2)}`;
            
            writeHtmlFile(`${countrySlug}/certifications/${f.id}/${topicSlug}.html`, topicHtml);
            allGeneratedUrls.push(`${countrySlug}/certifications/${f.id}/${topicSlug}.html`);
        }
    });
};

const buildGlossaryPages = (country, countrySlug) => {
    console.log('Building 100 Glossary Pages...');
    glossaryTerms.forEach(t => {
        const slug = t.term.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const canonical = `https://www.policy.co.ke/${countrySlug}/glossary/${slug}.html`;
        const html = getHeader(`What is ${t.term}? Definition &amp; Context — Policy Oracle`, `${t.term} definition: ${t.def.substring(0, 150)}...`, canonical, 1, [
            { name: 'Glossary', url: 'sitemap-page.html' },
            { name: t.term, url: `glossary/${slug}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div style="max-width:800px; margin:0 auto;">
                    <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">Governance Glossary</span>
                    <h1 class="section-title" style="text-align:left; font-size:2.25rem; margin-top:1rem; margin-bottom:1rem;">What is <span class="gold-text">${t.term}</span>?</h1>
                    
                    <div class="glass-card" style="margin-bottom:3rem; font-size:1.1rem; line-height:1.7; border-left:3px solid var(--accent-gold);">
                        <h3 style="margin-bottom:1rem; color:var(--text-title);">Definition:</h3>
                        <p>${t.def}</p>
                    </div>

                    <h2 style="color:var(--text-title); margin-bottom:1rem;">Context &amp; Why It Matters in Development</h2>
                    <p style="font-size:1rem; line-height:1.6; margin-bottom:1.5rem;">Understanding concepts like ${t.term} is critical for designing robust policies, verifying indicators, and executing county public finance audits. Policy Oracle incorporates these metrics across all public sector and corporate engagements in Kenya.</p>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/glossary/${slug}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/glossary/${slug}.html`);
    });
};

const buildCaseStudyPages = (country, countrySlug) => {
    console.log('Building 12 Case Study Pages...');
    caseStudies.forEach(c => {
        const canonical = `https://www.policy.co.ke/${countrySlug}/case-studies/${c.id}.html`;
        const html = getHeader(`${c.title} — Case Study — Policy Oracle`, c.desc, canonical, parseInt(1) + 1, [
            { name: 'Consulting', url: 'consulting.html' },
            { name: 'Case Studies', url: `case-studies/${c.id}.html` },
            { name: c.client, url: `case-studies/${c.id}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div style="max-width:800px; margin:0 auto;">
                    <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">Case History</span>
                    <h1 class="section-title" style="text-align:left; font-size:2rem; margin-top:1rem; margin-bottom:1rem;">${c.title}</h1>
                    <div style="font-weight:600; color:var(--text-secondary); margin-bottom:2rem;">Client: ${c.client} · Year: ${c.year} · Practice: ${c.practice}</div>
                    
                    <div class="glass-card" style="margin-bottom:3rem;">
                        <h3>Executive Summary</h3>
                        <p style="font-size:1.05rem; line-height:1.7; margin-top:1rem;">${c.desc}</p>
                    </div>

                    <h2 style="color:var(--text-title); margin-bottom:1rem;">Methodological Rigour &amp; Approach</h2>
                    <p style="font-size:1rem; line-height:1.6; margin-bottom:1.5rem;">For this engagement, Policy Oracle deployed robust quantitative indicators verification, baseline comparisons, and ex-post impact assessment audits. Data triangulation confirmed that output results were fully verifiable, ensuring client and stakeholder alignment.</p>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/case-studies/${c.id}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/case-studies/${c.id}.html`);
    });
};

const buildInsightPages = (country, countrySlug) => {
    console.log('Building 50 Insight Pages...');
    insights.forEach(i => {
        const canonical = `https://www.policy.co.ke/${countrySlug}/insights/${i.id}.html`;
        const html = getHeader(`${i.title} — Policy Oracle`, i.desc, canonical, parseInt(1) + 1, [
            { name: 'Insights', url: 'sitemap-page.html' },
            { name: i.title, url: `insights/${i.id}.html` }
        ], country) + `
        <section class="section">
            <div class="container">
                <div style="max-width:800px; margin:0 auto;">
                    <span class="service-badge" style="background:var(--accent-gold); color:#ffffff; padding:0.25rem 0.75rem; font-size:0.8rem; border-radius:20px; font-weight:600;">Insights &amp; Articles</span>
                    <h1 class="section-title" style="text-align:left; font-size:2rem; margin-top:1rem; margin-bottom:1rem;">${i.title}</h1>
                    <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:2rem;">Published: ${i.date} · Author: ${i.author}</div>
                    
                    <div class="glass-card" style="margin-bottom:3rem;">
                        <p style="font-size:1.1rem; line-height:1.7;">${i.desc}</p>
                        <p style="margin-top:1rem; font-size:1rem;">As public policy, M&amp;E, and technology converge in Eastern Africa, institutions require detailed guidance to align their strategies. This article traces developments and proposals to support sustainable growth across regional bodies.</p>
                    </div>
                </div>
            </div>
        </section>
        ${getCTASection('../')}
        ${getFooter(1)}`;
        
        writeHtmlFile(`${countrySlug}/insights/${i.id}.html`, html);
        allGeneratedUrls.push(`${countrySlug}/insights/${i.id}.html`);
    });
};

const buildHtmlSitemap = (country, countrySlug) => {
    console.log('Building HTML Sitemap Page...');
    
    const canonical = 'https://www.policy.co.ke/sitemap-page.html';
    const html = getHeader('Sitemap — Policy Oracle', 'Comprehensive sitemap listing all indexable pages for Policy Oracle Limited.', canonical, parseInt(0) + 1, [{ name: 'Sitemap', url: 'sitemap-page.html' }], country) + `
    <section class="section">
        <div class="container">
            <h1 class="section-title" style="margin-bottom:2rem;">Policy Oracle Website <span class="gold-text">Sitemap</span></h1>
            <p style="text-align:center; max-width:600px; margin:0 auto 4rem auto; color:var(--text-secondary);">Browse all pages across our think tank consultancy, including County locations, sector practices, course details, certifications, and our policy glossary.</p>
            
            <div class="sitemap-grid">
                <div class="sitemap-col">
                    <h3>Core Sections</h3>
                    <ul class="sitemap-list">
                        <li><a href="index.html">Homepage</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="consulting.html">Consulting Services Hub</a></li>
                        <li><a href="research.html">Research &amp; Capacity Hub</a></li>
                        <li><a href="training.html">Training &amp; Executive Learning</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>
                
                <div class="sitemap-col">
                    <h3>Consulting Areas</h3>
                    <ul class="sitemap-list">
                        ${services.map(s => `
                        <li><a href="consulting/${s.id}.html">${s.name}</a></li>
                        `).join('')}
                    </ul>
                </div>

                <div class="sitemap-col">
                    <h3>Case Histories</h3>
                    <ul class="sitemap-list">
                        ${caseStudies.map(c => `
                        <li><a href="case-studies/${c.id}.html">${c.title}</a></li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <div class="sitemap-grid" style="margin-top:3rem;">
                <div class="sitemap-col">
                    <h3>30 Executive Courses</h3>
                    <ul class="sitemap-list">
                        ${courses.map(c => `
                        <li><a href="courses/${c.id}.html">${c.name}</a></li>
                        `).join('')}
                    </ul>
                </div>

                <div class="sitemap-col">
                    <h3>15 Professional Fields</h3>
                    <ul class="sitemap-list">
                        ${certificationFields.map(f => `
                        <li><a href="certifications/${f.id}.html">${f.name} Overview</a></li>
                        `).join('')}
                    </ul>
                </div>

                <div class="sitemap-col">
                    <h3>Glossary (Top 15 Terms)</h3>
                    <ul class="sitemap-list">
                        ${glossaryTerms.slice(0, 15).map(t => `
                        <li><a href="glossary/${t.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html">${t.term}</a></li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <div style="margin-top:4rem;" class="glass-card">
                <h3>SEO Location Pages Index</h3>
                <p style="margin-bottom:1.5rem; font-size:0.95rem;">Policy Oracle consulting advisory, indicator audits, and training are active across 24 regional countries. Choose a regional location to view tailored services:</p>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:1rem;">
                    ${countries.map(c => {
                        const slug = c.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        return `<div><a href="${slug}/consulting.html" style="color:var(--accent-gold); font-size:0.9rem; text-decoration:underline;">${c} Consulting</a></div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    </section>
    ${getFooter(0)}`;
    
    writeHtmlFile(`${countrySlug}/${countrySlug}/sitemap-page.html`, html);
    allGeneratedUrls.push(`${countrySlug}/${countrySlug}/sitemap-page.html`);
};

const buildSitemapXml = () => {
    console.log('Building sitemap.xml...');
    const urlsXml = allGeneratedUrls.map(url => `  <url>
    <loc>https://www.policy.co.ke/${url}</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === 'index.html' ? '1.0' : (url.includes('/') ? '0.6' : '0.8')}</priority>
  </url>`).join('\n');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemapContent, 'utf8');
    console.log(`Generated sitemap.xml with ${allGeneratedUrls.length} entries.`);
};

const buildRobotsTxt = () => {
    console.log('Building robots.txt...');
    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://www.policy.co.ke/sitemap.xml
`;
    fs.writeFileSync('robots.txt', robotsContent, 'utf8');
};

// 4. INITIATE BUILD PROCESS
const runBuild = () => {
    console.log('=== STARTING POLICY ORACLE REGIONAL BUILD ===');
    
    // Generate root index redirect
    const rootRedirect = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=kenya/index.html">
    <title>Redirecting...</title>
</head>
<body>
    Redirecting to <a href="kenya/index.html">Kenya site</a>.
</body>
</html>`;
    writeHtmlFile('index.html', rootRedirect);

    countries.forEach(country => {
        const countrySlug = country.toLowerCase().replace(/[^a-z0-9]/g, '-');
        console.log(`Building site for ${country}...`);
        buildCorePages(country, countrySlug);
        buildMainServicePages(country, countrySlug);
        buildSubCapabilityPages(country, countrySlug);
        buildSectorPages(country, countrySlug);
        buildCoursePages(country, countrySlug);
        buildCertificationPages(country, countrySlug);
        buildGlossaryPages(country, countrySlug);
        buildCaseStudyPages(country, countrySlug);
        buildInsightPages(country, countrySlug);
        buildHtmlSitemap(country, countrySlug);
    });

    buildSitemapXml();
    buildRobotsTxt();
    console.log('=== BUILD COMPLETED SUCCESSFULLY ===');
    console.log(`Total indexable static pages created: ${allGeneratedUrls.length}`);
};

runBuild();

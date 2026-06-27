export const mockOutputs = {
  generate: (roleTitle, sector = 'Regulation') => {
    const hash = Array.from(roleTitle).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const automateVal = 25 + (hash % 20);
    const augmentVal = 40 + (hash % 18);
    const humanVal = 100 - automateVal - augmentVal;

    return {
      suggestedTitle: `AI-Augmented ${roleTitle}`,
      superpower: `With AI handling routine paperwork, policy searches, administrative verification, and draft generation, this ${roleTitle} role can transition to higher-value outcomes. The professional can now focus on nuance, relationship coordination, complex exception cases, and strategic advice. That creates capacity to identify issues earlier and intervene with more confidence.`,
      categories: [
        { category: 'Compliance', value: 50 + (hash % 40) },
        { category: 'Operations', value: 40 + (hash % 50) },
        { category: 'Communication', value: 60 + (hash % 30) },
        { category: 'Analysis', value: 55 + (hash % 35) },
        { category: 'Decision-Making', value: 45 + (hash % 45) },
        { category: 'Relationship', value: 30 + (hash % 60) }
      ],
      split: [
        { name: 'Automate', value: automateVal },
        { name: 'Augment', value: augmentVal },
        { name: 'Human-Only', value: humanVal }
      ],
      taskScores: [
        { task: `Drafting routine ${roleTitle} documentation`, score: 85, classification: 'Automate', explanation: 'Drafting structured documents from standard data is highly automatable.' },
        { task: 'Cross-checking submissions against policy parameters', score: 78, classification: 'Automate', explanation: 'Policy parameters cross-checks are rules-based and easily assisted by AI.' },
        { task: `Assessing non-standard complex cases in ${sector}`, score: 32, classification: 'Augment', explanation: 'AI can flag parameters, but complex exceptions demand human interpretation.' },
        { task: 'Stakeholder coordination and alignment sessions', score: 28, classification: 'Human-Only', explanation: 'Interpersonal coordination and stakeholder trust require human relationship handling.' },
        { task: 'Formulating final recommendations and decisions', score: 18, classification: 'Human-Only', explanation: 'Final accountability and nuanced value decisions must remain human-led.' }
      ],
      movesToAi: [`Routine document generation`, `First-pass policy parameter matching`, `Data logging and administrative tracking`],
      remainsHuman: [`Complex case assessment`, `Stakeholder alignment`, `Final recommendation and accountability`],
      newFunctions: [`Strategic outcome diagnostics`, `Process improvement advisory`, `Feedback loop monitoring`],
      toolSuggestions: [
        'Document generation assistants',
        'Parameter comparison engines',
        'Collaboration copilots'
      ],
      newRoleProposals: [
        {
          title: `Strategic ${roleTitle} Analyst`,
          description: `Focuses on forward-looking outcome models and systemic optimization across ${sector}.`
        }
      ],
      upskilling: [
        { skill: 'AI-assisted document verification', effort: 'Low', direction: 'Learn to use AI checkers to accelerate routine review tasks.' },
        { skill: 'Data-driven decision optimization', effort: 'Medium', direction: 'Develop competencies in interpreting complex metrics and feedback loops.' },
        { skill: 'Stakeholder management and negotiation', effort: 'High', direction: 'Strengthen high-trust relationship handling and group alignment skills.' }
      ],
      citations: [
        { source: 'Grokipedia Policy Redesign Guide v2.1', section: 'Sec 4.2: Automated Policy Parsing' },
        { source: 'BuildJoyNow AI Impact Database', section: 'Role ID mapping schema' },
        { source: 'Workforce Redesign Taxonomy v1.08', section: 'Admin and Support automation splits' }
      ]
    };
  }
};

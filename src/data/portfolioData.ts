export interface ProjectItem {
  id: string;
  category: 'minecraft' | 'discord' | 'editing' | 'web' | 'skills' | 'about' | 'contact';
  sectionNumber: string;
  sectionTitle: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  detailedText?: string;
  tags: string[];
  links: {
    label: string;
    url: string;
    type?: 'external' | 'copy' | 'action';
  }[];
  stats?: { label: string; value: string }[];
  accentColor?: string;
}

export const PORTFOLIO_DATA: ProjectItem[] = [
  // 01 / MINECRAFT
  {
    id: 'zentramc',
    category: 'minecraft',
    sectionNumber: '01',
    sectionTitle: 'MINECRAFT DEVELOPMENT',
    title: 'ZentraMC',
    subtitle: 'MINECRAFT SERVER DEVELOPMENT',
    tag: 'LIVE SERVER 2026',
    description:
      'My Minecraft network project, built and developed around gameplay systems, server configuration, custom features and player experience.',
    detailedText:
      'Engineered from the ground up for high concurrency, optimal tick-rates, and seamless player journeys. Includes custom matchmaking, automated rank progressions, economy balancing, and robust anti-exploit protections.',
    tags: ['LIVE SERVER', 'GAMEPLAY SYSTEMS', 'PAPER', 'CONFIG'],
    links: [
      { label: 'OPEN SERVER ↗', url: 'https://zentramc.vercel.app', type: 'external' },
      { label: 'COPY IP: zentramc.loca.lol', url: 'zentramc.loca.lol', type: 'copy' },
    ],
    stats: [
      { label: 'STATUS', value: 'ONLINE' },
      { label: 'YEAR', value: '2026' },
      { label: 'CORE', value: 'PAPER / JAVA' },
    ],
  },
  {
    id: 'zentraduels',
    category: 'minecraft',
    sectionNumber: '01',
    sectionTitle: 'MINECRAFT DEVELOPMENT',
    title: 'Zentraduels',
    subtitle: 'PLUGIN DEVELOPMENT',
    tag: 'PAPER • JAVA',
    description:
      'A custom Minecraft PvP plugin project with queue systems, kits, arenas, countdowns and match flow.',
    detailedText:
      'Built in Java for modern Paper server runtimes. Features zero-latency combat tracking, custom battle arenas with automatic reset mechanisms, kit editing interfaces, leaderboard tracking, and configurable match countdowns.',
    tags: ['PAPER', 'JAVA', 'PVP QUEUE', 'ARENA RESET'],
    links: [
      { label: 'VIEW ZENTRAMC ↗', url: 'https://zentramc.vercel.app', type: 'external' },
    ],
    stats: [
      { label: 'TYPE', value: 'PVP PLUGIN' },
      { label: 'FRAMEWORK', value: 'PAPER API' },
      { label: 'COMPLEXITY', value: 'REAL-TIME QUEUES' },
    ],
  },
  {
    id: 'zentraholograms',
    category: 'minecraft',
    sectionNumber: '01',
    sectionTitle: 'MINECRAFT DEVELOPMENT',
    title: 'ZentraHolograms',
    subtitle: 'PLUGIN DEVELOPMENT',
    tag: 'PAPER • JAVA',
    description:
      'A Minecraft hologram plugin project created for displaying custom information and server content.',
    detailedText:
      'Lightweight floating text and interactive hologram entities designed to display dynamic server statistics, welcome banners, announcement broadcasts, and custom clickable hologram prompts without packet lag.',
    tags: ['PAPER', 'JAVA', 'HOLOGRAMS', 'SERVER UI'],
    links: [
      { label: 'SERVER NETWORK ↗', url: 'https://zentramc.vercel.app', type: 'external' },
    ],
    stats: [
      { label: 'TYPE', value: 'DISPLAY SYSTEM' },
      { label: 'ENGINE', value: 'PACKET PROTOCOL' },
      { label: 'EFFICIENCY', value: 'ZERO TICK IMPACT' },
    ],
  },

  // 02 / DISCORD
  {
    id: 'discord-bots',
    category: 'discord',
    sectionNumber: '02',
    sectionTitle: 'DISCORD DEVELOPMENT',
    title: 'Discord Bot Development',
    subtitle: 'CUSTOM BOTS • AUTOMATION • AI',
    tag: 'CUSTOM SYSTEMS',
    description:
      'I can build custom Discord bots for different use cases, systems and communities, excluding illegal or harmful bots.',
    detailedText:
      'Specialized in event-driven architecture, slash commands, interactive buttons and modal forms, database-backed role assignments, automated moderation, API integrations, and community utility systems.',
    tags: ['CUSTOM BOTS', 'AUTOMATION', 'AI', 'DISCORD.JS'],
    links: [
      { label: 'JOIN DISCORD COMMUNITY ↗', url: 'https://discord.gg/Q8cvUzamsQ', type: 'external' },
      { label: 'DISCORD PROFILE ↗', url: 'https://discord.com/users/1123668181534384229', type: 'external' },
    ],
    stats: [
      { label: 'EXPERIENCE', value: 'BOT ARCHITECTURE' },
      { label: 'INTEGRATIONS', value: 'REST API & AI' },
    ],
  },
  {
    id: 'discord-servers',
    category: 'discord',
    sectionNumber: '02',
    sectionTitle: 'DISCORD DEVELOPMENT',
    title: 'Discord Server Development',
    subtitle: 'SETUP • ROLES • SYSTEMS',
    tag: 'COMMUNITY INFRASTRUCTURE',
    description:
      'Server setup, channels, categories, roles, permissions, tickets, bots and community systems.',
    detailedText:
      'Clean structural design for gaming communities, development studios, and creators. Includes hierarchical permission auditing, ticket support pipelines, auto-onboarding flows, custom embeds, and aesthetic layout design.',
    tags: ['SETUP', 'ROLES', 'SYSTEMS', 'SECURITY'],
    links: [
      { label: 'COMMUNITY SERVER ↗', url: 'https://discord.gg/Q8cvUzamsQ', type: 'external' },
    ],
    stats: [
      { label: 'AUDITING', value: 'ZERO EXPLOIT ROLES' },
      { label: 'SYSTEMS', value: 'TICKETS & AUTO-MOD' },
    ],
  },
  {
    id: 'zeno-bot',
    category: 'discord',
    sectionNumber: '02',
    sectionTitle: 'DISCORD DEVELOPMENT',
    title: 'Zeno',
    subtitle: 'DISCORD BOT / AI',
    tag: 'AI ASSISTANT',
    description:
      'AI-powered Discord support bot developed for ZentraMC, designed to answer server-related questions and assist the community.',
    detailedText:
      'Trained and configured to resolve frequent player inquiries, explain server mechanics, guide users through connection troubleshooting, and maintain context-aware conversation within Discord support channels.',
    tags: ['BOT: <@1544796340909903972>', 'AI SUPPORT', 'ZENTRAMC'],
    links: [
      { label: 'DISCORD PROFILE ↗', url: 'https://discord.com/users/1123668181534384229', type: 'external' },
      { label: 'DISCORD SERVER ↗', url: 'https://discord.gg/Q8cvUzamsQ', type: 'external' },
    ],
    stats: [
      { label: 'MENTION ID', value: '<@1544796340909903972>' },
      { label: 'PURPOSE', value: 'ZENTRAMC SUPPORT' },
    ],
  },

  // 03 / EDITING & VFX
  {
    id: 'aevyrrr-channel',
    category: 'editing',
    sectionNumber: '03',
    sectionTitle: 'EDITING PROJECTS',
    title: 'AEVYRRR',
    subtitle: 'CONTENT / GAMING',
    tag: 'YOUTUBE CREATOR',
    description:
      'Gaming videos, Shorts & content creation focused on dynamic gaming sessions, energetic pacing, and creative narratives.',
    detailedText:
      'High-energy gaming gameplay, synchronized sound effects, fast-paced comedic cuts, and custom YouTube Shorts optimized for player engagement and retention.',
    tags: ['GAMING', 'SHORTS', 'PACING', 'SFX'],
    links: [
      { label: 'VIEW CHANNEL ↗', url: 'https://www.youtube.com/@Aevyrrr', type: 'external' },
    ],
    stats: [
      { label: 'PLATFORM', value: 'YOUTUBE' },
      { label: 'FORMAT', value: 'GAMING & SHORTS' },
    ],
  },
  {
    id: 'paulhuyawr-channel',
    category: 'editing',
    sectionNumber: '03',
    sectionTitle: 'EDITING PROJECTS',
    title: 'PAULHUYAWR',
    subtitle: 'LONG-FORM GAMING',
    tag: 'STORY & GAMEPLAY',
    description:
      'Long-form gaming content and videos diving into immersive gaming experiences, episodic series, and community highlights.',
    detailedText:
      'Structured storytelling, long-format gameplay editing, atmospheric sound design, commentary balance, and cinematic transitions across extended gaming series.',
    tags: ['LONG-FORM', 'GAMING', 'SERIES', 'AUDIO DESIGN'],
    links: [
      { label: 'VIEW CHANNEL ↗', url: 'https://www.youtube.com/@Paulhuyawr', type: 'external' },
    ],
    stats: [
      { label: 'TYPE', value: 'LONG-FORM' },
      { label: 'FOCUS', value: 'GAMEPLAY NARRATIVE' },
    ],
  },
  {
    id: 'aevrnnvfx-channel',
    category: 'editing',
    sectionNumber: '03',
    sectionTitle: 'EDITING PROJECTS',
    title: 'AEVRNNVFX',
    subtitle: 'EDITING / VISUALS',
    tag: 'MOTION & VFX',
    description:
      'Edits, visual projects and motion work. Kinetic typography, rhythm synchronization, visual experiments, and high-impact VFX.',
    detailedText:
      'Experimental motion design, beat synchronization, speed ramps, 3D camera tracking, glowing particle layers, sound staging, and futuristic reel aesthetics.',
    tags: ['VFX', 'MOTION DESIGN', 'KINETIC', 'REEL'],
    links: [
      { label: 'VIEW CHANNEL ↗', url: 'https://www.youtube.com/@aevrnnvfx', type: 'external' },
      { label: 'WATCH SHORTS ↗', url: 'https://www.youtube.com/@aevrnnvfx/shorts', type: 'external' },
    ],
    stats: [
      { label: 'STYLE', value: 'MOTION & VFX' },
      { label: 'SOFTWARE', value: 'AFTER EFFECTS / PREMIERE' },
    ],
  },

  // 04 / WEBSITE DESIGN & DEV
  {
    id: 'aevrnn-portfolio',
    category: 'web',
    sectionNumber: '04',
    sectionTitle: 'WEBSITE DESIGN & DEVELOPMENT',
    title: 'AEVRNN Portfolio',
    subtitle: 'CURRENT PROJECT ✦',
    tag: 'FLAGSHIP EXPERIENCE',
    description:
      'Designed and developed from scratch from the interface, animations and visual system to the responsive experience.',
    detailedText:
      'Modern web application combining advanced 3D WebGL rendering, custom camera choreography, mathematical smooth lerp physics, dark walnut/bronze aesthetics, and rich interactive modals.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive UI', 'Three.js'],
    links: [
      { label: 'PORTFOLIO SOURCE ↗', url: 'https://aevrnn.vercel.app', type: 'external' },
    ],
    stats: [
      { label: 'DOMAIN', value: 'aevrnn.dev' },
      { label: 'AESTHETIC', value: 'BRONZE / WALNUT / 3D' },
    ],
  },
  {
    id: 'modern-ui-design',
    category: 'web',
    sectionNumber: '04',
    sectionTitle: 'WEBSITE DESIGN & DEVELOPMENT',
    title: 'Modern UI Design',
    subtitle: 'VISUAL SYSTEM / 01',
    tag: 'UI / UX CRAFT',
    description:
      'Futuristic interfaces with cinematic motion, glowing effects, glass surfaces and responsive layouts.',
    detailedText:
      'Crafted with deliberate typographical hierarchies, calculated nested padding, high-contrast dark palette balance, subtle micro-interactions, and accessible interactive touch surfaces.',
    tags: ['CINEMATIC MOTION', 'GLASS SURFACES', 'RESPONSIVE', 'SYSTEMS'],
    links: [
      { label: 'CONTACT DESIGNER ↗', url: '#contact', type: 'action' },
    ],
    stats: [
      { label: 'DISCIPLINE', value: 'VISUAL DESIGN' },
      { label: 'FOCUS', value: 'FUTURISTIC & TACTILE' },
    ],
  },
  {
    id: 'frontend-dev',
    category: 'web',
    sectionNumber: '04',
    sectionTitle: 'WEBSITE DESIGN & DEVELOPMENT',
    title: 'Frontend Development',
    subtitle: 'HTML • CSS • JAVASCRIPT',
    tag: 'CLEAN ARCHITECTURE',
    description:
      'Lightweight and maintainable websites built with modern frontend technologies and smooth interactions.',
    detailedText:
      'Robust TypeScript implementations, optimized DOM updates, silky 60fps animations, mobile-first responsive viewports, and zero-bloat asset delivery.',
    tags: ['HTML', 'CSS', 'JS', 'TYPESCRIPT', 'PERFORMANCE'],
    links: [
      { label: 'INSPECT CODE ↗', url: 'https://aevrnn.vercel.app', type: 'external' },
    ],
    stats: [
      { label: 'ENGINE', value: 'MODERN WEB' },
      { label: 'PERFORMANCE', value: '60 FPS LERP' },
    ],
  },

  // 05 / SKILLS
  {
    id: 'skills-core',
    category: 'skills',
    sectionNumber: '05',
    sectionTitle: 'SKILLS & EXPERTISE',
    title: 'Still learning. Still building.',
    subtitle: 'CORE CAPABILITIES',
    tag: 'SKILLS_04',
    description:
      'A continuous journey of technical craftsmanship across game systems, automated community tools, digital reels, and web platforms.',
    detailedText:
      '1. Minecraft Development (SERVER / PLUGINS)\n2. Plugin Development (BEGINNER)\n3. Discord Development (BOTS / SERVERS)\n4. Video Editing (GAMING / SOCIAL)\n5. Website Design & Development (HTML / CSS / JAVASCRIPT)',
    tags: ['JAVA', 'JAVASCRIPT', 'MINECRAFT', 'DISCORD', 'AI', 'VIDEO EDITING'],
    links: [
      { label: 'DISCUSS A PROJECT ↗', url: '#contact', type: 'action' },
    ],
    stats: [
      { label: '01', value: 'MINECRAFT SERVER / PLUGINS' },
      { label: '02', value: 'DISCORD BOTS & SERVERS' },
      { label: '03', value: 'VIDEO EDITING & MOTION' },
      { label: '04', value: 'WEB DESIGN & DEV' },
    ],
  },

  // 06 / ABOUT
  {
    id: 'about-aevrnn',
    category: 'about',
    sectionNumber: '06',
    sectionTitle: 'ABOUT AEVRNN',
    title: 'Curious by default.',
    subtitle: 'AURITRA PAUL / AEVRNN',
    tag: 'DEVELOPER • EDITOR • CREATOR',
    description:
      "I'm Auritra Paul, but online you'll probably know me as AEVRNN. I'm into Minecraft development, Discord, websites, video editing and pretty much anything I can build or mess around with.",
    detailedText:
      "I make Minecraft plugins and server systems, build Discord bots, design websites and work on random ideas whenever something interesting pops into my head. I also mess around with AI and other stuff just to see what I can make.\n\nI build Minecraft plugins and server systems, create Discord bots and communities, design responsive websites and experiment with new creative projects.\n\nI'm constantly learning, building and improving through every project one idea at a time.",
    tags: ['MINECRAFT', 'JAVA', 'DISCORD', 'JAVASCRIPT', 'AI', 'VIDEO'],
    links: [
      { label: 'DISCORD ↗', url: 'https://discord.com/users/1123668181534384229', type: 'external' },
      { label: 'YOUTUBE ↗', url: 'https://youtube.com/@aevrnnvfx', type: 'external' },
      { label: 'INSTAGRAM ↗', url: 'https://www.instagram.com/stfupaul_', type: 'external' },
    ],
    stats: [
      { label: 'NAME', value: 'Auritra Paul' },
      { label: 'KNOWN AS', value: 'AEVRNN' },
      { label: 'CRAFT', value: 'Minecraft / Discord / Web / Video' },
      { label: 'STATUS', value: 'Learning • Building • Experimenting' },
    ],
  },

  // 07 / CONTACT
  {
    id: 'contact-section',
    category: 'contact',
    sectionNumber: '07',
    sectionTitle: 'CONTACT',
    title: "Have an idea? Let's build it.",
    subtitle: 'DIRECT REACH',
    tag: 'BUILD • EDIT • CREATE',
    description:
      'Want to discuss a Minecraft project, Discord system, bot or editing work? Reach out directly.',
    detailedText:
      'Feel free to connect directly on Discord or send a message via email. Available for Minecraft plugins, server infrastructure, custom Discord bots, motion edits, and modern websites.',
    tags: ['EMAIL: aevyrr@gmail.com', 'DISCORD', 'INSTAGRAM', 'YOUTUBE'],
    links: [
      { label: 'OPEN CONTACT TRANSMISSION FORM ↗', url: '#contact', type: 'action' },
      { label: 'DISCORD (1123668181534384229) ↗', url: 'https://discord.com/users/1123668181534384229', type: 'external' },
      { label: 'DISCORD SERVER ↗', url: 'https://discord.gg/Q8cvUzamsQ', type: 'external' },
      { label: 'YOUTUBE CHANNEL ↗', url: 'https://youtube.com/@aevrnnvfx', type: 'external' },
      { label: 'INSTAGRAM ↗', url: 'https://www.instagram.com/stfupaul_', type: 'external' },
    ],
    stats: [
      { label: 'DIRECT EMAIL', value: 'aevyrr@gmail.com' },
      { label: 'COPYRIGHT', value: '© AEVRNN. ALL RIGHTS RESERVED.' },
    ],
  },
];

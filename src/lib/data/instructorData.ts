export const LEARNERS = [
  { id:1, name:"Amara Diallo",    cohort:"2025-A", progress:82, status:"active",   lastSeen:"2h ago",  score:88, submissions:5 },
  { id:2, name:"Liam Chen",       cohort:"2025-A", progress:67, status:"active",   lastSeen:"5h ago",  score:74, submissions:4 },
  { id:3, name:"Sofia Martins",   cohort:"2025-A", progress:95, status:"active",   lastSeen:"1h ago",  score:96, submissions:6 },
  { id:4, name:"Kwame Asante",    cohort:"2025-A", progress:34, status:"at-risk",  lastSeen:"3d ago",  score:52, submissions:2 },
  { id:5, name:"Priya Nair",      cohort:"2025-B", progress:78, status:"active",   lastSeen:"1d ago",  score:81, submissions:5 },
  { id:6, name:"Tom Eriksson",    cohort:"2025-B", progress:12, status:"at-risk",  lastSeen:"7d ago",  score:40, submissions:1 },
  { id:7, name:"Yuki Tanaka",     cohort:"2025-B", progress:90, status:"active",   lastSeen:"3h ago",  score:93, submissions:6 },
  { id:8, name:"Chidi Okafor",    cohort:"2025-A", progress:58, status:"inactive", lastSeen:"4d ago",  score:61, submissions:3 },
];

export const COURSES = [
  { id:1, title:"Full-Stack Web Development",    cohort:"2025-A", published:true,  modules:5, lessons:24, enrolled:42, completion:67,
    modules_data:[
      { id:1, title:"HTML & CSS Foundations", lessons:6, week:"W1-2", published:true  },
      { id:2, title:"JavaScript Core",        lessons:5, week:"W3-4", published:true  },
      { id:3, title:"React Fundamentals",     lessons:6, week:"W5-6", published:true  },
      { id:4, title:"Node.js & APIs",         lessons:4, week:"W7-8", published:false },
      { id:5, title:"Databases & Deployment", lessons:3, week:"W9-10",published:false },
    ]
  },
  { id:2, title:"Advanced JavaScript Patterns", cohort:"2025-B", published:true,  modules:3, lessons:14, enrolled:28, completion:42,
    modules_data:[
      { id:1, title:"Design Patterns", lessons:5, week:"W1-2", published:true  },
      { id:2, title:"Performance",     lessons:5, week:"W3-4", published:true  },
      { id:3, title:"Testing",         lessons:4, week:"W5-6", published:false },
    ]
  },
];

export const ASSIGNMENTS = [
  { id:1, title:"Weather App with Fetch API",     course:"Full-Stack Web Dev", due:"Mar 1",  submitted:34, graded:22, total:42 },
  { id:2, title:"React Component Library",        course:"Full-Stack Web Dev", due:"Mar 15", submitted:18, graded:8,  total:42 },
  { id:3, title:"Design Patterns Implementation", course:"Adv JS Patterns",    due:"Mar 5",  submitted:21, graded:21, total:28 },
];

export const MODERATION_REQUESTS = [
  { id:1, learner:"Kwame Asante",  reason:"Repeated plagiarism on 3 assignments", requestedBy:"Admin", date:"Feb 24", urgency:"high"   },
  { id:2, learner:"Tom Eriksson",  reason:"Inactive for 7+ days, missed deadlines", requestedBy:"Admin",date:"Feb 26", urgency:"medium" },
];

export const ANNOUNCEMENTS = [
  { id:1, title:"Week 5 content goes live Friday", scope:"Course", time:"2h ago" },
  { id:2, title:"Q&A session — Thursday 3PM UTC",  scope:"Cohort", time:"1d ago" },
  { id:3, title:"Assignment deadline extended +48h",scope:"Course", time:"2d ago" },
];

export const MESSAGES_DATA = [
  { id:1, learnerId:4, learner:"Kwame Asante",  cohort:"2025-A", avatar:"KA", status:"at-risk", lastMessage:"I've been struggling with the async JS module. Can you help?",        time:"10m ago", unread:2, thread:[
    { from:"learner",     text:"Hi Dr. Kowalski, I've been struggling with the async JS module. Can you help?", time:"10m ago" },
  ]},
  { id:2, learnerId:6, learner:"Tom Eriksson",  cohort:"2025-B", avatar:"TE", status:"at-risk", lastMessage:"Sorry for being absent, I had a personal emergency.",                  time:"1h ago",  unread:1, thread:[
    { from:"learner",     text:"Sorry for being absent, I had a personal emergency.", time:"1h ago" },
  ]},
  { id:3, learnerId:1, learner:"Amara Diallo",  cohort:"2025-A", avatar:"AD", status:"active",  lastMessage:"Thank you for the feedback on my assignment!",                         time:"3h ago",  unread:0, thread:[
    { from:"instructor",  text:"Great work on the Weather App assignment Amara! A few notes on error handling.", time:"5h ago" },
    { from:"learner",     text:"Thank you for the feedback on my assignment!", time:"3h ago" },
  ]},
  { id:4, learnerId:3, learner:"Sofia Martins", cohort:"2025-A", avatar:"SM", status:"active",  lastMessage:"Can I get early access to Module 4?",                                  time:"1d ago",  unread:0, thread:[
    { from:"learner",     text:"Can I get early access to Module 4? I've finished everything so far.", time:"1d ago" },
    { from:"instructor",  text:"That's impressive Sofia! Let me unlock Module 4 for you.", time:"1d ago" },
  ]},
];

export const QUIZZES = [
  { title:"Async JavaScript — Knowledge Check", questions:5,  type:"MCQ",   pass:70, retakes:2, responses:34, avg:82 },
  { title:"CSS Grid & Flexbox Quiz",             questions:8,  type:"Mixed", pass:60, retakes:3, responses:41, avg:76 },
  { title:"React Hooks Assessment",              questions:6,  type:"MCQ",   pass:70, retakes:1, responses:18, avg:68 },
];

export const SC = { active:"green", "at-risk":"rose", inactive:"gray" };

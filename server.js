const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));
app.get('/gm', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gm.html')));

// ─── QUESTIONS ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1, prize: '£100', difficulty: 'Warm-Up',
    question: 'A customer calls in tears saying they\'ve been scammed. What\'s the FIRST thing you should do?',
    answers: [
      { text: 'Ask for their account number to pull up the record', correct: false },
      { text: 'Acknowledge their distress and tell them they\'ve done the right thing by calling', correct: true },
      { text: 'Transfer them straight to the fraud team immediately', correct: false },
      { text: 'Reassure them it\'s a common scam and not to worry', correct: false },
    ],
    explanation: 'The first words matter most. Before any process, validate their experience. They\'ve already been let down once today — don\'t let the next voice do the same.',
  },
  {
    id: 2, prize: '£200', difficulty: 'Warm-Up',
    question: 'A customer says: "I feel so stupid — I can\'t believe I fell for this." The BEST response is:',
    answers: [
      { text: '"Don\'t worry, it happens to a lot of people."', correct: false },
      { text: '"Unfortunately these things do happen when we\'re not careful."', correct: false },
      { text: '"These criminals are professional manipulators — many intelligent people are affected every day."', correct: true },
      { text: '"Let\'s focus on what we can do now rather than what happened."', correct: false },
    ],
    explanation: 'Option C directly challenges the shame — and it\'s true. Doctors, lawyers, engineers fall for these scams. Intelligence is not protection. Emotional state is. The other options, while kind, don\'t tackle the self-blame.',
  },
  {
    id: 3, prize: '£500', difficulty: 'Getting Warmer',
    question: 'A customer made a bank transfer to a scammer 25 minutes ago. What\'s the MOST urgent action?',
    answers: [
      { text: 'Take a full account of what happened before doing anything', correct: false },
      { text: 'Tell them to report it to Action Fraud immediately', correct: false },
      { text: 'Attempt to stop or recall the payment before anything else', correct: true },
      { text: 'Reset their online banking password first', correct: false },
    ],
    explanation: 'The 2-hour window is critical for Faster Payments recall. Funds can move through multiple accounts within minutes. Process the recall first — documentation comes after.',
  },
  {
    id: 4, prize: '£1,000', difficulty: 'Getting Warmer',
    question: 'Someone calls your customer claiming to be from their bank, saying there\'s fraud and they need to move money to a "safe account". This is:',
    answers: [
      { text: 'Possibly legitimate — banks do run fraud protection procedures', correct: false },
      { text: 'A classic impersonation scam — banks NEVER ask customers to move money to a safe account', correct: true },
      { text: 'A standard security procedure worth complying with', correct: false },
      { text: 'Only a scam if the caller cannot verify their identity', correct: false },
    ],
    explanation: '"Safe account" is the single biggest red flag in banking fraud. No legitimate bank, police force, or government body will EVER ask you to move money to protect it. This is always a scam.',
  },
  {
    id: 5, prize: '£2,000', difficulty: '⭐ SAFE HAVEN ⭐',
    question: 'You\'re on a call and the customer pauses mid-sentence as if listening to something, and can\'t explain clearly WHY they\'re making a payment. A scammer may be coaching them live. What do you do?',
    answers: [
      { text: 'Process the payment — it\'s not your place to interfere', correct: false },
      { text: 'Say directly: "I think you\'re being scammed right now"', correct: false },
      { text: 'Ask open questions: "Can you explain in your own words why you\'re making this payment today?"', correct: true },
      { text: 'Immediately hang up and call the police', correct: false },
    ],
    explanation: 'Open-ended questions break the scammer\'s script — the customer can\'t answer in their own words what they were coached to say. This creates doubt and buys time. Directly accusing them often causes defensiveness and they comply with the scammer anyway.',
  },
  {
    id: 6, prize: '£4,000', difficulty: 'Serious Territory',
    question: 'A customer paid for concert tickets on a social media marketplace — the seller disappeared. They paid by DEBIT CARD. What recovery option applies?',
    answers: [
      { text: 'Section 75 of the Consumer Credit Act', correct: false },
      { text: 'PSR mandatory reimbursement (up to £85,000)', correct: false },
      { text: 'Chargeback through their card scheme', correct: true },
      { text: 'Nothing — social media purchases have no consumer protection', correct: false },
    ],
    explanation: 'Section 75 is for CREDIT cards (£100–£30k). PSR mandatory reimbursement covers BANK TRANSFERS via Faster Payments. Debit card purchase scams → Chargeback (within 120 days). Every payment method has a different pathway — know them all.',
  },
  {
    id: 7, prize: '£8,000', difficulty: 'Serious Territory',
    question: 'Under the PSR mandatory reimbursement rules (effective October 2024), how long does a bank have to reimburse an eligible APP fraud victim?',
    answers: [
      { text: '24 hours', correct: false },
      { text: '5 business days', correct: true },
      { text: '30 calendar days', correct: false },
      { text: '8 weeks', correct: false },
    ],
    explanation: '5 business days is standard, extendable to 35 for complex cases. Max reimbursement is £85,000. This replaced the voluntary CRM Code in October 2024 — it now applies to ALL in-scope payment providers, not just those who signed up. A massive change for victims.',
  },
  {
    id: 8, prize: '£16,000', difficulty: 'Advanced',
    question: 'A romance scam victim is defending the person who scammed them: "He wouldn\'t do this — we talked every day for 3 months. I know him." What\'s the best approach?',
    answers: [
      { text: 'Show them news articles about romance scams to prove the pattern', correct: false },
      { text: 'Tell them directly: "The person you spoke to was a criminal using a fake identity"', correct: false },
      { text: 'Acknowledge their feelings first, then ask questions that help them reach their own conclusions', correct: true },
      { text: 'Escalate to a manager — this is too emotionally complex to handle yourself', correct: false },
    ],
    explanation: 'Telling victims their relationship was fake triggers denial and defensiveness. Instead, ask: "Has he ever been able to video call?" or "Have you ever met?" Let them reach their own conclusions. This is motivational interviewing — it works where direct confrontation fails.',
  },
  {
    id: 9, prize: '£32,000', difficulty: 'Expert Level',
    question: 'Mid-call, a distressed fraud victim says: "I just don\'t know what the point of anything is anymore." What is the correct response?',
    answers: [
      { text: 'Continue the claim process — it\'s probably just frustration', correct: false },
      { text: 'Pause everything, acknowledge what you heard, ask directly about self-harm, then connect them with support', correct: true },
      { text: 'Transfer immediately to a manager without saying anything more', correct: false },
      { text: 'Reassure them the money might be recovered to lift their spirits', correct: false },
    ],
    explanation: '60% of fraud victims experience mental health consequences after a crime. 300–350 Action Fraud reports per week show signs of severe distress. This statement is a warning sign. Pause. Acknowledge. Ask directly. Connect them to Samaritans (116 123). This IS your job.',
  },
  {
    id: 10, prize: '£1,000,000', difficulty: '🏆 MILLION POUND QUESTION',
    question: 'Which of these statements about UFT fraud victims is TRUE?',
    answers: [
      { text: 'Elderly people are the most commonly targeted demographic', correct: false },
      { text: 'Educated, intelligent people cannot be manipulated into sending money', correct: false },
      { text: 'Fraud affects all ages and backgrounds — vulnerability is about emotional state, not intelligence', correct: true },
      { text: 'Most victims report fraud to police within 24 hours of discovery', correct: false },
    ],
    explanation: 'Adults aged 18–34 are the MOST commonly targeted. Intelligence offers no protection against social engineering. Only 5% of fraud is ever reported — shame is a massive barrier. A fraud victim could be your colleague, your parent, or you. Treat every caller accordingly.',
  },
];

const PRIZES = QUESTIONS.map(q => q.prize);

// ─── GAME STATE ───────────────────────────────────────────────────────────────
function createState() {
  return {
    phase: 'lobby',        // lobby | presentation | question | revealed | gameover
    questionIndex: -1,
    players: {},           // name -> { name, socketId, connected, eliminated, answers[] }
    lifelines: { fifty: false, team: false, expert: false },
    eliminatedAnswers: [],
  };
}

let G = createState();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const currentQ = () => G.questionIndex >= 0 ? QUESTIONS[G.questionIndex] : null;

function answerBreakdown() {
  const q = currentQ(); if (!q) return null;
  const players = Object.values(G.players);
  const answered = players.filter(p => p.answers[G.questionIndex] !== undefined);
  return q.answers.map((_, i) => {
    const count = answered.filter(p => p.answers[G.questionIndex] === i).length;
    return {
      count,
      pct: answered.length > 0 ? Math.round((count / answered.length) * 100) : 0,
    };
  });
}

function playerStateFor(name) {
  const q = currentQ();
  const p = G.players[name];
  return {
    phase: G.phase,
    questionIndex: G.questionIndex,
    totalQuestions: QUESTIONS.length,
    prizes: PRIZES,
    lifelines: G.lifelines,
    eliminatedAnswers: G.eliminatedAnswers,
    playerCount: Object.keys(G.players).length,
    myEliminated: p ? p.eliminated : false,
    myAnswer: p ? p.answers[G.questionIndex] : undefined,
    question: q ? {
      id: q.id, prize: q.prize, difficulty: q.difficulty, question: q.question,
      answers: q.answers.map((a, i) => ({ text: a.text, index: i })),
      ...(G.phase === 'revealed' ? {
        correctIndex: q.answers.findIndex(a => a.correct),
        explanation: q.explanation,
      } : {}),
    } : null,
  };
}

function gmStateData() {
  const q = currentQ();
  return {
    phase: G.phase,
    questionIndex: G.questionIndex,
    totalQuestions: QUESTIONS.length,
    prizes: PRIZES,
    lifelines: G.lifelines,
    eliminatedAnswers: G.eliminatedAnswers,
    players: Object.values(G.players).map(p => ({
      name: p.name,
      connected: p.connected,
      eliminated: p.eliminated,
      answered: G.questionIndex >= 0 && p.answers[G.questionIndex] !== undefined,
      answer: p.answers[G.questionIndex],
      correctCount: p.answers
        .slice(0, G.questionIndex + (G.phase === 'revealed' ? 1 : 0))
        .filter((a, i) => a !== undefined && QUESTIONS[i]?.answers[a]?.correct).length,
    })),
    question: q ? {
      id: q.id, prize: q.prize, difficulty: q.difficulty, question: q.question,
      answers: q.answers.map((a, i) => ({ text: a.text, index: i, correct: a.correct })),
      correctIndex: q.answers.findIndex(a => a.correct),
      explanation: q.explanation,
      breakdown: answerBreakdown(),
    } : null,
  };
}

function broadcastPlayers() {
  Object.values(G.players).forEach(p => {
    if (!p.connected || !p.socketId) return;
    const sock = io.sockets.sockets.get(p.socketId);
    if (sock) sock.emit('state', playerStateFor(p.name));
  });
}

function broadcastGM() {
  io.to('gm').emit('gm_state', gmStateData());
}

// ─── SOCKET HANDLING ──────────────────────────────────────────────────────────
io.on('connection', socket => {

  // ── GM ──
  socket.on('gm_connect', () => {
    socket.join('gm');
    socket.emit('gm_state', gmStateData());
  });

  // ── PLAYER JOIN ──
  socket.on('join', ({ name }) => {
    name = (name || '').trim().slice(0, 25);
    if (!name) return socket.emit('join_error', 'Please enter a valid name.');

    if (G.phase !== 'lobby' && !G.players[name]) {
      return socket.emit('join_error', 'The game has already started. Ask your GM to let you in.');
    }
    if (!G.players[name] && Object.keys(G.players).length >= 10) {
      return socket.emit('join_error', 'Game is full (max 10 players).');
    }

    if (G.players[name]) {
      // Reconnect
      G.players[name].socketId = socket.id;
      G.players[name].connected = true;
    } else {
      G.players[name] = {
        name, socketId: socket.id, connected: true, eliminated: false,
        answers: new Array(QUESTIONS.length).fill(undefined),
      };
    }

    socket.data.name = name;
    socket.emit('joined', { name });
    socket.emit('state', playerStateFor(name));
    broadcastGM();
  });

  // ── PLAYER ANSWER ──
  socket.on('answer', ({ index }) => {
    const name = socket.data.name;
    if (!name || !G.players[name]) return;
    if (G.phase !== 'question') return;
    const qi = G.questionIndex;
    if (G.players[name].answers[qi] !== undefined) return; // already answered

    G.players[name].answers[qi] = index;
    if (!QUESTIONS[qi].answers[index].correct) {
      G.players[name].eliminated = true;
    }

    socket.emit('state', playerStateFor(name));
    broadcastGM();
  });

  // ── GM ACTIONS ──
  socket.on('gm', ({ action, payload = {} }) => {
    if (!socket.rooms.has('gm')) return;

    if (action === 'start') {
      G.phase = 'presentation';
      broadcastPlayers(); broadcastGM();

    } else if (action === 'show_question') {
      if (!['presentation', 'revealed'].includes(G.phase)) return;
      G.questionIndex++;
      if (G.questionIndex >= QUESTIONS.length) {
        G.phase = 'gameover';
      } else {
        G.phase = 'question';
        G.eliminatedAnswers = [];
      }
      broadcastPlayers(); broadcastGM();

    } else if (action === 'reveal') {
      if (G.phase !== 'question') return;
      G.phase = 'revealed';
      broadcastPlayers(); broadcastGM();

    } else if (action === 'presentation') {
      if (!['revealed', 'question'].includes(G.phase)) return;
      G.phase = 'presentation';
      broadcastPlayers(); broadcastGM();

    } else if (action === 'lifeline') {
      const { type } = payload;
      if (!['fifty', 'team', 'expert'].includes(type) || G.lifelines[type]) return;
      G.lifelines[type] = true;
      if (type === 'fifty') {
        const q = currentQ();
        const ci = q.answers.findIndex(a => a.correct);
        const wrong = [0,1,2,3].filter(i => i !== ci && !G.eliminatedAnswers.includes(i));
        G.eliminatedAnswers.push(...wrong.sort(() => .5 - Math.random()).slice(0, 2));
      }
      broadcastPlayers(); broadcastGM();

    } else if (action === 'reset') {
      G = createState();
      io.emit('reset');
      broadcastGM();

    } else if (action === 'kick') {
      const { name } = payload;
      if (G.players[name]) {
        const sock = io.sockets.sockets.get(G.players[name].socketId);
        if (sock) sock.emit('reset');
        delete G.players[name];
        broadcastGM();
      }
    }
  });

  // ── DISCONNECT ──
  socket.on('disconnect', () => {
    const name = socket.data.name;
    if (name && G.players[name]) {
      G.players[name].connected = false;
      broadcastGM();
    }
  });
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🎮  Weekend Millionaire — Dynarisk Training`);
  console.log(`✅  Server: http://localhost:${PORT}`);
  console.log(`👑  Game Master: http://localhost:${PORT}/gm\n`);
});

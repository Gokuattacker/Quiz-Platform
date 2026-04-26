const mongoose = require('mongoose');
const Question = require('../backend/models/Question');
const Quiz = require('../backend/models/Quiz');

mongoose.connect('mongodb://127.0.0.1:27017/quiz_platform')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error(err));

async function seed() {
  await Question.deleteMany({});
  await Quiz.deleteMany({});

  const questionsData = [

    // ─── MCQ: MongoDB ───────────────────────────────────────────────────────────
    {
      question_text: 'Which command is used to show all databases in MongoDB?',
      subject: 'MongoDB', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['show dbs', 'list databases', 'db.list()', 'show collections'] },
        { k: 'correct_option', v: 'show dbs' }
      ]
    },
    {
      question_text: 'In MongoDB, which operator matches documents where a field value is in a given array?',
      subject: 'MongoDB', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['$in', '$or', '$exists', '$elemMatch'] },
        { k: 'correct_option', v: '$in' }
      ]
    },
    {
      question_text: 'What does the aggregation stage $group do in MongoDB?',
      subject: 'MongoDB', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Groups documents by a key and allows accumulation', 'Filters documents', 'Joins two collections', 'Sorts documents ascending'] },
        { k: 'correct_option', v: 'Groups documents by a key and allows accumulation' }
      ]
    },
    {
      question_text: 'Which MongoDB index type supports queries on multiple fields simultaneously?',
      subject: 'MongoDB', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Compound Index', 'Single Field Index', 'Text Index', 'Hashed Index'] },
        { k: 'correct_option', v: 'Compound Index' }
      ]
    },
    {
      question_text: 'What is the purpose of the $lookup stage in MongoDB aggregation?',
      subject: 'MongoDB', difficulty: 'Hard', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Performs a left outer join with another collection', 'Searches a document by ID', 'Counts matching documents', 'Adds a computed field'] },
        { k: 'correct_option', v: 'Performs a left outer join with another collection' }
      ]
    },

    // ─── MCQ: Redis ─────────────────────────────────────────────────────────────
    {
      question_text: 'Which Redis data type is best suited for implementing a leaderboard?',
      subject: 'Redis', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Sorted Set (ZSET)', 'List', 'Hash', 'String'] },
        { k: 'correct_option', v: 'Sorted Set (ZSET)' }
      ]
    },
    {
      question_text: 'What does SET key value EX 60 do in Redis?',
      subject: 'Redis', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Sets a key with a 60-second TTL', 'Sets a key expiring in 60 minutes', 'Creates a key only if it does not exist', 'Increments key by 60'] },
        { k: 'correct_option', v: 'Sets a key with a 60-second TTL' }
      ]
    },
    {
      question_text: 'Which Redis command prevents duplicate writes for the same key?',
      subject: 'Redis', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['SET key value NX', 'SET key value XX', 'SETNX key value GET', 'INCR key'] },
        { k: 'correct_option', v: 'SET key value NX' }
      ]
    },
    {
      question_text: 'What does ZADD leaderboard NX 0 "alice" do?',
      subject: 'Redis', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Adds alice with score 0 only if she does not already exist', 'Updates alice score to 0', 'Removes alice from leaderboard', 'Increments alice score by 0'] },
        { k: 'correct_option', v: 'Adds alice with score 0 only if she does not already exist' }
      ]
    },

    // ─── MCQ: Node.js ───────────────────────────────────────────────────────────
    {
      question_text: 'What does process.env.NODE_ENV typically hold?',
      subject: 'Node.js', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['The current environment (development/production)', 'The Node.js version', 'The server port number', 'The package name'] },
        { k: 'correct_option', v: 'The current environment (development/production)' }
      ]
    },
    {
      question_text: 'Which built-in Node.js module creates an HTTP server without Express?',
      subject: 'Node.js', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['http', 'net', 'stream', 'url'] },
        { k: 'correct_option', v: 'http' }
      ]
    },
    {
      question_text: 'What is the role of the event loop in Node.js?',
      subject: 'Node.js', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Handles async I/O by offloading and executing callbacks', 'Manages multi-threading for CPU tasks', 'Runs JavaScript synchronously in parallel', 'Compiles JavaScript to machine code'] },
        { k: 'correct_option', v: 'Handles async I/O by offloading and executing callbacks' }
      ]
    },
    {
      question_text: 'What is the correct signature of an Express middleware function?',
      subject: 'Node.js', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['(req, res, next)', '(req, res)', '(err, req)', '(req, next, res)'] },
        { k: 'correct_option', v: '(req, res, next)' }
      ]
    },

    // ─── MCQ: React ─────────────────────────────────────────────────────────────
    {
      question_text: 'Which React hook runs side effects after a component renders?',
      subject: 'React', difficulty: 'Easy', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['useEffect', 'useState', 'useRef', 'useMemo'] },
        { k: 'correct_option', v: 'useEffect' }
      ]
    },
    {
      question_text: 'What does the key prop in React lists primarily help with?',
      subject: 'React', difficulty: 'Medium', type: 'MCQ',
      attributes: [
        { k: 'options', v: ['Efficient reconciliation during re-renders', 'Passing data from child to parent', 'Preventing re-renders entirely', 'Styling individual list items'] },
        { k: 'correct_option', v: 'Efficient reconciliation during re-renders' }
      ]
    },

    // ─── CODE SNIPPET: MongoDB ───────────────────────────────────────────────────
    {
      question_text: 'Given three documents: { subject: "Math", score: 80 }, { subject: "Math", score: 90 }, { subject: "Science", score: 70 }, what does the following aggregation produce?\n\ndb.grades.aggregate([\n  { $group: { _id: "$subject", avgScore: { $avg: "$score" } } },\n  { $sort: { avgScore: -1 } }\n])',
      subject: 'MongoDB', difficulty: 'Medium', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'db.grades.aggregate([\n  { $group: { _id: "$subject", avgScore: { $avg: "$score" } } },\n  { $sort: { avgScore: -1 } }\n])' },
        { k: 'expected_output', v: '[{ "_id": "Math", "avgScore": 85 }, { "_id": "Science", "avgScore": 70 }]' },
        { k: 'correct_answer', v: '[{ "_id": "Math", "avgScore": 85 }, { "_id": "Science", "avgScore": 70 }]' }
      ]
    },
    {
      question_text: 'What does the following Mongoose code do and what does it print?\n\nconst result = await User.findOneAndUpdate(\n  { username: "alice" },\n  { $inc: { loginCount: 1 } },\n  { new: true }\n);\nconsole.log(result.loginCount);',
      subject: 'MongoDB', difficulty: 'Medium', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'const result = await User.findOneAndUpdate(\n  { username: "alice" },\n  { $inc: { loginCount: 1 } },\n  { new: true }\n);\nconsole.log(result.loginCount);' },
        { k: 'expected_output', v: "Prints alice's loginCount incremented by 1 (returns the updated document due to { new: true })" },
        { k: 'correct_answer', v: "Prints alice's loginCount incremented by 1 (returns the updated document due to { new: true })" }
      ]
    },

    // ─── CODE SNIPPET: Redis ─────────────────────────────────────────────────────
    {
      question_text: 'What will the following Redis command sequence print?\n\nSET counter 10\nINCRBY counter 5\nGET counter',
      subject: 'Redis', difficulty: 'Easy', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'SET counter 10\nINCRBY counter 5\nGET counter' },
        { k: 'expected_output', v: '"15"' },
        { k: 'correct_answer', v: '"15"' }
      ]
    },
    {
      question_text: 'What does the following ioredis code return on the FIRST call and on the SECOND call with the same key?\n\nconst result = await redis.set("lock:q1", "locked", "NX", "EX", 3600);\nconsole.log(result);',
      subject: 'Redis', difficulty: 'Medium', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'const result = await redis.set("lock:q1", "locked", "NX", "EX", 3600);\nconsole.log(result);' },
        { k: 'expected_output', v: 'First call: "OK". Second call with same key: null (NX prevents overwrite if key exists)' },
        { k: 'correct_answer', v: 'First call: "OK". Second call with same key: null (NX prevents overwrite if key exists)' }
      ]
    },

    // ─── CODE SNIPPET: Node.js ──────────────────────────────────────────────────
    {
      question_text: 'What is the output of the following Node.js code?\n\nconsole.log("Start");\nsetTimeout(() => console.log("Timeout"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("End");',
      subject: 'Node.js', difficulty: 'Hard', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'console.log("Start");\nsetTimeout(() => console.log("Timeout"), 0);\nPromise.resolve().then(() => console.log("Promise"));\nconsole.log("End");' },
        { k: 'expected_output', v: 'Start\nEnd\nPromise\nTimeout' },
        { k: 'correct_answer', v: 'Start\nEnd\nPromise\nTimeout' }
      ]
    },
    {
      question_text: 'What does the following Express middleware do? Will it call next()?\n\napp.use((req, res, next) => {\n  if (!req.headers["x-api-key"]) {\n    return res.status(401).json({ error: "Unauthorized" });\n  }\n  next();\n});',
      subject: 'Node.js', difficulty: 'Medium', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'app.use((req, res, next) => {\n  if (!req.headers["x-api-key"]) {\n    return res.status(401).json({ error: "Unauthorized" });\n  }\n  next();\n});' },
        { k: 'expected_output', v: 'Returns 401 if x-api-key header is missing; calls next() if the header is present' },
        { k: 'correct_answer', v: 'Returns 401 if x-api-key header is missing; calls next() if the header is present' }
      ]
    },

    // ─── CODE SNIPPET: React ────────────────────────────────────────────────────
    {
      question_text: 'How many times does "render" get logged when this component first mounts, then when the button is clicked once?\n\nfunction App() {\n  const [count, setCount] = React.useState(0);\n  console.log("render");\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}',
      subject: 'React', difficulty: 'Easy', type: 'Coding',
      attributes: [
        { k: 'code_snippet', v: 'function App() {\n  const [count, setCount] = React.useState(0);\n  console.log("render");\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}' },
        { k: 'expected_output', v: '1 time on mount. 1 more time per button click (each setState triggers a re-render). Total after 1 click: 2.' },
        { k: 'correct_answer', v: '1 time on mount. 1 more time per button click (each setState triggers a re-render). Total after 1 click: 2.' }
      ]
    },

    // ─── DESCRIPTIVE: MongoDB ────────────────────────────────────────────────────
    {
      question_text: 'Explain the Attribute Pattern in MongoDB schema design. When would you use it over a fixed schema, and what are its trade-offs?',
      subject: 'MongoDB', difficulty: 'Hard', type: 'Descriptive',
      attributes: [
        { k: 'sample_answer', v: 'The Attribute Pattern stores variable or sparse fields as an array of key-value pairs (e.g., [{ k: "color", v: "red" }]) instead of top-level fields. Use it when documents have many optional or unpredictable attributes. Trade-offs: simplifies indexing (one compound index on k+v covers all attributes) but makes querying individual attributes less intuitive compared to a fixed schema.' }
      ]
    },
    {
      question_text: 'What is the difference between placing $match before vs after $group in a MongoDB aggregation pipeline? How does placement affect performance?',
      subject: 'MongoDB', difficulty: 'Hard', type: 'Descriptive',
      attributes: [
        { k: 'sample_answer', v: '$match before $group filters the input documents first, reducing documents the $group stage must process — improving performance and enabling index usage. $match after $group filters the grouped results, necessary when filtering on computed values (e.g., avgScore > 80). Best practice: place $match as early as possible in the pipeline.' }
      ]
    },

    // ─── DESCRIPTIVE: Redis ──────────────────────────────────────────────────────
    {
      question_text: 'Explain how Redis Sorted Sets work and why they are ideal for a real-time leaderboard. Include the key commands used.',
      subject: 'Redis', difficulty: 'Medium', type: 'Descriptive',
      attributes: [
        { k: 'sample_answer', v: 'A Sorted Set stores string members each with a float score, kept automatically sorted. Key commands: ZADD adds/updates members, ZINCRBY increments a score, ZREVRANGE 0 9 WITHSCORES returns the top-10 in descending order, ZREVRANK returns a member\'s rank. Updates are O(log N), making real-time leaderboards efficient.' }
      ]
    },

    // ─── DESCRIPTIVE: Node.js ───────────────────────────────────────────────────
    {
      question_text: 'What is the difference between process.nextTick(), setImmediate(), and setTimeout(fn, 0) in Node.js? In what order do they execute?',
      subject: 'Node.js', difficulty: 'Hard', type: 'Descriptive',
      attributes: [
        { k: 'sample_answer', v: 'process.nextTick() runs after the current operation but before the event loop moves to the next phase — highest priority. Promise microtasks also run here. setTimeout(fn, 0) runs in the timers phase. setImmediate() runs in the check phase after I/O. Order: nextTick/microtasks → timers (setTimeout) → check (setImmediate). In I/O callbacks, setImmediate runs before setTimeout(0).' }
      ]
    },

    // ─── DESCRIPTIVE: React ──────────────────────────────────────────────────────
    {
      question_text: 'Describe what happens when setState is called inside useEffect after a component unmounts. What is the risk and how do you prevent it?',
      subject: 'React', difficulty: 'Hard', type: 'Descriptive',
      attributes: [
        { k: 'sample_answer', v: 'If a component unmounts before an async operation (e.g., fetch) inside useEffect completes, calling setState afterward tries to update state on an unmounted component, causing a memory leak warning. Prevention: use a boolean flag (let isMounted = true; return () => { isMounted = false; }) and only setState if isMounted is true. Alternatively, use an AbortController to cancel pending requests on cleanup.' }
      ]
    }
  ];

  const questions = await Question.insertMany(questionsData);
  console.log(`Inserted ${questions.length} questions.`);

  const mcqIds         = questions.filter(q => q.type === 'MCQ').slice(0, 5).map(q => q._id);
  const codingIds      = questions.filter(q => q.type === 'Coding').slice(0, 3).map(q => q._id);
  const descriptiveIds = questions.filter(q => q.type === 'Descriptive').slice(0, 2).map(q => q._id);
  const selectedIds    = [...mcqIds, ...codingIds, ...descriptiveIds];

  const quiz = await Quiz.create({
    title: 'Full-Stack Mastery Quiz',
    subject: 'Full-Stack',
    duration_seconds: 600,
    created_by: 'Admin',
    question_ids: selectedIds
  });

  console.log(`Inserted Quiz: "${quiz.title}" with ${selectedIds.length} questions (5 MCQ, 3 Coding, 2 Descriptive).`);
  mongoose.disconnect();
}

seed();

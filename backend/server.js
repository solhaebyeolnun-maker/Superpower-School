import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'data.db'));

const app = express();
app.use(cors());
app.use(express.json());

init();

function init() {
  db.exec(`CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, name TEXT, role TEXT, password TEXT);
           CREATE TABLE IF NOT EXISTS notices(id TEXT PRIMARY KEY, title TEXT, category TEXT, body TEXT, createdAt TEXT);
           CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY, date TEXT, title TEXT, tag TEXT);
           CREATE TABLE IF NOT EXISTS community(id TEXT PRIMARY KEY, channel TEXT, user TEXT, role TEXT, text TEXT, at TEXT);`);
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (!count) seed();
}

function seed() {
  const users = [
    ['dev','Developer','admin','dev1234'],
    ['iris','아이리스','npc','iris1234'],
    ['leon','레온','npc','leon1234'],
    ['mirena','미레나','npc','mirena1234'],
    ['kyle','카일','npc','kyle1234'],
    ['harin','하린','npc','harin1234'],
    ['luka','루카','npc','luka1234']
  ];
  const insertUser = db.prepare('INSERT OR IGNORE INTO users VALUES (?,?,?,?)');
  users.forEach(u=>insertUser.run(...u));
  const notices = [
    ['n1','[긴급] 뒤산 보호구역 봉인 점검','안전','뒤산 보호구역 봉인이 일부 느슨해진 것으로 확인되었습니다.','2035-03-05'],
    ['n2','한강 야간 실습 대기','훈련','야간 실습 일정이 1일 연기되었습니다.','2035-03-02']
  ];
  const insertNotice = db.prepare('INSERT OR IGNORE INTO notices VALUES (?,?,?,?,?)');
  notices.forEach(n=>insertNotice.run(...n));
}

app.post('/api/login',(req,res)=>{
  const { id, pw } = req.body;
  const row = db.prepare('SELECT id,name,role FROM users WHERE id=? AND password=?').get(id,pw);
  if (!row) return res.status(401).send('invalid');
  res.json(row);
});

app.get('/api/notices',(req,res)=>{
  const rows = db.prepare('SELECT * FROM notices ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/notices',(req,res)=>{
  const id = crypto.randomUUID();
  const { title, category, body } = req.body;
  const createdAt = new Date().toISOString();
  db.prepare('INSERT INTO notices VALUES (?,?,?,?,?)').run(id,title,category,body,createdAt);
  res.json({ id, title, category, body, createdAt });
});

app.get('/api/events',(req,res)=>{
  const rows = db.prepare('SELECT * FROM events').all();
  res.json(rows);
});

app.get('/api/meals',(req,res)=>{
  const date = req.query.date || new Date().toISOString().slice(0,10);
  res.json({ date, menu:[
    { item:'능력자 에너지 플랜터 샐러드', kcal:520 },
    { item:'한강 특화 오메가-브리오 브로스', kcal:610 }
  ]});
});

app.get('/api/community',(req,res)=>{
  const channel = req.query.channel || '자유게시판';
  const rows = db.prepare('SELECT * FROM community WHERE channel=? ORDER BY at ASC').all(channel);
  res.json(rows);
});

app.post('/api/community/:channel',(req,res)=>{
  const channel = req.params.channel;
  const id = crypto.randomUUID();
  const { user, role, text } = req.body;
  const at = new Date().toISOString();
  db.prepare('INSERT INTO community VALUES (?,?,?,?,?,?)').run(id,channel,user,role,text,at);
  broadcast(channel);
  res.json({ id, channel, user, role, text, at });
});

app.get('/api/facilities',(req,res)=>{
  res.json([
    { name:'능력 실습동 A', availability:80, status:'정상', tag:'훈련' },
    { name:'연구동 위상측정실', availability:45, status:'점검', tag:'연구' }
  ]);
});

app.use(express.static(path.join(__dirname,'..','frontend')));

const server = app.listen(3000, ()=>console.log('Server on 3000'));
const wss = new WebSocketServer({ server });
const sockets = new Set();
wss.on('connection', (ws)=>{ sockets.add(ws); ws.on('close',()=>sockets.delete(ws)); });
function broadcast(channel) {
  const data = JSON.stringify({ channel, type:'community-update' });
  sockets.forEach(ws=>ws.readyState===1 && ws.send(data));
}

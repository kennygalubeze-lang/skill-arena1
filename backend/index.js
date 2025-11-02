
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@postgres:5432/skillarena';
const REDIS_URL = process.env.REDIS_URL || undefined;

const pool = new Pool({ connectionString: DATABASE_URL });
const redis = new Redis(REDIS_URL || { host: process.env.REDIS_HOST || 'redis', port: process.env.REDIS_PORT || 6379 });

try{ const initSql = fs.readFileSync(path.join(__dirname,'init_db.sql')).toString(); pool.query(initSql).then(()=>console.log('DB init ok')).catch(()=>{}); }catch(e){}

function authMiddleware(req,res,next){ const h = req.headers.authorization; if(!h) return res.status(401).json({error:'missing auth'}); const parts = h.split(' '); if(parts.length!==2) return res.status(401).json({error:'bad auth'}); try{ const payload = jwt.verify(parts[1], JWT_SECRET); req.userId = payload.sub; next(); } catch(e){ return res.status(401).json({error:'invalid token'}); } }

app.get('/health',(req,res)=>res.json({ok:true, app:'SkillArena', ts:new Date().toISOString()}));
app.get('/support',(req,res)=>res.json({whatsapp:'+2347011695248', call:'+2347053070533', email:'kennygalubeze@gmail.com'}));
app.get('/lounges',(req,res)=>{ res.json([{id:'free',name:'Free Lounge',currency:'FREE',min_entry:0,jackpot:0},{id:'premium',name:'Premium Lounge',currency:'NGN',min_entry:100,jackpot:0}]); });
app.listen(PORT,()=>console.log('SkillArena backend listening on',PORT));

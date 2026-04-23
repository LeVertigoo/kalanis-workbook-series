import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = 'https://qglyfohuebgbuztjqaok.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHlmb2h1ZWJnYnV6dGpxYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTgxODQsImV4cCI6MjA5MTgzNDE4NH0.HKqxiTKQDV8zvfpTmE8RlDq_GsbwHATzfn1gyDkJLxQ'
const BUCKET_NAME = 'formation-docs'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const WEBHOOK_URL = 'https://n8n.srv1272919.hstgr.cloud/webhook/kalanis-workbook-series'

const FMT = { texte: 'Texte', image: 'Texte + image', infographie: 'Infographie', carrousel: 'Carrousel', video: 'Vidéo' }
const CAD = { '1-2': '1–2 posts/sem', '3-4': '3–4 posts/sem', '5+': '5+ posts/sem' }

const mkS = () => ({ name: '', prob: '', posts: [{ idea: '', fmt: '' }, { idea: '', fmt: '' }, { idea: '', fmt: '' }] })

const css = `
@import url('https://fonts.googleapis.com/css2?family=Parkinsans:wght@400;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { min-height: 100%; background: #FAF9F2; font-family: 'Parkinsans', -apple-system, sans-serif; }
.wrapper { min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 2.5rem 1rem 3rem; position: relative; background: #FAF9F2; overflow: hidden; }
.blob { position: fixed; border-radius: 50%; background: #018EBB; filter: blur(100px); opacity: .22; pointer-events: none; z-index: 0; }
.blob-1 { width: 480px; height: 480px; top: -140px; left: -150px; }
.blob-2 { width: 350px; height: 350px; top: 35%; right: -100px; }
.blob-3 { width: 300px; height: 300px; bottom: -80px; left: 25%; }
.grain { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: .12; z-index: 1; }
.qouter { position: relative; z-index: 2; width: 100%; max-width: 600px; border-radius: 24px; border: 10px solid rgba(18,28,40,.10); background: #FAF9F2; }
.qcard { background: #FAF9F2; border-radius: 16px; padding: 2.5rem 2rem; }
.prog-bar { height: 4px; background: rgba(18,28,40,.08); border-radius: 2px; margin-bottom: 2rem; overflow: hidden; }
.prog-fill { height: 100%; background: #018EBB; border-radius: 2px; transition: width .4s ease; }
.badge { display: inline-block; background: #018EBB; color: #fff; border-radius: 20px; padding: 4px 12px; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; margin-bottom: 1rem; }
h1, h2 { font-size: 1.5rem; font-weight: 800; color: #121C28; line-height: 1.2; margin-bottom: .5rem; }
.sub { font-size: .9rem; color: #4a5568; line-height: 1.55; margin-bottom: 1.5rem; }
.lbl { display: block; font-size: .83rem; font-weight: 700; color: #121C28; margin-bottom: .35rem; }
.inp { width: 100%; background: #fff; border: 1.5px solid rgba(18,28,40,.15); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: .87rem; color: #121C28; margin-bottom: .85rem; outline: none; transition: border-color .2s; }
.inp:focus { border-color: #018EBB; }
.inp-area { width: 100%; background: #fff; border: 1.5px solid rgba(18,28,40,.15); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: .85rem; color: #121C28; margin-bottom: .85rem; outline: none; transition: border-color .2s; resize: vertical; min-height: 72px; line-height: 1.5; }
.opt-group { display: flex; flex-direction: column; gap: .55rem; margin-bottom: 1.5rem; }
.opt { background: #fff; border: 1.5px solid rgba(18,28,40,.12); border-radius: 12px; padding: 13px 17px; cursor: pointer; transition: all .18s; text-align: left; font-family: inherit; width: 100%; }
.opt:hover { border-color: #018EBB; background: rgba(1,142,187,.04); }
.opt.sel { border-color: #018EBB; background: rgba(1,142,187,.08); }
.opt-t { font-size: .87rem; font-weight: 700; color: #121C28; margin-bottom: 2px; }
.opt-d { font-size: .77rem; color: #718096; line-height: 1.4; }
.ex { background: rgba(1,142,187,.07); border-left: 3px solid #018EBB; border-radius: 0 12px 12px 0; padding: 11px 15px; margin-bottom: 1.4rem; }
.ex-lbl { font-size: .71rem; font-weight: 700; color: #018EBB; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; }
.ex-txt { font-size: .79rem; color: #4a5568; line-height: 1.45; }
.divider { height: 1px; background: rgba(18,28,40,.08); margin: 1.25rem 0; }
.btn-p { width: 100%; background: #121C28; color: #fff; border: none; border-radius: 12px; padding: 14px; font-family: inherit; font-size: .92rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-b { flex: 1; background: #018EBB; color: #fff; border: none; border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .87rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-g { flex: 1; background: transparent; color: #718096; border: 1.5px solid rgba(18,28,40,.12); border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .84rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.btn-row { display: flex; gap: .7rem; margin-top: 1rem; }
.chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 1.1rem; }
.chip { background: rgba(1,142,187,.10); color: #018EBB; border-radius: 20px; padding: 3px 11px; font-size: .77rem; font-weight: 700; }
.explore-subj { background: rgba(1,142,187,.07); border-left: 3px solid #018EBB; border-radius: 0 12px 12px 0; padding: 12px 16px; margin-bottom: 1.5rem; }
.explore-subj-lbl { font-size: .69rem; font-weight: 700; color: #018EBB; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 3px; }
.explore-subj-txt { font-size: 1rem; font-weight: 800; color: #121C28; }
.explore-note { font-size: .78rem; color: #718096; background: rgba(18,28,40,.03); border: 1px solid rgba(18,28,40,.07); border-radius: 10px; padding: 10px 13px; margin-bottom: 1.4rem; line-height: 1.5; font-style: italic; }
.e-dots { display: flex; align-items: center; gap: 6px; margin-bottom: 1.5rem; }
.edot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.edot-a { background: #018EBB; }
.edot-d { background: #018EBB; opacity: .35; }
.edot-t { background: rgba(18,28,40,.12); }
.q-block { margin-bottom: 1.1rem; }
.q-icon { font-size: .82rem; font-weight: 700; color: #121C28; margin-bottom: .3rem; }
.q-hint { font-size: .75rem; color: #718096; margin-bottom: .45rem; }
.seeds-toggle { width: 100%; background: rgba(18,28,40,.03); border: 1.5px solid rgba(18,28,40,.08); border-radius: 10px; padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: .79rem; font-weight: 700; color: #718096; display: flex; align-items: center; justify-content: space-between; margin-bottom: .7rem; text-align: left; transition: all .18s; }
.seeds-toggle:hover { border-color: rgba(1,142,187,.3); color: #018EBB; }
.seeds-body { display: none; background: rgba(18,28,40,.02); border: 1.5px solid rgba(18,28,40,.07); border-radius: 10px; padding: 12px 14px; margin-bottom: 1rem; }
.seeds-body.open { display: block; }
.sg-t { font-size: .69rem; font-weight: 700; color: #018EBB; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 5px; margin-top: 10px; }
.sg-t:first-child { margin-top: 0; }
.seed-row { font-size: .78rem; color: #4a5568; padding: 3px 0; line-height: 1.4; }
.stag { display: inline-block; font-size: .64rem; font-weight: 700; background: rgba(18,28,40,.06); color: #718096; border-radius: 4px; padding: 1px 5px; margin-right: 4px; vertical-align: middle; }
.sc { background: #fff; border: 1.5px solid rgba(18,28,40,.10); border-radius: 16px; padding: 1.25rem 1.25rem 1rem; margin-bottom: 1rem; }
.sc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sc-num { font-size: .74rem; font-weight: 800; color: #018EBB; text-transform: uppercase; letter-spacing: .05em; }
.btn-rm-s { background: none; border: none; cursor: pointer; font-size: .75rem; color: #a0aec0; font-family: inherit; padding: 3px 7px; border-radius: 6px; transition: all .15s; }
.btn-rm-s:hover { color: #ef4444; background: rgba(239,68,68,.06); }
.posts-list { display: flex; flex-direction: column; gap: .5rem; margin-bottom: .65rem; }
.p-row { background: #FAF9F2; border: 1.5px solid rgba(18,28,40,.07); border-radius: 10px; padding: 10px 12px; }
.p-row-top { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.pnum { width: 22px; height: 22px; min-width: 22px; border-radius: 50%; background: rgba(1,142,187,.12); color: #018EBB; font-size: .67rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pinp { flex: 1; background: transparent; border: none; outline: none; font-family: inherit; font-size: .83rem; color: #121C28; min-width: 0; line-height: 1.4; }
.pinp::placeholder { color: #a0aec0; }
.btn-rmp { background: none; border: none; cursor: pointer; color: #d1d5db; font-size: 1rem; line-height: 1; padding: 0 2px; transition: color .15s; flex-shrink: 0; }
.btn-rmp:hover { color: #ef4444; }
.fpills { display: flex; gap: 4px; flex-wrap: wrap; }
.fp { background: rgba(18,28,40,.04); border: 1px solid rgba(18,28,40,.09); border-radius: 6px; padding: 3px 9px; font-size: .67rem; font-weight: 700; color: #718096; cursor: pointer; transition: all .15s; font-family: inherit; }
.fp:hover { background: rgba(1,142,187,.08); border-color: rgba(1,142,187,.3); color: #018EBB; }
.fp.sel { background: #018EBB; border-color: #018EBB; color: #fff; }
.btn-add-p { width: 100%; background: none; border: 1.5px dashed rgba(18,28,40,.12); border-radius: 8px; padding: 7px; font-family: inherit; font-size: .77rem; font-weight: 600; color: #a0aec0; cursor: pointer; transition: all .18s; margin-top: 2px; }
.btn-add-p:hover { border-color: #018EBB; color: #018EBB; background: rgba(1,142,187,.04); }
.btn-add-s { width: 100%; background: none; border: 1.5px dashed rgba(18,28,40,.15); border-radius: 14px; padding: 14px; font-family: inherit; font-size: .85rem; font-weight: 700; color: #718096; cursor: pointer; transition: all .18s; margin-bottom: 1rem; display: block; }
.btn-add-s:hover { border-color: #018EBB; color: #018EBB; background: rgba(1,142,187,.04); }
.rh { background: rgba(1,142,187,.06); border: 1.5px solid rgba(1,142,187,.15); border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
.rs { background: #fff; border: 1.5px solid rgba(18,28,40,.10); border-radius: 14px; padding: 1.1rem 1.25rem; margin-bottom: .85rem; }
.rs-title { font-size: .94rem; font-weight: 800; color: #121C28; margin-bottom: .4rem; }
.rs-prob { font-size: .79rem; color: #4a5568; margin-bottom: .7rem; font-style: italic; }
.rs-posts { list-style: none; }
.rs-posts li { font-size: .79rem; color: #4a5568; padding: 4px 0; display: flex; align-items: flex-start; gap: 7px; line-height: 1.4; }
.rs-fmt { font-size: .64rem; font-weight: 700; background: rgba(1,142,187,.10); color: #018EBB; border-radius: 5px; padding: 2px 7px; flex-shrink: 0; margin-top: 1px; }
.ok-banner { background: rgba(34,197,94,.08); border: 1.5px solid rgba(34,197,94,.25); border-radius: 12px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 1rem; font-size: .83rem; color: #15803d; font-weight: 600; line-height: 1.45; }
.err-banner { background: rgba(239,68,68,.06); border: 1.5px solid rgba(239,68,68,.2); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; font-size: .82rem; color: #b91c1c; font-weight: 600; }
.fn { font-size: .73rem; color: #a0aec0; text-align: center; margin-top: .75rem; }
.btn-dl { width: 100%; background: transparent; color: #018EBB; border: 1.5px solid #018EBB; border-radius: 12px; padding: 13px; font-family: inherit; font-size: .88rem; font-weight: 700; cursor: pointer; transition: all .2s; margin-top: .6rem; }
.btn-dl:hover { background: rgba(1,142,187,.07); }
`

const FMTS_OPTS = [
  { val: 'texte', label: 'Texte', desc: 'Post texte pur — idéal pour opinions, conseils, insights, storytelling' },
  { val: 'image', label: 'Texte + image', desc: "Post texte accompagné d'une image ou visuel — booste la visibilité" },
  { val: 'infographie', label: 'Infographie', desc: 'Visuel synthétique — idéal pour chiffres, comparatifs, frameworks en un coup d\'œil' },
  { val: 'carrousel', label: 'Carrousel', desc: 'Posts à slides scrollables — idéal pour méthodes, listes structurées, tutoriels' },
  { val: 'video', label: 'Vidéo', desc: 'Format natif LinkedIn — fort reach, idéal pour démonstrations et prises de parole' },
]
const POST_FMTS = [['texte','Texte'],['image','Txt+Img'],['infographie','Infographie'],['carrousel','Carrousel'],['video','Vidéo']]
const POST_PH = ["L'erreur la plus fréquente sur ce sujet...", "Comment corriger cette erreur, étape par étape...", "Cas client — avant / après avec résultats concrets...", "Angle complémentaire, variante ou approfondissement...", "Autre idée de post..."]

function Grain() {
  return (
    <svg className="grain" xmlns="http://www.w3.org/2000/svg">
      <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#gr)"/>
    </svg>
  )
}

export default function Workbook() {
  const [screen, setScreen] = useState('home')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subjects, setSubjects] = useState(['', '', ''])
  const [fmt, setFmt] = useState('')
  const [cad, setCad] = useState('')
  const [exps, setExps] = useState([{e:'',q:'',r:''},{e:'',q:'',r:''},{e:'',q:'',r:''}])
  const [curExp, setCurExp] = useState(0)
  const [series, setSeries] = useState([mkS()])
  const [seedsOpen, setSeedsOpen] = useState(true)
  const [slackOk, setSlackOk] = useState(false)
  const [slackErr, setSlackErr] = useState('')
  const listRef = useRef(null)

  const filled = subjects.map((s,i)=>({t:s.trim(),i})).filter(x=>x.t)
  const go = (s) => { setScreen(s); window.scrollTo(0,0) }

  const startExplore = () => { if (!filled.length) { goSeries(); return }; setCurExp(0); go('explore') }
  const saveExp = (idx, field, val) => {
    setExps(prev => {
      const next = prev.map(x=>({...x}))
      next[filled[idx].i][field] = val
      return next
    })
  }

  const exploreBack = () => curExp === 0 ? go('cadence') : setCurExp(c=>c-1)
  const exploreNext = () => curExp === filled.length - 1 ? goSeries() : setCurExp(c=>c+1)
  const goSeries = () => { go('series') }

  const updateSeries = (si, field, val) => setSeries(prev => prev.map((s,i) => i===si ? {...s,[field]:val} : s))
  const updatePost = (si, pi, field, val) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts: s.posts.map((p,j) => j===pi ? {...p,[field]:val} : p)} : s))
  const addPost = (si) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:[...s.posts,{idea:'',fmt:''}]} : s))
  const rmPost = (si, pi) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:s.posts.filter((_,j)=>j!==pi)} : s))
  const addSeries = () => setSeries(prev=>[...prev, mkS()])
  const rmSeries = (si) => setSeries(prev=>prev.filter((_,i)=>i!==si))

  const buildResultHtml = () => {
    const tags = subjects.filter(Boolean).map(s=>`<span class="chip">${s}</span>`).join('')
    let html = `<div class="rh"><div style="font-size:.7rem;font-weight:700;color:#018EBB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Profil</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">${tags}</div><div style="font-size:.79rem;color:#4a5568"><strong>Format :</strong> ${FMT[fmt]||fmt} &nbsp;•&nbsp; <strong>Cadence :</strong> ${CAD[cad]||cad}</div></div>`
    const hasExp = filled.some(x=>{ const e=exps[x.i]; return e.e||e.q||e.r })
    if (hasExp) {
      html += `<div class="rs" style="background:rgba(1,142,187,.04)"><div style="font-size:.7rem;font-weight:700;color:#018EBB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem">Observations de terrain</div>`
      filled.forEach(x=>{
        const e=exps[x.i]; if(!e.e&&!e.q&&!e.r)return
        html+=`<div style="font-size:.79rem;font-weight:700;color:#121C28;margin-bottom:.35rem">${x.t}</div>`
        if(e.e)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem"><span class="stag">Erreur</span>${e.e}</div>`
        if(e.q)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem"><span class="stag">Question</span>${e.q}</div>`
        if(e.r)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.5rem"><span class="stag">Résultat</span>${e.r}</div>`
      })
      html+=`</div>`
    }
    series.forEach((s,i)=>{
      if(!s.name)return
      const posts=s.posts.filter(p=>p.idea).map(p=>`<li><span class="rs-fmt">${FMT[p.fmt]||'—'}</span>${p.idea}</li>`).join('')
      html+=`<div class="rs"><div class="rs-title">Série ${i+1} — ${s.name}</div>${s.prob?`<div class="rs-prob">${s.prob}</div>`:''}${posts?`<ul class="rs-posts">${posts}</ul>`:''}</div>`
    })
    return html
  }

  const handleResult = async () => {
    setSlackOk(false); setSlackErr(''); go('result')
    const resBody = buildResultHtml()
    const fullHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Séries ${name}</title>
<style>body{font-family:sans-serif;background:#FAF9F2;padding:2rem}.container{max-width:620px;margin:0 auto}h1{font-size:1.4rem} .rh{background:rgba(1,142,187,.06);padding:1rem;border-radius:14px;margin-bottom:1rem} .rs{background:#fff;padding:1.1rem;border-radius:14px;margin-bottom:.85rem;border:1.5px solid #eee} .chip{background:rgba(1,142,187,.1);color:#018EBB;border-radius:20px;padding:3px 11px;font-size:.77rem;font-weight:700;margin-right:4px} .rs-fmt{font-size:.64rem;font-weight:700;background:rgba(1,142,187,.1);color:#018EBB;border-radius:5px;padding:2px 7px;margin-right:7px} .stag{font-size:.64rem;font-weight:700;background:rgba(18,28,40,.06);color:#718096;border-radius:4px;padding:1px 5px;margin-right:4px} .rs-posts{list-style:none;padding:0} .rs-posts li{display:flex;align-items:flex-start;margin-bottom:8px;font-size:.8rem}</style>
</head><body><div class="container"><h1>Tes séries, ${name}</h1>${resBody}</div></body></html>`

    try {
      const fileName = `workbook-series/${Date.now()}_${name.replace(/\s+/g,'_')}.html`
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
      const { error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, blob)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: name, email, url: publicUrl })
      })
      setSlackOk(true)
    } catch (e) { setSlackErr("Erreur technique d'envoi.") }
  }

  const expSubj = filled[curExp]
  const expData = expSubj ? exps[expSubj.i] : {e:'',q:'',r:''}

  return (
    <>
      <style>{css}</style>
      <div className="wrapper">
        <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/><Grain/>
        <div className="qouter">
          {screen==='home' && (
            <div className="qcard">
              <div className="badge">Kalanis • Formation</div>
              <h1>Construis tes séries de posts LinkedIn</h1>
              <p className="sub">Prends 10–15 minutes pour explorer tes idées.</p>
              <span className="lbl">Ton nom *</span>
              <input className="inp" value={name} onChange={e=>setName(e.target.value)}/>
              <button className="btn-p" disabled={!name} onClick={()=>go('subjects')}>Commencer →</button>
            </div>
          )}

          {screen==='subjects' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'15%'}}/></div>
              <h2>Quels sont tes sujets ?</h2>
              {subjects.map((s,i)=>(
                <input key={i} className="inp" placeholder={`Sujet ${i+1}`} value={s} onChange={e=>{const n=[...subjects];n[i]=e.target.value;setSubjects(n)}}/>
              ))}
              <button className="btn-p" onClick={()=>go('format')}>Continuer →</button>
            </div>
          )}

          {screen==='format' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'30%'}}/></div>
              <h2>Ton format ?</h2>
              <div className="opt-group">
                {FMTS_OPTS.map(o=>(
                  <button key={o.val} className={`opt${fmt===o.val?' sel':''}`} onClick={()=>setFmt(o.val)}>
                    <div className="opt-t">{o.label}</div><div className="opt-d">{o.desc}</div>
                  </button>
                ))}
              </div>
              <button className="btn-p" onClick={()=>go('cadence')}>Suivant</button>
            </div>
          )}

          {screen==='cadence' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'45%'}}/></div>
              <h2>Ta cadence ?</h2>
              <div className="opt-group">
                {[['1-2','1-2/sem'],['3-4','3-4/sem'],['5+','5+/sem']].map(([v,l])=>(
                  <button key={v} className={`opt${cad===v?' sel':''}`} onClick={()=>setCad(v)}>{l}</button>
                ))}
              </div>
              <button className="btn-p" onClick={startExplore}>Continuer</button>
            </div>
          )}

          {screen==='explore' && expSubj && (
            <div className="qcard">
              <div className="badge">Exploration {curExp+1}/{filled.length}</div>
              <h2>{expSubj.t}</h2>
              <div className="q-block">
                <div className="q-icon">❌ Erreur fréquente</div>
                <textarea className="inp-area" value={expData.e} onChange={e=>saveExp(curExp,'e',e.target.value)}/>
              </div>
              <div className="q-block">
                <div className="q-icon">❓ Question récurrente</div>
                <textarea className="inp-area" value={expData.q} onChange={e=>saveExp(curExp,'q',e.target.value)}/>
              </div>
              <div className="btn-row">
                <button className="btn-g" onClick={exploreBack}>← Retour</button>
                <button className="btn-b" onClick={exploreNext}>Suivant →</button>
              </div>
            </div>
          )}

          {screen==='series' && (
            <div className="qcard">
              <h2>Tes séries</h2>
              {series.map((s, si)=>(
                <div key={si} className="sc">
                  <input className="inp" placeholder="Nom de la série" value={s.name} onChange={e=>updateSeries(si,'name',e.target.value)}/>
                  <div className="posts-list">
                    {s.posts.map((p, pi)=>(
                      <div key={pi} className="p-row">
                        <div className="p-row-top">
                          <div className="pnum">{pi+1}</div>
                          <input className="pinp" value={p.idea} onChange={e=>updatePost(si,pi,'idea',e.target.value)}/>
                        </div>
                        <div className="fpills">
                          {POST_FMTS.map(([v,l])=><button key={v} className={`fp ${p.fmt===v?'sel':''}`} onClick={()=>updatePost(si,pi,'fmt',v)}>{l}</button>)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-add-p" onClick={()=>addPost(si)}>+ Ajouter un post</button>
                </div>
              ))}
              <button className="btn-add-s" onClick={addSeries}>+ Nouvelle série</button>
              <button className="btn-p" onClick={handleResult}>Terminer →</button>
            </div>
          )}

          {screen==='result' && (
            <div className="qcard">
              <div className="badge">Terminé !</div>
              <h2>Résumé pour Sarah</h2>
              {slackOk && <div className="ok-banner">✅ Transmis avec succès !</div>}
              <div style={{maxHeight:'400px', overflowY:'auto', background:'rgba(18,28,40,.02)', padding:'1rem', borderRadius:'12px', border:'1px solid #eee'}}
                   dangerouslySetInnerHTML={{__html: buildResultHtml()}} />
              <button className="btn-dl" onClick={()=>window.location.reload()}>Fermer</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

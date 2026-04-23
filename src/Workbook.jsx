import { useState, useRef } from 'react'

const WEBHOOK_URL = 'https://n8n.srv1272919.hstgr.cloud/webhook/kalanis-workbook-series'
const SUPABASE_URL = 'https://qglyfohuebgbuztjqaok.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbHlmb2h1ZWJnYnV6dGpxYW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNTgxODQsImV4cCI6MjA5MTgzNDE4NH0.HKqxiTKQDV8zvfpTmE8RlDq_GsbwHATzfn1gyDkJLxQ'
const STORAGE_PATH = 'formation-docs/workbook-series'

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
.hint { font-size: .77rem; color: #718096; margin-bottom: .55rem; margin-top: -.2rem; }
.inp { width: 100%; background: #fff; border: 1.5px solid rgba(18,28,40,.15); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: .87rem; color: #121C28; margin-bottom: .85rem; outline: none; transition: border-color .2s; }
.inp:focus { border-color: #018EBB; }
.inp::placeholder { color: #a0aec0; }
.inp-area { width: 100%; background: #fff; border: 1.5px solid rgba(18,28,40,.15); border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: .85rem; color: #121C28; margin-bottom: .85rem; outline: none; transition: border-color .2s; resize: vertical; min-height: 72px; line-height: 1.5; }
.inp-area:focus { border-color: #018EBB; }
.inp-area::placeholder { color: #a0aec0; }
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
.btn-p:hover { opacity: .88; }
.btn-p:disabled { opacity: .35; cursor: not-allowed; }
.btn-b { flex: 1; background: #018EBB; color: #fff; border: none; border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .87rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-b:hover { opacity: .88; }
.btn-g { flex: 1; background: transparent; color: #718096; border: 1.5px solid rgba(18,28,40,.12); border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .84rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.btn-g:hover { border-color: #018EBB; color: #018EBB; }
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
  const [resultHtml, setResultHtml] = useState('')
  const listRef = useRef(null)

  const filled = subjects.map((s,i)=>({t:s.trim(),i})).filter(x=>x.t)

  const go = (s) => { setScreen(s); window.scrollTo(0,0) }

  // Explore
  const startExplore = () => {
    if (!filled.length) { goSeries(); return }
    setCurExp(0); go('explore')
  }

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

  // Series
  const updateSeries = (si, field, val) => {
    setSeries(prev => prev.map((s,i) => i===si ? {...s,[field]:val} : s))
  }
  const updatePost = (si, pi, field, val) => {
    setSeries(prev => prev.map((s,i) => i===si ? {...s, posts: s.posts.map((p,j) => j===pi ? {...p,[field]:val} : p)} : s))
  }
  const addPost = (si) => {
    setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:[...s.posts,{idea:'',fmt:''}]} : s))
  }
  const rmPost = (si, pi) => {
    setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:s.posts.filter((_,j)=>j!==pi)} : s))
  }
  const addSeries = () => setSeries(prev=>[...prev, mkS()])
  const rmSeries = (si) => setSeries(prev=>prev.filter((_,i)=>i!==si))

  const hasValidSeries = series.some(s=>s.name.trim())

  // Result
  const buildHtmlDoc = () => {
    const resHtml = buildResultHtml()
    const title = `Tes séries, ${name} 🎯`
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${title} — Kalanis</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,sans-serif;background:#FAF9F2;padding:2rem 1rem}.container{max-width:620px;margin:0 auto}h1{font-size:1.4rem;font-weight:800;color:#121C28;margin-bottom:.4rem}.meta{font-size:.8rem;color:#718096;margin-bottom:1.5rem}.badge{display:inline-block;background:#018EBB;color:#fff;border-radius:20px;padding:4px 12px;font-size:11px;text-transform:uppercase;font-weight:700;letter-spacing:.08em;margin-bottom:1rem}.chip{display:inline-block;background:rgba(1,142,187,.10);color:#018EBB;border-radius:20px;padding:3px 11px;font-size:.77rem;font-weight:700;margin:2px}.rh{background:rgba(1,142,187,.06);border:1.5px solid rgba(1,142,187,.15);border-radius:14px;padding:1rem 1.25rem;margin-bottom:1rem}.rs{background:#fff;border:1.5px solid rgba(18,28,40,.10);border-radius:14px;padding:1.1rem 1.25rem;margin-bottom:.85rem}.rs-title{font-size:.94rem;font-weight:800;color:#121C28;margin-bottom:.4rem}.rs-prob{font-size:.79rem;color:#4a5568;margin-bottom:.7rem;font-style:italic}.rs-posts{list-style:none}.rs-posts li{font-size:.79rem;color:#4a5568;padding:4px 0;display:flex;align-items:flex-start;gap:7px;line-height:1.4}.rs-fmt{font-size:.64rem;font-weight:700;background:rgba(1,142,187,.10);color:#018EBB;border-radius:5px;padding:2px 7px;flex-shrink:0;margin-top:1px}footer{text-align:center;font-size:.72rem;color:#a0aec0;margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(18,28,40,.07)}</style>
</head><body><div class="container"><div class="badge">Kalanis • Séries de Posts</div><h1>${title}</h1>
<p class="meta">Généré le ${new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p>
${resHtml}<footer>Kalanis — Document confidentiel</footer></div></body></html>`
  }

  const buildPayload = (html_url) => ({
    nom: name,
    email: email || null,
    sujets: subjects.filter(Boolean),
    format_principal: FMT[fmt]||fmt,
    cadence: CAD[cad]||cad,
    filename: `Kalanis_Series_${name.replace(/\s+/g,'_')}.html`,
    html_url: html_url || null,
    observations: filled.map(x=>({
      sujet: x.t,
      erreur_frequente: exps[x.i].e||null,
      question_recurrente: exps[x.i].q||null,
      resultat_obtenu: exps[x.i].r||null,
    })).filter(o=>o.erreur_frequente||o.question_recurrente||o.resultat_obtenu),
    series: series.filter(s=>s.name).map((s,i)=>({
      numero: i+1,
      nom: s.name,
      probleme: s.prob||null,
      posts: s.posts.filter(p=>p.idea).map(p=>({idee:p.idea,format:FMT[p.fmt]||null}))
    }))
  })

  const handleResult = async () => {
    setSlackOk(false); setSlackErr('')
    go('result')
    try {
      // 1. Upload HTML vers Supabase Storage
      const filename = `Kalanis_Series_${name.replace(/\s+/g,'_')}.html`
      const htmlDoc = buildHtmlDoc()
      const htmlBlob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' })
      await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_PATH}/${filename}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type': 'text/html;charset=utf-8',
          'x-upsert': 'true'
        },
        body: htmlBlob
      })
      const html_url = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_PATH}/${filename}`

      // 2. Envoi webhook N8N avec l'URL publique
      const resp = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(html_url))
      })
      if (resp.ok) setSlackOk(true)
      else setSlackErr(`Erreur ${resp.status} lors de l'envoi. Télécharge le résumé ci-dessous.`)
    } catch {
      setSlackErr("Impossible de joindre le webhook N8N. Télécharge le résumé ci-dessous.")
    }
  }

  const downloadResult = () => {
    const doc = buildHtmlDoc()
    const blob = new Blob([doc], {type:'text/html;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `Kalanis_Series_${name.replace(/\s+/g,'_')}.html`
    a.click(); URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    setScreen('home'); setName(''); setEmail(''); setSubjects(['','',''])
    setFmt(''); setCad(''); setExps([{e:'',q:'',r:''},{e:'',q:'',r:''},{e:'',q:'',r:''}])
    setCurExp(0); setSeries([mkS()]); setSeedsOpen(true); setSlackOk(false); setSlackErr('')
  }

  // Build result HTML for display
  const buildResultHtml = () => {
    const tags = subjects.filter(Boolean).map(s=>`<span class="chip">${s}</span>`).join('')
    let html = `<div class="rh"><div style="font-size:.7rem;font-weight:700;color:#018EBB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Profil</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px">${tags}</div><div style="font-size:.79rem;color:#4a5568"><strong>Format :</strong> ${FMT[fmt]||fmt} &nbsp;•&nbsp; <strong>Cadence :</strong> ${CAD[cad]||cad}</div></div>`
    const hasExp = filled.some(x=>{ const e=exps[x.i]; return e.e||e.q||e.r })
    if (hasExp) {
      html += `<div class="rs" style="background:rgba(1,142,187,.04)"><div style="font-size:.7rem;font-weight:700;color:#018EBB;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem">Observations de terrain</div>`
      filled.forEach(x=>{
        const e=exps[x.i]; if(!e.e&&!e.q&&!e.r)return
        html+=`<div style="font-size:.79rem;font-weight:700;color:#121C28;margin-bottom:.35rem">${x.t}</div>`
        if(e.e)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem"><span style="font-size:.65rem;font-weight:700;background:rgba(18,28,40,.06);color:#718096;border-radius:4px;padding:1px 5px;margin-right:4px">Erreur</span>${e.e}</div>`
        if(e.q)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem"><span style="font-size:.65rem;font-weight:700;background:rgba(18,28,40,.06);color:#718096;border-radius:4px;padding:1px 5px;margin-right:4px">Question</span>${e.q}</div>`
        if(e.r)html+=`<div style="font-size:.77rem;color:#4a5568;margin-bottom:.5rem"><span style="font-size:.65rem;font-weight:700;background:rgba(18,28,40,.06);color:#718096;border-radius:4px;padding:1px 5px;margin-right:4px">Résultat</span>${e.r}</div>`
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

  const expSubj = filled[curExp]
  const expData = expSubj ? exps[expSubj.i] : {e:'',q:'',r:''}

  return (
    <>
      <style>{css}</style>
      <div className="wrapper">
        <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
        <Grain/>
        <div className="qouter">

          {/* HOME */}
          {screen==='home' && (
            <div className="qcard">
              <div className="badge">Kalanis • Formation</div>
              <h1>Construis tes séries de posts LinkedIn</h1>
              <p className="sub">Avant ton call avec Sarah, prends 10–15 minutes pour explorer tes idées. Tes réponses vont directement alimenter votre travail ensemble.</p>
              <div className="divider"/>
              <span className="lbl">Ton prénom et nom *</span>
              <input className="inp" placeholder="ex : Marie Dupont" value={name} onChange={e=>setName(e.target.value)}/>
              <span className="lbl">Ton email <span style={{fontWeight:400,color:'#718096'}}>(optionnel)</span></span>
              <input className="inp" type="email" placeholder="ex : marie@freelance.com" value={email} onChange={e=>setEmail(e.target.value)}/>
              <button className="btn-p" disabled={!name.trim()} onClick={()=>go('subjects')}>Commencer →</button>
            </div>
          )}

          {/* SUBJECTS */}
          {screen==='subjects' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'13%'}}/></div>
              <div className="badge">Tes sujets</div>
              <h2>Sur quoi tu travailles avec tes clients ?</h2>
              <p className="sub">Cite les 1 à 3 grandes thématiques que tu traites. Ces sujets vont structurer toute la réflexion qui suit.</p>
              <div className="ex"><div className="ex-lbl">💡 Exemple Kalanis</div><div className="ex-txt">"Optimisation profil LinkedIn", "Acquisition client organique", "Personal branding freelance"</div></div>
              <span className="lbl">Sujet 1 *</span>
              <input className="inp" placeholder="ex : Optimisation profil LinkedIn" value={subjects[0]} onChange={e=>setSubjects(s=>{const n=[...s];n[0]=e.target.value;return n})}/>
              <span className="lbl">Sujet 2 <span style={{fontWeight:400,color:'#718096'}}>(optionnel)</span></span>
              <input className="inp" placeholder="ex : Acquisition client organique" value={subjects[1]} onChange={e=>setSubjects(s=>{const n=[...s];n[1]=e.target.value;return n})}/>
              <span className="lbl">Sujet 3 <span style={{fontWeight:400,color:'#718096'}}>(optionnel)</span></span>
              <input className="inp" placeholder="ex : Personal branding freelance" value={subjects[2]} onChange={e=>setSubjects(s=>{const n=[...s];n[2]=e.target.value;return n})}/>
              <div className="btn-row">
                <button className="btn-g" onClick={()=>go('home')}>← Retour</button>
                <button className="btn-b" disabled={!subjects[0].trim()} onClick={()=>go('format')}>Continuer →</button>
              </div>
            </div>
          )}

          {/* FORMAT */}
          {screen==='format' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'26%'}}/></div>
              <div className="badge">Ton format</div>
              <h2>Quel format tu maîtrises le mieux ?</h2>
              <p className="sub">C'est ton format de base. Chaque idée de post pourra avoir le sien ensuite — pas de contrainte.</p>
              <div className="ex"><div className="ex-lbl">💡 Exemple Kalanis</div><div className="ex-txt">Thomas utilise principalement les carrousels pour ses séries récurrentes et les posts texte pour ses opinions et retours terrain.</div></div>
              <div className="opt-group">
                {FMTS_OPTS.map(o=>(
                  <button key={o.val} className={`opt${fmt===o.val?' sel':''}`} onClick={()=>setFmt(o.val)}>
                    <div className="opt-t">{o.label}</div>
                    <div className="opt-d">{o.desc}</div>
                  </button>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-g" onClick={()=>go('subjects')}>← Retour</button>
                <button className="btn-b" disabled={!fmt} onClick={()=>go('cadence')}>Continuer →</button>
              </div>
            </div>
          )}

          {/* CADENCE */}
          {screen==='cadence' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'38%'}}/></div>
              <div className="badge">Ta cadence</div>
              <h2>À quelle fréquence tu publies ?</h2>
              <p className="sub">Ou tu comptes publier. Ça n'influe pas sur le nombre de séries — tu pourras en créer autant que tu veux ensuite.</p>
              <div className="opt-group">
                {[['1-2','1–2 posts / semaine','Idéal pour démarrer — mise sur la qualité'],['3-4','3–4 posts / semaine','Rythme optimal pour construire ton autorité'],['5+','5 posts / semaine +','Format expert — nécessite un système solide']].map(([v,l,d])=>(
                  <button key={v} className={`opt${cad===v?' sel':''}`} onClick={()=>setCad(v)}>
                    <div className="opt-t">{l}</div><div className="opt-d">{d}</div>
                  </button>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-g" onClick={()=>go('format')}>← Retour</button>
                <button className="btn-b" disabled={!cad} onClick={startExplore}>Continuer →</button>
              </div>
            </div>
          )}

          {/* EXPLORE */}
          {screen==='explore' && expSubj && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:`${38+((curExp+1)/filled.length)*42}%`}}/></div>
              <div className="e-dots">
                {filled.map((_,i)=><div key={i} className={`edot ${i<curExp?'edot-d':i===curExp?'edot-a':'edot-t'}`}/>)}
                {filled.length>1 && <span style={{fontSize:'.75rem',color:'#718096',marginLeft:6}}>Sujet {curExp+1} / {filled.length}</span>}
              </div>
              <div className="badge">{filled.length>1?`Exploration ${curExp+1}/${filled.length}`:'Exploration'}</div>
              <h2>Explorer : {expSubj.t}</h2>
              <div className="explore-subj">
                <div className="explore-subj-lbl">Sujet en cours</div>
                <div className="explore-subj-txt">{expSubj.t}</div>
              </div>
              <p className="explore-note">Pas de bonne ou mauvaise réponse — réponds librement, même si c'est imparfait. L'objectif c'est de faire remonter ce que tu sais déjà.</p>
              <div className="q-block">
                <div className="q-icon">❌ L'erreur que tu vois le plus souvent</div>
                <p className="q-hint">Quelle faute tes clients font encore et encore sur ce sujet ?</p>
                <textarea className="inp-area" placeholder="ex : Ils écrivent pour montrer leur expertise plutôt que pour parler des problèmes concrets de leur cible..." value={expData.e} onChange={e=>saveExp(curExp,'e',e.target.value)}/>
              </div>
              <div className="q-block">
                <div className="q-icon">❓ La question qu'on te pose tout le temps</div>
                <p className="q-hint">Dans tes calls, tes DMs — quelle question revient régulièrement ?</p>
                <textarea className="inp-area" placeholder="ex : 'Comment je sais si mon hook est bon avant de publier ?'" value={expData.q} onChange={e=>saveExp(curExp,'q',e.target.value)}/>
              </div>
              <div className="q-block">
                <div className="q-icon">✅ Une transformation que tu as déjà produite</div>
                <p className="q-hint">Avant → après. Chez toi ou un client. Même approximatif.</p>
                <textarea className="inp-area" placeholder="ex : Un client est passé de 500 à 8 000 impressions par post en 3 semaines..." value={expData.r} onChange={e=>saveExp(curExp,'r',e.target.value)}/>
              </div>
              <div className="btn-row">
                <button className="btn-g" onClick={exploreBack}>{curExp===0?'← Retour':'← Sujet précédent'}</button>
                <button className="btn-b" onClick={exploreNext}>{curExp===filled.length-1?'Construire mes séries →':'Sujet suivant →'}</button>
              </div>
            </div>
          )}

          {/* SERIES */}
          {screen==='series' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'85%'}}/></div>
              <div className="badge">Tes séries</div>
              <h2>Construis tes séries de posts</h2>
              <p className="sub">En t'appuyant sur tes observations ci-dessous, identifie et structure tes séries. Chaque idée de post a son propre format.</p>
              <div className="chips">{subjects.filter(Boolean).map((s,i)=><span key={i} className="chip">{s}</span>)}</div>

              {filled.some(x=>{const e=exps[x.i];return e.e||e.q||e.r}) && (
                <>
                  <button className="seeds-toggle" onClick={()=>setSeedsOpen(o=>!o)}>
                    <span>📎 Tes observations — cliquer pour {seedsOpen?'masquer':'afficher'}</span>
                    <span>{seedsOpen?'▴':'▾'}</span>
                  </button>
                  <div className={`seeds-body${seedsOpen?' open':''}`}>
                    {filled.map(x=>{
                      const e=exps[x.i]; if(!e.e&&!e.q&&!e.r)return null
                      return <div key={x.i}>
                        <div className="sg-t">{x.t}</div>
                        {e.e&&<div className="seed-row"><span className="stag">Erreur fréquente</span>{e.e}</div>}
                        {e.q&&<div className="seed-row"><span className="stag">Question récurrente</span>{e.q}</div>}
                        {e.r&&<div className="seed-row"><span className="stag">Résultat obtenu</span>{e.r}</div>}
                      </div>
                    })}
                  </div>
                </>
              )}

              <div ref={listRef}>
                {series.map((s,si)=>(
                  <div key={si} className="sc">
                    <div className="sc-head">
                      <span className="sc-num">Série {si+1}</span>
                      {series.length>1 && <button className="btn-rm-s" onClick={()=>rmSeries(si)}>✕ Supprimer</button>}
                    </div>
                    <span className="lbl">Nom de la série *</span>
                    <p className="hint">Un titre court et mémorable — inspire-toi de tes observations si besoin</p>
                    <input className="inp" placeholder="ex : Les erreurs de profil LinkedIn" value={s.name} onChange={e=>updateSeries(si,'name',e.target.value)}/>
                    <span className="lbl">Problème traité</span>
                    <p className="hint">Quelle douleur de ta cible cette série adresse-t-elle directement ?</p>
                    <input className="inp" placeholder="ex : Mon client ne comprend pas pourquoi son profil n'attire pas les bons prospects" value={s.prob} onChange={e=>updateSeries(si,'prob',e.target.value)}/>
                    <span className="lbl">Idées de posts <span style={{fontWeight:400,color:'#718096'}}>— 1 idée = 1 format</span></span>
                    <p className="hint">Commence par l'erreur, enchaîne la solution, conclus avec un résultat. Ajoute autant d'idées que tu veux.</p>
                    <div className="posts-list">
                      {s.posts.map((p,pi)=>(
                        <div key={pi} className="p-row">
                          <div className="p-row-top">
                            <div className="pnum">{pi+1}</div>
                            <input className="pinp" placeholder={POST_PH[Math.min(pi,POST_PH.length-1)]} value={p.idea} onChange={e=>updatePost(si,pi,'idea',e.target.value)}/>
                            {s.posts.length>1 && <button className="btn-rmp" onClick={()=>rmPost(si,pi)}>×</button>}
                          </div>
                          <div className="fpills">
                            {POST_FMTS.map(([v,l])=>(
                              <button key={v} className={`fp${p.fmt===v?' sel':''}`} onClick={()=>updatePost(si,pi,'fmt',v)}>{l}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-add-p" onClick={()=>addPost(si)}>+ Ajouter une idée de post</button>
                  </div>
                ))}
              </div>
              <button className="btn-add-s" onClick={addSeries}>+ Ajouter une série</button>
              <button className="btn-p" disabled={!hasValidSeries} onClick={handleResult}>Voir le résumé →</button>
            </div>
          )}

          {/* RESULT */}
          {screen==='result' && (
            <div className="qcard">
              <div className="prog-bar"><div className="prog-fill" style={{width:'100%'}}/></div>
              <div className="badge">Résumé final ✓</div>
              <h2>Tes séries, {name} 🎯</h2>
              <p className="sub">Voici le résumé de tes séries. Il a été envoyé automatiquement à Sarah sur Slack — elle l'aura avant votre call.</p>
              {slackOk && (
                <div className="ok-banner">
                  <span style={{fontSize:'1.1rem',flexShrink:0}}>✅</span>
                  <span>Résumé envoyé dans ton canal Slack ! Sarah le recevra avant votre call pour préparer votre session.</span>
                </div>
              )}
              {slackErr && (
                <div className="err-banner">
                  <span>⚠️</span>
                  <span>{slackErr}</span>
                </div>
              )}
              <div id="res-content" dangerouslySetInnerHTML={{__html: buildResultHtml()}}/>
              <button className="btn-dl" onClick={downloadResult}>⬇ Télécharger le résumé (HTML)</button>
              <button className="btn-g" onClick={resetAll} style={{marginTop:'.6rem',width:'100%',display:'block'}}>Recommencer</button>
              <p className="fn">Sarah recevra ce résumé avant votre call pour préparer votre session ensemble.</p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

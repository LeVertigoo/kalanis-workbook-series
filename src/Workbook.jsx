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
.btn-p { width: 100%; background: #121C28; color: #fff; border: none; border-radius: 12px; padding: 14px; font-family: inherit; font-size: .92rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-b { flex: 1; background: #018EBB; color: #fff; border: none; border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .87rem; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.btn-g { flex: 1; background: transparent; color: #718096; border: 1.5px solid rgba(18,28,40,.12); border-radius: 12px; padding: 12px 20px; font-family: inherit; font-size: .84rem; font-weight: 600; cursor: pointer; transition: all .18s; }
.btn-row { display: flex; gap: .7rem; margin-top: 1rem; }
.chip { background: rgba(1,142,187,.10); color: #018EBB; border-radius: 20px; padding: 3px 11px; font-size: .77rem; font-weight: 700; margin-right: 4px; margin-bottom: 4px; display: inline-block; }
.explore-subj { background: rgba(1,142,187,.07); border-left: 3px solid #018EBB; border-radius: 0 12px 12px 0; padding: 12px 16px; margin-bottom: 1.5rem; }
.explore-subj-lbl { font-size: .69rem; font-weight: 700; color: #018EBB; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 3px; }
.explore-subj-txt { font-size: 1rem; font-weight: 800; color: #121C28; }
.e-dots { display: flex; align-items: center; gap: 6px; margin-bottom: 1.5rem; }
.edot { width: 7px; height: 7px; border-radius: 50%; }
.edot-a { background: #018EBB; }
.edot-t { background: rgba(18,28,40,.12); }
.q-block { margin-bottom: 1.1rem; }
.q-icon { font-size: .82rem; font-weight: 700; color: #121C28; margin-bottom: .3rem; }
.q-hint { font-size: .75rem; color: #718096; margin-bottom: .45rem; }
.seeds-toggle { width: 100%; background: rgba(18,28,40,.03); border: 1.5px solid rgba(18,28,40,.08); border-radius: 10px; padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: .79rem; font-weight: 700; color: #718096; display: flex; align-items: center; justify-content: space-between; margin-bottom: .7rem; }
.seeds-body { display: none; background: rgba(18,28,40,.02); border: 1.5px solid rgba(18,28,40,.07); border-radius: 10px; padding: 12px 14px; margin-bottom: 1rem; }
.seeds-body.open { display: block; }
.sc { background: #fff; border: 1.5px solid rgba(18,28,40,.10); border-radius: 16px; padding: 1.25rem; margin-bottom: 1rem; }
.sc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.sc-num { font-size: .74rem; font-weight: 800; color: #018EBB; text-transform: uppercase; }
.p-row { background: #FAF9F2; border: 1.5px solid rgba(18,28,40,.07); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
.pnum { width: 22px; height: 22px; border-radius: 50%; background: rgba(1,142,187,.12); color: #018EBB; font-size: .67rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.pinp { flex: 1; background: transparent; border: none; outline: none; font-family: inherit; font-size: .83rem; color: #121C28; }
.fpills { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px; }
.fp { background: rgba(18,28,40,.04); border: 1px solid rgba(18,28,40,.09); border-radius: 6px; padding: 3px 9px; font-size: .67rem; font-weight: 700; color: #718096; cursor: pointer; }
.fp.sel { background: #018EBB; border-color: #018EBB; color: #fff; }
.btn-add-p { width: 100%; background: none; border: 1.5px dashed rgba(18,28,40,.12); border-radius: 8px; padding: 7px; font-family: inherit; font-size: .77rem; color: #a0aec0; cursor: pointer; }
.btn-add-s { width: 100%; background: none; border: 1.5px dashed rgba(18,28,40,.15); border-radius: 14px; padding: 14px; font-family: inherit; font-size: .85rem; font-weight: 700; color: #718096; cursor: pointer; margin-bottom: 1rem; }
.rh { background: rgba(1,142,187,.06); border: 1.5px solid rgba(1,142,187,.15); border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
.rs { background: #fff; border: 1.5px solid rgba(18,28,40,.10); border-radius: 14px; padding: 1.1rem 1.25rem; margin-bottom: .85rem; }
.rs-title { font-size: .94rem; font-weight: 800; color: #121C28; margin-bottom: .4rem; }
.rs-prob { font-size: .79rem; color: #4a5568; margin-bottom: .7rem; font-style: italic; }
.rs-posts { list-style: none; }
.rs-posts li { font-size: .79rem; color: #4a5568; padding: 4px 0; display: flex; align-items: flex-start; gap: 7px; }
.rs-fmt { font-size: .64rem; font-weight: 700; background: rgba(1,142,187,.10); color: #018EBB; border-radius: 5px; padding: 2px 7px; }
.ok-banner { background: rgba(34,197,94,.08); border: 1.5px solid rgba(34,197,94,.25); border-radius: 12px; padding: 14px 16px; margin-bottom: 1rem; font-size: .83rem; color: #15803d; font-weight: 600; }
.btn-dl { width: 100%; background: transparent; color: #018EBB; border: 1.5px solid #018EBB; border-radius: 12px; padding: 13px; font-family: inherit; font-size: .88rem; font-weight: 700; cursor: pointer; margin-top: .6rem; }
`

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

  const filled = subjects.map((s,i)=>({t:s.trim(),i})).filter(x=>x.t)
  const go = (s) => { setScreen(s); window.scrollTo(0,0) }

  const saveExp = (idx, field, val) => {
    setExps(prev => {
      const next = [...prev]; next[filled[idx].i] = {...next[filled[idx].i], [field]: val}
      return next
    })
  }

  const updateSeries = (si, field, val) => setSeries(prev => prev.map((s,i) => i===si ? {...s,[field]:val} : s))
  const updatePost = (si, pi, field, val) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts: s.posts.map((p,j) => j===pi ? {...p,[field]:val} : p)} : s))
  const addPost = (si) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:[...s.posts,{idea:'',fmt:''}]} : s))
  const rmPost = (si, pi) => setSeries(prev => prev.map((s,i) => i===si ? {...s, posts:s.posts.filter((_,j)=>j!==pi)} : s))

  const buildResultHtml = () => {
    const tags = subjects.filter(Boolean).map(s=>`<span class="chip">${s}</span>`).join('')
    let html = `<div class="rh"><div style="font-size:.7rem;font-weight:700;color:#018EBB;text-transform:uppercase;margin-bottom:8px">Profil</div><div style="margin-bottom:8px">${tags}</div><div style="font-size:.79rem;color:#4a5568"><strong>Format :</strong> ${FMT[fmt]||fmt} • <strong>Cadence :</strong> ${CAD[cad]||cad}</div></div>`
    
    filled.forEach(x=>{
      const e=exps[x.i]; if(!e.e && !e.q && !e.r) return
      html += `<div class="rs" style="background:rgba(1,142,187,.04)"><div style="font-size:.79rem;font-weight:700;color:#121C28;margin-bottom:.35rem">${x.t}</div>`
      if(e.e) html += `<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem">❌ ${e.e}</div>`
      if(e.q) html += `<div style="font-size:.77rem;color:#4a5568;margin-bottom:.25rem">❓ ${e.q}</div>`
      if(e.r) html += `<div style="font-size:.77rem;color:#4a5568;margin-bottom:.5rem">✅ ${e.r}</div>`
      html += `</div>`
    })

    series.forEach((s,i)=>{
      if(!s.name) return
      const posts = s.posts.filter(p=>p.idea).map(p=>`<li><span class="rs-fmt">${FMT[p.fmt]||'—'}</span> ${p.idea}</li>`).join('')
      html += `<div class="rs"><div class="rs-title">Série ${i+1} — ${s.name}</div>${s.prob?`<div class="rs-prob">${s.prob}</div>`:''}<ul class="rs-posts">${posts}</ul></div>`
    })
    return html
  }

  const handleResult = async () => {
    setSlackOk(false); setSlackErr(''); go('result')
    const finalHtml = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Kalanis — ${name}</title>
    <style>body{font-family:sans-serif;background:#FAF9F2;padding:2rem}.container{max-width:600px;margin:0 auto}.rh{background:rgba(1,142,187,.06);padding:1rem;border-radius:14px;margin-bottom:1rem}.rs{background:#fff;padding:1rem;border-radius:14px;margin-bottom:1rem;border:1px solid #eee}.chip{background:#e0f2f7;color:#018EBB;padding:3px 10px;border-radius:20px;font-size:12px;margin-right:5px}.rs-fmt{background:#018EBB;color:#fff;font-size:10px;padding:2px 5px;border-radius:4px}</style>
    </head><body><div class="container"><h1>Séries de ${name}</h1>${buildResultHtml()}</div></body></html>`

    try {
      const fileName = `workbook-series/${Date.now()}_${name.replace(/\s+/g,'_')}.html`
      const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8' })
      const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, blob)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName)

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: name, url: publicUrl, email })
      })
      setSlackOk(true)
    } catch (e) { setSlackErr("Fichier généré, mais erreur d'envoi Slack.") }
  }

  return (
    <div className="wrapper">
      <style>{css}</style>
      <div className="blob blob-1"/><div className="blob blob-2"/><div className="qouter">
        {screen==='home' && (
          <div className="qcard">
            <div className="badge">Kalanis</div>
            <h1>Tes séries de posts LinkedIn</h1>
            <p className="sub">Prépare ton call avec Sarah en structurant tes idées.</p>
            <input className="inp" placeholder="Ton nom" value={name} onChange={e=>setName(e.target.value)}/>
            <button className="btn-p" disabled={!name} onClick={()=>go('subjects')}>Commencer</button>
          </div>
        )}

        {screen==='subjects' && (
          <div className="qcard">
            <h2>Quels sont tes sujets ?</h2>
            {subjects.map((s,i)=>(
              <input key={i} className="inp" placeholder={`Sujet ${i+1}`} value={s} onChange={e=>{const n=[...subjects];n[i]=e.target.value;setSubjects(n)}}/>
            ))}
            <button className="btn-p" onClick={()=>go('format')}>Continuer</button>
          </div>
        )}

        {screen==='format' && (
          <div className="qcard">
            <h2>Ton format favori ?</h2>
            <div className="opt-group">
              {Object.entries(FMT).map(([k,v])=>(
                <button key={k} className={`opt ${fmt===k?'sel':''}`} onClick={()=>setFmt(k)}>{v}</button>
              ))}
            </div>
            <button className="btn-p" onClick={()=>go('cadence')}>Suivant</button>
          </div>
        )}

        {screen==='cadence' && (
          <div className="qcard">
            <h2>Ta fréquence ?</h2>
            <div className="opt-group">
              {Object.entries(CAD).map(([k,v])=>(
                <button key={k} className={`opt ${cad===k?'sel':''}`} onClick={()=>setCad(k)}>{v}</button>
              ))}
            </div>
            <button className="btn-p" onClick={()=>go('explore')}>C'est parti</button>
          </div>
        )}

        {screen==='explore' && filled[curExp] && (
          <div className="qcard">
            <div className="badge">Sujet {curExp+1}/{filled.length}</div>
            <h2>{filled[curExp].t}</h2>
            <textarea className="inp-area" placeholder="L'erreur fréquente..." value={exps[filled[curExp].i].e} onChange={e=>saveExp(curExp,'e',e.target.value)}/>
            <textarea className="inp-area" placeholder="La question récurrente..." value={exps[filled[curExp].i].q} onChange={e=>saveExp(curExp,'q',e.target.value)}/>
            <button className="btn-p" onClick={()=>curExp < filled.length-1 ? setCurExp(curExp+1) : go('series')}>
              {curExp < filled.length-1 ? 'Sujet suivant' : 'Créer les séries'}
            </button>
          </div>
        )}

        {screen==='series' && (
          <div className="qcard">
            <h2>Tes séries</h2>
            {series.map((s, si)=>(
              <div key={si} className="sc">
                <input className="inp" placeholder="Nom de la série" value={s.name} onChange={e=>updateSeries(si,'name',e.target.value)}/>
                {s.posts.map((p, pi)=>(
                  <div key={pi} className="p-row">
                    <input className="pinp" placeholder={`Post ${pi+1}`} value={p.idea} onChange={e=>updatePost(si,pi,'idea',e.target.value)}/>
                    <div className="fpills">
                      {Object.keys(FMT).map(k=><button key={k} className={`fp ${p.fmt===k?'sel':''}`} onClick={()=>updatePost(si,pi,'fmt',k)}>{k}</button>)}
                    </div>
                  </div>
                ))}
                <button className="btn-add-p" onClick={()=>addPost(si)}>+ Ajouter un post</button>
              </div>
            ))}
            <button className="btn-add-s" onClick={()=>setSeries([...series, mkS()])}>+ Nouvelle série</button>
            <button className="btn-p" onClick={handleResult}>Terminer</button>
          </div>
        )}

        {screen==='result' && (
          <div className="qcard">
            <h2>Terminé !</h2>
            {slackOk && <div className="ok-banner">Envoyé à Sarah !</div>}
            <div style={{background:'#fff', padding:'15px', borderRadius:'10px', border:'1px solid #ddd', marginTop:'10px'}} 
                 dangerouslySetInnerHTML={{__html: buildResultHtml()}} />
            <button className="btn-dl" onClick={() => window.location.reload()}>Recommencer</button>
          </div>
        )}
      </div>
    </div>
  )
}

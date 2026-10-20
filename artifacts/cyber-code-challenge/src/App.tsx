import { type ReactNode, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Link, useLocation, Router as WouterRouter } from 'wouter';
import { Activity, ArrowLeft, ArrowRight, BookOpen, BrainCircuit, Check, ChevronLeft, CircleHelp, Clock3, Download, FileJson, Gauge, Layers3, ListChecks, Menu, Pencil, Play, Plus, Search, ShieldAlert, Sparkles, Target, Trash2, Upload, X, Zap } from 'lucide-react';
import questionsSeed from './data/questions.json';
import type { Question } from './types';

const queryClient = new QueryClient();
const unitLessons = [
  { id: '1-1', title: 'تطور تكنولوجيا المعلومات والتحول الاجتماعي', short: 'تطور التقنية', topics: 'من الحواسيب الأولى إلى التحول الرقمي', icon: Activity, color: 'cyan' },
  { id: '1-2', title: 'كيف يعمل الذكاء الاصطناعي', short: 'كيف يعمل الذكاء الاصطناعي', topics: 'البيانات، التعلم الآلي والنماذج', icon: BrainCircuit, color: 'violet' },
  { id: '1-3', title: 'الذكاء الاصطناعي في الحياة اليومية والصناعة', short: 'الذكاء الاصطناعي حولنا', topics: 'تطبيقات واقعية في قطاعات مختلفة', icon: Layers3, color: 'cyan' },
  { id: '1-4', title: 'القضايا الأخلاقية للذكاء الاصطناعي', short: 'أخلاقيات الذكاء الاصطناعي', topics: 'الإنصاف والخصوصية والمساءلة', icon: ShieldAlert, color: 'violet' },
] as const;
type LessonId = typeof unitLessons[number]['id'];
type Q = Question;
type Attempt = { question: Q; selectedId: string; correct: boolean };
const initialQuestions = questionsSeed as Q[];
const nav = [
  { href: '/', label: 'الرئيسية', icon: Gauge },
  { href: '/stages', label: 'خريطة الدروس', icon: Layers3 },
  { href: '/stats', label: 'سجلي', icon: Activity },
  { href: '/admin', label: 'بنك الأسئلة', icon: ListChecks },
];

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="cyber-bg scanline" dir="rtl">
    <header className="relative z-10 border-b border-white/5 bg-[#0d1020]/80 backdrop-blur-xl">
      <div className="wide-content mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-3 no-underline text-inherit" data-testid="link-brand">
          <div className="grid h-10 w-10 place-items-center border border-cyan-300/30 bg-cyan-300/10 text-cyan-200"><Zap size={21}/></div>
          <div><div className="mono text-[10px] tracking-[.23em] text-cyan-300">CYBER / CODE</div><div className="text-sm font-bold text-slate-100">تحدّي الوحدة الأولى</div></div>
        </Link>
        <nav className="desktop-nav flex items-center gap-1" aria-label="التنقل الرئيسي">
          {nav.map(item => <Link key={item.href} href={item.href} data-testid={`link-nav-${item.href.slice(1)||'home'}`} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm no-underline transition ${location===item.href?'bg-cyan-300/10 text-cyan-200':'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}><item.icon size={16}/>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/><span className="mono text-[10px] text-slate-400">النظام جاهز</span></div>
          <button className="mobile-nav btn-ghost hidden h-10 w-10 items-center justify-center rounded-lg text-slate-200" onClick={()=>setMenuOpen(!menuOpen)} aria-label="فتح قائمة التنقل" aria-expanded={menuOpen} data-testid="button-mobile-menu"><Menu size={19}/></button>
        </div>
      </div>
      {menuOpen&&<nav className="mobile-nav relative z-20 hidden flex-col gap-1 border-t border-white/5 bg-[#111528] p-3">{nav.map(item=><Link key={item.href} onClick={()=>setMenuOpen(false)} href={item.href} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-300 no-underline hover:bg-white/5"><item.icon size={17}/>{item.label}</Link>)}</nav>}
    </header>
    <main className="wide-content relative z-[1] mx-auto max-w-[1440px] px-8 pb-20 pt-9">{children}</main>
    <footer className="relative z-[1] border-t border-white/5 px-6 py-5 text-center text-xs text-slate-600">تحدّي الوحدة الأولى <span className="px-2 text-cyan-800">/</span> مساعد مذاكرة تفاعلي للصف الثاني الثانوي</footer>
  </div>;
}
function Eyebrow({ children }: { children: ReactNode }) { return <div className="mono mb-3 flex items-center gap-2 text-[10px] tracking-[.2em] text-cyan-300/80"><span className="h-px w-6 bg-cyan-400/70"/>{children}</div>; }
function PageTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) { return <div className="mb-8 reveal"><Eyebrow>{eyebrow}</Eyebrow><h1 className="mb-2 text-3xl font-extrabold leading-tight text-slate-100 sm:text-4xl">{title}</h1>{sub&&<p className="max-w-2xl text-sm leading-7 text-slate-400">{sub}</p>}</div>; }
function PrimaryLink({ href, children }: { href: string; children: ReactNode }) { return <Link href={href} className="btn-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold no-underline" data-testid="link-primary-action">{children}</Link>; }

function Home({ questions }: { questions: Q[] }) {
  const available = questions.length;
  const [startMode, setStartMode] = useState<LessonId|'all'>('all');
  const [, setLocation] = useLocation();
  const start = () => { sessionStorage.setItem('ccc-lesson', startMode); setLocation('/play'); };
  return <div className="space-y-10">
    <section className="relative grid min-h-[390px] items-center overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#11182a] p-7 sm:p-12 lg:grid-cols-[1.1fr_.9fr]">
      <div className="absolute inset-0 opacity-40" style={{background:'radial-gradient(ellipse at 75% 45%, rgba(29,205,219,.12), transparent 42%),linear-gradient(125deg,transparent 48%,rgba(123,93,197,.07))'}}/>
      <div className="relative z-[1] max-w-2xl">
        <Eyebrow>المهمة ٠١ <span className="text-slate-600">/</span> تحقيق معرفي</Eyebrow>
        <h1 className="mb-4 text-4xl font-black leading-[1.3] text-slate-50 sm:text-6xl">فكّ شفرة<br/><span className="cyan-glow text-cyan-300">الذكاء الاصطناعي</span></h1>
        <p className="mb-7 max-w-lg text-base leading-8 text-slate-400">أربع دروس. أسئلة من المنهج. كل إجابة تقرّبك من حلّ القضية.</p>
        <div className="flex flex-wrap items-center gap-3">
          <select aria-label="اختيار نطاق الجولة" value={startMode} onChange={e=>setStartMode(e.target.value as LessonId|'all')} className="h-12 rounded-lg border border-white/10 bg-[#171d30] px-3 text-sm text-slate-200 outline-none focus:border-cyan-300/60" data-testid="select-round-scope">
            <option value="all">جولة من الوحدة كاملة</option>{unitLessons.map(l=><option key={l.id} value={l.id}>الدرس {l.id} · {l.short}</option>)}
          </select>
          <button onClick={start} className="btn-primary inline-flex h-12 items-center gap-2 rounded-lg px-5 text-sm font-extrabold" data-testid="button-quick-start"><Play size={16} fill="currentColor"/>ابدأ الجولة<ArrowLeft size={16}/></button>
        </div>
      </div>
      <div className="relative mx-auto mt-8 flex h-64 w-64 items-center justify-center lg:mt-0">
        <div className="absolute inset-2 rounded-full border border-cyan-300/15"/><div className="absolute inset-8 rounded-full border border-dashed border-violet-300/20"/>
        <div className="absolute h-48 w-48 rounded-full border border-cyan-300/15" style={{transform:'rotateX(65deg) rotate(-24deg)'}}/>
        <div className="absolute h-36 w-36 rounded-full border border-violet-300/25" style={{transform:'rotateY(66deg) rotate(22deg)'}}/>
        <div className="relative grid h-28 w-28 place-items-center border border-cyan-200/40 bg-[#101b2b] shadow-[0_0_60px_rgba(61,219,229,.13)]"><BrainCircuit className="text-cyan-200" size={50}/><span className="absolute -bottom-7 mono text-[9px] tracking-[.22em] text-cyan-300">UNIT_01</span></div>
        <span className="absolute right-2 top-9 mono text-[9px] text-violet-300">AI_CORE : ACTIVE</span><span className="absolute bottom-8 left-0 mono text-[9px] text-slate-500">CIRCUIT / 01—04</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-cyan-300/30 to-transparent"/>
    </section>
    <section className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
      <div className="panel rounded-xl p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between"><div><Eyebrow>مسار التحقيق</Eyebrow><h2 className="text-xl font-bold">أربع محطات، قضية واحدة</h2></div><Link href="/stages" className="flex items-center gap-1 text-xs text-cyan-300 no-underline" data-testid="link-all-stages">عرض الخريطة<ChevronLeft size={15}/></Link></div>
        <div className="grid gap-2 sm:grid-cols-2">{unitLessons.map((lesson,i)=><Link href="/stages" key={lesson.id} data-testid={`card-lesson-${lesson.id}`} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[.02] p-3 text-inherit no-underline transition hover:border-cyan-300/25 hover:bg-cyan-300/[.04]"><span className={`mono grid h-9 w-9 shrink-0 place-items-center rounded-md ${lesson.color==='cyan'?'bg-cyan-300/10 text-cyan-200':'bg-violet-300/10 text-violet-200'}`}>0{i+1}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{lesson.short}</div><div className="mt-1 text-[11px] text-slate-500">الدرس {lesson.id}</div></div><ChevronLeft size={15} className="text-slate-600 group-hover:text-cyan-300"/></Link>)}</div>
      </div>
      <div className="panel flex flex-col justify-between rounded-xl p-6">
        <div><Eyebrow>إشارة من النظام</Eyebrow><h2 className="mb-2 text-xl font-bold">تعلّم بالتركيز</h2><p className="text-sm leading-7 text-slate-400">الجولة تراجع فهمك للمفاهيم، لا سرعة ضغطك على الإجابة. اقرأ الموقف، فكّر، ثم اختر.</p></div>
        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4"><span className="text-xs text-slate-500">أسئلة متاحة في النسخة الحالية</span><span className="mono text-lg text-cyan-300">{available.toLocaleString('ar-EG')}</span></div>
      </div>
    </section>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[
      ['٠٤','دروس الوحدة','تعلّم منظّم'],['٠٦','أنماط سؤال','من اختيار إلى تطبيق'],['٠١','وحدة دراسية','الذكاء الاصطناعي'],['∞','محاولتك القادمة','ابدأ من أي درس'],
    ].map(([n,label,caption])=><div key={label} className="border-r border-cyan-300/20 py-2 pr-4"><div className="mono mb-1 text-xl text-cyan-200">{n}</div><div className="text-sm font-bold">{label}</div><div className="mt-1 text-[11px] text-slate-500">{caption}</div></div>)}</section>
  </div>;
}

function Stages({ questions }: { questions: Q[] }) {
  const [location, setLocation] = useLocation();
  const begin = (id: LessonId) => { sessionStorage.setItem('ccc-lesson', id); setLocation('/play'); };
  return <><PageTitle eyebrow="خريطة الوحدة / ٠١" title="مسار التعلّم" sub="اختر محطة للتركيز عليها، أو ابدأ جولة تغطي موضوعات الوحدة كاملة."/>
  <div className="relative space-y-4 before:absolute before:bottom-8 before:right-[27px] before:top-8 before:w-px before:bg-gradient-to-b before:from-cyan-300/50 before:via-violet-300/25 before:to-transparent sm:before:right-[35px]">
    {unitLessons.map((l,i)=>{const count=questions.filter(q=>q.lesson===l.id).length;const Icon=l.icon;return <article key={l.id} className="panel relative grid gap-4 rounded-xl p-4 pr-[68px] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6 sm:pr-[88px]">
      <span className={`absolute right-3 top-5 z-[1] grid h-10 w-10 place-items-center border ${l.color==='cyan'?'border-cyan-200/40 bg-cyan-300/10 text-cyan-200':'border-violet-200/40 bg-violet-300/10 text-violet-200'} sm:right-4 sm:top-6 sm:h-12 sm:w-12`}><Icon size={21}/></span>
      <div><div className="mono mb-1 text-[10px] tracking-widest text-cyan-300">STAGE 0{i+1} <span className="text-slate-600">/</span> الدرس {l.id}</div><h2 className="mb-1 text-base font-bold leading-7 text-slate-100 sm:text-lg">{l.title}</h2><p className="text-xs text-slate-500">{l.topics}</p></div>
      <div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-xs text-slate-500">{count.toLocaleString('ar-EG')} أسئلة محمّلة</span><button onClick={()=>begin(l.id)} className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-cyan-100" data-testid={`button-start-lesson-${l.id}`}>ابدأ الدرس<ArrowLeft size={14}/></button></div>
    </article>})}
  </div><div className="panel mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl p-5"><div><div className="font-bold">مستعد لجولة شاملة؟</div><div className="mt-1 text-xs text-slate-500">تنقّل بين المفاهيم من الدروس الأربعة.</div></div><button onClick={()=>begin('1-1')} className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold" data-testid="button-start-full-unit"><Play size={15}/>ابدأ جولة الوحدة</button></div></>;
}

function PlayPage({ questions, onComplete }: { questions: Q[]; onComplete: (attempts: Attempt[])=>void }) {
  const lesson = sessionStorage.getItem('ccc-lesson') as LessonId|'all'|null;
  const pool = useMemo(()=>questions.filter(q=>!lesson||lesson==='all'||q.lesson===lesson),[questions,lesson]);
  const [idx,setIdx]=useState(0);const [selected,setSelected]=useState('');const [revealed,setRevealed]=useState(false);const [attempts,setAttempts]=useState<Attempt[]>([]);const [hint,setHint]=useState(false);
  if(pool.length===0)return <div className="mx-auto max-w-xl py-16 text-center"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-violet-300/20 bg-violet-300/5 text-violet-200"><CircleHelp/></div><h1 className="mb-2 text-2xl font-bold">لا توجد أسئلة لهذا النطاق بعد</h1><p className="mb-6 text-sm leading-7 text-slate-400">أضف أسئلة لهذا الدرس من بنك الأسئلة، أو عد إلى خريطة الوحدة واختر درسًا آخر.</p><Link href="/admin" className="btn-primary inline-flex rounded-lg px-5 py-3 text-sm font-bold no-underline">إدارة بنك الأسئلة</Link></div>;
  const q=pool[idx%pool.length];
  const pick=(id:string)=>{if(revealed)return;setSelected(id);setRevealed(true);const attempt={question:q,selectedId:id,correct:id===q.correctChoiceId};setAttempts(a=>[...a,attempt]);};
  const next=()=>{if(idx+1>=pool.length){onComplete(attempts);return;}setIdx(idx+1);setSelected('');setRevealed(false);setHint(false);};
  return <div className="mx-auto max-w-3xl">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><Link href="/stages" className="flex items-center gap-2 text-sm text-slate-400 no-underline hover:text-cyan-200"><ArrowRight size={16}/>خريطة الدروس</Link><span className="mono text-xs text-slate-400">سؤال {String(idx+1).padStart(2,'0')} <span className="text-slate-600">/</span> {String(pool.length).padStart(2,'0')}</span></div>
    <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-cyan-300 transition-all" style={{width:`${((idx+1)/pool.length)*100}%`}}/></div>
    <section className="panel rounded-2xl p-5 sm:p-9">
      <div className="mb-6 flex flex-wrap items-center gap-2"><span className="rounded-md border border-cyan-300/20 bg-cyan-300/5 px-2.5 py-1 text-[11px] text-cyan-200">الدرس {q.lesson}</span><span className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-slate-400">{q.topic}</span><span className="mr-auto mono text-[10px] text-slate-600">{q.difficulty==='easy'?'سهل':q.difficulty==='medium'?'متوسط':'متقدم'}</span></div>
      <div className="mb-7 flex gap-3"><span className="mono mt-1 text-sm text-violet-300">Q{String(idx+1).padStart(2,'0')}</span><h1 className="text-xl font-bold leading-9 text-slate-100 sm:text-2xl">{q.prompt}</h1></div>
      <div className="grid gap-3">{q.choices.map((choice,i)=>{const chosen=selected===choice.id;const isCorrect=choice.id===q.correctChoiceId;let state='border-white/10 bg-white/[.025] hover:border-cyan-300/40 hover:bg-cyan-300/[.04]';if(revealed&&isCorrect)state='border-emerald-300/50 bg-emerald-300/[.08]';else if(revealed&&chosen)state='border-rose-300/50 bg-rose-300/[.07]';return <button key={choice.id} onClick={()=>pick(choice.id)} disabled={revealed} className={`flex min-h-[58px] items-center gap-3 rounded-lg border p-3 text-right text-sm leading-6 text-slate-200 transition ${state}`} data-testid={`button-answer-${choice.id}`}><span className={`mono grid h-8 w-8 shrink-0 place-items-center rounded-md border ${revealed&&isCorrect?'border-emerald-300/40 text-emerald-200':'border-white/10 text-slate-500'}`}>{String.fromCharCode(65+i)}</span><span className="flex-1">{choice.text}</span>{revealed&&isCorrect&&<Check size={17} className="text-emerald-300"/>}</button>})}</div>
      {hint&&!revealed&&<div className="mt-4 rounded-lg border border-violet-300/20 bg-violet-300/[.05] p-3 text-sm leading-6 text-violet-100"><span className="ml-2 text-violet-300">تلميح:</span>{q.hint||'فكّر في الفكرة الأساسية التي يختبرها السؤال.'}</div>}
      {revealed&&<div className={`mt-5 rounded-lg border p-4 ${selected===q.correctChoiceId?'border-emerald-300/20 bg-emerald-300/[.045]':'border-rose-300/20 bg-rose-300/[.045]'}`}><div className={`mb-1 text-sm font-bold ${selected===q.correctChoiceId?'text-emerald-200':'text-rose-200'}`}>{selected===q.correctChoiceId?'إجابة صحيحة':'راجع الفكرة'}</div><p className="text-sm leading-7 text-slate-300">{q.explanation}</p></div>}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
        {!revealed?<button onClick={()=>setHint(!hint)} className="btn-ghost flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-300" data-testid="button-toggle-hint"><Sparkles size={14} className="text-violet-300"/>{hint?'إخفاء التلميح':'اطلب تلميحًا'}</button>:<span className="text-xs text-slate-500">{attempts.filter(a=>a.correct).length} إجابات صحيحة حتى الآن</span>}
        {revealed&&<button onClick={next} className="btn-primary flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" data-testid="button-next-question">{idx+1>=pool.length?'إنهاء الجولة':'السؤال التالي'}<ArrowLeft size={15}/></button>}
      </div>
    </section>
    <p className="mt-4 text-center text-[11px] text-slate-600">تُظهر الجولة عيّنة الأسئلة المتاحة حاليًا. ستُربط آلية التوليد العشوائي عند تكامل البيانات.</p>
  </div>;
}

function Results({ attempts }: { attempts: Attempt[] }) {
  const total=attempts.length;const correct=attempts.filter(a=>a.correct).length;const pct=total?Math.round(correct/total*100):0;
  return <div className="mx-auto max-w-3xl"><PageTitle eyebrow="تقرير الجولة / COMPLETE" title="أُغلقت القضية" sub="كل محاولة تبني فهمًا أدق. راجع ما تعلّمته قبل الانتقال إلى المحطة التالية."/>
  {!total?<div className="panel rounded-xl p-8 text-center"><p className="mb-4 text-slate-400">لا توجد جولة مكتملة لعرضها الآن.</p><PrimaryLink href="/stages">اختر درسًا وابدأ</PrimaryLink></div>:<>
    <section className="panel relative mb-5 overflow-hidden rounded-2xl p-7 sm:p-10"><div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-cyan-300/[.04] blur-2xl"/><div className="relative grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center"><div><Eyebrow>نتيجة التحليل</Eyebrow><div className="text-5xl font-black text-slate-50">{pct}<span className="text-2xl text-cyan-300">٪</span></div><p className="mt-2 text-sm text-slate-400">أجبت بشكل صحيح عن {correct.toLocaleString('ar-EG')} من {total.toLocaleString('ar-EG')} أسئلة</p></div><div className="grid h-32 w-32 place-items-center rounded-full border-[6px] border-cyan-300/20 text-center" style={{background:`conic-gradient(#45e1e9 ${pct}%,#273044 ${pct}% 100%)`}}><div className="grid h-24 w-24 place-items-center rounded-full bg-[#131a2b]"><div><div className="mono text-2xl text-cyan-200">{correct}/{total}</div><div className="text-[10px] text-slate-500">إجابات صحيحة</div></div></div></div></div></section>
    <section className="panel mb-5 rounded-xl p-5"><h2 className="mb-4 font-bold">ملخص جولتك</h2><div className="grid gap-2 sm:grid-cols-3"><div className="rounded-lg bg-white/[.025] p-4"><Target className="mb-3 text-cyan-300" size={19}/><div className="mono text-xl">{correct.toLocaleString('ar-EG')}</div><div className="text-xs text-slate-500">إجابات صحيحة</div></div><div className="rounded-lg bg-white/[.025] p-4"><CircleHelp className="mb-3 text-violet-300" size={19}/><div className="mono text-xl">{(total-correct).toLocaleString('ar-EG')}</div><div className="text-xs text-slate-500">تحتاج مراجعة</div></div><div className="rounded-lg bg-white/[.025] p-4"><Zap className="mb-3 text-amber-200" size={19}/><div className="mono text-xl">{total.toLocaleString('ar-EG')}</div><div className="text-xs text-slate-500">إجمالي الأسئلة</div></div></div></section>
    <div className="flex flex-wrap gap-3"><Link href="/review" className="btn-ghost inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-slate-100 no-underline" data-testid="link-review-missed"><BookOpen size={16}/>راجع الإجابات</Link><Link href="/stages" className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold no-underline" data-testid="link-continue-stages">تابع إلى الخريطة<ArrowLeft size={16}/></Link></div>
  </>}</div>;
}

function Review({ attempts }: { attempts: Attempt[] }) {
  const missed=attempts.filter(a=>!a.correct);
  return <><PageTitle eyebrow="مختبر المراجعة / REVIEW" title="راجع نقاط الالتباس" sub="الإجابة وحدها لا تكفي؛ افهم السبب، ثم أعد المحاولة في جولتك التالية."/>
  {!attempts.length?<div className="panel mx-auto max-w-2xl rounded-xl p-8 text-center"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200"><BookOpen/></div><h2 className="mb-2 text-lg font-bold">لا توجد مراجعات بعد</h2><p className="mb-5 text-sm leading-7 text-slate-400">أكمل جولة أولًا، وستظهر هنا الأسئلة التي تحتاج إلى مراجعتها.</p><PrimaryLink href="/stages">اذهب إلى خريطة الدروس</PrimaryLink></div>:!missed.length?<div className="panel rounded-xl p-8 text-center"><Check className="mx-auto mb-4 text-emerald-300" size={34}/><h2 className="mb-2 text-xl font-bold">أحسنت، لا توجد إجابات فائتة</h2><p className="mb-5 text-sm text-slate-400">أجبت عن كل أسئلة الجولة بشكل صحيح.</p><PrimaryLink href="/stages">جولة جديدة</PrimaryLink></div>:<div className="space-y-3">{missed.map(({question:q,selectedId},i)=><article key={`${q.id}-${i}`} className="panel rounded-xl p-5"><div className="mb-3 flex items-center justify-between gap-2"><span className="mono text-[10px] text-violet-300">REVIEW / {String(i+1).padStart(2,'0')}</span><span className="text-[11px] text-slate-500">الدرس {q.lesson} · {q.topic}</span></div><h2 className="mb-4 font-bold leading-7">{q.prompt}</h2><div className="grid gap-2 sm:grid-cols-2"><div className="rounded-lg border border-rose-300/15 bg-rose-300/[.04] p-3"><div className="mb-1 text-[10px] text-rose-200">إجابتك</div><div className="text-sm">{q.choices.find(c=>c.id===selectedId)?.text||'—'}</div></div><div className="rounded-lg border border-emerald-300/15 bg-emerald-300/[.04] p-3"><div className="mb-1 text-[10px] text-emerald-200">الإجابة الصحيحة</div><div className="text-sm">{q.choices.find(c=>c.id===q.correctChoiceId)?.text||'—'}</div></div></div><p className="mt-3 text-sm leading-7 text-slate-400">{q.explanation}</p></article>)}</div>}</>;
}

function Stats({ attempts }: { attempts: Attempt[] }) {
  const count=attempts.length;const right=attempts.filter(a=>a.correct).length;const pct=count?Math.round(right/count*100):0;
  return <><PageTitle eyebrow="السجل الشخصي / LEARNER LOG" title="تقدّمك في التحقيق" sub="مؤشرات الجلسة الحالية. ستظهر السجلات التراكمية بعد توصيل التخزين الدائم."/>
  <div className="grid gap-4 sm:grid-cols-3"><div className="panel rounded-xl p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-400">إجابات في هذه الجلسة</span><ListChecks className="text-cyan-300" size={18}/></div><div className="mono text-3xl text-slate-100">{count.toLocaleString('ar-EG')}</div><div className="mt-2 text-xs text-slate-600">محاولات مسجلة محليًا</div></div><div className="panel rounded-xl p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-400">دقة الإجابة</span><Target className="text-violet-300" size={18}/></div><div className="mono text-3xl text-slate-100">{pct}<span className="text-lg text-violet-300">٪</span></div><div className="mt-3 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-violet-300" style={{width:`${pct}%`}}/></div></div><div className="panel rounded-xl p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-slate-400">نقاط تحتاج مراجعة</span><CircleHelp className="text-amber-200" size={18}/></div><div className="mono text-3xl text-slate-100">{(count-right).toLocaleString('ar-EG')}</div><Link href="/review" className="mt-2 inline-block text-xs text-cyan-300 no-underline">افتح قائمة المراجعة ←</Link></div></div>
  <section className="panel mt-5 rounded-xl p-6"><div className="mb-5 flex items-center justify-between"><div><Eyebrow>مؤشرات الدروس</Eyebrow><h2 className="font-bold">أين وصل تعلّمك؟</h2></div><span className="mono text-[10px] text-slate-600">UNIT_01</span></div><div className="space-y-4">{unitLessons.map(l=>{const lessonAttempts=attempts.filter(a=>a.question.lesson===l.id);const correct=lessonAttempts.filter(a=>a.correct).length;const percent=lessonAttempts.length?Math.round(correct/lessonAttempts.length*100):0;return <div key={l.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><div><div className="mb-2 flex justify-between gap-2 text-xs"><span className="truncate text-slate-300">الدرس {l.id} · {l.short}</span><span className="mono text-slate-500">{lessonAttempts.length?`${percent}%`:'—'}</span></div><div className="h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan-300/80 transition-all" style={{width:`${percent}%`}}/></div></div><span className="mono text-[10px] text-slate-600">{lessonAttempts.length} Q</span></div>})}</div></section>
  <div className="mt-5 rounded-xl border border-violet-300/15 bg-violet-300/[.035] p-5 text-sm leading-7 text-slate-400"><Clock3 className="mb-2 text-violet-200" size={18}/><strong className="text-slate-200">السجل التراكمي قيد الربط.</strong> لا يتم فقد تقدّم هذه الصفحة أثناء التنقل، لكن الحفظ الدائم وسجل المحاولات سيُضافان عند تكامل طبقة البيانات.</div>
  </>;
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); if (row.some(value => value.trim())) rows.push(row);
      row = []; cell = '';
    } else cell += ch;
  }
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

function Admin({questions,onChange}:{questions:Q[];onChange:(questions:Q[])=>void}) {
  const [query,setQuery]=useState('');const [lesson,setLesson]=useState('all');const [editing,setEditing]=useState<Q|null>(null);const [notice,setNotice]=useState('');const fileRef=useRef<HTMLInputElement>(null);
  const empty:Q={id:'',prompt:'',type:'multiple-choice',choices:[{id:'a',text:''},{id:'b',text:''},{id:'c',text:''},{id:'d',text:''}],correctChoiceId:'a',explanation:'',hint:'',topic:'',lesson:'1-1',difficulty:'easy'};
  const filtered=questions.filter(q=>(lesson==='all'||q.lesson===lesson)&&`${q.prompt} ${q.topic} ${q.id}`.toLowerCase().includes(query.toLowerCase()));
  const save=()=>{if(!editing)return;if(!editing.prompt.trim()||editing.choices.some(c=>!c.text.trim())){setNotice('أكمل نص السؤال وجميع الاختيارات قبل الحفظ.');return;}const dupe=questions.find(q=>q.id!==editing.id&&q.prompt.trim()===editing.prompt.trim());if(dupe){setNotice(`يوجد سؤال مطابق بالفعل بالمعرّف ${dupe.id}.`);return;}const data=questions.some(q=>q.id===editing.id)?questions.map(q=>q.id===editing.id?editing:q):[editing,...questions];onChange(data);setEditing(null);setNotice('تم حفظ السؤال في القائمة الحالية.');};
  const remove=(id:string)=>{if(window.confirm('هل تريد حذف هذا السؤال من القائمة الحالية؟')){onChange(questions.filter(q=>q.id!==id));setNotice('تم حذف السؤال.');}};
  const download=(csv=false)=>{const content=csv?['id,prompt,type,correctChoiceId,explanation,hint,topic,lesson,difficulty,choices',...questions.map(q=>[q.id,q.prompt,q.type,q.correctChoiceId,q.explanation,q.hint,q.topic,q.lesson,q.difficulty,JSON.stringify(q.choices)].map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))].join('\n'):JSON.stringify(questions,null,2);const blob=new Blob([content],{type:csv?'text/csv;charset=utf-8':'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=csv?'cyber-code-questions.csv':'cyber-code-questions.json';a.click();URL.revokeObjectURL(url);};
  const importFile=async(file?:File)=>{if(!file)return;try{const text=await file.text();let incoming:Q[];if(file.name.toLowerCase().endsWith('.csv')){const rows=parseCsvRows(text);const headers=rows.shift()?.map(h=>h.trim())||[];incoming=rows.map(row=>{const record=Object.fromEntries(headers.map((h,i)=>[h,row[i]||''])) as Record<string,string>;return {...record,choices:JSON.parse(record.choices||'[]')} as unknown as Q;});}else{const parsed=JSON.parse(text);if(!Array.isArray(parsed))throw new Error();incoming=parsed;}const valid=incoming.every(q=>q.id&&q.prompt&&q.lesson&&Array.isArray(q.choices)&&q.correctChoiceId&&q.choices.length>0);if(!valid)throw new Error();const ids=new Set(questions.map(q=>q.id));const prompts=new Set(questions.map(q=>q.prompt.trim().toLocaleLowerCase()));const fresh=incoming.filter(q=>{const normalized=q.prompt.trim().toLocaleLowerCase();if(ids.has(q.id)||prompts.has(normalized))return false;ids.add(q.id);prompts.add(normalized);return true;});onChange([...fresh,...questions]);setNotice(`تم استيراد ${fresh.length} سؤالًا جديدًا؛ تم تجاهل ${incoming.length-fresh.length} سجل مكرر.`);}catch{setNotice('تعذّر استيراد الملف. تحقّق من صيغة CSV أو صحة JSON وبنية الأسئلة.');}};
  const update=(patch:Partial<Q>)=>setEditing(v=>v?{...v,...patch}:v);
  return <><PageTitle eyebrow="إدارة المحتوى / BANK CONTROL" title="بنك الأسئلة" sub="أضف الأسئلة وراجع التكرار وصدّر البيانات. القائمة الحالية بيانات محلية قابلة للاستبدال بالبنك الكامل."/>
  <div className="mb-5 flex flex-wrap gap-2"><button onClick={()=>{setEditing({...empty,id:`U1-${String(Date.now()).slice(-6)}`});setNotice('')}} className="btn-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold" data-testid="button-add-question"><Plus size={16}/>إضافة سؤال</button><button onClick={()=>download()} className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-200" data-testid="button-export-json"><Download size={15}/>تصدير JSON</button><button onClick={()=>download(true)} className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-200" data-testid="button-export-csv"><Download size={15}/>تصدير CSV</button><button onClick={()=>fileRef.current?.click()} className="btn-ghost flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-200" data-testid="button-import-file"><Upload size={15}/>استيراد ملف</button><input ref={fileRef} type="file" accept=".json,.csv,application/json,text/csv" className="hidden" onChange={e=>{void importFile(e.target.files?.[0]);e.target.value=''}} aria-label="استيراد أسئلة من ملف"/></div>
  {notice&&<div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-cyan-300/15 bg-cyan-300/[.04] px-4 py-3 text-sm text-cyan-100"><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="إغلاق التنبيه"><X size={15}/></button></div>}
  {editing&&<section className="panel mb-5 rounded-xl p-5 sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">{questions.some(q=>q.id===editing.id)?'تعديل السؤال':'سؤال جديد'}</h2><button onClick={()=>setEditing(null)} aria-label="إغلاق نموذج السؤال" className="text-slate-500 hover:text-white"><X size={18}/></button></div>
    <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-400">المعرّف<input value={editing.id} onChange={e=>update({id:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid="input-question-id"/></label><label className="text-xs text-slate-400">الموضوع<input value={editing.topic} onChange={e=>update({topic:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid="input-question-topic"/></label>
    <label className="text-xs text-slate-400 sm:col-span-2">نص السؤال<textarea value={editing.prompt} onChange={e=>update({prompt:e.target.value})} rows={2} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid="input-question-prompt"/></label>
    {editing.choices.map((c,i)=><label key={c.id} className="text-xs text-slate-400">الاختيار {String.fromCharCode(65+i)}<input value={c.text} onChange={e=>update({choices:editing.choices.map((choice,j)=>j===i?{...choice,text:e.target.value}:choice)})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid={`input-choice-${c.id}`}/></label>)}
    <label className="text-xs text-slate-400">الإجابة الصحيحة<select value={editing.correctChoiceId} onChange={e=>update({correctChoiceId:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100">{editing.choices.map((c,i)=><option key={c.id} value={c.id}>الاختيار {String.fromCharCode(65+i)}</option>)}</select></label>
    <label className="text-xs text-slate-400">الدرس<select value={editing.lesson} onChange={e=>update({lesson:e.target.value as LessonId})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100">{unitLessons.map(l=><option key={l.id} value={l.id}>{l.id} · {l.short}</option>)}</select></label>
    <label className="text-xs text-slate-400">نوع السؤال<select value={editing.type} onChange={e=>update({type:e.target.value as Q['type']})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100">{[['multiple-choice','اختيار من متعدد'],['true-false','صواب أو خطأ'],['scenario','موقف تطبيقي'],['sequencing','ترتيب'],['matching','مطابقة'],['short-answer','إجابة قصيرة']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <label className="text-xs text-slate-400">المستوى<select value={editing.difficulty} onChange={e=>update({difficulty:e.target.value as Q['difficulty']})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100"><option value="easy">سهل</option><option value="medium">متوسط</option><option value="hard">متقدم</option></select></label>
    <label className="text-xs text-slate-400 sm:col-span-2">التفسير<input value={editing.explanation} onChange={e=>update({explanation:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid="input-question-explanation"/></label>
    <label className="text-xs text-slate-400 sm:col-span-2">التلميح<input value={editing.hint} onChange={e=>update({hint:e.target.value})} className="mt-1 w-full rounded-lg border border-white/10 bg-[#0f1424] px-3 py-2.5 text-sm text-slate-100" data-testid="input-question-hint"/></label></div>
    <div className="mt-4 flex justify-end gap-2"><button onClick={()=>setEditing(null)} className="btn-ghost rounded-lg px-4 py-2 text-sm">إلغاء</button><button onClick={save} className="btn-primary rounded-lg px-5 py-2 text-sm font-bold" data-testid="button-save-question">حفظ السؤال</button></div>
  </section>}
  <section className="panel overflow-hidden rounded-xl"><div className="flex flex-col gap-3 border-b border-white/5 p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث بالنص أو الموضوع أو المعرّف" className="h-10 w-full rounded-lg border border-white/10 bg-[#0f1424] pr-9 pl-3 text-sm outline-none focus:border-cyan-300/40" data-testid="input-search-questions"/></label><select value={lesson} onChange={e=>setLesson(e.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0f1424] px-3 text-sm text-slate-300" aria-label="تصفية حسب الدرس"><option value="all">كل الدروس</option>{unitLessons.map(l=><option key={l.id} value={l.id}>الدرس {l.id}</option>)}</select><span className="self-center text-xs text-slate-500">{filtered.length.toLocaleString('ar-EG')} سؤال</span></div>
    {!filtered.length?<div className="p-12 text-center"><FileJson className="mx-auto mb-3 text-slate-600" size={30}/><p className="mb-4 text-sm text-slate-400">{questions.length?'لا توجد نتائج مطابقة.':'بنك الأسئلة فارغ في الوقت الحالي.'}</p><button onClick={()=>setEditing({...empty,id:`U1-${String(Date.now()).slice(-6)}`})} className="text-sm text-cyan-300" data-testid="button-empty-add">أضف سؤالًا جديدًا</button></div>:
    <div className="divide-y divide-white/5">{filtered.map(q=><article key={q.id} className="flex items-start gap-3 p-4 sm:p-5"><span className="mono mt-1 hidden text-[10px] text-cyan-300 sm:block">{q.id}</span><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded border border-violet-300/15 bg-violet-300/[.04] px-2 py-0.5 text-[10px] text-violet-200">درس {q.lesson}</span><span className="text-[10px] text-slate-500">{q.topic}</span></div><p className="text-sm font-semibold leading-6 text-slate-200">{q.prompt}</p><p className="mt-2 text-xs text-slate-500">الإجابة: {q.choices.find(c=>c.id===q.correctChoiceId)?.text||'—'}</p></div><div className="flex gap-1"><button onClick={()=>{setEditing({...q,choices:q.choices.map(c=>({...c}))});setNotice('')}} aria-label={`تعديل ${q.id}`} className="btn-ghost rounded-md p-2 text-slate-400 hover:text-cyan-200" data-testid={`button-edit-${q.id}`}><Pencil size={15}/></button><button onClick={()=>remove(q.id)} aria-label={`حذف ${q.id}`} className="btn-ghost rounded-md p-2 text-slate-400 hover:text-rose-300" data-testid={`button-delete-${q.id}`}><Trash2 size={15}/></button></div></article>)}</div>}</section>
  <p className="mt-4 text-xs leading-6 text-slate-600">فحص التكرار الحالي يعتمد على نص السؤال ومعرّف السجل محليًا. يطبّق الخادم التحقق النهائي عند ربط واجهة الإدارة.</p>
  </>;
}

function NotFoundWithNav(){return <div className="py-16 text-center"><h1 className="mb-3 text-3xl font-bold">المسار غير موجود</h1><p className="mb-6 text-slate-400">هذه المحطة ليست ضمن خريطة التحقيق.</p><PrimaryLink href="/">العودة للرئيسية</PrimaryLink></div>}
function Router() {
  const [location,setLocation]=useLocation();
  const [questions,setQuestions]=useState<Q[]>(initialQuestions);
  const [attempts,setAttempts]=useState<Attempt[]>([]);
  const complete=(round:Attempt[])=>{setAttempts(round);setLocation('/results');};
  return <AppShell><ErrorBoundary resetKey={location}><Switch>
    <Route path="/"><Home questions={questions}/></Route>
    <Route path="/stages"><Stages questions={questions}/></Route>
    <Route path="/play"><PlayPage questions={questions} onComplete={complete}/></Route>
    <Route path="/results"><Results attempts={attempts}/></Route>
    <Route path="/review"><Review attempts={attempts}/></Route>
    <Route path="/stats"><Stats attempts={attempts}/></Route>
    <Route path="/admin"><Admin questions={questions} onChange={setQuestions}/></Route>
    <Route component={NotFoundWithNav}/>
  </Switch></ErrorBoundary></AppShell>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}
export default App;

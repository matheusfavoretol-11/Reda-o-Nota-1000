const SUPABASE_URL      = 'https://hyzfpmfnwztosxwjuzio.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5emZwbWZud3p0b3N4d2p1emlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODQzNzUsImV4cCI6MjA5MzM2MDM3NX0.24VfIWQj1kgPF2iuM21ghvg_ESVPB-JkXO1lVIZrK04';
const GEMINI_KEY        = 'AIzaSyDgyPA07z_KGGPmV1nDLQDln8x3OtPIGGU';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if(location.hostname !== "localhost") { const noop = ()=>{}; }

let usuarioLogado = null;
let historico = [];
let catAtiva = 'todos';
let ultimoResultadoMalu = null;

function mostrarLanding() {
  document.getElementById('view-landing').classList.add('active');
  document.getElementById('view-login').classList.remove('active');
  document.getElementById('view-app').classList.remove('active');
}
function mostrarLogin() {
  document.getElementById('view-landing').classList.remove('active');
  document.getElementById('view-login').classList.add('active');
  document.getElementById('view-app').classList.remove('active');
}
function mostrarApp(user) {
  const nome = user.user_metadata?.full_name || user.email.split('@')[0];
  document.getElementById('sb-nome').textContent = nome;
  document.getElementById('sb-email').textContent = user.email;
  document.getElementById('dash-greeting').textContent = `Olá, ${nome.split(' ')[0]} 👋`;
  document.getElementById('view-landing').classList.remove('active');
  document.getElementById('view-login').classList.remove('active');
  document.getElementById('view-app').classList.add('active');
  carregarHistorico();
}

function toggleSenha() {
  const input = document.getElementById('login-senha');
  const btn = document.getElementById('toggle-senha-btn');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Ocultar';
  } else {
    input.type = 'password';
    btn.textContent = 'Mostrar';
  }
}

async function recuperarSenha() {
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    const errEl = document.getElementById('login-error');
    errEl.textContent = 'Digite seu e-mail acima e clique em "Esqueceu a senha?" novamente.';
    errEl.style.display = 'block';
    return;
  }
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/app'
  });
  const errEl = document.getElementById('login-error');
  if (error) {
    errEl.textContent = 'Não encontramos esse e-mail. Verifique ou fale pelo WhatsApp.';
    errEl.style.color = 'var(--red)';
    errEl.style.borderColor = 'rgba(239,68,68,.2)';
    errEl.style.background = 'rgba(239,68,68,.08)';
  } else {
    errEl.textContent = '✓ E-mail enviado! Verifique sua caixa de entrada (e o spam).';
    errEl.style.color = 'var(--green)';
    errEl.style.borderColor = 'rgba(34,197,94,.2)';
    errEl.style.background = 'rgba(34,197,94,.08)';
  }
  errEl.style.display = 'block';
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const errEl = document.getElementById('login-error');
  const btn   = document.getElementById('btn-login');

  if (!email || !senha) {
    errEl.textContent = 'Preencha e-mail e senha.';
    errEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="border-top-color:#fff;width:14px;height:14px;margin-right:6px"></div> Entrando...';
  errEl.style.display = 'none';

  const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });

  if (error) {
    errEl.textContent = 'E-mail ou senha incorretos. Verifique seus dados ou clique em "Esqueceu a senha?".';
    errEl.style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Entrar na plataforma →';
    return;
  }

  usuarioLogado = data.user;
  mostrarApp(data.user);
}

async function fazerLogout() {
  await sb.auth.signOut();
  usuarioLogado = null;
  historico = [];
  mostrarLanding();
}

async function verificarSessao() {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    usuarioLogado = session.user;
    mostrarApp(session.user);
  }
}

async function verificarMagicLink() {
  const { data: { session }, error } = await sb.auth.getSession();
  if (error) return;
  if (session?.user) {
    usuarioLogado = session.user;
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState({}, '', window.location.pathname);
      mostrarApp(session.user);
    }
  }
}

function showToast(msg, tipo = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${tipo}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = ''; }, 3000);
}

function carregarScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
  });
}

async function irTela(tela, btn) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + tela).classList.add('active');
  if (btn) btn.classList.add('active');
  
  if (tela === 'exemplos' && !window.__REDACOES__) {
    await carregarScript('redacoes.js');
    renderExemplos();
  }
  if (tela === 'repertorio' && !window.__REPERTORIOS__) {
    await carregarScript('repertorios.js');
    renderRep(window.__REPERTORIOS__ || []);
    renderRefsRapidas();
  }
  if (tela === 'dashboard') atualizarDashboard();
}

function abrirTab(tab, btn, scope) {
  const prefix = scope === 'blocos' ? 'btab-' : 'rtab-';
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(p => p.classList.remove('active'));
  const parent = btn.closest('.tab-nav');
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById(prefix + tab);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
}

document.querySelectorAll('.acc-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const aberto = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
    if (!aberto) item.classList.add('open');
  });
});

async function chamarGemini(prompt) {
  if (!GEMINI_KEY) {
    await new Promise(r => setTimeout(r, 1600 + Math.random() * 800));
    const notas = [120, 160, 160, 200, 200];
    const shuffle = (a) => a.sort(() => Math.random() - .5);
    const ns = shuffle([...notas]);
    return {
      c1: { nota: ns[0], comentario: 'Boa norma culta. Atenção à concordância verbal em períodos longos.', sugestao: 'Revise os períodos mais longos para eliminar ambiguidades.' },
      c2: { nota: ns[1], comentario: 'Proposta temática bem desenvolvida e coerente.', sugestao: 'Mantenha a consistência temática até a conclusão.' },
      c3: { nota: ns[2], comentario: 'Bom uso de repertório sociocultural. Referência ancorada adequadamente.', sugestao: 'Adicione uma referência filosófica para enriquecer a argumentação.' },
      c4: { nota: ns[3], comentario: 'Coesão adequada. Bom uso de conectivos de adição.', sugestao: 'Varie os operadores argumentativos para evitar repetição.' },
      c5: { nota: ns[4], comentario: 'Intervenção presente com agente e ação. Falta especificar o meio.', sugestao: 'Inclua os 5 elementos: agente, ação, meio, finalidade e detalhamento.' },
      total: ns.reduce((a, b) => a + b, 0),
      nivel: ns.reduce((a, b) => a + b, 0) >= 800 ? 'Avançado' : 'Intermediário',
      ponto_critico: 'A proposta de intervenção (C5) não apresenta todos os 5 elementos exigidos pelo INEP. Especifique: quem vai agir, o que vai fazer, como, para quê e com qual detalhamento. Isso pode elevar sua nota em até 80 pontos.',
      ponto_forte: 'A contextualização histórica na introdução é precisa e conecta bem com o problema central apresentado.'
    };
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Gemini ' + res.status + ': ' + err);
  }
  const data = await res.json();
  const txt = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const limpo = txt.replace(/```json|```/g, '').trim();
  return JSON.parse(limpo);
}

function renderComps(res, containerId, mostrarSugestao = false) {
  const nomes = ['C1 — Norma culta', 'C2 — Proposta temática', 'C3 — Argumentação', 'C4 — Coesão', 'C5 — Intervenção'];
  const keys = ['c1', 'c2', 'c3', 'c4', 'c5'];
  const el = document.getElementById(containerId);
  el.innerHTML = keys.map((k, i) => {
    const n = res[k]?.nota || 0;
    const pct = (n / 200) * 100;
    const cor = n >= 200 ? 'var(--green)' : n >= 160 ? 'var(--amber)' : 'var(--red)';
    return `<div class="comp-block">
      <div class="comp-header"><span class="comp-name">${nomes[i]}</span><span class="comp-nota" style="color:${cor}">${n}</span></div>
      <div class="comp-bar-bg"><div class="comp-bar" style="width:${pct}%;background:${cor}"></div></div>
      <div class="comp-comment">${res[k]?.comentario || ''}</div>
      ${mostrarSugestao && res[k]?.sugestao ? `<div class="comp-sugestao">→ ${res[k].sugestao}</div>` : ''}
    </div>`;
  }).join('');
}

async function rodarDemoMalu() {
  if (localStorage.getItem('malu_demo_used')) {
    document.getElementById('demo-form').style.display = 'none';
    document.getElementById('demo-usado').style.display = 'block';
    return;
  }

  const texto = document.getElementById('demo-texto').value.trim();
  if (texto.length < 50) { showToast('Cole pelo menos 3 linhas da sua redação.', 'error'); return; }

  const btn = document.getElementById('btn-demo');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Analisando...';
  document.getElementById('demo-form').style.display = 'none';
  document.getElementById('demo-loading').style.display = 'block';

  const t0 = Date.now();

  const prompt = `Você é a Malu IA, corretora oficial de redações do ENEM, calibrada nos critérios do INEP.

REGRAS OBRIGATÓRIAS:
- ESCALA: notas por competência = 0, 40, 80, 120, 160 ou 200. NUNCA outro valor.
- SEJA RIGOROSO: redação ruim DEVE receber notas baixas (0-120). Não infle notas para não desmotivar melhorias reais.
- Uma redação com erros graves de gramática, sem repertório, sem argumentação sólida e sem intervenção completa NÃO pode passar de 600 no total.

CRITÉRIOS OFICIAIS DO INEP:
C1 - Norma Culta (0-200): gramática, ortografia, concordância, regência, pontuação. Erros graves e recorrentes = 40-80. Poucos desvios = 120-160. Domínio pleno = 200.
C2 - Proposta Temática (0-200): desenvolveu o tema completamente? Fuga total = 0. Tangenciamento = 40-80. Desenvolvimento parcial = 120. Completo e consistente = 160-200.
C3 - Argumentação e Repertório (0-200): argumentos consistentes com embasamento sociocultural legítimo? Sem repertório = 40-80. Referência vaga ou genérica = 80-120. Repertório específico e bem articulado = 160-200.
C4 - Coesão e Coerência (0-200): texto coeso e coerente, conectivos variados e adequados? Texto fragmentado ou confuso = 40-80. Coesão básica = 120. Coesão sofisticada = 160-200.
C5 - Intervenção (0-200): proposta com os 5 elementos obrigatórios: AGENTE + AÇÃO + MEIO + FINALIDADE + DETALHAMENTO? Sem proposta = 0. Proposta vaga sem elementos = 40-80. Incompleta (faltam elementos) = 120. Completa com os 5 elementos = 160-200.

Trecho do aluno: "${texto}"

Responda APENAS com JSON, sem markdown:
{"c1":{"nota":number,"comentario":"diagnóstico específico sobre norma culta com exemplo do texto"},"c2":{"nota":number,"comentario":"diagnóstico específico sobre adequação ao tema"},"c3":{"nota":number,"comentario":"diagnóstico específico sobre repertório e argumentação usados"},"c4":{"nota":number,"comentario":"diagnóstico específico sobre coesão e conectivos"},"c5":{"nota":number,"comentario":"diagnóstico específico sobre os elementos da intervenção presentes ou ausentes"},"total":number,"ponto_critico":"2-3 linhas sobre o maior problema e como corrigir concretamente"}\`;

  try {
    const res = await chamarGemini(prompt);
    const seg = ((Date.now() - t0) / 1000).toFixed(1);
    document.getElementById('demo-loading').style.display = 'none';
    document.getElementById('demo-resultado').style.display = 'block';
    document.getElementById('demo-tempo').textContent = `Análise concluída em ${seg}s`;
    renderComps(res, 'demo-comps');
    document.getElementById('demo-total').textContent = res.total || '—';
    document.getElementById('demo-critico').textContent = res.ponto_critico || '';
    localStorage.setItem('malu_demo_used', '1');
    if(typeof fbq !== 'undefined') fbq('track', 'Lead');
  } catch (e) {
    document.getElementById('demo-loading').style.display = 'none';
    document.getElementById('demo-form').style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Analisar com Malu IA →';
    showToast('Erro ao processar. Tente novamente.', 'error');
  }
}

async function rodarMaluApp() {
  const texto = document.getElementById('malu-texto').value.trim();
  const tema = document.getElementById('malu-tema').value.trim();

  if (texto.length < 100) { showToast('Escreva pelo menos 100 caracteres para análise precisa.', 'error'); return; }

  const btn = document.getElementById('btn-malu-app');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Malu analisando...';

  document.getElementById('malu-empty').style.display = 'none';
  document.getElementById('malu-loading').style.display = 'block';
  document.getElementById('malu-result').style.display = 'none';

  const t0 = Date.now();

  const prompt = `Você é a Malu IA, corretora oficial de redações do ENEM, calibrada nos critérios do INEP com rigor de bancas especializadas.

REGRAS ABSOLUTAS:
1. ESCALA DE NOTAS: cada competência = 0, 40, 80, 120, 160 ou 200. NUNCA outro valor.
2. RIGOR OBRIGATÓRIO: Redações ruins DEVEM receber notas baixas. Não seja condescendente — inflar notas prejudica o aprendizado real do aluno.
3. PARÂMETRO GERAL: Uma redação mediana/ruim tipicamente soma 400-600. Uma boa soma 700-840. Excelente: 900-1000.

CRITÉRIOS OFICIAIS INEP — avalie cada competência com precisão cirúrgica:

C1 - DOMÍNIO DA NORMA CULTA (0-200):
- 0: Sem domínio, texto ininteligível
- 40: Desvios graves e muito frequentes comprometem a leitura
- 80: Desvios graves frequentes, mas texto compreensível
- 120: Desvios graves ocasionais ou desvios médios frequentes
- 160: Desvios apenas ocasionais de pequena gravidade
- 200: Domínio pleno, sem desvios ou com desvios de naturalidade

C2 - COMPREENSÃO DA PROPOSTA TEMÁTICA (0-200):
- 0: Fuga total ao tema ou texto em branco
- 40: Tangenciamento, tema não desenvolvido
- 80: Desenvolvimento insuficiente, superficial
- 120: Desenvolvimento mediano
- 160: Bom desenvolvimento com poucos afastamentos
- 200: Desenvolvimento excelente, completo e consistente

C3 - SELEÇÃO E ORGANIZAÇÃO DE INFORMAÇÕES (0-200):
- 0: Sem informações relevantes
- 40: Informações vagas, sem repertório
- 80: Repertório genérico ou mal articulado ao tema
- 120: Repertório pertinente mas com articulação fraca
- 160: Bom repertório sociocultural bem articulado
- 200: Repertório excelente, específico, legitimamente fundamentado e perfeitamente articulado

C4 - COESÃO E COERÊNCIA (0-200):
- 0: Ausência total de coesão
- 40: Articulação precária, texto fragmentado
- 80: Articulação básica com muitos problemas
- 120: Articulação mediana, conectivos repetitivos
- 160: Boa articulação com pequenos deslizes
- 200: Articulação excelente, coesão sofisticada

C5 - PROPOSTA DE INTERVENÇÃO (0-200) — Os 5 elementos OBRIGATÓRIOS:
① AGENTE: quem vai executar? (governo federal, escolas, ONGs, mídia...)
② AÇÃO: o que vai fazer? (criar, implementar, promover, regulamentar...)
③ MEIO: como vai fazer? (por meio de lei, através de campanhas, mediante...)
④ FINALIDADE: para quê? (a fim de, com o objetivo de, para que...)
⑤ DETALHAMENTO: especificação concreta da ação
- 0: Sem proposta
- 40: Proposta vaga sem nenhum elemento claro
- 80: 1-2 elementos presentes
- 120: 3 elementos presentes
- 160: 4 elementos presentes
- 200: Todos os 5 elementos presentes e bem desenvolvidos

Tema informado: "${tema || 'não informado'}"
Redação do aluno:
"${texto}"

Responda APENAS com JSON válido, sem markdown, sem texto fora do JSON:
{"c1":{"nota":number,"comentario":"diagnóstico específico com exemplos do texto","sugestao":"como corrigir especificamente"},"c2":{"nota":number,"comentario":"diagnóstico específico","sugestao":"como melhorar"},"c3":{"nota":number,"comentario":"diagnóstico sobre repertório e argumentação com referência a trechos concretos","sugestao":"qual repertório adicionar e como"},"c4":{"nota":number,"comentario":"diagnóstico sobre coesão com exemplos dos conectivos usados","sugestao":"como melhorar a articulação"},"c5":{"nota":number,"comentario":"liste QUAIS dos 5 elementos estão presentes e quais faltam","sugestao":"escreva o parágrafo de intervenção reescrito com os 5 elementos"},"total":number,"nivel":"Iniciante|Em desenvolvimento|Intermediário|Avançado|Excelência","ponto_critico":"3-4 linhas sobre o maior problema com instrução concreta de como corrigir","ponto_forte":"1-2 linhas sobre o que o aluno fez bem e deve manter"}\`;

  try {
    const res = await chamarGemini(prompt);
    const seg = ((Date.now() - t0) / 1000).toFixed(1);
    ultimoResultadoMalu = { tema, texto, resultado: res, data: new Date().toLocaleDateString('pt-BR') };

    document.getElementById('malu-loading').style.display = 'none';
    document.getElementById('malu-result').style.display = 'block';
    document.getElementById('malu-tempo-txt').textContent = `⚡ em ${seg}s`;

    renderComps(res, 'malu-comps-app', true);

    document.getElementById('malu-total-app').textContent = res.total || '—';
    document.getElementById('malu-critico-app').textContent = res.ponto_critico || '';
    document.getElementById('malu-forte-app').textContent = res.ponto_forte || '';

    const badge = document.getElementById('malu-nivel-badge');
    badge.textContent = res.nivel || '';

    btn.disabled = false;
    btn.innerHTML = 'Analisar com Malu IA →';
    document.getElementById('btn-salvar').style.display = 'inline-flex';
  } catch (e) {
    document.getElementById('malu-loading').style.display = 'none';
    document.getElementById('malu-empty').style.display = 'block';
    btn.disabled = false;
    btn.innerHTML = 'Analisar com Malu IA →';
    showToast('Erro ao processar. Tente novamente.', 'error');
  }
}

async function salvarCorrecao() {
  if (!ultimoResultadoMalu || !usuarioLogado) return;
  const r = ultimoResultadoMalu;
  const btn = document.getElementById('btn-salvar');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="border-top-color:var(--accent2)"></div> Salvando...';

  const { error } = await sb.from('correcoes').insert({
    user_id:       usuarioLogado.id,
    tema:          r.tema || null,
    texto:         r.texto,
    c1_nota:       r.resultado.c1?.nota,
    c1_comentario: r.resultado.c1?.comentario,
    c1_sugestao:   r.resultado.c1?.sugestao,
    c2_nota:       r.resultado.c2?.nota,
    c2_comentario: r.resultado.c2?.comentario,
    c2_sugestao:   r.resultado.c2?.sugestao,
    c3_nota:       r.resultado.c3?.nota,
    c3_comentario: r.resultado.c3?.comentario,
    c3_sugestao:   r.resultado.c3?.sugestao,
    c4_nota:       r.resultado.c4?.nota,
    c4_comentario: r.resultado.c4?.comentario,
    c4_sugestao:   r.resultado.c4?.sugestao,
    c5_nota:       r.resultado.c5?.nota,
    c5_comentario: r.resultado.c5?.comentario,
    c5_sugestao:   r.resultado.c5?.sugestao,
    nota_total:    r.resultado.total,
    nivel:         r.resultado.nivel,
    ponto_critico: r.resultado.ponto_critico,
    ponto_forte:   r.resultado.ponto_forte,
  });

  if (error) {
    showToast('Erro ao salvar. Tente novamente.', 'error');
    btn.disabled = false;
    btn.textContent = 'Salvar esta análise';
    return;
  }

  showToast('Análise salva com sucesso!');
  btn.style.display = 'none';
  await carregarHistorico();
}

async function carregarHistorico() {
  if (!usuarioLogado) return;
  const { data, error } = await sb
    .from('correcoes')
    .select('id, created_at, tema, texto, nota_total, nivel')
    .eq('user_id', usuarioLogado.id)
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) { console.error('Erro ao carregar histórico:', error); return; }

  historico = (data || []).map(c => ({
    id:    c.id,
    data:  new Date(c.created_at).toLocaleDateString('pt-BR'),
    tema:  c.tema || 'Sem tema',
    trecho: (c.texto || '').slice(0, 55) + '...',
    nota:  c.nota_total || 0,
    nivel: c.nivel || '',
  }));

  atualizarDashboard();
}

function atualizarDashboard() {
  const total = historico.length;
  document.getElementById('dash-total').textContent = total;

  if (total === 0) {
    document.getElementById('dash-maior').textContent = '—';
    document.getElementById('dash-media').textContent = '—';
    document.getElementById('hist-empty').style.display = 'block';
    document.getElementById('hist-wrap').style.display = 'none';
    document.getElementById('chart-area').innerHTML = '<div class="chart-empty">Envie sua primeira redação para ver o gráfico.</div>';
    return;
  }

  const notas = historico.map(c => c.nota);
  document.getElementById('dash-maior').textContent = Math.max(...notas);
  const slice5 = notas.slice(0, 5);
  const media = Math.round(slice5.reduce((a, b) => a + b, 0) / slice5.length);
  document.getElementById('dash-media').textContent = media;

  renderGrafico([...historico].slice(0, 10).reverse());
  renderHistorico(historico.slice(0, 5));
}

function renderGrafico(dados) {
  const el = document.getElementById('chart-area');
  if (!dados.length) { el.innerHTML = '<div class="chart-empty">Sem dados ainda.</div>'; return; }
  const maxNota = Math.max(...dados.map(d => d.nota), 400);
  el.innerHTML = dados.map(d => {
    const h = Math.max(6, Math.round((d.nota / maxNota) * 108));
    const cor = d.nota >= 900 ? 'var(--green)' : d.nota >= 700 ? 'var(--accent)' : 'var(--amber)';
    return `<div class="chart-bar-col">
      <div class="chart-bar" style="height:${h}px;background:${cor}" title="${d.nota} — ${d.data}"></div>
      <div class="chart-bar-lbl">${d.nota}</div>
    </div>`;
  }).join('');
}

function renderHistorico(dados) {
  const empty = document.getElementById('hist-empty');
  const wrap = document.getElementById('hist-wrap');
  const tbody = document.getElementById('hist-body');

  if (!dados.length) { empty.style.display = 'block'; wrap.style.display = 'none'; return; }
  empty.style.display = 'none'; wrap.style.display = 'block';

  const cls = n => n >= 900 ? 'nota-alta' : n >= 700 ? 'nota-media' : 'nota-baixa';
  tbody.innerHTML = dados.map(d => `<tr>
    <td>${d.data}</td>
    <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text)">${d.tema}</td>
    <td><span class="nota-badge ${cls(d.nota)}">${d.nota}</span></td>
    <td style="font-size:12px;color:var(--text3)">${d.nivel}</td>
  </tr>`).join('');
}

async function avaliarBloco(tipo, inputId, resultId, nomeTipo, foco) {
  const texto = document.getElementById(inputId).value.trim();
  if (!texto) { showToast('Escreva o parágrafo antes de avaliar.', 'error'); return; }

  const resEl = document.getElementById(resultId);
  resEl.style.display = 'block';
  resEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;color:var(--text2)"><div class="spinner"></div> Malu analisando...</div>';

  const prompt = `Você é a Malu IA, corretora do ENEM com rigor do INEP. O aluno escreveu um parágrafo de ${nomeTipo}. Avalie com foco em ${foco}.

SEJA RIGOROSO: Se o parágrafo for fraco, dê nota baixa e explique o que falta. Não elogie o que não merece elogio.
Escala: nota_estimada de 0 a 200 em múltiplos de 40.

Texto do aluno: "${texto}"

Responda APENAS com JSON, sem markdown:
{"aprovado":boolean,"nota_estimada":number,"pontos_fortes":["item específico do texto que está bom"],"pontos_melhorar":["problema específico com citação do trecho problemático"],"reescrita_sugerida":"versão melhorada do parágrafo mantendo a ideia do aluno mas corrigindo os problemas"}\`;

  try {
    const res = await chamarGemini(prompt);
    const cor = res.aprovado ? 'var(--green)' : 'var(--amber)';
    const icone = res.aprovado ? '✓ Aprovado' : '⚠ Precisa melhorar';

    resEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
        <span style="font-size:13px;font-weight:700;color:${cor}">${icone}</span>
        <span class="pill ${res.aprovado ? 'pill-green' : 'pill-amber'}">Nota estimada: ${res.nota_estimada}</span>
      </div>
      ${res.pontos_fortes?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Pontos fortes</div>
          ${res.pontos_fortes.map(p => `<div style="font-size:13px;color:var(--text2);display:flex;gap:8px;margin-bottom:4px"><span style="color:var(--green);flex-shrink:0">✓</span>${p}</div>`).join('')}
        </div>` : ''}
      ${res.pontos_melhorar?.length ? `
        <div style="margin-bottom:12px">
          <div style="font-size:11px;font-weight:700;color:var(--amber);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">O que melhorar</div>
          ${res.pontos_melhorar.map(p => `<div style="font-size:13px;color:var(--text2);display:flex;gap:8px;margin-bottom:4px"><span style="color:var(--amber);flex-shrink:0">→</span>${p}</div>`).join('')}
        </div>` : ''}
      ${res.reescrita_sugerida ? `
        <div style="padding:12px;background:var(--bg);border-radius:8px;border-left:3px solid var(--accent2)">
          <div style="font-size:11px;font-weight:700;color:var(--accent2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em">Sugestão de reescrita</div>
          <div style="font-size:13px;color:var(--text2);font-style:italic;line-height:1.65">${res.reescrita_sugerida}</div>
        </div>` : ''}`;
  } catch (e) {
    resEl.innerHTML = '<span style="color:var(--red);font-size:13px">Erro ao processar. Tente novamente.</span>';
  }
}

function montarInterventora() {
  const ag = document.getElementById('iv-agente').value.trim();
  const ac = document.getElementById('iv-acao').value.trim();
  const me = document.getElementById('iv-meio').value.trim();
  const fi = document.getElementById('iv-final').value.trim();
  const de = document.getElementById('iv-detalhe').value.trim();

  if (!ag || !ac || !me || !fi || !de) {
    showToast('Preencha todos os 5 campos para montar a intervenção.', 'error');
    return;
  }

  const paragrafo = `${ag} ${ac}, ${me}, ${fi} ${de}, assegurando assim a efetividade da proposta e a construção de uma sociedade mais justa e igualitária.`;
  const el = document.getElementById('interv-result');
  el.style.display = 'block';
  el.innerHTML = `
    <div style="font-size:11px;font-weight:700;color:var(--accent2);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">Sua intervenção montada</div>
    <div style="font-size:14px;color:var(--text);line-height:1.7">${paragrafo}</div>`;

  document.getElementById('ex-interv').value = paragrafo;
  document.getElementById('btn-av-interv').style.display = 'inline-flex';
  showToast('Intervenção montada! Clique em avaliar para o feedback da Malu.');
}

async function avaliarInterventora() {
  await avaliarBloco('interv', 'ex-interv', 'interv-av-res', 'Intervenção (C5)', 'C5 — os 5 elementos obrigatórios do INEP');
  document.getElementById('interv-av-res').style.display = 'block';
}

const REPERTORIOS = [
  { cat: 'Filosofia', nome: 'Hannah Arendt', uso: 'Espaço público, cidadania, exclusão política.', ex: '"Para Hannah Arendt, o espaço público é condição de visibilidade para o exercício pleno da cidadania."', tags: ['cidadania', 'política', 'exclusão'] },
  { cat: 'Filosofia', nome: 'Simone de Beauvoir', uso: 'Gênero, trabalho doméstico, identidade feminina.', ex: '"Segundo Beauvoir, a condição feminina é construída socialmente — logo, pode ser desconstruída por meio de políticas públicas."', tags: ['gênero', 'feminismo', 'identidade'] },
  { cat: 'Filosofia', nome: 'Michel Foucault', uso: 'Poder, vigilância, instituições, normatização.', ex: '"Foucault demonstrou que instituições exercem micropoderes que regulam corpos e comportamentos de forma sutil e contínua."', tags: ['poder', 'vigilância', 'instituições'] },
  { cat: 'Filosofia', nome: 'Zygmunt Bauman', uso: 'Modernidade líquida, consumismo, vínculos frágeis.', ex: '"Bauman define a modernidade líquida como uma era de incertezas em que vínculos humanos se tornam descartáveis."', tags: ['consumismo', 'modernidade', 'identidade'] },
  { cat: 'Filosofia', nome: 'Émile Durkheim', uso: 'Coesão social, anomia, solidariedade coletiva.', ex: '"Durkheim alertou que a ausência de normas coletivas gera anomia — estado de desorientação social que fragmenta comunidades."', tags: ['sociedade', 'coesão', 'normas'] },
  { cat: 'Filosofia', nome: 'Karl Marx', uso: 'Trabalho, alienação, desigualdade de classes.', ex: '"Para Marx, o trabalhador alienado não reconhece no produto do seu trabalho a sua própria essência humana."', tags: ['trabalho', 'desigualdade', 'alienação'] },
  { cat: 'Dados', nome: 'IBGE / PNAD', uso: 'Desigualdade, renda, educação, saúde, trabalho.', ex: '"Segundo o IBGE, o Brasil figura entre os países com maior concentração de renda do mundo, com os 10% mais ricos detendo metade da riqueza nacional."', tags: ['desigualdade', 'renda', 'educação'] },
  { cat: 'Dados', nome: 'OMS / ONU', uso: 'Saúde global, direitos humanos, desenvolvimento.', ex: '"A OMS aponta que doenças crônicas não transmissíveis respondem por 74% das mortes globais anualmente."', tags: ['saúde', 'direitos humanos', 'global'] },
  { cat: 'Dados', nome: 'PISA / OCDE', uso: 'Educação, desempenho escolar, qualidade do ensino.', ex: '"O PISA revela que o Brasil ocupa posições abaixo da média da OCDE em leitura, matemática e ciências."', tags: ['educação', 'escola', 'desempenho'] },
  { cat: 'Dados', nome: 'Banco Mundial / IDH', uso: 'Desenvolvimento humano, pobreza, desigualdade global.', ex: '"O Banco Mundial classifica o Brasil como país de renda média-alta, mas com IDH abaixo do esperado para seu nível econômico."', tags: ['desenvolvimento', 'pobreza', 'economia'] },
  { cat: 'História', nome: 'Revolução Industrial', uso: 'Trabalho, urbanização, desigualdade, tecnologia.', ex: '"A Revolução Industrial, iniciada no séc. XVIII, transformou radicalmente as relações de trabalho e acirrou desigualdades socioeconômicas."', tags: ['trabalho', 'urbanização', 'tecnologia'] },
  { cat: 'História', nome: 'Ditadura Militar (BR)', uso: 'Democracia, censura, direitos civis, memória.', ex: '"Durante a ditadura militar brasileira (1964-1985), direitos fundamentais foram sistematicamente suprimidos em nome da segurança nacional."', tags: ['democracia', 'censura', 'direitos'] },
  { cat: 'História', nome: 'Colonização brasileira', uso: 'Racismo estrutural, escravidão, identidade nacional.', ex: '"O processo de colonização deixou marcas estruturais que ainda moldam as desigualdades raciais e sociais do Brasil contemporâneo."', tags: ['racismo', 'escravidão', 'identidade'] },
  { cat: 'História', nome: 'Revolução Francesa', uso: 'Democracia, direitos humanos, liberdade, igualdade.', ex: '"Os ideais de liberdade, igualdade e fraternidade da Revolução Francesa fundamentaram os modernos sistemas de direitos humanos."', tags: ['democracia', 'direitos', 'liberdade'] },
  { cat: 'Literatura', nome: 'Grande Sertão: Veredas', uso: 'Violência, identidade, marginalização, sertão.', ex: '"Na obra de Guimarães Rosa, o sertão funciona como metáfora da condição humana e da eterna busca por sentido em meio à violência."', tags: ['violência', 'identidade', 'marginalização'] },
  { cat: 'Literatura', nome: 'Vidas Secas', uso: 'Seca, desigualdade, migração, descaso estatal.', ex: '"Graciliano Ramos, em Vidas Secas, retrata a desumanização causada pela miséria extrema e pelo abandono do Estado."', tags: ['seca', 'migração', 'pobreza'] },
  { cat: 'Literatura', nome: 'Dom Casmurro', uso: 'Subjetividade, ponto de vista, crítica social.', ex: '"Machado de Assis demonstra, em Dom Casmurro, que a narração em primeira pessoa é sempre parcial, interessada e subjetiva."', tags: ['subjetividade', 'crítica', 'narrativa'] },
  { cat: 'Contemporâneo', nome: 'Inteligência Artificial', uso: 'Tecnologia, automação, emprego, ética digital.', ex: '"A expansão da Inteligência Artificial representa um divisor de águas no mercado de trabalho, exigindo requalificação urgente da força produtiva."', tags: ['tecnologia', 'automação', 'emprego'] },
  { cat: 'Contemporâneo', nome: 'Redes sociais e desinformação', uso: 'Fake news, saúde mental, polarização, democracia.', ex: '"Estudos apontam correlação direta entre uso excessivo de redes sociais e aumento dos índices de ansiedade e depressão em jovens."', tags: ['desinformação', 'saúde mental', 'democracia'] },
  { cat: 'Contemporâneo', nome: 'Pandemia de Covid-19', uso: 'Saúde pública, desigualdade, educação, trabalho remoto.', ex: '"A pandemia escancarou desigualdades preexistentes: os trabalhadores informais e mais pobres foram os mais severamente impactados economicamente."', tags: ['saúde', 'desigualdade', 'educação'] },
  { cat: 'Direito', nome: 'Constituição Federal de 1988', uso: 'Direitos fundamentais, cidadania, dignidade humana.', ex: '"A Constituição de 1988 consagra em seu artigo 5º a igualdade de todos perante a lei, sem distinção de qualquer natureza."', tags: ['direitos', 'cidadania', 'igualdade'] },
  { cat: 'Direito', nome: 'ECA — Estatuto da Criança', uso: 'Proteção de menores, educação, saúde infantil.', ex: '"O Estatuto da Criança e do Adolescente garante proteção integral a menores de 18 anos, sendo dever do Estado assegurar seus direitos."', tags: ['criança', 'proteção', 'educação'] },
  { cat: 'Direito', nome: 'Lei Maria da Penha', uso: 'Violência doméstica, gênero, proteção feminina.', ex: '"A Lei Maria da Penha (11.340/2006) representou um marco no combate à violência doméstica e familiar contra a mulher no Brasil."', tags: ['violência', 'gênero', 'direitos'] },
];

const corCat = { Filosofia: 'pill-purple', Dados: 'pill-green', História: 'pill-amber', Literatura: 'pill-red', Contemporâneo: 'pill-purple', Direito: 'pill-green' };

const REDACOES = window.__REDACOES__ || [];

const REPERTORIOS = window.__REPERTORIOS__ || [];

function renderExemplos() {
  const container = document.getElementById('exemplos-lista');
  if (!container) return;

  const corComp = n => n >= 200 ? 'var(--green)' : n >= 160 ? 'var(--amber)' : 'var(--red)';
  const nomeComp = ['C1','C2','C3','C4','C5'];
  const labelComp = ['Norma culta','Proposta','Argumentação','Coesão','Intervenção'];

  container.innerHTML = REDACOES.map((r, i) => `
    <div class="ex-card" id="ex-${i}">
      <div class="ex-card-header" onclick="toggleEx(${i})">
        <div style="flex:1">
          <div class="ex-ano">${r.ano}</div>
          <div class="ex-titulo">${r.tema}</div>
          <div class="ex-meta" style="margin-top:8px">
            <span class="ex-nota">🏆 Nota ${r.nota}</span>
            ${Object.entries(r.competencias).map((c,j) => `<span class="ex-tag">${nomeComp[j]}: <strong style="color:${corComp(c[1])}">${c[1]}</strong></span>`).join('')}
          </div>
        </div>
        <span class="ex-chevron">▾</span>
      </div>
      <div class="ex-body" id="ex-body-${i}">
        <div class="ex-content">
          <div class="ex-analise-grid">
            ${Object.entries(r.competencias).map((c,j) => `
              <div class="ex-comp">
                <div class="ex-comp-nome">${labelComp[j]}</div>
                <div class="ex-comp-nota" style="color:${corComp(c[1])}">${c[1]}</div>
              </div>`).join('')}
          </div>
          <div class="ex-section">
            <div class="ex-section-title">Texto completo</div>
            <div class="ex-texto">${r.texto}</div>
          </div>
          <div class="ex-section">
            <div class="ex-section-title">Por que tirou 1000</div>
            <div class="ex-destaque">${r.analise}</div>
          </div>
          <div class="ex-section">
            <div class="ex-section-title">Diferencial desta redação</div>
            <div class="ex-destaque" style="border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.06)">⭐ ${r.destaque}</div>
          </div>
        </div>
      </div>
    </div>`).join('');
}

function toggleEx(i) {
  const card = document.getElementById('ex-'+i);
  const body = document.getElementById('ex-body-'+i);
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.ex-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

function renderRep(lista) {
  const grid = document.getElementById('rep-grid');
  if (!lista.length) {
    grid.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:40px 0;text-align:center;grid-column:1/-1">Nenhum repertório encontrado.</div>';
    return;
  }
  grid.innerHTML = lista.map((r, i) => `
    <div class="rep-app-card">
      <span class="pill ${corCat[r.cat] || 'pill-gray'}">${r.cat}</span>
      <div class="rep-app-nome">${r.nome}</div>
      <div class="rep-app-uso">${r.uso}</div>
      <div class="rep-app-ex">${r.ex}</div>
      <div class="rep-app-tags">${r.tags.map(t => `<span class="pill pill-gray">${t}</span>`).join('')}</div>
      <button class="btn btn-ghost" style="width:100%;justify-content:center;border:0.5px solid var(--border);border-radius:8px;font-size:12px;padding:8px" onclick="copiarRep(${REPERTORIOS.indexOf(r)})">Copiar referência</button>
    </div>`).join('');
}

function filtrarRep() {
  const busca = document.getElementById('rep-busca').value.toLowerCase();
  const lista = REPERTORIOS.filter(r => {
    const catOk = catAtiva === 'todos' || r.cat === catAtiva;
    const buscaOk = !busca || r.nome.toLowerCase().includes(busca) || r.uso.toLowerCase().includes(busca) || r.cat.toLowerCase().includes(busca) || r.tags.some(t => t.includes(busca));
    return catOk && buscaOk;
  });
  renderRep(lista);
}

function setCat(cat, btn) {
  catAtiva = cat;
  document.querySelectorAll('#rep-cat-nav .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filtrarRep();
}

function copiarRep(i) {
  const r = REPERTORIOS[i];
  const txt = `${r.nome} — ${r.ex.replace(/"/g, '')}`;
  navigator.clipboard.writeText(txt)
    .then(() => showToast(`"${r.nome}" copiado!`))
    .catch(() => showToast('Copie manualmente: ' + r.nome, 'error'));
}

function renderRefsRapidas() {
  const el = document.getElementById('refs-rapidas');
  if (!el) return;
  el.innerHTML = REPERTORIOS.slice(0, 10).map((r, i) =>
    `<button class="ref-btn" onclick="copiarRefRapida(${i})" title="${r.uso}">${r.nome}</button>`
  ).join('');
}

function copiarRefRapida(i) {
  const r = REPERTORIOS[i];
  navigator.clipboard.writeText(`${r.nome}: ${r.ex.replace(/"/g, '')}`)
    .then(() => showToast(`"${r.nome}" copiado!`))
    .catch(() => {});
}

(function() {
  var priceSeen = false;
  var priceObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !priceSeen) {
        priceSeen = true;
        if(typeof fbq !== 'undefined') fbq('track', 'ViewContent', {
          content_name: 'RED 1000 PRO',
          content_ids: ['red1000pro'],
          content_type: 'product',
          value: 29.90,
          currency: 'BRL'
        });
      }
    });
  }, { threshold: 0.5 });

  document.addEventListener('DOMContentLoaded', function() {
    var priceSection = document.getElementById('preco');
    if(priceSection) priceObserver.observe(priceSection);
  });
})();

function observarBarras() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.comp-bar').forEach((bar, i) => {
          setTimeout(() => {
            const target = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = target;
          }, i * 100);
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.comp-block').forEach(block => observer.observe(block));
}


// ══ LOGIN DE TESTE ══
async function loginTeste() {
  const emailEl = document.getElementById('login-email');
  const senhaEl = document.getElementById('login-senha');
  const btn     = document.querySelector('[onclick="loginTeste()"]');

  if (!emailEl || !senhaEl) return;

  // Preencher credenciais
  emailEl.value = 'matheusfavoretol@gmail.com';
  senhaEl.value = 'Favoreto11!';

  // Feedback visual
  if (btn) {
    btn.textContent = 'Entrando...';
    btn.disabled = true;
  }

  // Chamar o login normal
  await fazerLogin();

  if (btn) {
    btn.textContent = 'Entrar como cliente pagante →';
    btn.disabled = false;
  }
}

(async function init() {
  const idle = window.requestIdleCallback || (cb => setTimeout(cb, 100));
  function atualizarBotaoWA() {
    const btn = document.getElementById('whatsapp-float');
    if (!btn) return;
    const appAtivo = document.getElementById('view-app').classList.contains('active');
    btn.style.display = appAtivo ? 'none' : 'flex';
  }
  const observer = new MutationObserver(atualizarBotaoWA);
  observer.observe(document.getElementById('view-app'), { attributes: true, attributeFilter: ['class'] });

  if (localStorage.getItem('malu_demo_used')) {
    document.getElementById('demo-form').style.display = 'none';
    document.getElementById('demo-usado').style.display = 'block';
  }
  
  idle(() => {
    if (window.__REPERTORIOS__) {
      renderRep(window.__REPERTORIOS__);
      renderRefsRapidas();
    }
  });
  idle(() => {
    if (window.__REDACOES__) renderExemplos();
  });
  
  const sessionTimeout = new Promise(resolve => setTimeout(resolve, 3000));
  await Promise.race([verificarMagicLink(), sessionTimeout]);
  await Promise.race([verificarSessao(), sessionTimeout]);
})();

import * as React from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Zap, 
  AlertTriangle, 
  Lightbulb, 
  MessageSquare, 
  ArrowRight, 
  Star, 
  Quote, 
  Lock, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Check, 
  Clock, 
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  History,
  Scale,
  Globe,
  User,
  Plus,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Toaster, toast } from 'sonner';
import { supabase, updateSupabaseConfig, getSupabase } from './lib/supabase';
import { correctEssay } from './services/aiService';

// --- CONFIG ---
const KIWIFY_CHECKOUT_URL = "https://pay.kiwify.com.br/AhSL8x0";

// --- DATA: EBOOK ---
const EBOOK_PAGES = [
  { p: 1, section: "FUNDAMENTOS", title: "A Mentalidade Nota 1000", content: "Escrever uma redação nota 1000 não é sobre inspiração divina, mas sobre domínio de um código. O ENEM avalia 5 competências específicas (200 pontos cada). O segredo é entender que você não está escrevendo para 'agradar' o corretor, mas para 'atender critérios'. A partir de hoje, você verá o texto como uma construção de engenharia: cada peça tem um lugar e uma função. A clareza é sua prioridade absoluta; se o corretor precisar reler uma frase para entender, você já perdeu pontos." },
  { p: 2, section: "FUNDAMENTOS", title: "As 5 Competências em Detalhes", content: "C1: Domínio da norma culta (gramática e sintaxe). C2: Compreensão do tema e aplicação de repertório legitimado (fora do texto de apoio). C3: Organização, interpretação e defesa de ponto de vista (autoralidade). C4: Conhecimento de mecanismos linguísticos (coesão e conectivos). C5: Proposta de intervenção completa com os 5 elementos. Dominar estas 5 regras é o único caminho para a nota máxima. No Red 1000 Pro, focamos em garantir 200 em cada uma delas através de repetição e técnica." },
  { p: 3, section: "FUNDAMENTOS", title: "A Estrutura de Ferro (Macro)", content: "Seu texto deve ter entre 25 e 30 lines, dividido em 4 parágrafos. 1. INTRODUÇÃO (5-7 linhas): Apresenta o tema e a tese. 2. DESENVOLVIMENTO 1 (7-9 linhas): Defende a primeira causa do problema. 3. DESENVOLVIMENTO 2 (7-9 linhas): Defende a segunda causa ou consequência. 4. CONCLUSÃO (7-9 linhas): Apresenta a solução. Fugir dessa estrutura macro é o erro número 1 que impede o 900+. Cada parágrafo deve ser independente, mas conectado por 'ganchos semânticos'." },
  { p: 4, section: "FUNDAMENTOS", title: "O Planejamento Analítico", content: "Nunca comece a escrever sem um roteiro. Gaste 10 a 15 minutos na 'Chuva de Ideias': 1. Qual o problema central? 2. Quais as duas causas principais (Causa A e B)? 3. Qual repertório combina com essas causas? 4. Quem pode resolver isso? Ao planejar, você evita contradições, repetições de palavras e o famoso 'branco'. Um projeto de texto bem feito garante que a escrita flua em menos de 40 minutos. Se você cansa no meio da redação, o erro foi no planejamento." },
  { p: 5, section: "FUNDAMENTOS", title: "Interpretação da Proposta", content: "O tema do ENEM sempre contém 'palavras-chave' e um recorte. Ex: 'Desafios para a valorização de...'. Você deve abordar os desafios, não apenas o tema geral. Se o tema é sobre cinema, e você fala de cultura em geral, você tangenciou. Use os textos motivadores para entender o contexto, mas NUNCA copie trechos deles. Eles servem como um 'norte' para que você não saia do assunto, mas sua inteligência deve vir de fora deles, do seu repertório pessoal." },
  { p: 6, section: "INTRODUÇÃO", title: "O Gancho: Abertura de Impacto", content: "A primeira frase do seu texto deve 'fisgar' o corretor. Temos 3 modelos principais: 1. HISTÓRICO: 'Durante a Revolução Industrial...'. 2. LITERÁRIO/CINEMATOGRÁFICO: 'No seriado Black Mirror...'. 3. LEGAL: 'A Constituição Federal de 1988 garante...'. Escolha um que você se sinta confortável e que tenha conexão direta com o tema. Não jogue o repertório; explique como ele se assemelha ou se distancia da realidade brasileira atual." },
  { p: 7, section: "INTRODUÇÃO", title: "A Conexão com a Realidade", content: "Após o gancho, você precisa trazer o assunto para o Brasil 'hoje'. Use conectivos de contraste: 'Entretanto, fora da ficção...', 'Contudo, tal direito não se materializa no cotidiano brasileiro...'. É neste momento que você prova que entendeu o tema. Seja direto. Diga que o problema X persiste e que isso é um desafio que precisa ser superado. Esta ponte entre o repertório e a realidade é o que garante que sua introdução não seja apenas um 'amontoado de frases'." },
  { p: 8, section: "INTRODUÇÃO", title: "A Tese Binária (O Segredo)", content: "Sua tese deve ser clara e apresentar dois 'culpados' ou 'causas'. Ex: 'Isso ocorre devido à inoperância estatal (Causa 1) e à passividade da sociedade (Causa 2)'. Por que dois? Porque o parágrafo 2 da sua redação falará da Causa 1 e o parágrafo 3 falará da Causa 2. Isso cria o que os corretores chamam de 'Projeto de Texto Estruturado'. Sem uma tese binária, seu desenvolvimento tende a ser confuso e misturado, o que tira pontos na Competência 3." },
  { p: 9, section: "INTRODUÇÃO", title: "Checklist da Intro Nota 200", content: "Antes de passar para o desenvolvimento, verifique: 1. Usei um repertório legitimado (História, Lei, Filme)? 2. Usei um conectivo de contraste para ligar ao Brasil? 3. Mencionei todas as palavras do tema? 4. Minha tese apresenta dois problemas distintos? Se sua introdução tem 6 linhas e responde 'sim' a tudo isso, você começou com o pé direito. Evite introduções longas demais; guarde espaço para o desenvolvimento, onde a argumentação realmente acontece." },
  { p: 10, section: "INTRODUÇÃO", title: "Modelos Prontos de Intro", content: "Para temas sociais: 'Segundo a Constituição Federal de 1988, todos os cidadãos possuem direito à dignidade. Entretanto, a persistência do [TEMA] no Brasil contradiz esse preceito. Isso se deve tanto à negligência do Estado em garantir [COMPLEMENTO] quanto à invisibilidade do problema na mídia...'. Perceba a estrutura: Direito -> Realidade -> Causa 1 -> Causa 2. Ter modelos mentais como este acelera sua escrita e reduz a ansiedade de 'não saber como começar'." },
  { p: 11, section: "DESENVOLVIMENTO", title: "O Tópico Frasal (A Afirmação)", content: "A primeira frase do seu 2º e 3º parágrafos deve ser direta. Use conectivos de início: 'Em primeira análise...', 'Ademais...'. O tópico frasal resume o que você vai provar naquele bloco. Ex: 'Em primeira análise, cabe pontuar o silenciamento das instituições públicas frente ao problema'. Não enrole. Diga logo o que você vai acusar. Lembre-se: o corretor quer ver seu poder de síntese e sua capacidade de sustentar uma acusação com fatos." },
  { p: 12, section: "DESENVOLVIMENTO", title: "Fundamentação (O Peso)", content: "Após acusar (tópico frasal), você deve 'provar'. Aqui entra o 2º repertório. Se você usou Lei na intro, use um Sociólogo ou Filósofo aqui. Ex: 'De acordo com Zygmunt Bauman, vivemos em uma modernidade líquida...'. Apresente o conceito de forma curta. O objetivo da fundamentação é dar autoridade ao seu argumento. Você não está apenas dando sua opinião; você está mostrando que grandes pensadores também analisaram dinâmicas similares às que você está discutindo." },
  { p: 13, section: "DESENVOLVIMENTO", title: "Aprofundamento Argumentativo", content: "Esta é a parte mais importante. Não basta dizer o que Bauman pensa; você deve explicar como o pensamento dele explica o problema X no Brasil. Use frases como: 'Nesse contexto, percebe-se que...', 'Dessa forma, a lógica de Bauman materializa-se quando...'. É aqui que você ganha o 1000. O corretor procura sua capacidade de relacionar o conhecimento acadêmico com a realidade social. Se você apenas joga a frase e não explica, seu repertório é considerado 'não produtivo'." },
  { p: 14, section: "DESENVOLVIMENTO", title: "Conclusão do Parágrafo", content: "Termine cada desenvolvimento com uma frase de 'respiro' que feche a ideia. Use: 'Por conseguinte, a manutenção desse cenário é inaceitável', 'Logo, enquanto o Estado se mantiver omisso, a problemática persistirá'. Isso dá unidade ao parágrafo. Nunca termine um parágrafo com uma citação. A última palavra do bloco deve ser sua, reforçando sua visão crítica. Isso demonstra domínio total sobre o que você está escrevendo e fecha o ciclo de raciocínio." },
  { p: 15, section: "DESENVOLVIMENTO", title: "Estratégia: Causa e Consequência", content: "Uma das formas mais poderosas de argumentar é mostrar que o problema X (Causa) gera o impacto Y (Consequência). Ex: A falta de educação sexual (Causa) gera o aumento da gravidez na adolescência e a evasão escolar (Consequência). Ao estruturar seu parágrafo assim, você cria uma lógica inquestionável. O corretor vê que você entende a raiz e o fruto do problema. Use conectivos como 'Em decorrência disso', 'Como resultado', 'Visto que'." },
  { p: 16, section: "CONCLUSAO", title: "A Proposta de Intervenção (C5)", content: "A conclusão do ENEM exige uma solução para o problema. Para tirar 200 na Competência 5, você PRECISA de 5 elementos: 1. AGENTE (Quem faz?). 2. AÇÃO (O que faz?). 3. MEIO/MODO (Como faz?). 4. EFEITO (Para que faz?). 5. DETALHAMENTO (Explicação extra de um dos itens). Se faltar um, você perde 40 pontos. O objetivo não é 'salvar o mundo', mas mostrar que existe um caminho viável e pragmático para atenuar o cenário discutido ao longo do texto." },
  { p: 17, section: "CONCLUSAO", title: "GOMIFPS: O Guia de Agentes", content: "Na dúvida de quem responsabilizar, lembre-se do acrônimo GOMIFPS: Governo (Ministérios, Prefeituras), ONGs, Mídia, Indivíduo/Família, Faculdade/Escola, Sociedade civil. Escolha o agente que tenha poder real sobre o que você sugeriu. Se o problema é educacional, o agente é o MEC. Se é segurança, é o Ministério da Justiça. Seja específico: 'O Ministério da Educação' é muito melhor que apenas 'O Governo'. Isso mostra que você conhece as instituições do seu país." },
  { p: 18, section: "CONCLUSAO", title: "Modo/Meio: O 'Como'", content: "Muitos alunos falham aqui por serem vagos. 'Através de leis' é fraco. 'Por meio da destinação de verbas suplementares e parcerias público-privadas' é forte. Explique o caminho fático: será via campanhas na TV? Será mudando a grade curricular? será criando delegacias especializadas? Use conectivos como: 'Mediante...', 'Por intermédio de...', 'Através de investimento em...'. O 'como' prova que sua solução não é utópica, mas executável." },
  { p: 19, section: "CONCLUSAO", title: "O Detalhamento Estratégico", content: "O elemento mais esquecido. O detalhamento é uma informação adicional que explica melhor um dos outros 4 elementos. O mais fácil é detalhar o AGENTE: 'O MEC, órgão responsável pela gestão educacional do país, deve...'. Ou detalhar o EFEITO: '...com o intuito de reduzir a evasão, de modo que os jovens possam construir um futuro digno'. Pense no detalhamento como um pequeno aposto entre vírgulas. Ele garante os últimos 40 pontos da sua nota final." },
  { p: 20, section: "CONCLUSAO", title: "A Frase de Fechamento (Cíclica)", content: "Para terminar com 'chave de ouro', retome o repertório que você usou lá na introdução. Ex: 'Dessa forma, os preceitos da Constituição de 1988 deixarão de ser apenas teoria e passarão a ser realidade para todos'. Isso mostra que seu texto foi planejado do início ao fim e que você 'amarrou' todas as pontas. É a marca registrada de um autor maduro. O corretor termina a leitura com a sensação de satisfação por ter lido um texto completo e bem acabado." },
  { p: 21, section: "REPERTORIOS", title: "Coringas: Paulo Freire", content: "Conceito: Educação como ferramenta de libertação contra a 'domesticação'. Aplicação: Temas de educação, desigualdade, preconceito, cidadania. Frase: 'A educação deve ser um processo de libertação, não de domesticação'. Como usar: Se o tema for sobre um problema social, você pode dizer que a educação atual tem falhado em seu papel libertador (Freire), o que mantém os indivíduos passivos diante da injustiça. É um dos repertórios mais versáteis do planeta." },
  { p: 22, section: "REPERTORIOS", title: "Coringas: Zygmunt Bauman", content: "Conceito: Modernidade Líquida. As relações, instituições e valores tornaram-se fluidos, frágeis e descartáveis. Aplicação: Cibercrime, consumismo, relacionamentos virtuais, ansiedade, insegurança. Frase: 'Na modernidade líquida, nada é feito para durar'. Como usar: Perfeito para temas que envolvem pressa, tecnologia ou falta de compromisso social. Use para explicar por que as pessoas não se importam com o próximo ou compram obsessivamente." },
  { p: 23, section: "REPERTORIOS", title: "Coringas: Michel Foucault", content: "Conceito: Relações de Poder e Vigilância (Panóptico). O poder não é apenas força física, mas controle de comportamento e vigilância invisível. Aplicação: Manipulação de dados, segurança pública, padrões de beleza, saúde mental. Como usar: Use para discutir como algoritmos vigiam nossas escolhas na internet ou como a sociedade impõe normas que nos 'escravizam' sem que percebamos. É a base para qualquer discussão sobre controle social moderno." },
  { p: 24, section: "REPERTORIOS", title: "Coringas: Constituição Federal", content: "A nossa 'Constituição Cidadã'. Ela garante educação (Art. 205), saúde (Art. 196), lazer, segurança e dignidade. Aplicação: ABSOLUTAMENTE QUALQUER TEMA SOCIAL. Como usar: Comece a intro dizendo o que a lei garante. No desenvolvimento, mostre que na prática o Brasil não está cumprindo a lei. É o repertório mais seguro para quem está começando, pois é impossível de refutar e dá uma base legal fortíssima para sua crítica." },
  { p: 25, section: "REPERTORIOS", title: "Filmes e Séries Estratégicos", content: "1. BLACK MIRROR: Tecnologia e desumanização. 2. PARASITA: Desigualdade de classe e falta de mobilidade social. 3. O POÇO: Individualismo e distribuição de recursos. 4. GREY'S ANATOMY: Desafios da saúde pública. Ao usar ficção, sempre use o conectivo 'Analogamente ao cenário fictício...' para mostrar que você entende que aquilo é uma representação artística que reflete problemas da nossa vida real. Isso é fundamental para a Competência 2." },
  { p: 26, section: "REPERTORIOS", title: "A Luta Contra a Invisibilidade", content: "Conceito de Boaventura de Sousa Santos: 'Sociologia das ausências'. A sociedade escolhe não ver determinados problemas. Aplicação: Idosos, moradores de rua, minorias étnicas, doenças mentais. Como usar: Argumente que o problema X persiste porque a sociedade e o Estado operam sob uma lógica de invisibilidade, onde o sofrimento dessas pessoas é ignorado para manter o status quo. É um argumento forte para temas de descaso social profundo." },
  { p: 27, section: "COESAO", title: "O Arsenal de Conectivos (C4)", content: "A Competência 4 exige que seu texto seja 'costurado'. 1. INÍCIO DE PARÁGRAFO: 'Nesse sentido', 'Ademais', 'Por outro lado', 'Portanto'. 2. LIGAÇÃO DE FRASES: 'Dessa forma', 'Por conseguinte', 'Visto que', 'Apesar de'. Nunca comece um período sem um elemento de coesão. Isso mantém o fluxo lógico. Repetir conectivos (usar 'portanto' três vezes) tira pontos. Tenha uma lista mental de pelo menos 3 sinônimos para cada função (conclusão, oposição, adição)." },
  { p: 28, section: "COESAO", title: "Coesão Referencial (Evite Repetições)", content: "Não repita palavras como 'educação', 'estudante', 'Brasil'. Use pronomes (ele, esse, disso) ou sinônimos (campo pedagógico, corpo discente, nação verde-amarela). Um texto com vocabulário variado demonstra inteligência linguística e maturidade. Ao se referir ao problema, alterne entre: 'o óbice', 'o entrave', 'a problemática', 'o cenário adverso'. Isso mantém o texto 'limpo' e profissional durante toda a leitura." },
  { p: 29, section: "GRAMATICA", title: "Erros Mortais (C1)", content: "1. VÍRGULA: Nunca separe o sujeito do verbo. 'O Governo, deve fazer...' está ERRADO. 2. CRASE: Use o truque do 'ao': Se trocar por uma palavra masculina ficar 'ao', tem crase. Ex: 'À escola' -> 'Ao colégio'. 3. CONCORDÂNCIA: 'Fazem muitos anos' está ERRADO, o correto é 'Faz muitos anos' (sentido de tempo decorrido). A C1 é injusta: um erro de vírgula pode te custar o 1000. Revise com foco total no final." },
  { p: 30, section: "PRATICA", title: "Como Analisar sua Própria Redação", content: "Terminou o rascunho? Faça a análise das cores: 1. Pinte os conectivos: Seu texto está 'colorido'? 2. Circule o repertório: Eles estão em parágrafos diferentes? 3. Sublinhe a tese: Suas causas estão no desenvolvimento? Se você não encontrar esses elementos visualmente, seu texto está incompleto. A revisão por cores ajuda a identificar padrões de erro que o cérebro ignora durante a escrita automática. Seja seu próprio corretor mais carrasco." },
  { p: 31, section: "PRATICA", title: "Simulado de Tempo (60 Min)", content: "No dia do ENEM, você tem cerca de 1 hora e 15 minutos para a redação. Treine em casa em 60 minutos: 10 min de projeto de texto, 40 min de rascunho e 10 min de passagem a limpo. Se você demora 2 horas para escrever, seu projeto de texto está falhando. A agilidade vem do conhecimento de modelos estruturais. Quanto mais você treina o 'esqueleto', mais rápido você preenche com a 'carne' (argumentos)." },
  { p: 32, section: "PRATICA", title: "A Estratégia da Reescrita", content: "O aprendizado real não acontece quando você termina uma redação, mas quando você reescreve uma nota 700 para virar 900. Leia os comentários da nossa IA Malu. O que ela apontou? Falta de conectivo? Argumento raso? Pegue sua própria redação e melhore os pontos fracos. Reescrever fixa a correção no cérebro. Não jogue fora as redações com nota baixa; elas são o degrau para o seu sucesso futuro." },
  { p: 33, section: "PSICOLOGIA", title: "Vencendo a Folha em Branco", content: "O bloqueio acontece porque você quer que a primeira frase seja perfeita. Dica: Comece o rascunho de qualquer jeito. Escreva mal, mas escreva tudo. O papel aceita tudo. Depois, no rascunho pronto, você lapida, troca as palavras e melhora a coesão. 'Escrita é reescrita'. Ninguém faz um 1000 de primeira. O rascunho é o lugar de errar; a folha oficial é o lugar de brilhar com o que você já corrigiu no rascunho." },
  { p: 34, section: "PSICOLOGIA", title: "Lidando com Temas Difíceis", content: "Se cair um tema que você 'não sabe nada', não se desespere. Recorra aos pilares universais: Estado, Educação, Cultura, Mídia. Quase todo problema brasileiro passa por um desses 4. Use o repertório da Constituição Federal para garantir uma base segura. Leia os textos motivadores com cuidado; eles dão o caminho. O ENEM não avalia seu conhecimento específico de geopolítica, mas sua capacidade de organizar um pensamento lógico sobre um problema comum." },
  { p: 35, section: "REFINAMENTO", title: "Vocabulário de Poder", content: "Troque palavras comuns por termos mais acadêmicos. 'Importante' -> 'Fundamental/Imprescindível'. 'Ruim' -> 'Deleterioso/Nocivo'. 'Causar' -> 'Fomentar/Propiciar'. 'Terminar' -> 'Mitigar/Atenuar'. Mas atenção: use apenas palavras que você entende o significado real. Usar vocabulário difícil de forma errada tira mais pontos do que usar o simples. O objetivo é a precisão vocabular, não a erudição vazia." },
  { p: 36, section: "REFINAMENTO", title: "O Uso de Dados Estatísticos", content: "Se você não decorou dados específicos, use os do texto de apoio, mas transforme-os. Não copie. Ex: Se o dado diz que '4 a cada 10 sofrem X', você escreve: 'Quase metade da população vivencia o cenário de X...'. Isso mostra interpretação. Dados estatísticos dão veracidade absoluta ao seu argumento. Eles provam que o problema não é 'coisa da sua cabeça', mas um fato mensurável que o Estado precisa enfrentar imediatamente." },
  { p: 37, section: "REFINAMENTO", title: "Argumentação Histórica Avançada", content: "Não cite apenas a 'História'. Seja específico. 1. HERANÇA COLONIAL: Para temas de preconceito. 2. ERA VARGAS: Para temas de leis trabalhistas ou propaganda. 3. DITADURA MILITAR: Para temas de liberdade e autoritarismo. Mostrar marcos temporais específicos prova que você tem repertório histórico legitimado e produtivo. O corretor adora ver que o aluno entende como o passado molda os vícios do presente no Brasil." },
  { p: 38, section: "REFINAMENTO", title: "Conectivos de Conclusão Fortes", content: "Para a última frase do texto, use conectivos que indiquem esperança e fechamento: 'Somente assim...', 'Dessa forma, tornar-se-á possível...', 'A partir dessas medidas, o Brasil trilhará um caminho de...'. Evite frases clichês como 'para que o Brasil seja um país melhor'. Seja mais específico com o tema: '...para que a inclusão digital deixe de ser uma utopia e se torne um direito tangível'. O final deve ser inspirador e firme." },
  { p: 39, section: "TECNICA", title: "O Detalhamento do Efeito", content: "Além de detalhar o agente (Quem), você pode detalhar o EFEITO (Para que). Ex: '...com o intuito de reduzir o analfabetismo funcional, fenômeno que ainda atinge milhões de brasileiros'. Este detalhamento do efeito é excelente para temas educacionais ou de saúde, pois já antecipa o impacto social da sua proposta. Lembre-se: o detalhamento é o que separa o 160 do 200 na C5. Não negligencie este elemento simples e poderoso." },
  { p: 40, section: "TECNICA", title: "A Jornada Final", content: "Você agora possui o mapa completo. A teoria está em suas mãos, mas o 1000 está na ponta do seu lápis. Pratique. Escreva. Erre. Melhore. O sucesso na redação do ENEM é uma escada que se sobe um degrau por vez. Confie no método Red 1000 Pro e na nossa IA Malu. Estamos aqui para garantir que sua voz seja ouvida e sua nota seja máxima. O seu futuro na universidade começa com o primeiro parágrafo que você escrever hoje. Boa jornada!" }
];

// --- DATA: REPERTORIOS ---
const REPERTORIOS_DATA = [
  {
    category: "Filosofia e Pensadores",
    items: [
      { 
        name: "Paulo Freire", 
        concept: "Educação e Libertação", 
        application: "Educação como ferramenta de libertação contra a 'domesticação'. Ideal para temas de desigualdade e cidadania.", 
        quote: "A educação não muda o mundo. Educação muda as pessoas que vão mudar o mundo.",
        usage: "Pode ser citado como 'O pedagogo Paulo Freire compreendeu a educação como um processo de libertação através do pensamento crítico.'",
        themes: ["Educação", "Mudança Social", "Cidadania"]
      },
      { 
        name: "Simone de Beauvoir", 
        concept: "Gênero e Construção Social", 
        application: "Gênero é construído socialmente, não biológico. Fundamental para temas de feminismo e violência de gênero.", 
        quote: "Não se nasce mulher; torna-se mulher.",
        usage: "Cite argumentando que a opressão feminina é social e não natural, podendo assim ser transformada.",
        themes: ["Feminismo", "Violência Contra a Mulher", "Identidade"]
      },
      { 
        name: "Michel Foucault", 
        concept: "Poder e Vigilância (Panóptico)", 
        application: "Poder exercido por vigilância invisível e normalização. Perfeito para temas de tecnologia e controle social.", 
        quote: "Poder não é apenas repressão; poder produz realidade.",
        usage: "Use para discutir como algoritmos monitoram comportamentos e moldam percepções sem que percebamos.",
        themes: ["Tecnologia", "Vigilância", "Mídia"]
      },
      { 
        name: "Zygmunt Bauman", 
        concept: "Modernidade Líquida", 
        application: "Sociedade marcada pela fluidez, fragilidade e desapego. Explica consumismo e relações superficiais.", 
        quote: "Na modernidade líquida, nada é feito para durar.",
        usage: "Relacione com a insegurança no trabalho, precarização e a efemeridade dos vínculos afetivos atuais.",
        themes: ["Consumismo", "Trabalho", "Relacionamentos"]
      },
      { 
        name: "Hannah Arendt", 
        concept: "Banalidade do Mal", 
        application: "Atrocidades cometidas por pessoas comuns que deixam de pensar criticamente em sistemas autoritários.", 
        quote: "O mal extremo é frequentemente praticado por pessoas comuns.",
        usage: "Aplique em temas de responsabilidade moral, direitos humanos e regimes totalitários.",
        themes: ["Direitos Humanos", "Política", "Ética"]
      },
      { 
        name: "Byung-Chul Han", 
        concept: "Sociedade do Cansaço", 
        application: "Excesso de demanda por desempenho gera esgotamento mental, burnout e depressão.", 
        quote: "A sociedade do século XXI não é mais a sociedade disciplinar, mas uma sociedade de desempenho.",
        usage: "Discuta a autoexploração e como a busca frenética por produtividade adoece a população.",
        themes: ["Saúde Mental", "Produtividade", "Burnout"]
      }
    ]
  },
  {
    category: "História e Contexto Brasileiro",
    items: [
      { 
        name: "Abolição da Escravidão (1888)", 
        concept: "Marginalização Estrutural", 
        application: "Fim legal sem integração social, gerando abismos socioeconômicos que persistem até hoje.", 
        usage: "Destaque que a falta de reparação histórica explica as disparidades em renda e educação entre negros e brancos.",
        themes: ["Racismo", "Desigualdade Social", "História"]
      },
      { 
        name: "Ditadura Militar (1964-1985)", 
        concept: "Fragilidade Democrática", 
        application: "Período de repressão, censura e tortura que deixou marcas profundas na política brasileira.", 
        usage: "Use para alertar sobre os riscos do autoritarismo e a importância da memória histórica.",
        themes: ["Democracia", "Liberdade de Expressão", "Política"]
      },
      { 
        name: "Constituição Cidadã (1988)", 
        concept: "Direitos Fundamentais", 
        application: "Dignidade humana como fundamento. Garante saúde, educação e lazer como direitos de todos.", 
        usage: "Aponte que o problema atual não é a falta de leis, mas a falha na efetivação do que a Carta Magna garante.",
        themes: ["Direitos Humanos", "Saúde Pública", "Segurança"]
      }
    ]
  },
  {
    category: "Literatura e Cinema",
    items: [
      { 
        name: "Vidas Secas (Graciliano Ramos)", 
        concept: "Invisibilidade e Pobreza", 
        application: "Retrata a miséria e a luta pela sobrevivência no sertão, simbolizando a desigualdade regional.", 
        usage: "Cite para mostrar como a pobreza extrema retira a voz e a humanidade do cidadão.",
        themes: ["Pobreza", "Nordeste", "Resiliência"]
      },
      { 
        name: "Cidade de Deus (Fernando Meirelles)", 
        concept: "Violência nas Periferias", 
        application: "Mostra como a ausência do Estado e a falta de oportunidades empurram jovens para a criminalidade.", 
        usage: "Relacione o filme com o crescimento das milícias e do tráfico em favelas brasileiras.",
        themes: ["Segurança Pública", "Juventude", "Favela"]
      },
      { 
        name: "Matrix / Truman Show", 
        concept: "Simulação e Controle", 
        application: "Metáforas sobre a manipulação da realidade e a falta de liberdade em mundos controlados.", 
        usage: "Aplique em temas sobre 'bolhas' de redes sociais e manipulação de massa por algoritmos.",
        themes: ["Tecnologia", "Manipulação", "Mídia"]
      },
      { 
        name: "Tempos Modernos (Charlie Chaplin)", 
        concept: "Alienação do Trabalho", 
        application: "A mecanização do homem e a desumanização nas linhas de produção industriais.", 
        usage: "Use para discutir a precarização do trabalho 'uberizado' e a automação excessiva.",
        themes: ["Trabalho", "Automação", "Indústria"]
      }
    ]
  },
  {
    category: "Dados Estatísticos (2024-25)",
    items: [
      { name: "Educação (IBGE)", concept: "Evasão Escolar", application: "1,5 milhão de crianças fora da escola. Brasil investe 3,5% do PIB (OECD recomenda 6%).", theme: "Dados" },
      { name: "Violência (FBSP)", concept: "Taxas Reais", application: "45 mil homicídios/ano. 88% da violência sexual registrada ocorre em âmbito doméstico.", theme: "Dados" },
      { name: "Pobreza (IPEA)", concept: "Concentração", application: "62 milhões em pobreza. O top 1% ganha 550x mais que o bottom 50%.", theme: "Dados" },
      { name: "Saúde Mental (OMS)", concept: "Pandemia de Ansiedade", application: "Brasil é o país mais ansioso do mundo (9,3%) e 15% têm depressão.", theme: "Dados" },
      { name: "Meio Ambiente (IPCC)", concept: "Aquecimento Global", application: "Amazônia perdeu 22% em 30 anos. Limite seguro de 1.5°C está próximo.", theme: "Dados" }
    ]
  }
];

const TOP_THEMES_REPERTOIRE = [
  { theme: "Educação", items: ["Paulo Freire", "Constituição de 1988 (Art. 205)", "Dados de evasão escolar", "Vidas Secas (Graciliano Ramos)", "Darcy Ribeiro"] },
  { theme: "Violência contra Mulheres", items: ["Simone de Beauvoir", "Lei Maria da Penha (2006)", "Dados de violência (1 em 3 mulheres)", "Movimento feminista", "Dom Casmurro (Machado Assis)"] },
  { theme: "Tecnologia e Sociedade", items: ["Foucault (vigilância)", "Bauman (modernidade líquida)", "Tempos Modernos (Chaplin)", "Dados de rastreamento", "Matrix"] },
  { theme: "Saúde Mental", items: ["Byung-Chul Han (cansaço)", "Dados de depressão", "OMS como referência", "Bauman (insegurança)", "Clarice Lispector"] },
  { theme: "Desigualdade Social", items: ["Paulo Freire", "Abolição (1888)", "Dados de pobreza (62 milhões)", "O Cortiço (Aluísio)", "Milton Santos"] },
  { theme: "Meio Ambiente", items: ["ODS (13, 14 e 15)", "Dados de desmatamento", "IPCC (aquecimento)", "Rachel Carson", "Sustentabilidade"] },
  { theme: "Trabalho / Automação", items: ["Revolução Industrial", "Tempos Modernos (Chaplin)", "Bauman (precarização)", "Dados de desemprego", "Karl Marx"] },
  { theme: "Racismo", items: ["Abolição (1888)", "Movimento Negro", "Sueli Carneiro", "Sérgio Buarque de Holanda", "Dados de desigualdade racial"] }
];

// --- DATA: EXERCÍCIOS / DESAFIOS ---
const CHALLENGES_DATA = {
  iniciante: [
    {
      id: "i1",
      title: "O Primeiro Passo: Intro com Contexto",
      type: "INTRODUÇÃO",
      time: "5-10 min",
      competence: "C2 e C3 (Repertório e Tese)",
      theme: "A importância da educação de qualidade para reduzir desigualdade social",
      task: "Escreva uma introdução (5-7 linhas). Comece com Contexto Histórico, Dados ou Citação. Termine com uma Tese Clara sobre o tema.",
      criteria: [
        "Contextualização adequada utilizando repertório",
        "Tese clara e objetiva no final do parágrafo",
        "Linguagem formal e apropriada ao ENEM",
        "Uso de pelo menos um conectivo de contraste"
      ],
      gabarito: {
        examples: [
          {
            title: "Exemplo 1 - Contexto Histórico (Nota 8/10)",
            text: "Desde o século XVIII, pensadores reconhecem que educação é ferramenta de libertação social. Porém, no Brasil contemporâneo, ainda 1,5 milhão de crianças estão fora da escola. Essa realidade mostra que, apesar de séculos de discussão sobre sua importância, educação de qualidade continua inacessível para muitos. Portanto, é imperativo que a sociedade reconheça educação como instrumento essencial para redução de desigualdades.",
            analysis: "✅ Começa com contexto histórico. ✅ Traz dado estatístico. ✅ Tese é clara. ⚠️ Vocabulário poderia ser mais rico."
          },
          {
            title: "Exemplo 2 - Citação (Nota 9/10)",
            text: "Para Paulo Freire, educador brasileiro revolucionário, 'a educação não muda o mundo, mas muda as pessoas que vão mudar o mundo'. No Brasil, onde 62 milhões vivem em situação de pobreza, transformação social passa necessariamente por acesso igualitário a educação de qualidade. Nesse sentido, urge reconhecer que investimento em educação é investimento em futura igualdade social.",
            analysis: "✅ Usa repertório filosófico natural. ✅ Integra citação perfeitamente. ✅ Conecta teoria à realidade. ✅ Tese sofisticada."
          }
        ],
        lessons: "A introdução é o portão de entrada. Começar com algo de 'fora' (História, Filosofia) prova ao corretor que você tem bagagem cultural.",
        next: "Desafio 2: Construa seu primeiro argumento sólido."
      }
    },
    {
      id: "i2",
      title: "Domine a Argumentação",
      type: "DESENVOLVIMENTO",
      time: "10-15 min",
      competence: "C3 (Argumentação)",
      theme: "Tecnologia prejudica relacionamentos humanos",
      task: "Escreva UM parágrafo de desenvolvimento (7-10 linhas) com: Tópico Frasal (Afirmação), Explicação (Por quê?), Exemplo Concreto (Como?) e Conclusão do Parágrafo.",
      criteria: [
        "Tópico frasal claro no início",
        "Argumento causal bem desenvolvido",
        "Exemplo concreto que ilustre o ponto",
        "Conclusão que retoma o tema central"
      ],
      gabarito: {
        examples: [
          {
            title: "Exemplo Nota 900+ (Analisado)",
            text: "A tecnologia, quando usada em excesso, substitui interação presencial por conexão virtual, reduzindo qualidade de relacionamentos. Isso ocorre porque comunicação por tela não transmite elementos essenciais da linguagem corporal, tom de voz natural e presença física que caracterizam vínculos genuínos. Observe uma família durante refeição: pais e filhos olham para celulares em vez de conversar. Dessa forma, momentos que deveriam fortalecer laços emocionais se tornam oportunidades perdidas de conexão. Logo, enquanto tecnologia avança, qualidade relacional diminui.",
            analysis: "✅ Tópico Frasal certeiro. ✅ Argumentação causal forte. ✅ Exemplo relatable (família). ✅ Conclusão fecha o ciclo."
          }
        ],
        lessons: "Argumentar não é dar opinião vazia. É mostrar a CAUSA e a CONSEQUÊNCIA de um problema com exemplos reais.",
        next: "Desafio 3: A Arte da Coesão."
      }
    }
  ],
  intermediario: [
    {
      id: "m1",
      title: "Engenharia da Coesão",
      type: "COESÃO",
      time: "8-12 min",
      competence: "C4 (Coesão)",
      theme: "Reescrita Crítica",
      task: "Reescreva o seguinte texto eliminando repetições e adicionando conectivos: 'Tecnologia muda a forma como as pessoas vivem. As redes sociais mudaram como as pessoas se comunicam. Comunicação não é como era antes. É preciso entender como a tecnade afeta relacionamentos.'",
      criteria: [
        "Uso de sinônimos (evitar repetição de 'pessoas', 'como')",
        "Pelo menos 3 conectivos diferentes (Adição, Oposição, Conclusão)",
        "Correção de erros gramaticais e de digitação",
        "Manutenção do sentido original com mais fluidez"
      ],
      gabarito: {
        examples: [
          {
            title: "Reescrita Nota 1000",
            text: "Tecnologia transformou radicalmente o cotidiano contemporâneo. Por meio de redes sociais, a comunicação interpessoal se modificou substancialmente, adquirindo características distintas das interações presenciais. Porém, tal fenômeno não foi apenas mudança estrutural—implicou também transformação profunda de como nos relacionamos. Logo, compreender o impacto da tecnologia digital no âmbito relacional é essencial para a sociedade atual.",
            analysis: "✅ Eliminou repetições. ✅ Usou conectivos (Por meio de, Porém, Logo). ✅ Fluxo de leitura superior."
          }
        ],
        lessons: "Os conectivos são os 'links' do seu texto. Sem eles, sua redação parece uma lista de compras. Com eles, parece uma sinfonia.",
        next: "Desafio 4: Repertório Integrado."
      }
    },
    {
      id: "m2",
      title: "O Combo de Repertórios",
      type: "REPERTÓRIO",
      time: "15 min",
      competence: "C2 (Produtividade)",
      theme: "Educação e Desigualdade no Brasil",
      task: "Escreva um parágrafo que integre NATURALMENTE estes 3 itens: Paulo Freire ('Educação liberta'), Dado de 62 milhões em pobreza, e a Abolição em 1888.",
      criteria: [
        "Integração de todos os 3 repertórios no mesmo parágrafo",
        "Uso produtivo (não apenas citar, mas explicar a relação)",
        "Lógica histórica e sociológica coerente",
        "Mínimo de 8 linhas"
      ],
      gabarito: {
        examples: [
          {
            title: "Integração Perfeita (Nota 10/10)",
            text: "De acordo com Paulo Freire, education é processo de libertação, não domesticação. Essa visão ganha relevância ao considerarmos a realidade brasileira: após a abolição em 1888, a população negra não recebeu qualquer suporte educacional, perpetuando um ciclo de pobreza. Atualmente, 62 milhões de brasileiros vivem em situação de vulnerabilidade, sendo a maioria afrodescendente—herança direta da falta de acesso igualitário a educação. Assim, reconhecendo o pensamento de Freire, o investimento em educação pública é a única ferramenta para quebrar estruturas históricas de exclusão.",
            analysis: "✅ Conecta 1888 à pobreza atual. ✅ Usa Freire para fechar a solução. ✅ Lógica histórica inatacável."
          }
        ],
        lessons: "Nunca jogue o repertório no texto. Ele deve servir ao seu argumento, não o contrário. A história explica o presente.",
        next: "Desafio 5: Proposta de Intervenção Nota 200."
      }
    }
  ],
  avancado: [
    {
      id: "a1",
      title: "A Solução Final (C5)",
      type: "INTERVENÇÃO",
      time: "20 min",
      competence: "C5 (Proposta)",
      theme: "Violência nas escolas públicas",
      task: "Crie uma proposta de intervenção completa com os 5 elementos: Agente, Ação, Meio/Modo, Efeito e Detalhamento. Máximo 10 linhas.",
      criteria: [
        "Presença clara do Agente (Quem?)",
        "Ação prática e específica (O quê?)",
        "Meio/Modo viável (Como?)",
        "Efeito social esperado (Para quê?)",
        "Detalhamento de pelo menos um dos elementos"
      ],
      gabarito: {
        examples: [
          {
            title: "Proposta Nota 200 (C5)",
            text: "Para combater a violência nas escolas, o Ministério da Educação deve implementar o Programa Nacional de Segurança Escolar. Este seria executado em parceria com as polícias militares estaduais, através da presença estratégica de agentes treinados especificamente para o ambiente escolar em zonas de vulnerabilidade. O detalhamento dessa ação inclui a mediação de conflitos por psicólogos contratados, visando alcançar 100% das escolas críticas em 24 meses. Esta ação beneficiaria 40 milhões de estudantes, criando um ambiente seguro que permite o aprendizado efetivo e a redução da criminalidade juvenil.",
            analysis: "✅ Todos os 5 elementos presentes. ✅ Detalhamento técnico (prazos e metas). ✅ Agente apropriado."
          }
        ],
        lessons: "A C5 é a competência mais fácil de garantir 200 pontos. É puramente checklist. Se tem os 5 itens, você ganha a nota.",
        next: "Parabéns! Você concluiu a trilha avançada do Red 1000 Pro."
      }
    }
  ]
};

// --- DATA: REDAÇÕES MODELO ---
const REDACOES_MODELO = [
  {
    title: "Herança Africana (ENEM 2024)",
    theme: "Desafios para a valorização da herança africana no Brasil",
    note: 1000,
    author: "Sabrina Ayumi Alvez Shimizu",
    text: "O livro 'Nós matamos o cão tinhoso', de Luís Bernardo Honwana, retrata a sociedade moçambicana durante a colonização portuguesa. Na obra literária, observa-se uma dinâmica social pautada pela inferiorização dos indivíduos negros, na qual o racismo está enraizado nas interações entre as pessoas, na qualidade de vida e na autoimagem de cada ser. Analogamente, é possível considerar que tal realidade, apesar de ficcional, replica a situação vivenciada pelos povos africanos até os dias atuais no Brasil, contexto onde a herança africana não é devidamente valorizada na sociedade brasileira.\n\nEm primeira análise, convém ressaltar que a escassa valorização de tais tradições se arquiteta como expressão de contribuições históricas. De fato, a escravização de povos oriundos da África, no Brasil Colônia, constitui a base para a formação do país. Nessa conjuntura, esses indivíduos foram vítimas de violências físicas e simbólicas que, de forma cruel, visavam à docilização e ao apagamento da identidade desses grupos. Desse modo, a marginalização da population negra nesse período, promovida pela elite branca, implicou, consequentemente, a invisibilização dessa minoria até a atualidade, visto que o Estado falhou na inserção social e na valorização do legado africano após a abolição da escravidão.\n\nAdemais, uma segunda análise acerca da problemática revela a influência da hipervalorização da cultura branca. Tal fato (estudado pela filósofa Sueli Carneiro) provoca um sepultamento dos saberes ao apagar o conhecimento e as tradições preservadas ao longo dos séculos pelos povos afrodescendentes. Dessa forma, perpetua-se a desvalorização da cultura plural contida na história dos povos pretos, responsáveis por grande parte da construção identitária nacional. Portanto, urge a necessidade de valorização da herança africana no Brasil.\n\nPara isso, o Poder Executivo Federal, mais especificamente o Ministério da Educação, deve fomentar um projeto de resgate das heranças afro-brasileiras. Tal ação ocorrerá por meio da implantação de uma 'Campanha Nacional de Validação da Cultura Africana', a qual irá promover o consumo e a análise de obras que fazem jus à identidade brasileira em ambiente escolar, ressaltando a importância e a pluralidade da herança afrodescendente.",
    analysis: {
      intro: "Abertura sofisticada com literatura moçambicana conectada ao tema brasileiro.",
      dev1: "Argumento histórico: foca na escravização como base da invisibilidade atual do legado africano.",
      dev2: "Repertório avançado: utiliza Sueli Carneiro para explicar o 'sepultamento dos saberes' pela cultura branca.",
      conclusion: "Proposta completa: Ministério da Educação com a 'Campanha Nacional de Validação da Cultura Africana'."
    }
  },
  {
    title: "Envelhecimento (ENEM 2025)",
    theme: "Perspectivas acerca do envelhecimento na sociedade brasileira",
    note: 1000,
    author: "Carlos (estudante)",
    text: "O sociólogo e professor Boaventura de Sousa Santos afirma que a sociedade vive uma 'sociologia das ausências', uma vez que os saberes e o modo de vida de determinados grupos tendem a ser invisibilizados por não se encaixarem na lógica da racionalidade ocidental. Nesse sentido, ao analisar o hodierno contexto brasileiro, é perceptível que a população idosa é marcada pela sociologia defendida pelo professor, já que o envelhecimento desses indivíduos testemunha um descaso social de desassistência e preconceito, marcado por perspectivas que dificultam a qualidade de vida e a inclusão social. Por isso, urge uma discussão sobre essa problemática, a qual é sustentada não só pela negligência estatal, mas também pela omissão midiática.\n\nDiante desse cenário, faz-se mister mencionar a ausência de políticas públicas de saúde para a população idosa como um dos fatores dessa estigmatização. Instituições que deveriam servir como ferramenta de inclusão, como asilos, apresentam elevados índices de negligência e abandono. Além disso, a mídia pouco retrata a potencialidade e a capacidade contributiva de idosos para a sociedade, perpetuando estereótipos de fragilidade e inutilidade. Consequentemente, há um aprofundamento do sentimento de exclusão social nesses indivíduos.\n\nSomado a isso, cumpre reconhecer que a perspectiva cultural brasileira, historicamente pautada na valorização de beleza e de força física, marginaliza a população idosa. Enquanto filmes, novelas e publicidades enfatizam corpos jovens e belos, aqueles que envelhecem são invisibilizados nos espaços de representação. Essa lógica cultural reforça a ideia de que idosos não são dignos de atenção e respeito, gerando consequências psicológicas devastadoras.\n\nPortanto, para solucionar essa problemática, faz-se imprescindível que o Poder Executivo, em colaboração com órgãos como Secretarias de Saúde e instituições de assistência social, implemente ações que valorizem a população idosa. Propostas como programas de inclusão laboral para idosos dispostos a trabalhar, criação de espaços de convívio que promovam integração intergeracional e revisão da cobertura de mídia para inclusão de representatividade positiva de envelhecimento são medidas viáveis. Tais iniciativas permitiriam que idosos vivenciassem dignidade, utilidade social e qualidade de vida adequada.",
    analysis: {
      intro: "Uso do conceito 'Sociologia das ausências' de Boaventura para diagnosticar a invisibilidade do idoso.",
      dev1: "Foca na negligência institucional (asilos) e no papel da mídia em perpetuar estereótipos de inutilidade.",
      dev2: "Crítica à 'estética da juventude' que marginaliza quem não possui força física ou beleza padrão.",
      conclusion: "Proposta detalhada com integração intergeracional e inclusão laboral (agente: Poder Executivo)."
    }
  },
  {
    title: "Manipulação de Dados (ENEM 2019)",
    theme: "Manipulação do comportamento do usuário pelo controle de dados na internet",
    note: 1000,
    author: "André Bahia Pereira",
    text: "A manipulação pelo controle de dados surge como uma ameaça contemporânea à liberdade individual. A internet, que foi originalmente concebida como ferramenta de democratização de informação, tornou-se instrumento de controle comportamental através de algoritmos sofisticados. Conforme aponta a teoria da Escola de Frankfurt, desenvolvida por Adorno e Horkheimer, a indústria cultural moderna exerce influência silenciosa sobre o consciente coletivo, moldando preferências e desejos sem que indivíduos percebam a manipulação. Atualmente, grandes corporações como Google e Facebook utilizam algoritmos que selecionam, filtram e apresentam informações de acordo com o perfil do usuário, criando 'bolhas informacionais' que limitam o acesso ao conhecimento diverso e reforçam vieses preexistentes.\n\nConsequentemente, essa dinâmica prejudica a formação da consciência crítica essencial para a vida democrática. Quando cidadãos recebem apenas informações que confirmam suas crenças prévias, tornam-se incapazes de compreender perspectivas diferentes ou questionar narrativas dominantes. Manuel Castells, importante sociólogo, argumenta que a internet poderia ser espaço de inclusão informacional; contudo, na prática, serve mais para fragmentação e polarização social. Além disso, a disseminação de notícias falsas é amplificada por esses mesmos algoritmos que selecionam conteúdo visualmente atrativo ou emocionalmente provocador, independente de sua veracidade.\n\nDiante dessa conjuntura, urge a necessidade de regulamentação estatal e transparência corporativa. O Poder Legislativo Federal deve promulgar lei que obrigue plataformas digitais a divulgar publicamente critérios de seus algoritmos, permitindo auditorias independentes sobre práticas de coleta e uso de dados. Paralelamente, deve-se investir em educação digital nas escolas, capacitando cidadãos a compreender mecanismos de manipulação e exercer consumo crítico de informação. Essas medidas, embora desafiadoras em contexto de grande poder corporativo, são essenciais para preservar autonomia individual e democracia.",
    analysis: {
      intro: "Conecta a Escola de Frankfurt (Indústria Cultural) à manipulação algorítmica moderna.",
      dev1: "Explica a formação de 'bolhas informacionais' e o prejuízo à consciência crítica democrática.",
      dev2: "Utiliza Manuel Castells para discutir a fragmentação social versus o potencial de inclusão da rede.",
      conclusion: "Proposta sólida: Regulamentação pelo Poder Legislativo + Educação Digital nas escolas."
    }
  },
  {
    title: "Saúde Mental (ENEM 2020)",
    theme: "O estigma associado às doenças mentais na sociedade brasileira",
    note: 1000,
    author: "Giovanna Sbeghen Marin Viotto",
    text: "O filme 'Fragmentado' conta a história de um homem que possui múltiplas personalidades. Na obra, a patologia do protagonista é tratada como algo perigoso e incompreensível, reforçando o estereótipo de que indivíduos com transtornos psíquicos são ameaças à coletividade. Analogamente à ficção, o estigma associado às doenças mentais na sociedade brasileira ainda é uma realidade alarmante. Esse cenário de preconceito é alimentado tanto pela falta de informação técnico-científica na base educacional quanto pela visão utilitarista da sociedade moderna, que marginaliza aqueles que não conseguem manter uma produtividade constante.\n\nEfetivamente, a carência de debates sobre saúde mental no sistema de ensino brasileiro corrobora a manutenção desse estigma. Vigora, no país, uma cultura de silenciamento, na qual transtornos como depressão e ansiedade são frequentemente reduzidos a 'frescura' ou falta de força de vontade. Nesse sentido, conforme o pensamento de Michel Foucault, a sociedade tende a excluir o 'anormal' para manter uma aparência de ordem e produtividade. Sem a educação necessária para compreender que tais condições são patologias clínicas, o preconceito floresce, dificultando a busca por tratamento e o acolhimento desses indivíduos.\n\nAdemais, a lógica do sistema capitalista atual intensifica a marginalização dos doentes mentais. Segundo o filósofo portorriquenho Byung-Chul Han, vivemos em uma 'Sociedade do Cansaço', na qual a cobrança excessiva por performance gera um esgotamento mental generalizado. Nesse panorama, quem adoece psiquicamente é visto como um 'elo fraco' ou alguém que falhou na autogestão. Dessa forma, o estigma não é apenas social, mas também econômico, uma vez que o mercado de trabalho muitas vezes exclui quem necessita de pausas para cuidar da psique, relegando esses cidadãos à invisibilidade profissional.\n\nPortanto, medidas são necessárias para mitigar esse estigma. Cabe ao Ministério da Educação, em parceria com o Ministério da Saúde, instituir o 'Programa Mente Saudável' nas escolas brasileiras. Tal iniciativa deve ser realizada por meio de palestras ministradas por psicólogos e psiquiatras, bem como pela inclusão de conteúdos sobre saúde mental na Base Nacional Comum Curricular (BNCC). O objetivo é transformar a escola em um espaço de desconstrução de preconceitos, permitindo que as futuras gerações enxerguem a saúde mental com a seriedade e a empatia que a ciência exige.",
    analysis: {
      intro: "Abre com o filme 'Fragmentado' para ilustrar como a mídia reforça estereótipos negativos sobre a loucura.",
      dev1: "Utiliza Foucault para explicar a exclusão do 'anormal' e critica o silenciamento educativo no Brasil.",
      dev2: "Repertório contemporâneo de Byung-Chul Han (Sociedade do Cansaço) para ligar produtividade e estigma.",
      conclusion: "Proposta detalhada (MEC + Saúde) com foco em palestras e mudança na grade curricular (BNCC)."
    }
  },
  {
    title: "Meio Ambiente (ENEM 2026)",
    theme: "Desafios para a implementação de uma economia sustentável no Brasil",
    note: 1000,
    author: "Malu IA (Modelo RED 1000 PRO)",
    text: "A 'Tragédia dos Comuns', conceito desenvolvido pelo ecologista Garrett Hardin, descreve situações em que indivíduos, agindo de forma independente e racional de acordo com seus próprios interesses, acabam esgotando um recurso compartilhado, mesmo que isso seja contrário aos interesses de longo prazo de todo o grupo. Analogamente, a implementação de uma economia sustentável no Brasil enfrenta o desafio do individualismo predatório presente nas cadeias produtivas globais. Apesar de possuir a maior biodiversidade do planeta, o país ainda patina na transição entre o modelo extrativista arcaico e a bioeconomia moderna, problemática sustentada pela falha na fiscalização ambiental e pela cultura do consumo imediato.\n\nEm primeira instância, a ineficiência logística e fiscalizatória do Estado configura-se como um entrave central. Segundo o filósofo contratualista John Locke, o Estado existe para garantir o bem comum e a propriedade; contudo, ao falhar na repressão ao desmatamento ilegal e ao garimpo predatório, o poder público permite que o patrimônio ambiental brasileiro seja degradado em prol do lucro de minorias. Essa 'cegueira estatal' gera um paradoxo: o Brasil possui leis ambientais rigorosas, mas a impunidade nas fronteiras agrícolas impede que mercados sustentáveis consigam competir de forma justa.\n\nOutrossim, é imperativo analisar o papel da 'Obscolescência Programada' no impedimento do desenvolvimento sustentável. Na sociedade moderna, como descrito por Zygmunt Bauman, a cultura do descarte impera, transformando produtos duráveis em resíduos em tempo recorde. Essa dinâmica pressiona os recursos naturais de forma insustentável e dificulta a adoção de uma economia circular. Enquanto o lucro for pautado na reposição constante de mercadorias frágeis, a sustentabilidade permanecerá como uma utopia distante, uma vez que o mercado prioriza a fluidez financeira sobre a regeneração ecológica.\n\nLogo, urge que o Ministério do Meio Ambiente e o Ministério da Economia articulem a 'Rede Nacional de Bioeconomia'. Essa política deve ser executada por meio da concessão de subsídios fiscais para empresas que adotarem o selo de logística reversa e reciclagem integral. Além disso, o Ministério da Ciência e Tecnologia deve financiar centros de pesquisa na Amazônia para o desenvolvimento de produtos de alto valor agregado derivados da floresta em pé. Somente assim, a tragédia dos comuns será mitigada e o Brasil poderá liderar a economia do novo século.",
    analysis: {
      intro: "Repertório sofisticado de Garrett Hardin para explicar o esgotamento de recursos naturais.",
      dev1: "Uso de John Locke para cobrar a responsabilidade do Estado na proteção da biodiversidade.",
      dev2: "Ligação entre Zygmunt Bauman e o conceito industrial de obsolescência programada.",
      conclusion: "Proposta técnica com foco em subsídios fiscais, bioeconomia e logística reversa."
    }
  }
];
const TESTIMONIALS = [
  { 
    name: "João Silva", 
    age: 18, 
    note: 950, 
    text: "Entrei com nota 650 e saí com 950. Consegui bolsa integral na USP! O método de estruturas prontas salvou meu tempo.", 
    before: 650, 
    after: 950,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" 
  },
  { 
    name: "Maria Eduarda", 
    age: 17, 
    note: 980, 
    text: "Eu simplesmente travava na introdução. Com as fórmulas 'copy-paste', minha redação fluiu em menos de 40 minutos.", 
    before: 580, 
    after: 980,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" 
  },
  { 
    name: "Pedro Santos", 
    age: 19, 
    note: 920, 
    text: "Paguei R$ 29 e tive mais correção que no cursinho presencial. A Malu IA não deixa passar nenhum erro de coesão.", 
    before: 700, 
    after: 920,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" 
  }
];

const VALUE_PROPS = [
  { icon: "🤖", title: "CORRETOR COM IA INTEGRADA", desc: "Envie sua redação e receba feedback em 2 minutos.", sub: "Identifica erros de estrutura, coesão e gramática" },
  { icon: "✍️", title: "REDAÇÕES NOTA 1000", desc: "Modelos dos anos 2023-2024 analisados linha por linha.", sub: "Aprenda com quem já chegou no topo" },
  { icon: "🎯", title: "ESTRUTURAS PRONTAS", desc: "Planilha com 5 modelos 'copy-paste' para qualquer tema.", sub: "Introdução, Desenvolvimento e Conclusão completas" },
  { icon: "🎁", title: "BÔNUS: GUIA DE REPERTÓRIOS", desc: "Citações e séries curingas que cabem em tudo.", sub: "Filosofia, Sociologia e Cultura Pop" },
  { icon: "🕒", title: "ACESSO VITALÍCIO", desc: "Pague uma vez e estude para sempre, sem mensalidade.", sub: "Atualizações inclusas todo ano" },
  { icon: "📝", title: "SIMULADOS MENSAIS", desc: "Temas inéditos com correção comentada.", sub: "Treine sob pressão" }
];

// --- COMPONENTS ---

const Nav = ({ onAction }: { onAction: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 p-6`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center glass p-4 px-8 rounded-[32px] ${isScrolled ? 'bg-white/10' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-2xl rotate-3 shadow-[0_0_20px_rgba(255,0,102,0.4)]">
            <Trophy className="text-white w-5 h-5" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter">RED <span className="text-primary italic">1000</span> PRO</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
          <a href="#features" className="hover:text-primary transition-colors">Método</a>
          <a href="#ia" className="hover:text-primary transition-colors">Malu IA</a>
          <a href="#faq" className="hover:text-primary transition-colors">Dúvidas</a>
        </div>

        <button 
          onClick={onAction}
          className="bg-white text-bg-dark px-8 py-3 rounded-full font-display font-black text-xs uppercase tracking-widest hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
        >
          QUERO MEU 1000
        </button>
      </div>
    </nav>
  );
};

const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: string, subtitle?: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-20 px-6">
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 shadow-xl"
    >
      {badge}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-5xl md:text-7xl font-display font-black mb-8 leading-[0.9] tracking-tighter"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 text-xl font-medium leading-relaxed"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const targetStr = value.replace(/[^0-9.]/g, '');
  const target = parseFloat(targetStr) || 0;
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(progress * target);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{Math.floor(count).toLocaleString()}{suffix}</span>;
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ d: 45, h: 23, m: 59 });
  
  return (
    <div className="flex gap-4 justify-center">
      {[
        { v: timeLeft.d, l: "Dias", c: "text-primary" },
        { v: timeLeft.h, l: "Hrs", c: "text-secondary" },
        { v: timeLeft.m, l: "Min", c: "text-accent" }
      ].map((time, i) => (
        <div key={i} className="glass w-24 h-24 rounded-[32px] flex flex-col items-center justify-center border-white/5">
          <div className={`text-4xl font-display font-black ${time.c}`}>{time.v}</div>
          <div className="text-[10px] uppercase font-black opacity-30">{time.l}</div>
        </div>
      ))}
    </div>
  );
};

// --- DASHBOARD VIEWS ---

const EbookView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 30;

  const getPageContent = (page: number) => {
    return [...EBOOK_PAGES].reverse().find(p => p.p <= page) || EBOOK_PAGES[0];
  };

  const activePage = getPageContent(currentPage);

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start mt-12 overflow-visible">
      {/* SIDEBAR NAVIGATION */}
      <div className="glass rounded-[32px] p-6 space-y-2 sticky top-6 hidden lg:block">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-30 px-4 mb-4 font-mono">Manual do Aprovado</h3>
        {[
          { p: 1, t: "Págs 1-2: Comece Aqui" },
          { p: 3, t: "Págs 3-5: O Que é Redação" },
          { p: 6, t: "Págs 6-9: Estrutura & Intro" },
          { p: 10, t: "Págs 10-14: Conclusão" },
          { p: 15, t: "Págs 15-19: Repertório" },
          { p: 20, t: "Págs 20-24: Coesão" },
          { p: 25, t: "Págs 25-29: Prática" },
          { p: 30, t: "Págs 30: Próximos Passos" },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentPage(item.p)}
            className={`w-full text-left p-3 px-4 rounded-xl text-[10px] font-bold transition-all ${currentPage === item.p ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' : 'hover:bg-white/5 opacity-60'}`}
          >
            {item.t}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="glass rounded-[48px] p-8 md:p-16 border-white/5 min-h-[800px] relative">
        <div className="absolute top-8 right-8 text-[10px] font-black uppercase opacity-20 font-mono tracking-widest">
          PÁGINA {currentPage} / {totalPages}
        </div>

        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="space-y-6">
              <span className="p-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20">{activePage.section}</span>
              <h1 className="text-5xl font-display font-black leading-tight italic">{activePage.title}</h1>
              <p className="text-xl text-gray-400 font-medium leading-relaxed">
                {activePage.content}
              </p>
           </div>

           {currentPage === 1 && (
             <div className="p-8 glass rounded-[32px] border-primary/20 bg-primary/5">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 italic">🚀 Aviso aos Navegantes</h4>
                <p className="text-gray-300 italic leading-relaxed">
                  Não tente ser um gênio. Tente ser um técnico. Redação é o jogo mais previsível do ENEM.
                </p>
             </div>
           )}

           {currentPage === 15 && (
             <div className="grid gap-6">
                <div className="p-6 glass rounded-2xl border-white/10">
                   <h4 className="text-sm font-black text-primary mb-2">DICA DE OURO</h4>
                   <p className="text-xs text-gray-400 italic">"Repertório legitimado é aquele que tem autoridade comprovada. Não invente citações!"</p>
                </div>
             </div>
           )}
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="mt-20 pt-12 border-t border-white/5 flex justify-between items-center">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-3 px-6 glass rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:bg-white/10"
          >
            Anterior
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-3 px-8 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-20 hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Próxima Página
          </button>
        </div>
      </div>
    </div>
  );
};

const IaView = () => {
    const [essay, setEssay] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCorrect = async () => {
        if (!essay.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const feedback = await correctEssay(essay);
            setResult(feedback);
        } catch (e) {
            setResult("Eita! Ocorreu um erro. Tenta de novo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20 pb-20">
            <div className="glass rounded-[64px] border-white/5 p-2 shadow-2xl overflow-hidden">
                <div className="bg-[#0A0A0F] rounded-[62px] min-h-[600px] flex flex-col border border-white/10">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                                <Sparkles size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs font-black uppercase">Malu AI Corretora</div>
                                <div className="text-[10px] font-mono opacity-30 text-success">ONLINE E PRONTA</div>
                            </div>
                        </div>
                        {result && (
                            <button 
                                onClick={() => {setResult(null); setEssay("");}}
                                className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                            >
                                [ Limpar Tudo ]
                            </button>
                        )}
                    </div>
                    
                    {!result ? (
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-5xl">📄</div>
                            <h3 className="text-3xl font-display font-black italic tracking-tighter">Pronto para a correção?</h3>
                            <p className="text-gray-400 font-medium max-w-sm">Para uma análise precisa, cole seu texto abaixo. A Malu vai ler tudo e te falar a real.</p>
                            
                            <div className="w-full max-w-2xl space-y-4">
                                <textarea 
                                    className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[300px] resize-none"
                                    placeholder="Digite ou cole sua redação completa aqui..."
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                />
                                <button 
                                    onClick={handleCorrect}
                                    disabled={loading || !essay.trim()}
                                    className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ANALISANDO...
                                        </>
                                    ) : "SOLTAR O VEREDITO"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="max-w-2xl mx-auto markdown-body">
                                <Markdown>{result}</Markdown>
                            </div>
                            <div className="mt-12 flex justify-center pb-8">
                                <button 
                                    onClick={() => setResult(null)}
                                    className="p-4 px-10 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                                >
                                    Fazer Outra Correção
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Baseado no Manual do Candidato</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Correção via Gemini 1.5 Flash</span>
                </div>
            </div>
        </div>
    )
}

const RepertoireView = () => {
    const [selectedCat, setSelectedCat] = useState<string | null>(null);

    return (
        <div className="space-y-12 mt-12 mb-20">
            <div className="flex flex-wrap gap-4 mb-12">
               <button 
                  onClick={() => setSelectedCat(null)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCat ? 'bg-primary text-white' : 'glass opacity-60'}`}
               >
                  Todos
               </button>
               {REPERTORIOS_DATA.map((cat, i) => (
                  <button 
                     key={i}
                     onClick={() => setSelectedCat(cat.category)}
                     className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCat === cat.category ? 'bg-primary text-white' : 'glass opacity-60'}`}
                  >
                     {cat.category}
                  </button>
               ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {REPERTORIOS_DATA.filter(c => !selectedCat || c.category === selectedCat).map((cat, i) => (
                    cat.items.map((item: any, j: number) => (
                      <motion.div 
                        key={`${i}-${j}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-[40px] border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between group h-full"
                      >
                         <div>
                            <div className="flex justify-between items-start mb-6">
                               <h3 className="text-2xl font-display font-black italic tracking-tighter group-hover:text-primary transition-colors">{item.name}</h3>
                               <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg uppercase tracking-widest">{cat.category}</span>
                            </div>
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <div className="text-[10px] font-black opacity-30 uppercase tracking-widest font-mono">Conceito</div>
                                  <div className="text-base font-bold text-white leading-relaxed">{item.concept}</div>
                               </div>
                               <div className="space-y-1">
                                  <div className="text-[10px] font-black opacity-30 uppercase tracking-widest font-mono">Aplicação</div>
                                  <div className="text-xs font-semibold text-gray-400 leading-relaxed">{item.application}</div>
                               </div>
                               {item.usage && (
                                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                     <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-2">💡 Como usar na prática</div>
                                     <div className="text-[11px] font-medium text-gray-300 italic leading-relaxed">"{item.usage}"</div>
                                  </div>
                               )}
                            </div>
                         </div>
                         <div className="mt-8 space-y-6 pt-8 border-t border-white/5">
                            {item.quote && (
                               <div className="italic text-gray-500 text-xs bg-white/[0.01] p-4 rounded-xl">
                                  "{item.quote}"
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                               {item.theme && (
                                  <div className="text-[9px] font-black text-accent uppercase tracking-widest bg-accent/5 px-2 py-1 rounded">#{item.theme}</div>
                               )}
                               {item.themes?.map((t: string, k: number) => (
                                  <div key={k} className="text-[9px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-2 py-1 rounded">#{t}</div>
                               ))}
                            </div>
                         </div>
                      </motion.div>
                    ))
                ))}
            </div>

            <div className="mt-24 p-12 glass rounded-[64px] border-primary/20 bg-primary/5 space-y-12">
               <div className="text-center space-y-4">
                  <h3 className="text-3xl font-display font-black italic tracking-tighter">🔥 Guia Rápido por Temas</h3>
                  <p className="text-gray-400 font-medium italic">As melhores combinações de repertório para os temas mais prováveis.</p>
               </div>
               
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TOP_THEMES_REPERTOIRE.map((item, i) => (
                     <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 group-hover:scale-105 transition-transform inline-block">{item.theme}</h4>
                        <ul className="space-y-3">
                           {item.items.map((repertory, j) => (
                              <li key={j} className="text-[11px] font-bold text-gray-400 flex items-start gap-2">
                                 <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-1 shrink-0" />
                                 {repertory}
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
            </div>
        </div>
    )
}

const ChallengesView = () => {
    const [level, setLevel] = useState<'iniciante' | 'intermediario' | 'avancado'>('iniciante');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [answer, setAnswer] = useState("");
    const [showGabarito, setShowGabarito] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    const activeChallenge = CHALLENGES_DATA[level].find(c => c.id === selectedId);

    const handleFeedback = async () => {
        if (!answer.trim()) return;
        setLoadingFeedback(true);
        try {
            const prompt = `Você é um TREINADOR DE REDAÇÃO. Avalie o seguinte exercício prático do aluno.
            Nível: ${level}
            Desafio: ${activeChallenge?.title}
            Tema: ${activeChallenge?.theme}
            Tarefa: ${activeChallenge?.task}
            Resposta do Aluno: "${answer}"
            
            Compare com os critérios: ${activeChallenge?.criteria.join(', ')}.
            Dê uma nota de 0 a 1000 baseada na qualidade e forneça um feedback construtivo (Pontos Fortes, O que melhorar, Dica de Ouro).`;
            
            const result = await correctEssay(prompt);
            setFeedback(result);
            setShowGabarito(true);
        } catch (e) {
            toast.error("Erro ao gerar feedback.");
        } finally {
            setLoadingFeedback(false);
        }
    }

    if (selectedId && activeChallenge) {
        return (
            <div className="max-w-4xl mx-auto space-y-12 mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <button 
                  onClick={() => {setSelectedId(null); setAnswer(""); setShowGabarito(false); setFeedback(null);}}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 mb-8"
                >
                    <ArrowRight className="rotate-180" size={14} /> Voltar aos Desafios
                </button>

                <div className="glass p-12 rounded-[64px] border-white/5 space-y-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="p-2 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-lg border border-primary/20">{activeChallenge.type}</span>
                         <span className="text-[10px] font-black uppercase opacity-30 flex items-center gap-1"><Clock size={12} /> {activeChallenge.time}</span>
                      </div>
                      <h2 className="text-4xl font-display font-black italic tracking-tighter">{activeChallenge.title}</h2>
                      <div className="p-6 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                         <div className="text-[10px] font-black uppercase opacity-30 mb-2 font-mono">🎯 O DESAFIO:</div>
                         <p className="text-xl font-bold leading-tight">{activeChallenge.theme}</p>
                         <p className="mt-4 text-gray-400 font-medium">{activeChallenge.task}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-30 px-4">Sua Resposta:</div>
                      <textarea 
                        className="w-full bg-[#0A0A0F] border border-white/10 rounded-[32px] p-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all min-h-[250px] resize-none shadow-2xl"
                        placeholder="Escreva sua resposta aqui..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={showGabarito}
                      />
                      
                      {!showGabarito ? (
                        <button 
                            disabled={!answer.trim() || loadingFeedback}
                            onClick={handleFeedback}
                            className="w-full bg-primary py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                        >
                            {loadingFeedback ? <RefreshCw className="animate-spin" size={16} /> : "ENVIAR PARA AVALIAÇÃO"}
                        </button>
                      ) : (
                        <div className="space-y-12 py-10 border-t border-white/5">
                           {feedback && (
                             <div className="p-10 glass rounded-[48px] border-primary/20 bg-primary/5">
                                <h3 className="text-2xl font-display font-black italic mb-6 text-primary flex items-center gap-3">
                                   <Zap size={24} /> Feedback da Malu IA
                                </h3>
                                <div className="markdown-body">
                                   <Markdown>{feedback}</Markdown>
                                </div>
                             </div>
                           )}

                           <div className="space-y-10">
                              <h3 className="text-2xl font-display font-black italic mb-6 flex items-center gap-3">
                                 <CheckCircle2 size={24} className="text-success" /> Gabarito Comentado
                              </h3>
                              
                              <div className="grid gap-6">
                                 {activeChallenge.gabarito.examples.map((ex, i) => (
                                   <div key={i} className="p-8 glass rounded-[32px] border-white/5 bg-white/[0.02]">
                                      <h4 className="text-lg font-bold mb-4 italic text-success">{ex.title}</h4>
                                      <p className="text-sm italic text-gray-400 mb-6 bg-white/5 p-6 rounded-2xl">"{ex.text}"</p>
                                      <p className="text-xs font-medium border-l-2 border-success pl-4">{ex.analysis}</p>
                                   </div>
                                 ))}
                              </div>

                              <div className="p-8 glass rounded-[32px] border-white/5 bg-white/[0.01]">
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">💡 LIÇÕES DESSE EXERCÍCIO</h4>
                                 <p className="text-sm font-medium text-gray-400 italic">"{activeChallenge.gabarito.lessons}"</p>
                              </div>

                              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                 <div className="text-[10px] font-black uppercase text-accent">PRÓXIMO PASSO: {activeChallenge.gabarito.next}</div>
                                 <button 
                                    onClick={() => {setSelectedId(null); setAnswer(""); setShowGabarito(false); setFeedback(null);}}
                                    className="p-4 px-10 glass rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                                 >
                                    Fazer Outro Desafio
                                 </button>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 mt-12 mb-20 animate-in fade-in duration-700">
            <SectionHeader 
                badge="🏋️ ACADEMIA DO 1000" 
                title="Treinos Práticos Reais" 
                subtitle="Mini-desafios que desenvolvem habilidades específicas da redação nota 1000." 
            />

            <div className="flex flex-center justify-center gap-4 mb-16">
                {[
                    { id: 'iniciante', label: 'Iniciante', icon: <Target size={14} />, color: 'primary' },
                    { id: 'intermediario', label: 'Intermediário', icon: <Sparkles size={14} />, color: 'secondary' },
                    { id: 'avancado', label: 'Avançado', icon: <Trophy size={14} />, color: 'accent' }
                ].map((l) => (
                    <button 
                        key={l.id}
                        onClick={() => setLevel(l.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-sm font-black uppercase tracking-widest transition-all ${level === l.id ? `bg-${l.color} text-${l.color === 'accent' ? 'bg-dark' : 'white'} scale-105 shadow-xl shadow-${l.color}/20` : 'glass opacity-40 hover:opacity-100'}`}
                    >
                        {l.icon} {l.label}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {CHALLENGES_DATA[level].map((challenge) => (
                    <button 
                        key={challenge.id}
                        onClick={() => setSelectedId(challenge.id)}
                        className="glass p-10 rounded-[48px] border-white/5 hover:border-primary/20 transition-all text-left flex flex-col justify-between group h-full relative overflow-hidden"
                    >
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <span className="p-2 bg-white/5 text-[9px] font-black uppercase rounded-lg border border-white/10">{challenge.type}</span>
                                <span className="text-[10px] font-bold opacity-30 flex items-center gap-1 font-mono tracking-tighter"><Clock size={12} /> {challenge.time}</span>
                            </div>
                            <h3 className="text-2xl font-display font-black italic tracking-tighter leading-tight group-hover:text-primary transition-colors">{challenge.title}</h3>
                            <div className="space-y-4">
                                <div className="text-[9px] font-black uppercase opacity-20 tracking-widest">Tema Sugerido</div>
                                <p className="text-xs font-bold text-gray-500 line-clamp-2 italic leading-relaxed">"{challenge.theme}"</p>
                            </div>
                        </div>
                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                            <div className="text-[9px] font-black uppercase text-primary tracking-widest">Comp: {challenge.competence}</div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Plus size={20} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="max-w-4xl mx-auto p-12 glass rounded-[64px] border-primary/20 bg-primary/5 text-center space-y-6 mt-20">
                <ShieldCheck size={48} className="text-primary mx-auto opacity-40 mb-4" />
                <h4 className="text-2xl font-display font-black italic tracking-tighter">Pratique para a Perfeição</h4>
                <p className="text-gray-400 font-medium leading-relaxed max-w-xl mx-auto">
                    A redação é uma escada que se sobe um degrau por vez. <br/> Escolha um desafio acima e comece seu treino de hoje.
                </p>
            </div>
        </div>
    );
};

const RedacoesView = () => {
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <div className="space-y-12 mt-12 mb-20">
            <div className="grid md:grid-cols-2 gap-8">
               {REDACOES_MODELO.map((red, i) => (
                  <div 
                    key={i} 
                    className="glass p-8 rounded-[48px] border-white/5 flex flex-col justify-between hover:border-success/20 transition-all group cursor-pointer"
                    onClick={() => setSelected(i)}
                  >
                     <div className="space-y-6">
                        <div className="flex justify-between items-start">
                           <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                              <FileText size={24} />
                           </div>
                           <div className="text-right">
                              <div className="text-[9px] font-black uppercase opacity-40 mb-1">Nota ENEM</div>
                              <div className="text-2xl font-display font-black text-success">{red.note}</div>
                           </div>
                        </div>
                        <h3 className="text-2xl font-display font-black italic tracking-tighter group-hover:text-success transition-colors">{red.title}</h3>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">{red.theme}</p>
                     </div>
                     <div className="mt-12 group-hover:translate-x-2 transition-transform text-success text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        Ver Análise Completa <ArrowRight size={14} />
                     </div>
                  </div>
               ))}
            </div>

            <AnimatePresence>
               {selected !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="glass p-12 rounded-[64px] border-success/20 relative"
                  >
                     <button onClick={() => setSelected(null)} className="absolute top-10 right-10 opacity-40 hover:opacity-100"><X size={24} /></button>
                     <div className="grid lg:grid-cols-[1fr_350px] gap-16">
                        <div className="space-y-8">
                           <div className="space-y-2">
                              <h2 className="text-4xl font-display font-black italic tracking-tighter text-success">{REDACOES_MODELO[selected].title}</h2>
                              {REDACOES_MODELO[selected].author && (
                                 <p className="text-xs font-black uppercase tracking-widest text-success/60">Autor(a): {REDACOES_MODELO[selected].author}</p>
                              )}
                           </div>
                           <div className="bg-white/5 p-10 rounded-[40px] text-sm font-medium leading-relaxed text-gray-300 italic relative whitespace-pre-wrap">
                              <Quote className="absolute -top-4 -left-4 text-success opacity-20" size={48} />
                              {REDACOES_MODELO[selected].text}
                           </div>
                        </div>
                        <div className="space-y-10">
                           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-success italic">Análise do Professor</h3>
                           {Object.entries(REDACOES_MODELO[selected].analysis).map(([key, val], i) => (
                              <div key={i} className="space-y-2">
                                 <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{key}</div>
                                 <p className="text-xs font-medium leading-relaxed">{val}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
        </div>
    )
}


// --- REDIRECT VIEW ---
const SuccessRedirect = ({ email }: { email: string }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URL(KIWIFY_CHECKOUT_URL);
      url.searchParams.append('email', email);
      window.location.href = url.toString();
    }, 3000);
    return () => clearTimeout(timer);
  }, [email]);

  return (
    <div className="fixed inset-0 z-[200] bg-bg-dark flex items-center justify-center p-6 selection:bg-primary/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[160px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-10 relative z-10"
      >
        <div className="relative mx-auto w-32 h-32">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="w-full h-full bg-gradient-to-tr from-primary to-secondary rounded-[40px] flex items-center justify-center shadow-[0_20px_50px_rgba(255,0,102,0.4)] rotate-6"
          >
            <CheckCircle2 size={64} className="text-white" />
          </motion.div>
          <div className="absolute -top-4 -right-4 bg-white text-bg-dark p-2 rounded-xl shadow-xl animate-bounce">
            <Sparkles size={20} className="text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black italic tracking-tighter leading-tight">
            CONTA CRIADA <br/>
            <span className="text-gradient">COM SUCESSO!</span>
          </h2>
          <p className="text-gray-400 text-lg font-medium">
            Sua vaga na elite está garantida. <br/>
            <span className="text-white">Você será redirecionado para finalizar sua assinatura...</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
            <RefreshCw className="animate-spin" size={12} /> Preparando Checkout Seguro
          </div>
        </div>
      </motion.div>
    </div>
  );
};


// --- OFFER VIEW ---
const BenefitsOffer = ({ user, onLogout, manualVerify, isVerifying }: { user: any, onLogout: () => void, manualVerify: () => void, isVerifying: boolean }) => {
  const benefits = [
    { 
      icon: <Sparkles className="text-primary" />, 
      title: "Malu IA Corretora", 
      desc: "Feedback instantâneo seguindo as 5 competências do ENEM." 
    },
    { 
      icon: <BookOpen className="text-secondary" />, 
      title: "Guia Emergencial", 
      desc: "O atalho de 30 páginas com as fórmulas prontas para o 1000." 
    },
    { 
      icon: <Trophy className="text-accent" />, 
      title: "Repertórios Curinga", 
      desc: "Citações e argumentos que encaixam em qualquer tema." 
    },
    { 
      icon: <CheckCircle2 className="text-success" />, 
      title: "Redações Comentadas", 
      desc: "Exemplos de nota 1000 analisados linha por linha." 
    }
  ];

  const goToCheckout = () => {
    const url = new URL(KIWIFY_CHECKOUT_URL);
    url.searchParams.append('email', user.email);
    window.location.href = url.toString();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-bg-dark overflow-y-auto selection:bg-primary/30">
      <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20 relative">
        {/* BG EFFECTS */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full space-y-12 relative z-10"
        >
          {/* HEADER */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Zap size={12} /> Conta Criada com Sucesso
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter italic">
              BEM-VINDO À ELITE, <br/>
              <span className="text-gradient">FUTURO NOTA 1000!</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Você está a um passo de desbloquear o arsenal completo que vai transformar sua redação em tempo recorde.
            </p>
          </div>

          {/* BENEFITS GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="glass p-8 rounded-[32px] border-white/5 flex gap-6 items-start hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-xl font-display font-black mb-1 italic tracking-tight">{b.title}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA BOX */}
          <div className="glass p-10 md:p-16 rounded-[48px] border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/5 text-center space-y-10">
            <div className="space-y-4">
              <div className="text-2xl font-display font-medium line-through opacity-20">R$ 197,00</div>
              <div className="text-7xl md:text-8xl font-display font-black tracking-tighter">R$ 29,90</div>
              <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Acesso Vitalício • Pagamento Único</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <button 
                onClick={goToCheckout}
                className="w-full bg-primary text-white py-8 rounded-[32px] text-2xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,0,102,0.4)] flex items-center justify-center gap-4 group"
              >
                DESBLOQUEAR TUDO <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary animate-pulse mb-2">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   Sincronizando com banco de dados...
                </div>
                <button 
                  onClick={manualVerify}
                  disabled={isVerifying}
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 flex items-center justify-center gap-2"
                >
                  {isVerifying ? <RefreshCw className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                  Já comprei, verificar meu e-mail
                </button>
                <button onClick={onLogout} className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">
                  Sair da conta
                </button>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 grid grid-cols-3 gap-4 opacity-30 text-[9px] font-black uppercase tracking-widest mt-12">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={16} />
                <span>Compra Segura</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Clock size={16} />
                <span>Liberação Imediata</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Trophy size={16} />
                <span>Garantia 7 Dias</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- AUTH VIEWS ---
const AuthScreen = ({ mode, onClose, setMode }: { mode: 'login' | 'signup', onClose: () => void, setMode: (m: 'login' | 'signup') => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    let url = "";
    let key = "";

    // Prioridade total: Tentar pegar do servidor para garantir chaves reais
    try {
      const response = await fetch('/api/config/supabase');
      const data = await response.json();
      if (data.url && data.key && !data.url.includes("your-project-id")) {
        url = data.url;
        key = data.key;
        updateSupabaseConfig(url, key);
        console.log("✅ Configuração Supabase carregada do servidor.");
      }
    } catch (err) {
      console.warn("⚠️ Falha ao buscar config do servidor, tentando local:", err);
    }

    // Fallback para build-time ou global
    if (!url) {
      url = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.url || import.meta.env.VITE_SUPABASE_URL || "";
      key = (window as any).__SUPABASE_DYNAMIC_CONFIG__?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || "";
    }
    
    // Validação permissiva
    const isUrlMissing = !url || url.length < 10 || !url.startsWith('http');
    const isKeyMissing = !key || key.length < 20;
    const isPlaceholder = url.includes("your-project-id") || key.includes("your-anon-public-key");

    if (isUrlMissing || isKeyMissing || isPlaceholder) {
      console.error("❌ Falha na validação das chaves:", { url: url ? "PRESENTE" : "MISSING", key: key ? "PRESENTE" : "MISSING" });
      toast.error("Configuração do Banco de Dados não detectada", {
        description: "Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no menu 'Settings' -> 'Environment Variables' e reinicie o app."
      });
      setAuthLoading(false);
      return;
    }

    const client = getSupabase();
    
    // Limpar e-mail e senha de espaços em branco acidentais
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    try {
      if (mode === 'signup') {
        const { data, error } = await client.auth.signUp({ 
          email: cleanEmail, 
          password: cleanPassword,
          options: { emailRedirectTo: window.location.origin }
        });
        
        if (error) {
          // Se o erro for rate limit, damos uma explicação amigável
          if (error.message?.includes("rate limit exceeded")) {
             toast.error("Limite de segurança atingido", {
               description: "O Supabase bloqueou novos cadastros temporariamente para evitar spam. Por favor, aguarde de 15 a 30 minutos e tente novamente com este mesmo e-mail."
             });
             return;
          }
          throw error;
        }

        // Se o Supabase retornar uma sessão imediatamente (confirmação desativada), logamos o usuário
        if (data?.session) {
          setShowSuccess(true);
        } else {
          setShowSuccess(true); // Mostramos sucesso para o redirecionamento mesmo sem sessão imediata
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ 
          email: cleanEmail, 
          password: cleanPassword 
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        onClose();
      }
    } catch (err: any) {
      console.error("Auth process error detail:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        clientUrl: (client as any).supabaseUrl
      });
      
      if (err.message?.includes("Invalid path")) {
        toast.error("Erro de configuração no Supabase", {
          description: "O endereço (URL) do Supabase parece estar incorreto ou mal formatado. Verifique se ele termina em .supabase.co e não possui caminhos extras."
        });
      } else if (err.message === "Failed to fetch") {
        toast.error("Erro de conexão (Failed to fetch). Verifique se o seu projeto Supabase não está pausado e se sua internet permite conexões externas.");
        console.error("Connectivity issue with Supabase. Active Client URL:", (client as any).supabaseUrl);
      } else if (err.message?.includes("Invalid login credentials")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (err.message?.includes("Email address") && err.message?.includes("invalid")) {
        toast.error("O formato do e-mail é inválido. Verifique se digitou corretamente.");
      } else if (err.message?.includes("rate limit exceeded")) {
        toast.error("Limite de segurança atingido", {
          description: "O Supabase bloqueou novos e-mails temporariamente para evitar spam. Por favor, aguarde cerca de 15 minutos e tente novamente."
        });
      } else {
        toast.error(err.message || "Erro no processo de autenticação");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  if (showSuccess) {
    return <SuccessRedirect email={email} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-dark/95 backdrop-blur-xl transition-all">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass w-full max-w-md p-10 py-16 rounded-[48px] border-white/5 relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <div className="bg-primary w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-[0_0_20px_rgba(255,0,102,0.4)]">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-4xl font-display font-black italic tracking-tighter mb-2">
            {mode === 'signup' ? 'Nova Conta' : 'Área do Aluno'}
          </h2>
          <p className="text-sm text-gray-400 font-medium">{mode === 'signup' ? 'Junte-se à elite da Redação 1000' : 'Entre para continuar seus estudos'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 font-mono">E-mail</label>
            <input 
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-primary/50 font-bold text-sm transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4 font-mono">Senha</label>
            <input 
              required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-primary/50 font-bold text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={authLoading}
            className="w-full bg-primary py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {authLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : mode === 'signup' ? 'CRIAR MINHA CONTA' : 'ACESSAR AGORA'}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-[11px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity hover:text-primary"
          >
            {mode === 'login' ? 'Ainda não tem conta? Clique aqui' : 'Já sou aluno, fazer login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ebook' | 'ia' | 'repertorios' | 'redacoes' | 'exercicios'>('overview');
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch Supabase Config from Server (Fix for AI Studio build-time environment variables)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config/supabase');
        const data = await response.json();
        if (data.url && data.key) {
          console.log("Configuração do Supabase carregada do servidor.");
          updateSupabaseConfig(data.url, data.key);
        }
      } catch (e) {
        console.error("Erro ao buscar configuração dinâmica:", e);
      }
    };
    fetchConfig();
  }, []);

  const isPaid = profile?.status === 'paid' || user?.email === 'matheusfavoretol@gmail.com';

  // Auth Listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        setCheckingPayment(true);
        await checkPaymentStatus(currentUser.email);
        setCheckingPayment(false);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        setCheckingPayment(true);
        await checkPaymentStatus(currentUser.email);
        setCheckingPayment(false);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-verify every 3 seconds if on pending screen (faster for immediate access)
  useEffect(() => {
    let interval: number;
    if (user && !isPaid) {
      // First check immediately
      checkPaymentStatus(user.email);
      
      interval = window.setInterval(() => {
        checkPaymentStatus(user.email);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [user, isPaid]);

  const checkPaymentStatus = async (userEmail: string | undefined) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/check-payment?email=${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error("Falha ao verificar pagamento no servidor");
      const data = await res.json();
      setProfile({ status: data.isPaid ? 'paid' : 'pending' });
      if (data.isPaid) {
        toast.success("Pagamento identificado! Seu acesso foi liberado.");
      }
    } catch (e) {
      console.error("Error checking payment:", e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada!");
  };

  if (loading || checkingPayment) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40 animate-pulse">Sincronizando Acesso...</div>
        </div>
      </div>
    );
  }


  if (user && isPaid) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col selection:bg-primary/30">
        <Toaster position="bottom-right" invert />
        {/* DASHBOARD NAVBAR */}
        <nav className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
             <button onClick={() => setActiveTab('overview')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Trophy className="text-primary w-6 h-6 shadow-[0_0_20px_rgba(255,0,102,0.5)]" />
                <span className="font-display font-black text-xl tracking-tighter uppercase">Área do <span className="text-primary italic">Aluno</span></span>
             </button>
             <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                   <div className="text-[10px] font-black uppercase opacity-40">Estudante Logado</div>
                   <div className="text-xs font-bold text-gradient">{user.email}</div>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                   <X size={18} className="opacity-40" />
                </button>
             </div>
          </div>
        </nav>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <h1 className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tighter">BORA PRO <span className="text-gradient italic">MIL?</span> 🚀</h1>
                  <p className="text-gray-400 font-medium">Seu acesso completo está disponível. Por onde vamos começar hoje?</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="bento-card bg-primary/5 border-primary/20 flex flex-col justify-between group"
                  >
                      <BookOpen size={48} className="text-primary mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Ebook Emergencial</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">O manual exato de 30 páginas para salvar sua nota.</p>
                        <button onClick={() => setActiveTab('ebook')} className="w-full bg-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">ESTUDAR AGORA</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bento-card bg-secondary/5 border-secondary/20 flex flex-col justify-between group"
                  >
                      <MessageSquare size={48} className="text-secondary mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Malu IA Corretora</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Envie sua redação e receba os pontos de melhoria.</p>
                        <button onClick={() => setActiveTab('ia')} className="w-full bg-secondary py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-secondary/20 transition-all hover:scale-105 active:scale-95">CORRIGIR AGORA</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bento-card bg-accent/5 border-accent/20 flex flex-col justify-between group"
                  >
                      <Trophy size={48} className="text-accent mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Repertórios Curinga</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Banco completo de citações que cabem em tudo.</p>
                        <button onClick={() => setActiveTab('repertorios')} className="w-full bg-accent text-bg-dark py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">VER REPERTÓRIOS</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bento-card bg-success/5 border-success/20 flex flex-col justify-between group"
                  >
                      <CheckCircle2 size={48} className="text-success mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Redações 1000</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Modelos nota 1000 comentados linha por linha.</p>
                        <button onClick={() => setActiveTab('redacoes')} className="w-full bg-success py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-success/20 transition-all hover:scale-105 active:scale-95">VER REDAÇÕES</button>
                      </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    className="bento-card bg-white/5 border-white/10 flex flex-col justify-between group"
                  >
                      <Plus size={48} className="text-white opacity-40 mb-12 group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-2xl font-display font-black mb-2 italic">Exercícios Práticos</h3>
                        <p className="text-sm text-gray-400 mb-6 font-medium">Mini-desafios para destravar sua criatividade.</p>
                        <button onClick={() => setActiveTab('exercicios')} className="w-full bg-white/10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-white/20">VER DESAFIOS</button>
                      </div>
                  </motion.div>
                </div>

                <div className="mt-12 p-8 glass border-white/5 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={32} className="text-success shadow-[0_0_20px_rgba(0,255,153,0.3)]" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold italic tracking-tighter">Precisa de ajuda urgente?</h4>
                        <p className="text-sm text-gray-400">Suporte prioritário via WhatsApp disponível.</p>
                      </div>
                  </div>
                  <button className="px-10 py-4 glass rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border-white/10">CHAMAR NO WHATSAPP</button>
                </div>
              </>
            )}

            {activeTab === 'ebook' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <EbookView />
              </motion.div>
            )}
            {activeTab === 'ia' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <IaView />
              </motion.div>
            )}
            {activeTab === 'repertorios' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RepertoireView />
              </motion.div>
            )}
            {activeTab === 'redacoes' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RedacoesView />
              </motion.div>
            )}
            {activeTab === 'exercicios' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ChallengesView />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const handleCTA = () => {
    if (user) {
      if (isPaid) setActiveTab('overview');
      else {
        const url = new URL(KIWIFY_CHECKOUT_URL);
        url.searchParams.append('email', user.email);
        window.location.href = url.toString();
      }
    } else {
      setShowAuth('signup');
    }
  };

  const manualVerify = async () => {
    setIsVerifying(true);
    await checkPaymentStatus(user?.email);
    setIsVerifying(false);
    if (!profile?.status || profile.status === 'pending') {
      toast.info("Ainda não identificamos seu pagamento. Pode levar alguns minutos.");
    } else {
      toast.success("Pagamento identificado! Divirta-se.");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Toaster position="bottom-right" theme="dark" />
      <Nav onAction={handleCTA} />
      
      <AnimatePresence>
        {showAuth && (
          <AuthScreen 
            mode={showAuth} 
            onClose={() => setShowAuth(null)} 
            setMode={(m) => setShowAuth(m)}
          />
        )}
        {user && !isPaid && (
          <BenefitsOffer 
            user={user} 
            onLogout={handleLogout} 
            manualVerify={manualVerify} 
            isVerifying={isVerifying} 
          />
        )}
      </AnimatePresence>
      
      {/* GLOWS */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[180px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* HERO SECTION */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full mb-12 border-white/5 shadow-2xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-[0.2em] italic">🔥 Já somos +500 alunos rumo ao 1000</span>
            </div>
            
            <h1 className="text-6xl md:text-[86px] font-display font-black leading-[0.85] mb-12 tracking-tighter">
              A Redação do <br/>
              <span className="text-gradient">ENEM sem drama.</span>
            </h1>
            
            <h2 className="text-2xl text-gray-400 mb-16 leading-relaxed font-medium max-w-xl">
              Como alunos PASSARAM de 600 para 900+ em redação ENEM. Mesmo quem sempre foi "péssimo" em português.
              <br/><br/>
              <span className="text-white">Descubra o método que já ajudou 12.847 alunos a escrever redações nota 950+ em apenas 7 dias.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={handleCTA}
                className="w-full sm:w-auto bg-primary text-white p-8 px-14 rounded-[40px] text-2xl font-display font-black flex items-center justify-center gap-4 hover:scale-110 hover:shadow-[0_30px_60px_rgba(255,0,102,0.4)] transition-all active:scale-95 group"
              >
                QUERO MINHA REDAÇÃO NOTA 10 <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28} />
              </button>
              
              <div className="flex flex-col gap-2 items-center sm:items-start group">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-accent text-accent" />)}
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">OFERTA VÁLIDA POR TEMPO LIMITADO</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-secondary/10 blur-[120px] rounded-full z-0" />
            <div className="glass rounded-[64px] border-white/5 p-2 animate-float relative z-10 shadow-2xl">
               <div className="bg-[#0A0A0F] rounded-[62px] aspect-[4/5] overflow-hidden flex flex-col border border-white/10">
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                          <Sparkles size={24} className="text-white" />
                        </div>
                        <div>
                           <div className="text-xs font-black uppercase">Malu AI</div>
                           <div className="text-[10px] font-mono opacity-30">CORRETORA v3.0</div>
                        </div>
                     </div>
                     <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  </div>
                  
                  <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                     <div className="flex justify-end">
                        <div className="bg-white/5 p-4 rounded-3xl rounded-tr-none border border-white/5 max-w-[80%]">
                           <p className="text-xs italic text-gray-400">"Malu, meu desenvolvimento tá meio fraco. O que eu faço?"</p>
                        </div>
                     </div>
                     <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       className="bg-primary/10 p-6 rounded-3xl rounded-tl-none border border-primary/20 max-w-[90%] relative"
                     >
                        <p className="text-sm font-medium leading-relaxed mb-6">
                          "Amigão, seu argumento tá mais raso que prato de sobremesa! 😂 Cadê o repertório? Tente usar o Bauman para conectar com a fluidez do tema. BORA!"
                        </p>
                        <div className="flex gap-2">
                           <div className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase rounded-full">Nota: 640 🔥</div>
                           <div className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase rounded-full">Melhorar C3 🚀</div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-full bg-primary/20 blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-full bg-secondary/20 blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-24 relative z-10">
          {[
            { v: "500+", l: "Alunos Aprovados", sub: "Estudando com o método" },
            { v: "12.847", l: "Análises de IA", sub: "Correções precisas MALU" },
            { v: "4.9/5", l: "Satisfação Geral", sub: "Nota média dos usuários" }
          ].map((s, i) => (
            <div key={i} className="group">
              <div className="text-7xl font-display font-black text-gradient block mb-4 group-hover:scale-110 transition-transform">
                <AnimatedCounter value={s.v} />
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.3em] text-white mb-2">{s.l}</div>
              <div className="text-[10px] font-medium uppercase tracking-widest opacity-30">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM PREVIEW - "PROOF" SECTION */}
      <section className="py-40 px-6 relative overflow-hidden bg-bg-dark">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
         
         <SectionHeader 
           badge="PROVA DE COMO É" 
           title="O Coração do Red 1000 Pro" 
           subtitle="Esqueça plataformas confusas. Aqui você tem um ecossistema completo focado em uma única coisa: Sua Aprovação."
         />
         
         <div className="max-w-7xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-[52px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="glass rounded-[50px] border-white/5 p-4 animate-float relative z-10">
               <div className="bg-[#050508] rounded-[42px] overflow-hidden border border-white/10 shadow-3xl">
                  {/* Mock UI Header */}
                  <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.03]">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40" />
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="hidden sm:flex gap-4">
                           <div className="w-20 h-2 bg-white/10 rounded-full" />
                           <div className="w-20 h-2 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20" />
                     </div>
                  </div>
                  
                  {/* Mock App Content */}
                  <div className="flex flex-col md:flex-row h-[600px]">
                     {/* Sidebar */}
                     <div className="w-72 border-r border-white/5 p-8 space-y-8 hidden md:block bg-white/[0.01]">
                        <div className="space-y-3">
                           <div className="h-2 w-1/3 bg-primary/30 rounded-full" />
                           <div className="h-8 w-full bg-white/5 rounded-xl" />
                        </div>
                        <div className="space-y-6 pt-8">
                           {[1,2,3,4,5].map(i => (
                              <div key={i} className="flex gap-4 items-center opacity-40">
                                 <div className="w-8 h-8 rounded-lg bg-white/5" />
                                 <div className="h-2 flex-1 bg-white/5 rounded-full" />
                              </div>
                           ))}
                        </div>
                     </div>
                     
                     {/* Main Area */}
                     <div className="flex-1 p-8 md:p-12 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-12">
                           <div className="space-y-3">
                              <div className="h-10 w-64 bg-white/10 rounded-2xl" />
                              <div className="h-4 w-48 bg-white/5 rounded-lg" />
                           </div>
                           <div className="px-6 py-3 bg-success/20 text-success rounded-full text-[10px] font-black uppercase tracking-widest border border-success/20">
                              Módulo Concluído
                           </div>
                        </div>
                        
                        <div className="grid md:grid-cols-12 gap-10 flex-1">
                           <div className="md:col-span-12 lg:col-span-7 space-y-6">
                              <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 space-y-4 h-full">
                                 <div className="h-2 w-1/4 bg-primary/40 rounded-full" />
                                 <div className="space-y-3 pt-4">
                                    <div className="h-3 w-full bg-white/5 rounded-full" />
                                    <div className="h-3 w-full bg-white/5 rounded-full" />
                                    <div className="h-3 w-3/4 bg-white/5 rounded-full" />
                                    <div className="h-3 w-full bg-white/5 rounded-full opacity-50" />
                                    <div className="h-3 w-5/6 bg-white/5 rounded-full opacity-20" />
                                 </div>
                              </div>
                           </div>
                           <div className="hidden lg:flex lg:col-span-5 flex-col gap-6">
                              <div className="p-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[32px] border border-white/10 flex flex-col items-center justify-center text-center space-y-4 flex-1">
                                 <div className="text-6xl font-display font-black text-white italic">980</div>
                                 <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sua Nota Estimada</div>
                              </div>
                              <div className="p-6 bg-[#0A0A0F] rounded-[32px] border border-white/10 space-y-4">
                                 <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success" />
                                    <div className="w-2 h-2 rounded-full bg-success opacity-50" />
                                    <div className="w-2 h-2 rounded-full bg-success opacity-20" />
                                 </div>
                                 <p className="text-[11px] text-gray-400 font-medium italic leading-relaxed">
                                    "Malu detectou que sua C3 está perfeita, mas podemos melhorar um pouco a coesão no 2º parágrafo para chegar no 1000 absoluto."
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Decorative Floaters */}
               <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -left-12 glass p-6 rounded-3xl border-primary/20 shadow-2xl z-20 hidden xl:block"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center"><Zap size={24} className="text-primary" /></div>
                     <div>
                        <div className="text-xs font-black text-white">IA Corretora</div>
                        <div className="text-[9px] font-black uppercase opacity-40">Malu Ativa</div>
                     </div>
                  </div>
               </motion.div>
               
               <motion.div 
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 -right-10 glass p-6 rounded-3xl border-secondary/20 shadow-2xl z-20 hidden xl:block"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center"><BookOpen size={24} className="text-secondary" /></div>
                     <div>
                        <div className="text-xs font-black text-white">Guia 1000</div>
                        <div className="text-[9px] font-black uppercase opacity-40">30 Págs de Ouro</div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* THE BENTO SECTION */}
      <section id="features" className="py-32 px-6">
         <SectionHeader 
           badge="⚡ O ARSENAL DO 1000" 
           title="Tudo o que você desbloqueia hoje" 
           subtitle="Chega de perder tempo com teoria chata. O curso é focado em prática e resultado imediato."
         />
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bento-card flex flex-col justify-end bg-gradient-to-br from-primary/10 to-transparent min-h-[450px] relative overflow-hidden group">
               <div className="absolute top-10 right-10 text-[180px] opacity-10 group-hover:scale-110 transition-transform duration-700">🤖</div>
               <div className="relative z-10">
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-lg border border-primary/20 mb-6 inline-block">INTELIGÊNCIA ARTIFICIAL</span>
                  <h3 className="text-4xl font-display font-black mb-4 italic">Corretor com IA Integrada</h3>
                  <p className="text-gray-400 font-medium text-xl leading-relaxed max-w-xl">
                    Envie sua redação e receba feedback automático em 2 minutos. Identifica falhas na estrutura, argumentação, coesão e gramática.
                  </p>
               </div>
            </div>
            
            <div className="md:col-span-4 bento-card flex flex-col justify-between group">
               <div className="text-6xl group-hover:scale-125 transition-transform">📚</div>
               <div>
                  <h3 className="text-2xl font-display font-black mb-3 italic">Redações Nota 1000</h3>
                  <p className="text-sm text-gray-400">Estude redações nota 950-1000 do ENEM 2023-2024. Cada uma com análise completa.</p>
               </div>
            </div>

            <div className="md:col-span-12 bento-card flex flex-col justify-center bg-secondary/5 border-secondary/20 min-h-[250px] group text-center relative overflow-hidden">
               <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-[150px] opacity-5 group-hover:scale-110 transition-transform">🎯</div>
               <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform inline-block">🎯</div>
                  <h3 className="text-4xl font-display font-black mb-4 italic">Estruturas que Funcionam</h3>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">Planilha 'copy-paste' com 5 estruturas validadas para qualquer tema do ENEM. Do 0 ao 950+ sem complicação.</p>
               </div>
            </div>
         </div>
      </section>

      {/* VALUE PROPOSITION GRID */}
      <section className="py-32 px-6 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {VALUE_PROPS.map((prop, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-8 rounded-[32px] border-white/5 hover:border-primary/30 transition-all group"
                  >
                     <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{prop.icon}</div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">{prop.title}</h4>
                     <p className="text-sm font-bold text-white mb-2">{prop.desc}</p>
                     <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{prop.sub}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-32 px-6">
         <SectionHeader 
           badge="SÓ RESULTADO REAL" 
           title="O que dizem os futuros aprovados" 
         />
         
         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="glass p-10 rounded-[48px] border-white/5 flex flex-col justify-between"
               >
                 <div className="space-y-6">
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-accent text-accent" />)}
                    </div>
                    <p className="text-gray-300 font-medium text-lg leading-relaxed italic">"{t.text}"</p>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <img src={t.avatar} className="w-12 h-12 rounded-2xl bg-white/5" />
                       <div className="text-left">
                          <div className="text-sm font-black uppercase italic">{t.name}</div>
                          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aluno Pro</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[9px] font-black uppercase opacity-40 mb-1">Nota Anterior: {t.before}</div>
                       <div className="text-xl font-display font-black text-primary">MIL: {t.after}</div>
                    </div>
                 </div>
               </motion.div>
            ))}
         </div>
      </section>
      {/* FINAL CTA */}
      <section className="py-48 px-6 relative">
         <div className="absolute top-0 left-1/2 -track-x-1/2 w-px h-48 bg-gradient-to-b from-transparent to-primary" />
         
         <div className="max-w-4xl mx-auto bento-card text-center p-16 md:p-32 border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
               <div className="mb-12">
                  <p className="text-primary font-black uppercase tracking-[0.4em] mb-8 italic text-white leading-relaxed">O ENEM NÃO ESPERA POR VOCÊ</p>
                  <Countdown />
               </div>
               
               <h2 className="text-6xl md:text-8xl font-display font-black mb-12 tracking-tighter leading-[0.8] italic text-white">VAMOS COMEÇAR <br/> <span className="text-gradient">O SEU 1000?</span></h2>
               
               <div className="flex flex-col items-center mb-16">
                  <div className="space-y-4 mb-10">
                     <p className="text-2xl font-display font-medium line-through opacity-20 mb-2">DE R$ 99,90</p>
                     <p className="text-8xl font-display font-black text-white">R$ 29,90</p>
                     <div className="px-6 py-2 bg-success/10 border border-success/20 rounded-full text-[12px] font-black uppercase tracking-widest text-success inline-block mt-4">
                        VOCÊ ECONOMIZA R$ 70,00 (70% OFF)
                     </div>
                  </div>
                  
                  <p className="text-lg text-gray-400 max-w-sm mx-auto font-medium leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                    "Menos do que um café por mês, <br/> mais que sua aprovação."
                  </p>
               </div>

               <div className="max-w-md mx-auto mb-10 pt-8">
                 <button 
                   onClick={handleCTA}
                   className="w-full bg-primary text-white py-10 rounded-[48px] text-3xl font-display font-black hover:scale-105 active:scale-95 transition-all shadow-[0_30px_100px_rgba(255,0,102,0.3)] group flex items-center justify-center gap-4"
                 >
                   QUERO MEU 1000 AGORA! <ArrowRight className="group-hover:translate-x-2 transition-transform" size={32} />
                 </button>
               </div>

               <div className="p-8 glass rounded-3xl border-success/20 bg-success/5 mt-12 max-w-xl mx-auto flex flex-col md:flex-row items-center gap-8 text-left">
                  <div className="w-16 h-16 bg-success rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-success/20 group hover:rotate-12 transition-transform">
                     <ShieldCheck className="text-white" size={32} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black uppercase tracking-widest text-success mb-2">GARANTIA INCONDICIONAL DE 30 DIAS</h4>
                     <p className="text-xs text-gray-400 font-bold leading-relaxed">Se você não sentir evolução na sua escrita em 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.</p>
                  </div>
               </div>
               
               <div className="mt-20 flex justify-center gap-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">
                  <span>● CHECKOUT SEGURO</span>
                  <span>● LIBERAÇÃO IMEDIATA</span>
                  <span>● ACESSO VITALÍCIO</span>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-40 px-6">
        <SectionHeader badge="SÓ RESPOSTA PENSADA" title="Ficou alguma dúvida?" />
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            { 
               q: "Eu sou péssimo em redação, consigo aprender isso?", 
               a: "Absolutamente! Temos alunos que entraram sem saber colocar um ponto final e saíram com nota 900+. Ninguém é péssimo, só te falta o método e as estruturas prontas que o ENEM espera de você." 
            },
            { 
               q: "Quanto tempo preciso estudar por dia?", 
               a: "Apenas 30 minutos. Nossas aulas são diretas ao ponto, sem enrolação. Você começa a ver resultado na clareza do seu texto em 3 dias, não 3 meses." 
            },
            { 
               q: "Vou conseguir nota 950+ mesmo?", 
               a: "Nossos alunos focados têm média de 900-950. Se você seguir o Arsenal e usar as estruturas que fornecemos, sua nota vai disparar naturalmente porque você vai parar de cometer erros 'bobos' de competência." 
            },
            { 
               q: "E se eu comprar e não gostar?", 
               a: "Fica tranquilo. Você tem 30 dias de garantia completa. Se por qualquer motivo sentir que o método não é para você, basta pedir o reembolso. Simples assim, risco zero." 
            },
            { 
               q: "Qual é a diferença entre este curso e outros?", 
               a: "Enquanto outros cursos te vendem horas de teoria chata e gramática pesada, nós te entregamos o que REALMENTE RESOLVE: Estruturas prontas, correções por IA instantâneas e o caminho mais curto para a aprovação." 
            }
          ].map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[40px] border-white/5 hover:border-primary/20 transition-all group"
            >
              <h4 className="text-xl font-bold mb-6 flex items-center gap-4 italic tracking-tight text-white">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform tracking-normal group-hover:bg-primary group-hover:text-white">?</div>
                 {faq.q}
              </h4>
              <p className="text-gray-400 font-medium leading-relaxed pl-14">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-40 py-24 px-12 border-t border-white/5 opacity-50">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
               <Trophy size={20} className="text-primary" />
               <span className="font-display font-black text-xl tracking-tighter uppercase">RED 1000 PRO</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-gray-500">
               <span>© 2024 • MatheuS 1000 PRO</span>
               <a href="#" className="text-primary hover:underline">contato@redacao1000pro.com</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

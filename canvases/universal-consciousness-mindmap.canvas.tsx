import { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Text,
  computeDAGLayout,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type Importance = "core" | "major" | "supporting";

type MindNode = {
  id: string;
  label: string;
  time?: string;
  importance: Importance;
  summary: string;
  detail: string;
};

const LECTURE_META = {
  title: "Universal and Personal Consciousness",
  speaker: "Manly P. Hall",
  date: "16 июля 1958, Los Angeles",
  series: "Exploring Dimensions of Consciousness (лекция 1 из 5)",
  source: "https://www.youtube.com/watch?v=ejIt-XSKUkc",
  duration: "~2 ч",
};

const NODES: MindNode[] = [
  {
    id: "root",
    label: "Универсальное и личное сознание",
    importance: "core",
    summary: "Центральный тезис лекции: человек одновременно живёт в двух измерениях сознания.",
    detail:
      "Manly P. Hall открывает пятилекционный семинар «Exploring Dimensions of Consciousness» (1958). Главная идея: сознание — не побочный продукт мозга, а фундаментальная сила реальности. Каждый человек — локальное проявление универсального принципа жизни. Задача духовной эволюции — расширить личное сознание до осознания своей причастности к целому, не уничтожая индивидуальность, а трансформируя её.",
  },
  {
    id: "define",
    label: "Определение сознания",
    time: "2:25",
    importance: "core",
    summary: "Hall различает сознание как силу бытия и сознание как функцию восприятия.",
    detail:
      "Первый блок лекции посвящён терминологии. Hall подчёркивает, что слово «consciousness» используют хаотично — в быту, науке, философии и религии оно означает разное. В эзотерической традиции сознание — это не просто «осознанность» или «разум», а активная сила, которая: (1) делает возможным бытие, (2) пронизывает все уровни реальности, (3) проявляется в человеке как «Я есть» — центральное свидетельство существования. Тело — «хвостовое приложение сознания» (tail-end appendage): видимая оболочка, в которой отражается невидимое «Я». Без чёткого определения невозможно различить универсальное и личное.",
  },
  {
    id: "universal",
    label: "Универсальное сознание",
    time: "2:25–42:30",
    importance: "core",
    summary: "Единый, безличный, всепроникающий принцип — источник всего сущего.",
    detail:
      "Универсальное сознание (Universal Consciousness) — это абсолютный принцип бытия, который древние называли по-разному: Брахман, Дао, «Единое и Благое», Universal Divinity. Hall описывает его как: (1) безличное — в нём все части служат целому; (2) неограниченное — не связано телом, временем, пространством; (3) творческое — из него «лучится» вся материальная вселенная, как свет из источника; (4) единое — за многообразием явлений стоит одна реальность. В индуистской традиции это Brahman; Atman (душа человека) — искра этого пламени. «Каждый человек отражает вселенную, каждая вселенная отражает абсолют». Универсальное сознание — не абстракция, а живая сила, доступная через внутренний опыт.",
  },
  {
    id: "personal",
    label: "Личное сознание",
    time: "2:25–42:30",
    importance: "core",
    summary: "Индивидуальное «Я» — ограниченная, временная точка зрения на бесконечное.",
    detail:
      "Личное сознание — это локализованное, персональное проявление универсального принципа. Оно связано с: телом, эмоциями, памятью, эго, личными желаниями и страхами. Hall предупреждает: индивидуальность «очень лична, и чем больше её, тем опаснее она становится» — без дисциплины эго захватывает всё внимание. Личность (personality) — самая непостоянная часть человека: она меняется при жизни и распадается при смерти. Но за личностью стоит неуничтожимая искра (Spirit/Monad/Ego «Я ЕСМЬ»), которая переживает тело. Личное сознание — не враг, а школа: через него универсальное познаёт себя в конкретной форме.",
  },
  {
    id: "relation",
    label: "Соотношение универсального и личного",
    time: "2:25–42:30",
    importance: "core",
    summary: "Частное не может стать всеобщим, но всеобщее проявляется через степени и условия.",
    detail:
      "Ключевая формула Hall: «Universals cannot become particulars and particulars cannot become universals, but universals exist according to degrees and particulars exist according to conditions». Человек — микрокосм: в нём отражена структура макрокосма. Три нижних природы (тело, эмоции, ум) соответствуют трём божественным аспектам. Звезда Давида (два треугольника) символизирует соединение духовного и материального в человеке. Цель — не «растворить» личность в пустоте, а расширить её до универсального масштаба: воля личная постепенно воссоединяется с божественной волей. Это Yoga — буквально «союз».",
  },
  {
    id: "yoga",
    label: "Теории Йоги и Веданты",
    time: "42:30",
    importance: "major",
    summary: "Восточная система описывает пути объединения личного «Я» с универсальным.",
    detail:
      "Самый объёмный раздел лекции (~40 мин). Hall систематически разбирает пять ветвей Yoga как практические методы работы с сознанием: Bhakti (союз через любовь и преданность), Hatha (очищение тела и дисциплина), Jnana (познание через мудрость и философию), Raja (царский путь — восемь ступеней к Samadhi), Karma (союз через безличное действие). Веданта добавляет метафизическую рамку: Atman = Brahman. Все пути ведут к одной цели — осознанию единства. Hall подчёркивает, что Западу не хватает «total concept of education» — превращения мёртвых фактов в живое знание.",
  },
  {
    id: "bhakti",
    label: "Bhakti Yoga — путь любви",
    importance: "supporting",
    summary: "Объединение через эмоциональную преданность и служение.",
    detail:
      "Bhakti Yoga — путь сердца. Через любовь, преданность и эмоциональное слияние с божественным личное сознание растворяет барьеры отделённости. Цель — тождество личного и безличного, человеческого и божественного в состоянии бесконечно расширенной любви.",
  },
  {
    id: "hatha",
    label: "Hatha Yoga — путь тела",
    importance: "supporting",
    summary: "Тело как храм; дисциплина формы ради освобождения духа.",
    detail:
      "Hatha — не только асаны и дыхание. Это превращение физического тела в «достойный живой храм вечного Бога». Тело — одежда сознания, подлежащая изменению; отождествление с телом — иллюзия. Но пренебрежение телом тоже ошибка: «нельзя стать слугой дома, в котором живёшь». Дисциплина тела освобождает ум для внутреннего созерцания.",
  },
  {
    id: "jnana",
    label: "Jnana Yoga — путь знания",
    importance: "major",
    summary: "Ум как мост между объектом и субъектом; познание ведёт к мудрости и просветлению.",
    detail:
      "Hall подробно описывает Jnana Yoga: путь от знакомого к вечному. Ум — мост между объектом (внешним) и субъектом (внутренним). Запад переоценивает память; Восток ценит творческие способности, ведущие к внутреннему переживанию сознания. Цепочка: знание → размышление → мудрость → понимание (understanding как «мистическое соучастие») → просветление. «Понимать вселенную научно, но не знать тайну Бытия — значит быть дикарём во дворце». Интервал между личным и универсальным уничтожается «энергичным достижением воли».",
  },
  {
    id: "raja",
    label: "Raja Yoga — царский путь",
    importance: "major",
    summary: "8 ступеней от безвредной жизни до Samadhi — космического сознания.",
    detail:
      "Raja Yoga — «король йог», рекапитулирует все пути. Восемь ступеней: (1) безвредная жизнь, (2) простота и смирение, (3) дисциплина тела, (4) контроль дыхания, (5) отвод чувств внутрь, (6) концентрация ума, (7) правильная медитация, (8) Samadhi — тождество с универсальной жизнью. Финал — полный отказ от личных амбиций; остаются Бог и истина. «Рост — движение к универсальности и постепенный отказ от себя».",
  },
  {
    id: "involution",
    label: "Инволюция и эволюция",
    importance: "major",
    summary: "Involution — жизнь распадается на множество форм; evolution — возвращение к единству.",
    detail:
      "Hall объясняет космический процесс: инволюция — «разбиение одной жизни на множество проявлений» (энергия привязывается к материи, появляется многообразие, иллюзия). Эволюция — обратный процесс: «восстановление единства, возвращение разнообразия к целостности». Иллюзия = многообразие. Реальность = единство. Духовная работа — сознательный разворот от инволюции к эволюции: искать единое в многом, общее основание вещей, «единое за многим». Это труд «тихого ума» и внутреннего самоисследования.",
  },
  {
    id: "philosophy",
    label: "Философская теория",
    time: "1:24:45",
    importance: "major",
    summary: "Западная философия дополняет восточную: сознание как динамическая сила реальности.",
    detail:
      "Hall переходит от йогических систем к западной философской традиции (неоплатонизм, герметизм, платонизм). Сознание — «как хameleon, принимает цвет окружения» — но это не пассивность, а активное участие в формировании реальности. Человек — «существо судьбы, embarked upon eternal quest for self-realization». Философия даёт рациональную структуру для того, что йога переживает опытом. Тело — зеркало, в котором невидимое «Я» созерцает себя. Кровь — «vehicle of consciousness». Каждый атом отражает сознание Бога.",
  },
  {
    id: "objectivity",
    label: "Объективность vs Субъективность",
    time: "1:44:51",
    importance: "core",
    summary: "Духовный путь — постепенный переход от объективного (внешнего) к субъективному (внутреннему).",
    detail:
      "Финальный и, возможно, главный практический тезис. Objectivity — сознание, направленное наружу: восприятие мира через органы чувств, фиксация на феноменах, материальных формах, «мире эффектов». Subjectivity — сознательный поворот внутрь: к причинам, корням, «noumenal sphere of Being». Hall цитирует индуистскую идею «gradual retirement of man from objectivity» — человек постепенно отступает от объективного мира, не теряя тело, но ослабляя его власть над вниманием. Чувства отводятся от материальных объектов к «subjective realities». Это не субъективизм в смысле «всё относительно», а дисциплинированное исследование внутреннего мира причин.",
  },
  {
    id: "kant",
    label: "Категорический императив",
    importance: "supporting",
    summary: "Этический тест: каждый поступок — универсальное правило или личная выгода?",
    detail:
      "Hall использует Kant: перед решением спроси — «если бы все так поступали, был бы мир лучше?» Это практический инструмент балансировки личного и универсального в повседневной жизни. Каждая мысль и действие взвешиваются: служат ли они universal good или personal self-centeredness?",
  },
  {
    id: "practice",
    label: "Практические выводы",
    importance: "major",
    summary: "Сознание тренируется: дисциплина, ретроспекция, медитация, служение целому.",
    detail:
      "Hall завершает лекцию практическими указаниями: (1) Pythagoras — дисциплина ретроспекции (вечерний обзор дня); (2) разворот внимания от внешнего к внутреннему; (3) каждую часть себя рассматривать как отдельную сущность и «обучать» отдельно; (4) творчество — доступ к универсальному сознанию («идея приходит из universal consciousness»); (5) этика служения: «все человечество — брат, всё женское — сестра». Сознание — не статичная сущность, а динамическая сила, которую можно расширять.",
  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: "root", to: "define" },
  { from: "define", to: "universal" },
  { from: "define", to: "personal" },
  { from: "universal", to: "relation" },
  { from: "personal", to: "relation" },
  { from: "relation", to: "yoga" },
  { from: "yoga", to: "bhakti" },
  { from: "yoga", to: "hatha" },
  { from: "yoga", to: "jnana" },
  { from: "yoga", to: "raja" },
  { from: "yoga", to: "involution" },
  { from: "involution", to: "philosophy" },
  { from: "philosophy", to: "objectivity" },
  { from: "objectivity", to: "kant" },
  { from: "objectivity", to: "practice" },
];

const IMPORTANCE_LABEL: Record<Importance, string> = {
  core: "Ключевой",
  major: "Важный",
  supporting: "Вспомогательный",
};

function importanceColor(importance: Importance, theme: ReturnType<typeof useHostTheme>) {
  switch (importance) {
    case "core":
      return theme.accent.primary;
    case "major":
      return theme.text.link;
    default:
      return theme.text.tertiary;
  }
}

function MindMapSvg({
  nodes,
  edges,
  selectedId,
  onSelect,
}: {
  nodes: MindNode[];
  edges: Array<{ from: string; to: string }>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const theme = useHostTheme();

  const layout = useMemo(
    () =>
      computeDAGLayout({
        nodes: nodes.map((n) => ({ id: n.id })),
        edges,
        direction: "vertical",
        nodeWidth: 200,
        nodeHeight: 44,
        rankGap: 72,
        nodeGap: 32,
        padding: 32,
      }),
    [nodes, edges],
  );

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ width: "100%", maxHeight: 520, display: "block" }}
      role="img"
      aria-label="Mind map: Universal and Personal Consciousness"
    >
      {layout.edges.map((edge) => {
        const isBack = edge.isBackEdge;
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={edge.sourceX}
            y1={edge.sourceY}
            x2={edge.targetX}
            y2={edge.targetY}
            stroke={theme.stroke.secondary}
            strokeWidth={1.5}
            strokeDasharray={isBack ? "4 3" : undefined}
          />
        );
      })}

      {layout.nodes.map((ln) => {
        const node = nodeMap.get(ln.id);
        if (!node) return null;
        const isSelected = ln.id === selectedId;
        const color = importanceColor(node.importance, theme);
        const w = 200;
        const h = 44;

        return (
          <g
            key={ln.id}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(ln.id)}
            role="button"
            aria-label={node.label}
          >
            <rect
              x={ln.x}
              y={ln.y}
              width={w}
              height={h}
              rx={6}
              fill={isSelected ? theme.fill.secondary : theme.bg.elevated}
              stroke={isSelected ? color : theme.stroke.primary}
              strokeWidth={isSelected ? 2 : 1}
            />
            <text
              x={ln.x + w / 2}
              y={ln.y + h / 2 - (node.time ? 5 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSelected ? theme.text.primary : theme.text.secondary}
              fontSize={11}
              fontWeight={node.importance === "core" ? 600 : 400}
            >
              {node.label.length > 28 ? node.label.slice(0, 26) + "…" : node.label}
            </text>
            {node.time ? (
              <text
                x={ln.x + w / 2}
                y={ln.y + h / 2 + 12}
                textAnchor="middle"
                fill={theme.text.quaternary}
                fontSize={9}
              >
                {node.time}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function NodeDetail({ node }: { node: MindNode }) {
  const theme = useHostTheme();
  const color = importanceColor(node.importance, theme);
  const paragraphs =
    node.importance === "core" ? 2 : node.importance === "major" ? 1 : 0;

  return (
    <Stack gap={12}>
      <Row gap={8} align="center" wrap>
        <Pill tone={node.importance === "core" ? "info" : "neutral"} size="sm">
          {IMPORTANCE_LABEL[node.importance]}
        </Pill>
        {node.time ? (
          <Text size="small" tone="tertiary">
            {node.time}
          </Text>
        ) : null}
      </Row>

      <Text weight="semibold">{node.summary}</Text>

      <Text size="small" tone="secondary" style={{ lineHeight: 1.65 }}>
        {node.detail}
      </Text>

      {paragraphs >= 1 && node.importance === "core" ? (
        <Card variant="borderless">
          <CardBody>
            <Text size="small" tone="secondary" style={{ lineHeight: 1.6 }}>
              <span style={{ color: color, fontWeight: 500 }}>Почему это центрально: </span>
              {node.id === "root" &&
                "Вся двухчасовая лекция строится вокруг различения и последующего синтеза двух модусов сознания. Без этого различения йога, философия и практика остаются набором несвязанных техник."}
              {node.id === "define" &&
                "Hall тратит первые 40 минут на фундамент: если не определить термин, дальнейший анализ йоги и философии будет говорить о разных вещах под одним словом."}
              {node.id === "universal" &&
                "Универсальное сознание — не «тема» лекции, а онтологический фундамент: всё остальное (йога, этика, объективность) описывает пути доступа к этой реальности."}
              {node.id === "personal" &&
                "Личное сознание — поле, где происходит работа. Hall не отрицает индивидуальность, но показывает её ограниченность и необходимость трансформации."}
              {node.id === "relation" &&
                "Это синтез всей первой части: микрокосм/макрокосм, частица/волна, Atman/Brahman — одна формула в разных традициях."}
              {node.id === "objectivity" &&
                "Финальный блок (~20 мин) — практическая карта: куда именно поворачивать внимание. Это operational conclusion всего семинара."}
            </Text>
          </CardBody>
        </Card>
      ) : null}
    </Stack>
  );
}

export default function UniversalConsciousnessMindmap() {
  const theme = useHostTheme();
  const [selectedId, setSelectedId] = useCanvasState("selectedNode", "root");

  const selected = NODES.find((n) => n.id === selectedId) ?? NODES[0];

  const coreNodes = NODES.filter((n) => n.importance === "core");
  const majorNodes = NODES.filter((n) => n.importance === "major");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
      <Stack gap={6}>
        <H1>{LECTURE_META.title}</H1>
        <Text size="small" tone="secondary">
          {LECTURE_META.speaker} · {LECTURE_META.date} · {LECTURE_META.series}
        </Text>
        <Text size="small" tone="tertiary">
          Источник: MindPodNetwork · {LECTURE_META.duration} ·{" "}
          <span style={{ color: theme.text.link }}>{LECTURE_META.source}</span>
        </Text>
      </Stack>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">нажмите на узел</Text>}>
          Визуальный майндмэп
        </CardHeader>
        <CardBody>
          <MindMapSvg
            nodes={NODES}
            edges={EDGES}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <Row gap={16} wrap style={{ marginTop: 12 }}>
            <Row gap={6} align="center">
              <svg width={12} height={12}>
                <rect width={12} height={12} rx={2} fill={theme.accent.primary} />
              </svg>
              <Text size="small" tone="tertiary">
                Ключевой тезис
              </Text>
            </Row>
            <Row gap={6} align="center">
              <svg width={12} height={12}>
                <rect width={12} height={12} rx={2} fill={theme.text.link} />
              </svg>
              <Text size="small" tone="tertiary">
                Важный
              </Text>
            </Row>
            <Row gap={6} align="center">
              <svg width={12} height={12}>
                <rect width={12} height={12} rx={2} fill={theme.text.tertiary} />
              </svg>
              <Text size="small" tone="tertiary">
                Вспомогательный
              </Text>
            </Row>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>{selected.label}</CardHeader>
        <CardBody>
          <NodeDetail node={selected} />
        </CardBody>
      </Card>

      <H2>Структура лекции по главам YouTube</H2>
      <Grid columns={2} gap={12}>
        {[
          { time: "0:00–42:30", title: "Определение + Универсальное/Личное", pct: 35 },
          { time: "42:30–1:24:45", title: "Йога и Веданта", pct: 35 },
          { time: "1:24:45–1:44:51", title: "Философская теория", pct: 17 },
          { time: "1:44:51–конец", title: "Объективность vs Субъективность", pct: 13 },
        ].map((ch) => (
          <Card key={ch.title}>
            <CardBody>
              <Text size="small" tone="tertiary">
                {ch.time}
              </Text>
              <Text weight="semibold">{ch.title}</Text>
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  borderRadius: 2,
                  background: theme.fill.tertiary,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${ch.pct}%`,
                    height: "100%",
                    background: theme.accent.primary,
                  }}
                />
              </div>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H2>Все ключевые тезисы</H2>
      {coreNodes.map((node) => (
        <CollapsibleSection
          key={node.id}
          title={node.label}
          defaultOpen={node.id === "root"}
        >
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H3>Важные тезисы</H3>
      {majorNodes.map((node) => (
        <CollapsibleSection key={node.id} title={node.label}>
          <Stack gap={8}>
            <Text size="small" tone="tertiary">{node.summary}</Text>
            <NodeDetail node={node} />
          </Stack>
        </CollapsibleSection>
      ))}

      <Card variant="borderless">
        <CardBody>
          <Text size="small" tone="quaternary" style={{ lineHeight: 1.5 }}>
            Анализ основан на структуре видео (главы YouTube), семинаре «Exploring Dimensions of
            Consciousness» (1958), материалах Philosophical Research Society и родственных лекциях
            Hall. Полный автоматический транскрипт недоступен из-за ограничений YouTube API.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

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
  act?: string;
  importance: Importance;
  summary: string;
  detail: string;
};

const META = {
  title: "Жак Фреско",
  subtitle: "Дефицит ресурсов, кризисы экономики и ресурсо-ориентированная экономика",
  essay: "essays/jacque-fresco-resource-economy.md",
  source: "The Venus Project · Designing the Future · The Best That Money Can’t Buy",
  tradition: "Resource-Based Economy (RBE) — термин и смысл введены Жаком Фреско",
};

const NODES: MindNode[] = [
  {
    id: "root",
    label: "Жак Фреско / RBE",
    importance: "core",
    summary:
      "Нужны не деньги, а разумное управление ресурсами Земли как общим наследием человечества.",
    detail:
      "Jacque Fresco (1916–2017) — дизайнер и социальный инженер, основатель The Venus Project. Полный реферат — в essays/jacque-fresco-resource-economy.md. Ядро идеи: дефицит часто искусственный; автоматизация и наука могут дать доступ ко благам без денег, долга и бартера.",
  },
  {
    id: "diagnosis",
    label: "Диагноз системы",
    act: "1",
    importance: "core",
    summary: "Деньги стали целью; политика слабо компетентна в технике; ценности заточены под страх нужды.",
    detail:
      "Если деньги исчезнут, но останутся заводы, почва и люди — производство возможно. Значит, нужны ресурсы и доступ, а не знаки обмена. Политические циклы и идеологии плохо управляют энергией, экологией и логистикой. Страх дефицита порождает жадность, преступность и милитаризм.",
  },
  {
    id: "scarcity",
    label: "Искусственный дефицит",
    act: "2",
    importance: "core",
    summary: "Природную нехватку отличают от дефицита, созданного рынком и плановым устареванием.",
    detail:
      "Природный дефицит — объективный (вода в пустыне без опреснения). Искусственный — плановое устаревание, патенты, ценовой барьер при полных складах, уничтожение «излишков». Фреско: при нынешней технике большинство дефицитов поддерживается правилами денежной экономики.",
  },
  {
    id: "economy",
    label: "Кризисы экономики",
    act: "3",
    importance: "core",
    summary: "Долг, безработица от прогресса, экология vs прибыль, войны за ресурсы.",
    detail:
      "Кредитные циклы наказывают людей за математику денег. Роботы в рыночной системе — угроза зарплате; в RBE — освобождение. Загрязнение выгодно, пока среда «бесплатна». Геополитика ресурсов делает планету игрой с нулевой суммой. Образование готовит потребителей, а не системных мыслителей.",
  },
  {
    id: "rbe",
    label: "Решение: RBE",
    act: "4",
    importance: "core",
    summary: "Общее наследие ресурсов; доступ без денег; научное распределение; автоматизация.",
    detail:
      "Resource-Based Economy: ресурсы Земли — общее наследие; товары и услуги без денег/кредита/бартера; учёт потребностей, запасов и экологических пределов; три опоры — экология, технология, новая мотивация человека. Это не «коммунизм XX века» и не рынок без купюр, а системная инженерия цивилизации.",
  },
  {
    id: "venus",
    label: "Venus Project",
    act: "5",
    importance: "core",
    summary: "Круглые города, ВИЭ, демонстрационные центры и постепенный переход.",
    detail:
      "Концентрические города сокращают пути и встраивают зелёные пояса. Возобновляемая энергия и автоматизация снимают страх нужды. Переход: инвентаризация ресурсов → открытые энергопрограммы → demo-города → новое образование → выход из денежной логики. На практике проект остался исследовательско-пропагандистским.",
  },
  {
    id: "critique",
    label: "Критика",
    importance: "major",
    summary: "Кто задаёт цели? Стимулы без цены? Реализуемость? Риск технократии.",
    detail:
      "Даже «научное» планирование — институт с людьми у руля. Без ценовых сигналов сложнее выявлять предпочтения и редкость. Государства и корпорации не сдадут контроль добровольно. Глобальные модели могут ошибаться системно. Культурный сдвиг не следует автоматически из чертежей. Сторонники отвечают уровнем автоматизации и открытостью знаний — пока это обещание.",
  },
  {
    id: "incentives",
    label: "Новые стимулы",
    importance: "major",
    summary: "Успех = творчество и вклад, а не накопление власти и собственности.",
    detail:
      "Фреско хотел сменить «награду» системы: от богатства и статуса — к самореализации, заботе о среде и пониманию сложных систем. Без этого RBE рискует остаться схемой на бумаге: инженерия городов не заменяет культуру.",
  },
  {
    id: "automation",
    label: "Автоматизация",
    importance: "supporting",
    summary: "В рынке робот крадёт зарплату; в RBE — освобождает время.",
    detail:
      "Ключевой поворот Фреско: технический прогресс сам по себе нейтрален. В денежной рамке он создаёт безработицу и падение спроса. В рамке доступа к ресурсам он снимает вынужденный труд и делает изобилие дешевле экологически и социально.",
  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: "root", to: "diagnosis" },
  { from: "diagnosis", to: "scarcity" },
  { from: "scarcity", to: "economy" },
  { from: "economy", to: "rbe" },
  { from: "rbe", to: "venus" },
  { from: "root", to: "critique" },
  { from: "rbe", to: "incentives" },
  { from: "economy", to: "automation" },
];

const IMPORTANCE_LABEL: Record<Importance, string> = {
  core: "Ключевой",
  major: "Важный",
  supporting: "Вспомогательный",
};

const ILLUSTRATIONS = [
  {
    id: "commons",
    title: "Земля как общее наследие",
    caption: "Планета связана сетью энергии, транспорта и учёта ресурсов",
    file: "assets/fresco/01-earth-commons.jpg",
  },
  {
    id: "scarcity",
    title: "Искусственный дефицит",
    caption: "Производство и свалка разделены барьером цен и долга",
    file: "assets/fresco/02-artificial-scarcity.jpg",
  },
  {
    id: "rbe",
    title: "Ресурсо-ориентированная экономика",
    caption: "Ресурсы → энергия → автоматизация → открытый доступ",
    file: "assets/fresco/03-resource-based-economy.jpg",
  },
  {
    id: "city",
    title: "Круглый город Venus Project",
    caption: "Концентрические кольца жилья, парков и возобновляемой энергии",
    file: "assets/fresco/04-circular-city.jpg",
  },
  {
    id: "abundance",
    title: "Автоматизация и свободное время",
    caption: "Машины производят; люди учатся, творят и живут вместе",
    file: "assets/fresco/05-automated-abundance.jpg",
  },
];

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
        nodeWidth: 188,
        nodeHeight: 44,
        rankGap: 64,
        nodeGap: 28,
        padding: 28,
      }),
    [nodes, edges],
  );

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ width: "100%", maxHeight: 640, display: "block" }}
      role="img"
      aria-label="Майндмэп идей Жака Фреско"
    >
      {layout.edges.map((edge) => (
        <line
          key={`${edge.from}-${edge.to}`}
          x1={edge.sourceX}
          y1={edge.sourceY}
          x2={edge.targetX}
          y2={edge.targetY}
          stroke={theme.stroke.secondary}
          strokeWidth={1.5}
          strokeDasharray={edge.isBackEdge ? "4 3" : undefined}
        />
      ))}

      {layout.nodes.map((ln) => {
        const node = nodeMap.get(ln.id);
        if (!node) return null;
        const isSelected = ln.id === selectedId;
        const color = importanceColor(node.importance, theme);
        const w = 188;
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
              y={ln.y + h / 2 - (node.act ? 5 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSelected ? theme.text.primary : theme.text.secondary}
              fontSize={11}
              fontWeight={node.importance === "core" ? 600 : 400}
            >
              {node.label.length > 26 ? node.label.slice(0, 24) + "…" : node.label}
            </text>
            {node.act ? (
              <text
                x={ln.x + w / 2}
                y={ln.y + h / 2 + 12}
                textAnchor="middle"
                fill={theme.text.quaternary}
                fontSize={9}
              >
                часть {node.act}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function NodeDetail({ node }: { node: MindNode }) {
  return (
    <Stack gap={12}>
      <Row gap={8} align="center" wrap>
        <Pill tone={node.importance === "core" ? "info" : "neutral"} size="sm">
          {IMPORTANCE_LABEL[node.importance]}
        </Pill>
        {node.act ? (
          <Text size="small" tone="tertiary">
            Часть {node.act}
          </Text>
        ) : null}
      </Row>
      <Text weight="semibold">{node.summary}</Text>
      <Text size="small" tone="secondary" style={{ lineHeight: 1.65 }}>
        {node.detail}
      </Text>
    </Stack>
  );
}

export default function JacqueFrescoCanvas() {
  const theme = useHostTheme();
  const [selectedId, setSelectedId] = useCanvasState("selectedNode", "root");
  const selected = NODES.find((n) => n.id === selectedId) ?? NODES[0];
  const storyNodes = NODES.filter((n) => n.act);
  const ideaNodes = NODES.filter((n) => !n.act && n.id !== "root");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
      <Stack gap={6}>
        <H1>{META.title}</H1>
        <Text size="small" tone="secondary">
          {META.subtitle}
        </Text>
        <Text size="small" tone="tertiary">
          {META.source} · полный реферат: {META.essay}
        </Text>
      </Stack>

      <Card>
        <CardHeader>Суть одной фразой</CardHeader>
        <CardBody>
          <Text style={{ lineHeight: 1.6 }}>
            Фреско: большинству не хватает не денег, а доступа к ресурсам. Денежная экономика создаёт
            искусственный дефицит; ресурсо-ориентированная экономика объявляет планету общим
            наследием и распределяет блага через науку и автоматизацию — без долга и зарплатного
            фильтра.
          </Text>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">нажмите на узел</Text>}>
          Карта идей
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
                Ключевой
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
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>{selected.label}</CardHeader>
        <CardBody>
          <NodeDetail node={selected} />
        </CardBody>
      </Card>

      <H2>Пять частей реферата</H2>
      <Grid columns={1} gap={10}>
        {storyNodes.map((node) => (
          <Card key={node.id}>
            <CardBody>
              <Row gap={8} align="center" wrap>
                <Pill size="sm">Часть {node.act}</Pill>
                <Text weight="semibold">{node.label}</Text>
              </Row>
              <Text size="small" tone="secondary" style={{ lineHeight: 1.55, marginTop: 8 }}>
                {node.summary}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H2>Иллюстрации</H2>
      <Text size="small" tone="secondary">
        Образы сопровождают реферат в {META.essay}
      </Text>
      <Grid columns={1} gap={14}>
        {ILLUSTRATIONS.map((ill) => (
          <Card key={ill.id}>
            <CardHeader trailing={<Pill size="sm">{ill.id}</Pill>}>{ill.title}</CardHeader>
            <CardBody>
              <img
                src={ill.file}
                alt={ill.title}
                style={{
                  width: "100%",
                  borderRadius: 8,
                  display: "block",
                  marginBottom: 10,
                }}
              />
              <Text size="small" tone="secondary">
                {ill.caption}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H2>Разбор по частям</H2>
      {storyNodes.map((node) => (
        <CollapsibleSection
          key={node.id}
          title={`Часть ${node.act}. ${node.label}`}
          defaultOpen={node.act === "1"}
        >
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H3>Смежные темы</H3>
      {ideaNodes.map((node) => (
        <CollapsibleSection key={node.id} title={node.label}>
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H2>Ключевые тезисы</H2>
      <Grid columns={2} gap={10}>
        {[
          "Нужны ресурсы и доступ, а не деньги как цель",
          "Дефицит часто искусственный (устаревание, цена, патенты)",
          "Автоматизация в рынке = безработица; в RBE = свобода",
          "Ресурсы планеты — общее наследие всех жителей",
          "RBE: экология + технология + новые стимулы",
          "Города проектируются как система жизнеобеспечения",
          "Переход начинается с инвентаризации и demo-проектов",
          "Критика: технократия, стимулы, политическая реализуемость",
        ].map((item) => (
          <Card key={item} variant="borderless">
            <CardBody>
              <Text size="small" tone="secondary" style={{ lineHeight: 1.5 }}>
                {item}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Card variant="borderless">
        <CardBody>
          <Text size="small" tone="quaternary" style={{ lineHeight: 1.5 }}>
            Опора: {META.source}. {META.tradition}. Интерактивная карта дополняет полный реферат.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

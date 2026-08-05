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
  title: "Дом Индры",
  subtitle: "Миф о дворце, муравьях и смирении царя богов",
  essay: "essays/house-of-indra.md",
  source: "Брахмавайварта-пурана · Кришна-джанма-кханда, гл. 47",
  tradition: "Циммер / Кэмпбелл — классический современный пересказ",
};

const NODES: MindNode[] = [
  {
    id: "root",
    label: "Дом Индры",
    importance: "core",
    summary:
      "Царь богов строит всё более роскошный дворец — и узнаёт, что таких Индр было бесконечно много.",
    detail:
      "Миф из Брахмавайварта-пураны о «сокрушении гордыни Индры». Не про отказ от мира, а про космический масштаб желания: дворец реален, но временен; трон высок, но не вечен. Полный пересказ — в essays/house-of-indra.md.",
  },
  {
    id: "victory",
    label: "Победа над Вритрой",
    act: "1",
    importance: "core",
    summary: "Индра разит демона засухи — и опьяняется собственной славой.",
    detail:
      "Вритра перекрыл воды мира. Индра поразил его ваджрой, реки хлынули снова. Из упоения победой родилась мысль: «Такому герою нужен дворец, какого ещё не видел никто.» Гордыня здесь — не злоба, а опьянение успехом.",
  },
  {
    id: "palace",
    label: "Дворец без конца",
    act: "2",
    importance: "core",
    summary: "Вишвакарман строит Амаравати, а Индра всё требует «ещё».",
    detail:
      "Небесный зодчий возводит мрамор, золото, сады по мысли хозяина. Каждый осмотр — новые крылья, башни, залы. Желание без дна: оба бессмертны, а аппетит Индры — безграничен. Вишвакарман жалуется Брахме; тот обращается к Вишну.",
  },
  {
    id: "boy",
    label: "Мальчик-гость",
    act: "3",
    importance: "core",
    summary: "Вишну является брахманом-мальчиком и спрашивает про «бывших Индр».",
    detail:
      "Гость хвалит дворец и casually замечает: такого ещё ни один Индра не строил. Индра смеётся: «Сколько же Индр ты видел?» Вопрос становится ловушкой — ответом будет урок о бесконечных циклах.",
  },
  {
    id: "ants",
    label: "Парад муравьёв",
    act: "4",
    importance: "core",
    summary: "Бесчисленные миры; каждый муравей когда-то был Индрой.",
    detail:
      "Мальчик рассказывает о kalpa — циклах рождения и гибели вселенных. В каждом мире свой Индра. По залу проходит колонна муравьёв: все они — бывшие цари богов, низведённые кармой. Аскет с кружком волос на груди: каждый волос — жизнь одного Индры.",
  },
  {
    id: "balance",
    label: "Смирение без бегства",
    act: "5",
    importance: "core",
    summary: "Индра останавливает стройку, но остаётся царём — уже другим.",
    detail:
      "Он отпускает Вишвакармана. Хочет уйти в лес — жена и Брихаспати напоминают: миру нужен дождь и порядок. Мудрость — не только отречение. Индра правит, помня о муравьях. Дворец стоит, жажда «ещё грандиознее» утихла.",
  },
  {
    id: "ego",
    label: "Дворец как эго",
    importance: "major",
    summary: "Дом — образ самости: строить можно, путать с центром мира — нельзя.",
    detail:
      "Миф не запрещает дом, карьеру, проект. Он запрещает считать их осью вселенной. «Каждый из нас — в чём-то свой Индра»: вопрос не в том, строить ли дворец, а в том, помним ли мы про муравьёв на полу.",
  },
  {
    id: "karma",
    label: "Карма и циклы",
    importance: "major",
    summary: "Высокий трон — временная роль в бесконечной очереди ролей.",
    detail:
      "Позиция Индры достигается и утрачивается по закону кармы. Гордыня ускоряет падение. Космические циклы (kalpa) делают личную славу пылинкой — не ничтожной, но относительной.",
  },
  {
    id: "desire",
    label: "Желание без дна",
    importance: "supporting",
    summary: "«Ещё чуть пышнее» не имеет естественного предела.",
    detail:
      "Драма стройки — притча о жажде: удовлетворение отодвигается с каждым улучшением. Бессмертие без мудрости только удлиняет пытку бесконечных доработок.",
  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: "root", to: "victory" },
  { from: "victory", to: "palace" },
  { from: "palace", to: "boy" },
  { from: "boy", to: "ants" },
  { from: "ants", to: "balance" },
  { from: "root", to: "ego" },
  { from: "ants", to: "karma" },
  { from: "palace", to: "desire" },
];

const IMPORTANCE_LABEL: Record<Importance, string> = {
  core: "Ключевой",
  major: "Важный",
  supporting: "Вспомогательный",
};

const ILLUSTRATIONS = [
  {
    id: "victory",
    title: "Победа над Вритрой",
    caption: "Индра разит демона; воды снова текут — и рождается гордыня",
    file: "assets/indra/01-indra-victory.jpg",
  },
  {
    id: "palace",
    title: "Дворец без конца",
    caption: "Вишвакарман строит Амаравати; требования Индры растут",
    file: "assets/indra/02-palace-building.jpg",
  },
  {
    id: "boy",
    title: "Мальчик у трона",
    caption: "Вишну в облике брахмана-мальчика входит в зал",
    file: "assets/indra/03-boy-visitor.jpg",
  },
  {
    id: "ants",
    title: "Парад муравьёв",
    caption: "Бывшие Индры проходят по полу нынешнего царя богов",
    file: "assets/indra/04-parade-of-ants.jpg",
  },
  {
    id: "balance",
    title: "Смирение и равновесие",
    caption: "Дворец остаётся; жажда «ещё» уходит",
    file: "assets/indra/05-humility-balance.jpg",
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
      aria-label="Майндмэп мифа о Доме Индры"
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
                акт {node.act}
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
            Акт {node.act}
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

export default function HouseOfIndraCanvas() {
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
          {META.source} · полный пересказ: {META.essay}
        </Text>
      </Stack>

      <Card>
        <CardHeader>Суть одной фразой</CardHeader>
        <CardBody>
          <Text style={{ lineHeight: 1.6 }}>
            Индра строит всё более пышный дворец после победы — и мальчик (Вишну) показывает ему
            парад муравьёв: каждый когда-то был Индрой. Дворец остаётся; бесконечная жажда — нет.
          </Text>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">нажмите на узел</Text>}>
          Карта мифа
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

      <H2>Пять актов истории</H2>
      <Grid columns={1} gap={10}>
        {storyNodes.map((node) => (
          <Card key={node.id}>
            <CardBody>
              <Row gap={8} align="center" wrap>
                <Pill size="sm">Акт {node.act}</Pill>
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
        Образы сопровождают пересказ в {META.essay}
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

      <H2>Сюжет по актам</H2>
      {storyNodes.map((node) => (
        <CollapsibleSection key={node.id} title={`Акт ${node.act}. ${node.label}`} defaultOpen={node.act === "1"}>
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H3>Идеи мифа</H3>
      {ideaNodes.map((node) => (
        <CollapsibleSection key={node.id} title={node.label}>
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H2>Чему учит</H2>
      <Grid columns={2} gap={10}>
        {[
          "Победа опьяняет сильнее поражения",
          "«Ещё чуть пышнее» не имеет дна",
          "Трон — временная роль, не вечная сущность",
          "Карма меняет царей местами с муравьями",
          "Смирение ≠ бегство из мира",
          "Дворец реален; центр вселенной — нет",
          "Строй дом — и помни о полу под ногами",
          "Мудрость: жить в мире, держа космический масштаб",
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
            Опора: {META.source}. {META.tradition}. Интерактивная карта дополняет полный пересказ.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

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
  part?: string;
  importance: Importance;
  summary: string;
  detail: string;
};

const META = {
  title: "Трёхчастный трактат",
  subtitle: "Nag Hammadi I,5 · валентинианская система «изнутри»",
  essay: "essays/tripartite-tractate.md",
  dating: "ок. II пол. III в.",
  length: "~88 стр. рукописи",
};

const NODES: MindNode[] = [
  {
    id: "root",
    label: "Трёхчастный трактат",
    importance: "core",
    summary:
      "Единственный полностью сохранившийся систематический трактат валентинианской гнозы: от Отца — через ущерб Логоса — к восстановлению.",
    detail:
      "Текст без заголовка в рукописи. Название дали издатели: переписчик дважды разделил его декоративными знаками на три акта космической драмы. Это не фрагмент мифа и не пересказ ересеологов, а целостная система. Ценность — в отличиях от схем Иринея/Ипполита: видно, что «валентинианство» было живой семьёй вариантов, а не одной фиксированной мифологией.",
  },
  {
    id: "father",
    label: "Отец",
    part: "I",
    importance: "core",
    summary: "Непостижимый, нерождённый корень Totality — единственный в собственном смысле.",
    detail:
      "Отец прежде всего сущего: без начала и конца, неизменный, неисследимый. Он подобен корню с деревом, ветвями и плодами. Ни одно имя Его не исчерпывает; имена — слава по нашей мере. Он Сам знает Себя; познание Им даруется волей, не вымогается. Трактат настаивает на монадности первоначала — в отличие от многих валентиниан с первичной мужско-женской диадой.",
  },
  {
    id: "son-church",
    label: "Сын и Церковь",
    part: "I",
    importance: "core",
    summary: "Изначальные спутники Отца: Сын открывает, Церковь — множество нетленных духов.",
    detail:
      "Сын — первородный и единственный: форма безформенного, слово несказанного. Церковь здесь — не земная община, а «эоны эонов», сущность, на которой почивает Сын. Вместе это ближе к троичной схеме (Отец—Сын—Церковь), чем к огдоаде пар. Через Сына Totality получает знание, что Отец есть, и способность искать Его.",
  },
  {
    id: "aeons",
    label: "Эоны Плеромы",
    part: "I",
    importance: "major",
    summary: "Бесчисленные и безымянные; сначала — зародыши в мысли Отца, затем — самостоятельные существа.",
    detail:
      "Эманация описана эмбриологически, не арифметически: нет списка из 30 имён. Отец удерживает полноту знания не из зависти, а как школу — иначе эоны погибли бы от внезапного явления. Им даны вера, надежда, любовь, понимание, мудрость. Жизнь Плеромы — гармоничное совместное прославление, порождающее новые «плоды» славы.",
  },
  {
    id: "logos",
    label: "Движение Логоса",
    part: "I",
    importance: "core",
    summary: "Младший эон благо хочет объять непостижимое — и порождает ущерб, тени и силы власти.",
    detail:
      "Падший эон — не София, а Логос. Намерение благое, но он действует вне согласия Полноты и за пределом речи о Отце. Не выдержав света, он сомневается и делится: рождаются копии, фантазмы, жажда власти. Текст запрещает просто осуждать это движение — оно причина предназначенной «организации» мира. Дефект вписан в промысел.",
  },
  {
    id: "conversion",
    label: "Обращение и Спаситель",
    part: "I",
    importance: "major",
    summary: "Metanoia Логоса → молитва → плод согласия эонов = Спаситель/Христос/Свет.",
    detail:
      "Увидев раскол вместо единства, Логос обращается к добру, молится Отцу и братьям. Из согласия Плеромы рождается Возлюбленный — Спаситель. Он совершенствует ущербного, молнией поражает «левых» (хаос/Аид) и даёт надежду «правым». Логос устраивает чины: образы, правые (psychic), левые (hylic).",
  },
  {
    id: "demiurge",
    label: "Демиург",
    part: "I–II",
    importance: "major",
    summary: "Архонт без начальника: думает, что творит сам, а движим духом Логоса.",
    detail:
      "Демиург — изображение Отца Totality: его зовут отец, бог, творец, царь, судья, закон. Он — рука и уста высшего замысла. Радуясь своему делу, он не знает, что движение в нём — от духа. Так трактат объясняет и величие космоса, и слепоту его «бога».",
  },
  {
    id: "human",
    label: "Смешанный человек",
    part: "II",
    importance: "core",
    summary: "Создан в конце как смесь духа, души и материи — для воспитания через зло к знанию.",
    detail:
      "Живая душа — от духовного Логоса, хотя творец считает её своей. Рай — сад тройного порядка. Изгнание и смерть — промысел: кратко пережить великое зло незнания, чтобы принять вечную жизнь и твёрдое знание Totality. Три субстанции: духовная (едина), душевная (двояка), материальная (многообразна).",
  },
  {
    id: "savior",
    label: "Воплощённый Спаситель",
    part: "III",
    importance: "core",
    summary: "Сам принимает смерть и малость; нет отдельного «душевного Христа».",
    detail:
      "Спаситель — образ Единого в телесной форме. Он без греха, но реально воплощён, страдает и сам нуждается в искуплении как человек Церкви — чтобы дать искупление остальным. Искупление = свобода как знание истины, бывшей прежде незнания. Пророки предчувствовали Его приход, но не знали Его вечной природы.",
  },
  {
    id: "three",
    label: "Три рода людей",
    part: "III",
    importance: "core",
    summary: "Духовные, душевные, материальные — природа проявляется ответом на Свет.",
    detail:
      "Духовные сразу бегут к Спасителю и становятся телом Главы. Душевные медлят, учатся голосом и верой; исход возможен к добру. Материальные чужды свету и разрушаются им. Избрание — как брачный чертог со Спасителем; призвание радуется браку извне. Даже некоторые из жаждущих власти могут получить награду через смирение.",
  },
  {
    id: "restore",
    label: "Апокатастасис",
    part: "III",
    importance: "core",
    summary: "Конец подобен началу: единство; Христос — всё во всём.",
    detail:
      "Восстановление нужно людям, ангелам, образам и плеромам. Незнание было педагогикой: Totality устаёт искать Отца своими силами и принимает знание как дар. Крещение в полном смысле — искупление в Отца, Сына и Духа (одеяние, тишина, брачный чертог, незаходящий свет). Hylic силы полезны «на время», затем возвращаются в небытие.",
  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: "root", to: "father" },
  { from: "father", to: "son-church" },
  { from: "son-church", to: "aeons" },
  { from: "aeons", to: "logos" },
  { from: "logos", to: "conversion" },
  { from: "conversion", to: "demiurge" },
  { from: "demiurge", to: "human" },
  { from: "human", to: "savior" },
  { from: "savior", to: "three" },
  { from: "three", to: "restore" },
];

const IMPORTANCE_LABEL: Record<Importance, string> = {
  core: "Ключевой",
  major: "Важный",
  supporting: "Вспомогательный",
};

const ILLUSTRATIONS = [
  {
    id: "father",
    title: "Отец и Плерома",
    caption: "Корень Totality; эоны как ветви света",
    file: "assets/tripartite/01-father-pleroma.jpg",
  },
  {
    id: "logos",
    title: "Движение Логоса",
    caption: "Благое желание за пределом → тени и раскол",
    file: "assets/tripartite/02-logos-fall.jpg",
  },
  {
    id: "demiurge",
    title: "Демиург и творение",
    caption: "Творец думает, что творит сам",
    file: "assets/tripartite/03-demiurge-creation.jpg",
  },
  {
    id: "three",
    title: "Три природы",
    caption: "Отвращение · колебание · узнавание",
    file: "assets/tripartite/04-three-natures.jpg",
  },
  {
    id: "restore",
    title: "Восстановление",
    caption: "Искры возвращаются в Полноту",
    file: "assets/tripartite/05-restoration.jpg",
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
      aria-label="Майндмэп Трёхчастного трактата"
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
              y={ln.y + h / 2 - (node.part ? 5 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSelected ? theme.text.primary : theme.text.secondary}
              fontSize={11}
              fontWeight={node.importance === "core" ? 600 : 400}
            >
              {node.label.length > 26 ? node.label.slice(0, 24) + "…" : node.label}
            </text>
            {node.part ? (
              <text
                x={ln.x + w / 2}
                y={ln.y + h / 2 + 12}
                textAnchor="middle"
                fill={theme.text.quaternary}
                fontSize={9}
              >
                часть {node.part}
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
  return (
    <Stack gap={12}>
      <Row gap={8} align="center" wrap>
        <Pill tone={node.importance === "core" ? "info" : "neutral"} size="sm">
          {IMPORTANCE_LABEL[node.importance]}
        </Pill>
        {node.part ? (
          <Text size="small" tone="tertiary">
            Часть {node.part}
          </Text>
        ) : null}
      </Row>
      <Text weight="semibold">{node.summary}</Text>
      <Text size="small" tone="secondary" style={{ lineHeight: 1.65 }}>
        {node.detail}
      </Text>
      {node.id === "logos" ? (
        <Text size="small" style={{ color: theme.accent.primary, lineHeight: 1.5 }}>
          Отличие от других валентиниан: падший эон — Логос с благим мотивом, не София.
        </Text>
      ) : null}
      {node.id === "savior" ? (
        <Text size="small" style={{ color: theme.accent.primary, lineHeight: 1.5 }}>
          Отличие: нет «душевного Христа»-заменителя; страдает сам воплощённый Спаситель.
        </Text>
      ) : null}
    </Stack>
  );
}

export default function TripartiteTractateCanvas() {
  const theme = useHostTheme();
  const [selectedId, setSelectedId] = useCanvasState("selectedNode", "root");
  const selected = NODES.find((n) => n.id === selectedId) ?? NODES[0];
  const coreNodes = NODES.filter((n) => n.importance === "core");
  const majorNodes = NODES.filter((n) => n.importance === "major");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
      <Stack gap={6}>
        <H1>{META.title}</H1>
        <Text size="small" tone="secondary">
          {META.subtitle}
        </Text>
        <Text size="small" tone="tertiary">
          {META.dating} · {META.length} · полный реферат: {META.essay}
        </Text>
      </Stack>

      <Card>
        <CardHeader>Суть одной фразой</CardHeader>
        <CardBody>
          <Text style={{ lineHeight: 1.6 }}>
            Непостижимый Отец рождает Полноту; Логос благо, но невозможно хочет объять Его — и
            возникает школа космоса; Спаситель являет три природы людей; конец возвращает свет в
            единство начала.
          </Text>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Text size="small" tone="tertiary">нажмите на узел</Text>}>
          Карта драмы
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

      <H2>Три части трактата</H2>
      <Grid columns={3} gap={12}>
        {[
          {
            part: "I",
            pages: "51–104",
            title: "Происхождение",
            body: "Отец, Сын, Церковь, эоны; движение Логоса; обращение; Демиург и чины космоса.",
          },
          {
            part: "II",
            pages: "104–108",
            title: "Человек",
            body: "Смешанное творение; три субстанции; рай, преступление и смерть как промысел.",
          },
          {
            part: "III",
            pages: "108–138",
            title: "Спасение",
            body: "Воплощение; три рода; избрание и призвание; апокатастасис.",
          },
        ].map((p) => (
          <Card key={p.part}>
            <CardBody>
              <Text size="small" tone="tertiary">
                Часть {p.part} · стр. {p.pages}
              </Text>
              <Text weight="semibold">{p.title}</Text>
              <Text size="small" tone="secondary" style={{ lineHeight: 1.55, marginTop: 6 }}>
                {p.body}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <H2>Иллюстрации ключевых моментов</H2>
      <Text size="small" tone="secondary">
        Образы сопровождают полный реферат в essays/tripartite-tractate.md
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

      <H2>Ключевые узлы</H2>
      {coreNodes.map((node) => (
        <CollapsibleSection key={node.id} title={node.label} defaultOpen={node.id === "root"}>
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H3>Важные узлы</H3>
      {majorNodes.map((node) => (
        <CollapsibleSection key={node.id} title={node.label}>
          <NodeDetail node={node} />
        </CollapsibleSection>
      ))}

      <H2>Чем система особенна</H2>
      <Grid columns={2} gap={10}>
        {[
          "Монадный Отец, не первичная диада",
          "Сын + Церковь вместо сложной огдоады имён",
          "Эоны безымянны; эманация как рождение",
          "Падший эон — Логос, не София",
          "Спаситель сам страдает в теле",
          "Промысел, педагогика, икономия спасения",
          "Конец = единство начала (апокатастасис)",
          "Три природы проявляются ответом на Свет",
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
            Опора: Attridge & Mueller (NHL); Thomassen (Nag Hammadi Scriptures); Pearson (Ancient
            Gnosticism); Еланская (рус. перевод). Интерактивная карта дополняет полный реферат.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

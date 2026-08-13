import {
  Card,
  CardBody,
  CardHeader,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Text,
  useHostTheme,
} from "cursor/canvas";

type Source = { label: string; href: string };

const SPECTRUM = [
  {
    title: "Материализм",
    arrow: "Matter → Mind",
    summary: "Физические процессы первичны; сознание — продукт мозга.",
  },
  {
    title: "Дуализм",
    arrow: "Mind ‖ Matter",
    summary: "Два рода реальности; нужна теория взаимодействия.",
  },
  {
    title: "Идеализм",
    arrow: "Mind → Matter",
    summary: "Ум/сознание первичны; материя — явление, форма или эманация.",
  },
] as const;

const HISTORY = [
  {
    title: "Платон / Плотин",
    detail:
      "Чувственный мир — тень идей; эманация Единое → Ум → Душа → космос.",
  },
  {
    title: "Беркли (1710)",
    detail: "Esse est percipi: вещи — идеи в уме; стабильность мира — в уме Бога.",
  },
  {
    title: "Кант / Гегель",
    detail:
      "Формы познания конституируют опыт; Absolute Spirit раскрывается и через природу.",
  },
  {
    title: "Advaita Vedānta",
    detail: "Брахман как чистое сознание; nāma-rūpa — явление на фоне единого.",
  },
] as const;

const MODERN = [
  {
    title: "Kastrup — Analytic Idealism",
    detail:
      "Универсальное сознание — единственный примитив. Личности — диссоциированные альтеры; материя — extrinsic appearance.",
    source: {
      label: "Philosophies 2(2), 2017",
      href: "https://www.mdpi.com/2409-9287/2/2/10",
    } satisfies Source,
  },
  {
    title: "Hoffman — Conscious Realism",
    detail:
      "Объективный мир — сеть conscious agents. «Материя» — интерфейс (иконки), а не срез истины.",
    source: {
      label: "Conscious Realism (UCI)",
      href: "https://sites.socsci.uci.edu/~ddhoff/MindBody",
    } satisfies Source,
  },
  {
    title: "Chalmers — Hard Problem",
    detail:
      "Почему есть субъективный опыт? Для материализма — загадка; для идеализма — стартовая точка.",
    source: {
      label: "JCS 1995",
      href: "https://consc.net/papers/facing.pdf",
    } satisfies Source,
  },
] as const;

const HALL_POINTS = [
  "Сознание — фундаментальная сила, не эпифеномен мозга.",
  "Универсальное сознание «лучится» в материальную вселенную.",
  "Тело — tail-end appendage сознания.",
  "Инволюция: единство → многообразие материи; эволюция: возврат к единству.",
  "Ум — средний план (mercury) между духом и материей.",
] as const;

const KEY_SOURCES: Source[] = [
  {
    label: "SEP: Idealism",
    href: "https://plato.stanford.edu/entries/idealism/",
  },
  {
    label: "OECS: Mind–Body Problem",
    href: "https://oecs.mit.edu/pub/7fjwb5k3",
  },
  {
    label: "Hall 1958 lecture",
    href: "https://www.youtube.com/watch?v=ejIt-XSKUkc",
  },
  {
    label: "Полный реферат (HTML)",
    href: "../essays/mind-leads-to-matter/index.html",
  },
];

export default function MindLeadsToMatterCanvas() {
  const theme = useHostTheme();

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 920, margin: "0 auto" }}>
      <Stack gap={8}>
        <Row gap={8} wrap>
          <Pill tone="info" size="sm">
            Онтология
          </Pill>
          <Pill tone="neutral" size="sm">
            Идеализм
          </Pill>
          <Pill tone="neutral" size="sm">
            Реферат
          </Pill>
        </Row>
        <H1>Mind leads to matter</H1>
        <Text tone="secondary">
          Ум (сознание) онтологически первичен; материя — производное явление, форма или
          эманация ментальной реальности. Не путать с мотивационным «mind over matter».
        </Text>
      </Stack>

      <Card>
        <CardHeader>Ядро тезиса</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              Стрелка бытия идёт{" "}
              <span style={{ fontWeight: 600, color: theme.accent.primary }}>
                Consciousness → Ideas / Forms → Matter
              </span>
              , а не наоборот. Физический мир сохраняет законы и межсубъектность, но
              теряет статус «самодостаточной субстанции вне всякого ума».
            </Text>
            <Text size="small" tone="tertiary">
              Подробный текст с иллюстрациями: essays/mind-leads-to-matter/index.html
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <H2>Спектр ответов на mind–body problem</H2>
      <Stack gap={12}>
        {SPECTRUM.map((item) => (
          <Card key={item.title}>
            <CardBody>
              <Row gap={10} align="center" wrap>
                <Text weight="semibold">{item.title}</Text>
                <Pill
                  tone={item.title === "Идеализм" ? "info" : "neutral"}
                  size="sm"
                >
                  {item.arrow}
                </Pill>
              </Row>
              <Text size="small" tone="secondary" style={{ marginTop: 6 }}>
                {item.summary}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <H2>Историческая линия</H2>
      <Stack gap={10}>
        {HISTORY.map((h) => (
          <Stack key={h.title} gap={4}>
            <H3>{h.title}</H3>
            <Text size="small" tone="secondary">
              {h.detail}
            </Text>
          </Stack>
        ))}
      </Stack>

      <H2>Современные формулировки</H2>
      <Stack gap={12}>
        {MODERN.map((m) => (
          <Card key={m.title}>
            <CardHeader trailing={<Text size="small" tone="tertiary">{m.source.label}</Text>}>
              {m.title}
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">{m.detail}</Text>
                <Text size="small" tone="tertiary">
                  {m.source.href}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <H2>Связь с Manly P. Hall</H2>
      <Card>
        <CardBody>
          <Stack gap={8}>
            <Text size="small" tone="secondary">
              Лекция «Universal and Personal Consciousness» (1958) и родственные тексты
              Hall формулируют тот же вектор: сознание излучает материю; инволюция дробит
              единство в формы; эволюция возвращает внимание к источнику.
            </Text>
            {HALL_POINTS.map((p) => (
              <Row key={p} gap={8} align="start">
                <Text style={{ color: theme.accent.primary }}>•</Text>
                <Text size="small">{p}</Text>
              </Row>
            ))}
          </Stack>
        </CardBody>
      </Card>

      <H2>Ключевые источники</H2>
      <Stack gap={8}>
        {KEY_SOURCES.map((s) => (
          <Card key={s.href} variant="borderless">
            <CardBody>
              <Text weight="semibold">{s.label}</Text>
              <Text size="small" tone="tertiary">
                {s.href}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Stack>

      <Card variant="borderless">
        <CardBody>
          <Text size="small" tone="quaternary" style={{ lineHeight: 1.5 }}>
            Сопровождает HTML-реферат с четырьмя учебными иллюстрациями (эманация, спектр
            онтологий, модель Каструпа, инволюция/эволюция). См. также canvas
            universal-consciousness-mindmap.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

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

const PERSON_META = {
  name: "Руперт Шелдрейк (Rupert Sheldrake)",
  born: "род. 28 июня 1942, Ньюарк-он-Трент, Англия",
  credentials: "PhD по биохимии (Cambridge), экс-Fellow Клэр-колледжа, Royal Society Research Fellow",
  known: "Гипотеза морфического резонанса · критика материалистических догм науки",
  source: "https://www.sheldrake.org",
};

const NODES: MindNode[] = [
  {
    id: "root",
    label: "Руперт Шелдрейк",
    importance: "core",
    summary:
      "Биолог с классической кембриджской карьерой, ставший главным «еретиком» современной науки.",
    detail:
      "Руперт Шелдрейк — редкий случай учёного, который прошёл весь путь академического истеблишмента (Cambridge, Harvard, Royal Society Fellowship) и затем сознательно вышел за его рамки. Его центральная идея: природа обладает памятью, а сознание не сводится к активности мозга. Для темы этого архива Шелдрейк важен как современный «мост» между эмпирической наукой и той картиной мира, которую Manly P. Hall описывал языком эзотерической традиции: сознание — фундаментальная сила, а не побочный продукт материи.",
  },
  {
    id: "bio",
    label: "Научная биография",
    importance: "major",
    summary:
      "Кембриджский биохимик, исследователь растений, затем — Индия и поворот к «большим вопросам».",
    detail:
      "Шелдрейк изучал естественные науки в Cambridge и философию/историю науки в Harvard, защитил PhD по биохимии (1967), был Fellow Клэр-колледжа и Research Fellow Королевского общества. Вместе с Филипом Рубери открыл клеточный механизм полярного транспорта ауксина — результат, до сих пор входящий в учебники физиологии растений. В 1974–1978 работал главным физиологом растений в институте ICRISAT (Хайдарабад, Индия). Книгу «A New Science of Life» он писал, живя в христианском ашраме Беды Гриффитса в Тамил-Наду — биографическая деталь, показывающая сознательное соединение науки и созерцательной традиции.",
  },
  {
    id: "morphic",
    label: "Морфический резонанс",
    importance: "core",
    summary:
      "Центральная гипотеза: подобное влияет на подобное сквозь время; природа наследует свои формы.",
    detail:
      "Морфический резонанс (morphic resonance) — гипотеза «формативной причинности» (formative causation), выдвинутая в книге «A New Science of Life» (1981). Суть: каждая самоорганизующаяся система (кристалл, клетка, организм, стая, общество) настраивается на «память» всех прошлых подобных систем. Чем чаще форма или паттерн поведения возникали раньше, тем легче они возникают снова — где угодно, без физического контакта. Отсюда проверяемые следствия: новые химические соединения должны кристаллизоваться легче со временем; крысы по всему миру должны быстрее обучаться трюку, которому уже обучили крыс в одной лаборатории. Гипотеза предлагает альтернативу представлению, что вся наследственность записана в молекулах.",
  },
  {
    id: "fields",
    label: "Морфические поля",
    importance: "core",
    summary:
      "Невидимые организующие поля формы и поведения — носитель «памяти природы».",
    detail:
      "Морфическое поле (morphic field) — организующая структура, которая придаёт форму развивающемуся организму и координирует поведение групп. Шелдрейк опирается на понятие «морфогенетического поля» из эмбриологии 1920-х (Гурвич, Вайс), но радикализует его: поля не сводятся к химии и генам, они эволюционируют и несут в себе накопленную память вида. Гены, по Шелдрейку, кодируют белки — «строительные материалы», но не «план здания». План хранится в поле, доступном через резонанс. Иерархия полей: от полей атомов и кристаллов до полей стай, семей и культур. Здесь прямая перекличка с идеей универсального сознания: индивид «вложен» в объемлющие его целостности.",
  },
  {
    id: "habits",
    label: "Законы природы как привычки",
    importance: "major",
    summary:
      "«Законы» природы — не вечные предписания, а эволюционирующие привычки вселенной.",
    detail:
      "Одно из самых глубоких следствий гипотезы: если вселенная эволюционирует (а после теории Большого взрыва это общепринято), почему её «законы» должны быть вечными и неизменными, как во времена Ньютона? Шелдрейк предлагает мыслить регулярности природы как привычки (habits), которые закрепляются повторением через морфический резонанс. Новое сначала возникает как творческий акт, затем «привыкается» и выглядит как закон. Это переворачивает и картину эволюции: она становится не только отбором, но и накоплением памяти. Философски идея близка Ч. С. Пирсу и Бергсону, а в терминах Hall — процессу инволюции/эволюции, где формы кристаллизуются и вновь возвращаются к единству.",
  },
  {
    id: "dogmas",
    label: "Десять догм науки",
    importance: "core",
    summary:
      "«The Science Delusion» (2012): материализм — не вывод науки, а её непроверенная вера.",
    detail:
      "В книге «The Science Delusion» (в США — «Science Set Free», 2012) Шелдрейк формулирует десять допущений, которые современная наука принимает как догмы, не проверяя: (1) природа механистична; (2) материя лишена сознания; (3) законы природы фиксированы; (4) суммарное количество материи и энергии неизменно; (5) у природы нет целей; (6) наследственность целиком материальна; (7) память хранится как материальные следы в мозге; (8) разум находится внутри головы; (9) психические феномены иллюзорны; (10) работает только механистическая медицина. Его метод — превратить каждую догму в открытый вопрос и показать, что данные не так однозначны, как принято считать. Это не антинаука, а призыв вернуть науке дух свободного исследования.",
  },
  {
    id: "extended",
    label: "Расширенный разум",
    importance: "major",
    summary:
      "Разум не заперт в черепе: восприятие и внимание «дотягиваются» до своих объектов.",
    detail:
      "Гипотеза расширенного разума (extended mind): психика — это поле, простирающееся за пределы мозга. Когда мы смотрим на что-то, восприятие не только «внутри головы» — внимание образует реальную связь с объектом, подобно полю. Отсюда предсказание: пристальный взгляд может быть почувствован. Память, по Шелдрейку, тоже не «записана» в нейронах, как файлы на диске: мозг скорее «настройщик» (tuner), принимающий сигнал, чем «хранилище». Повреждение радиоприёмника портит приём, но не доказывает, что диктор сидит внутри приёмника — та же логика применима к повреждениям мозга и памяти. Эта модель напрямую резонирует с тезисом Hall о теле как «хвостовом приложении сознания».",
  },
  {
    id: "experiments",
    label: "Экспериментальная программа",
    importance: "core",
    summary:
      "Необъяснённые способности людей и животных как дешёвые, воспроизводимые опыты.",
    detail:
      "Отличие Шелдрейка от большинства «философов сознания» — упор на эксперимент. Книга «Seven Experiments That Could Change the World» (1994) предлагает программу дешёвых опытов, доступных даже студентам: телепатия домашних животных, чувство взгляда, телефонная телепатия, поведение голубей, фантомные конечности. Методология: большие выборки, простые протоколы, статистика против случайного угадывания, открытая публикация данных (многие датасеты выложены на sheldrake.org). Критики (Р. Вайзман, Д. Блэкмор) оспаривают контроль условий и интерпретацию; Шелдрейк отвечает повторными сериями и разбором критики. Независимо от исхода спора, сам подход — проверять «табуированные» феномены экспериментом — образцово научен.",
  },
  {
    id: "dogs",
    label: "Собаки, знающие о возвращении хозяев",
    importance: "supporting",
    summary:
      "Опыты с собакой Джейти: животное занимает место у окна, когда хозяйка решает ехать домой.",
    detail:
      "Книга «Dogs That Know When Their Owners Are Coming Home» (1999). Самая известная серия — опыты с собакой Джейти (Jaytee): хозяйка возвращалась в случайно выбранное время на незнакомом транспорте, дом снимался на видео. По данным Шелдрейка, собака проводила у окна значимо больше времени именно после момента, когда хозяйка решала ехать. Он интерпретирует это как связь через морфическое поле «социальной группы» человек–животное. Ричард Вайзман провёл собственные сессии и оспорил вывод; последующий спор о критериях анализа стал хрестоматийным примером того, как одни и те же данные читаются разными теоретическими очками.",
  },
  {
    id: "staring",
    label: "Чувство взгляда",
    importance: "supporting",
    summary:
      "«The Sense of Being Stared At» (2003): люди угадывают взгляд в спину чаще случайного.",
    detail:
      "Десятки тысяч проб по простому протоколу: «наблюдатель» по случайной последовательности смотрит или не смотрит в затылок «испытуемому», тот отвечает «смотрят/не смотрят». Совокупные результаты Шелдрейка — порядка 55–60% попаданий при случайных 50%, с высокой статистической значимостью за счёт объёма выборки. Для Шелдрейка это прямое следствие расширенного разума: взгляд — не пассивный приём фотонов, а активное «протягивание» перцептивного поля к объекту. Скептики указывают на возможные сенсорные утечки и ошибки рандомизации; часть повторов даёт эффект, часть — нет.",
  },
  {
    id: "telephone",
    label: "Телефонная телепатия",
    importance: "supporting",
    summary:
      "Угадывание звонящего из четырёх кандидатов: ~40% попаданий при случайных 25%.",
    detail:
      "Знакомое многим «я как раз о тебе подумал — и ты позвонил» Шелдрейк превратил в протокол: испытуемый называет четырёх близких людей; компьютер случайно выбирает, кто из них звонит; до ответа на звонок испытуемый называет имя. Случайный уровень — 25%; в сериях Шелдрейка средний результат — около 40%. Показательно: эффект выше для эмоционально близких людей и не зависит от расстояния (в опытах участвовали звонящие с другого континента). Позднее протокол повторён для SMS и e-mail. Это самый «бытовой» из его экспериментов — каждый может воспроизвести его дома, что соответствует его идеалу науки, открытой для всех.",
  },
  {
    id: "consciousness",
    label: "Сознание и мозг",
    importance: "core",
    summary:
      "Сознание — не секреция нейронов: Шелдрейк возвращает его в фундамент природы.",
    detail:
      "Итоговая позиция Шелдрейка по главному вопросу этого архива: материалистическое отождествление «разум = активность мозга» — самая слабая из догм. Если память не хранится в мозге, а разум простирается за пределы черепа, то сознание — не локальный продукт нейрохимии, а участие в полях, объемлющих индивида. Шелдрейк открыто обсуждает панпсихистские следствия — вплоть до статьи «Is the Sun Conscious?» (Journal of Consciousness Studies, 2021): если поля самоорганизующихся систем могут быть носителями опыта, вопрос о сознании звёзд перестаёт быть абсурдным. Это эмпирическая тропа к тому, что Hall называл универсальным сознанием, а Веданта — Брахманом: индивидуальный ум как локальная настройка на всеобщее поле.",
  },
  {
    id: "spiritual",
    label: "Наука и духовные практики",
    importance: "major",
    summary:
      "Поздние работы: медитация, благодарность, ритуал и паломничество как проверяемые практики.",
    detail:
      "В «Science and Spiritual Practices» (2017) и «Ways to Go Beyond» (2019) Шелдрейк разбирает по семь духовных практик (медитация, благодарность, связь с природой, отношения с растениями, ритуалы, пение, паломничество; затем — пост, психоделики, молитва и др.) с двух сторон: что о них говорит эмпирическая наука (эффекты на здоровье, психику, социальные связи) и как они осмысляются в традициях. Сам Шелдрейк — практикующий англиканин, прошедший через атеизм и годы в индийском ашраме; его жена Джилл Пёрс — специалист по обертонному пению. Вывод: духовные практики — это «эмпирика от первого лица», дополняющая эмпирику лабораторий. Прямая параллель с «практическими выводами» лекции Hall: сознание тренируемо.",
  },
  {
    id: "controversy",
    label: "«Книга для сожжения»: конфликт с истеблишментом",
    importance: "major",
    summary:
      "Редакционная статья Nature (1981) и снятый доклад TEDx (2013) — цена ереси.",
    detail:
      "В сентябре 1981 редактор Nature Джон Мэддокс опубликовал редакционную статью «A book for burning?» о «A New Science of Life», а в 1994 заявил в интервью BBC, что Шелдрейка «следует осудить ровно тем языком, каким папы осуждали Галилея, и по той же причине: это ересь». Фраза стала подарком Шелдрейку: наука, осуждающая гипотезы как ересь, ведёт себя как церковь. В 2013 доклад «The Science Delusion» на TEDxWhitechapel был снят с основного канала TED по решению научного совета — и набрал миллионы просмотров именно из-за скандала. Дискуссии с Докинзом, Шермером и Вайзманом показывают устойчивый паттерн: спор идёт не столько о данных, сколько о границах допустимого в науке.",
  },
  {
    id: "trialogues",
    label: "Триалоги: МакКенна и Абрахам",
    importance: "supporting",
    summary:
      "Многолетние беседы с Теренсом МакКенной и Ральфом Абрахамом о хаосе, творчестве и духе.",
    detail:
      "С конца 1980-х Шелдрейк вёл регулярные «триалоги» с этноботаником Теренсом МакКенной и математиком-хаологом Ральфом Абрахамом (книги «Trialogues at the Edge of the West», 1992; «The Evolutionary Mind», 1998). Три взгляда — биология полей, психоделическая феноменология, математика хаоса — сходились на общей интуиции: вселенная творческа, а разум распределён в природе. Сегодня эту линию продолжают «Sheldrake–Vernon Dialogues» — подкаст с философом Марком Верноном. Для архива это пример жанра: живой разговор как инструмент исследования сознания.",
  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: "root", to: "bio" },
  { from: "root", to: "morphic" },
  { from: "morphic", to: "fields" },
  { from: "morphic", to: "habits" },
  { from: "fields", to: "extended" },
  { from: "habits", to: "dogmas" },
  { from: "extended", to: "experiments" },
  { from: "experiments", to: "dogs" },
  { from: "experiments", to: "staring" },
  { from: "experiments", to: "telephone" },
  { from: "dogmas", to: "consciousness" },
  { from: "dogmas", to: "controversy" },
  { from: "consciousness", to: "spiritual" },
  { from: "bio", to: "trialogues" },
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
      style={{ width: "100%", maxHeight: 560, display: "block" }}
      role="img"
      aria-label="Mind map: Rupert Sheldrake"
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
              y={ln.y + h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSelected ? theme.text.primary : theme.text.secondary}
              fontSize={11}
              fontWeight={node.importance === "core" ? 600 : 400}
            >
              {node.label.length > 28 ? node.label.slice(0, 26) + "…" : node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function NodeDetail({ node }: { node: MindNode }) {
  const theme = useHostTheme();
  const color = importanceColor(node.importance, theme);

  return (
    <Stack gap={12}>
      <Row gap={8} align="center" wrap>
        <Pill tone={node.importance === "core" ? "info" : "neutral"} size="sm">
          {IMPORTANCE_LABEL[node.importance]}
        </Pill>
      </Row>

      <Text weight="semibold">{node.summary}</Text>

      <Text size="small" tone="secondary" style={{ lineHeight: 1.65 }}>
        {node.detail}
      </Text>

      {node.importance === "core" ? (
        <Card variant="borderless">
          <CardBody>
            <Text size="small" tone="secondary" style={{ lineHeight: 1.6 }}>
              <span style={{ color: color, fontWeight: 500 }}>Почему это центрально: </span>
              {node.id === "root" &&
                "Шелдрейк — редчайший тип фигуры: не мистик, спекулирующий о науке, а учёный первого ряда, предъявляющий материализму эмпирический счёт. Всё остальное на карте — развёртывание этой позиции."}
              {node.id === "morphic" &&
                "Морфический резонанс — стержень всей системы: из него выводятся и поля, и «законы-привычки», и объяснительная рамка для всех экспериментов. Принять или отвергнуть Шелдрейка — значит принять или отвергнуть эту гипотезу."}
              {node.id === "fields" &&
                "Поля — онтология Шелдрейка: они отвечают на вопрос, ГДЕ находится память природы и ЧТО организует форму, если не только гены. Без полей резонанс повисает в воздухе."}
              {node.id === "dogmas" &&
                "Десять догм — методологический манифест: он переводит спор из плоскости «верю/не верю в телепатию» в плоскость «какие допущения наука отказывается проверять». Это самая цитируемая часть его наследия."}
              {node.id === "experiments" &&
                "Экспериментальная программа отличает Шелдрейка от чистых философов: он ставит проверяемые предсказания и публикует данные. Спор о нём — это спор о том, были ли опыты корректны, а не о вкусах."}
              {node.id === "consciousness" &&
                "Здесь система Шелдрейка смыкается с темой архива: сознание как настройка на объемлющие поля — эмпирическая переформулировка тезиса об универсальном и личном сознании."}
            </Text>
          </CardBody>
        </Card>
      ) : null}
    </Stack>
  );
}

export default function RupertSheldrakeMindmap() {
  const theme = useHostTheme();
  const [selectedId, setSelectedId] = useCanvasState("selectedNode", "root");

  const selected = NODES.find((n) => n.id === selectedId) ?? NODES[0];

  const coreNodes = NODES.filter((n) => n.importance === "core");
  const majorNodes = NODES.filter((n) => n.importance === "major");

  return (
    <Stack gap={20} style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
      <Stack gap={6}>
        <H1>{PERSON_META.name}</H1>
        <Text size="small" tone="secondary">
          {PERSON_META.born} · {PERSON_META.credentials}
        </Text>
        <Text size="small" tone="tertiary">
          {PERSON_META.known} ·{" "}
          <span style={{ color: theme.text.link }}>{PERSON_META.source}</span>
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

      <H2>Ключевые книги</H2>
      <Grid columns={2} gap={12}>
        {[
          {
            year: "1981",
            title: "A New Science of Life",
            note: "Гипотеза формативной причинности; повод для статьи Nature «A book for burning?»",
          },
          {
            year: "1988",
            title: "The Presence of the Past",
            note: "Развёрнутое изложение морфического резонанса и памяти природы",
          },
          {
            year: "1994",
            title: "Seven Experiments That Could Change the World",
            note: "Программа дешёвых экспериментов по «табуированным» феноменам",
          },
          {
            year: "1999",
            title: "Dogs That Know When Their Owners Are Coming Home",
            note: "Телепатия животных; опыты с собакой Джейти",
          },
          {
            year: "2003",
            title: "The Sense of Being Stared At",
            note: "Чувство взгляда и другие аспекты расширенного разума",
          },
          {
            year: "2012",
            title: "The Science Delusion / Science Set Free",
            note: "Десять догм материалистической науки как открытые вопросы",
          },
          {
            year: "2017",
            title: "Science and Spiritual Practices",
            note: "Семь духовных практик глазами эмпирической науки",
          },
          {
            year: "2019",
            title: "Ways to Go Beyond and Why They Work",
            note: "Ещё семь практик: от поста и молитвы до психоделиков",
          },
        ].map((book) => (
          <Card key={book.title}>
            <CardBody>
              <Text size="small" tone="tertiary">
                {book.year}
              </Text>
              <Text weight="semibold">{book.title}</Text>
              <Text size="small" tone="secondary" style={{ marginTop: 4 }}>
                {book.note}
              </Text>
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
            Обзор составлен по книгам Шелдрейка, материалам sheldrake.org (включая открытые
            датасеты экспериментов) и публичным дискуссиям. Статус его гипотез в научном
            сообществе остаётся спорным: карта отражает позицию самого Шелдрейка и основные
            линии критики, не вынося вердикта. См. также канвас «Universal and Personal
            Consciousness» (Manly P. Hall) в этой же папке — идейную рамку, с которой
            резонирует программа Шелдрейка.
          </Text>
        </CardBody>
      </Card>
    </Stack>
  );
}

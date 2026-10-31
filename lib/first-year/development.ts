export type DevelopmentLanguage = "en" | "mk";
type StageText = {
  title: string;
  examples: [string, string, string];
  activity: string;
};
export type DevelopmentStage = {
  from: number;
  to: number;
  referenceAge: number;
  source: string;
  en: StageText;
  mk: StageText;
};

// Windows group reading chapters, never clinical windows for acquiring skills.
// Paraphrased from CDC age-specific pages read on 2026-10-31; see content review.
export const developmentStages: DevelopmentStage[] = [
  {
    from: 0,
    to: 2,
    referenceAge: 2,
    source: "https://www.cdc.gov/act-early/milestones/2-months.html",
    en: {
      title: "Getting to know each other",
      examples: [
        "Connection: looking toward your face and responding with a smile during interaction.",
        "Communication: making vocal sounds beyond crying.",
        "Discovery: watching you move and briefly looking at a toy.",
      ],
      activity:
        "Share a song or a short story. Respond warmly when your baby makes a sound, and pause when they turn away or seem tired.",
    },
    mk: {
      title: "Се запознавате меѓусебно",
      examples: [
        "Поврзување: гледање кон вашето лице и одговарање со насмевка при комуникација.",
        "Комуникација: испуштање гласови освен плачење.",
        "Откривање: следење на вашето движење со поглед и кратко гледање во играчка.",
      ],
      activity:
        "Споделете песна или кратка приказна. Одговорете топло кога бебето испушта глас и направете пауза кога го врти погледот или изгледа уморно.",
    },
  },
  {
    from: 3,
    to: 4,
    referenceAge: 4,
    source: "https://www.cdc.gov/act-early/milestones/4-months.html",
    en: {
      title: "A growing conversation",
      examples: [
        "Connection: using smiles, movement or sounds to get your attention.",
        "Communication: answering your voice with sounds and turning toward it.",
        "Movement: bringing hands toward the mouth and holding a toy placed in a hand.",
      ],
      activity:
        "Copy a sound your baby makes, then leave a pause for a reply. A little back-and-forth can be part of an ordinary day; follow your baby’s interest.",
    },
    mk: {
      title: "Разговорот расте",
      examples: [
        "Поврзување: привлекување на вашето внимание со насмевки, движења или гласови.",
        "Комуникација: одговарање на вашиот глас со гласови и вртење кон него.",
        "Движење: доближување на рацете до устата и држење играчка ставена во раката.",
      ],
      activity:
        "Повторете глас што го испушта бебето, па оставете пауза за одговор. Малата размена може да биде дел од обичен ден; следете го интересот на бебето.",
    },
  },
  {
    from: 5,
    to: 6,
    referenceAge: 6,
    source: "https://www.cdc.gov/act-early/milestones/6-months.html",
    en: {
      title: "Curiosity and familiar faces",
      examples: [
        "Connection: recognizing familiar people and sharing laughter.",
        "Communication: taking turns making sounds with you.",
        "Discovery: reaching toward a wanted toy; movement may include rolling from tummy to back.",
      ],
      activity:
        "Look at a picture book together and name what catches your baby’s attention. Respond to their sounds as part of the story; take a break if they become upset.",
    },
    mk: {
      title: "Љубопитност и познати лица",
      examples: [
        "Поврзување: препознавање познати луѓе и споделување смеа.",
        "Комуникација: наизменично испуштање гласови со вас.",
        "Откривање: посегнување по сакана играчка; движењето може да вклучува превртување од стомак на грб.",
      ],
      activity:
        "Разгледајте сликовница заедно и именувајте го она што го привлекува вниманието на бебето. Одговорете на неговите гласови како дел од приказната; направете пауза ако се вознемири.",
    },
  },
  {
    from: 7,
    to: 9,
    referenceAge: 9,
    source: "https://www.cdc.gov/act-early/milestones/9-months.html",
    en: {
      title: "Shared games and discoveries",
      examples: [
        "Connection: looking when their name is called and enjoying peek-a-boo.",
        "Communication: repeating varied syllables and lifting arms to ask to be picked up.",
        "Discovery and movement: searching for a dropped object and sitting without support.",
      ],
      activity:
        "Take turns passing an age-appropriate toy while staying beside your baby. Name pictures in a book and respond to their sounds with simple words.",
    },
    mk: {
      title: "Заеднички игри и откритија",
      examples: [
        "Поврзување: погледнување кога ќе го повикате по име и уживање во играта криенка со лицето.",
        "Комуникација: повторување различни слогови и подигање на рацете за да го земете.",
        "Откривање и движење: барање паднат предмет и седење без потпора.",
      ],
      activity:
        "Наизменично подавајте си играчка соодветна за возраста, останувајќи покрај бебето. Именувајте слики во книга и одговарајте на неговите гласови со едноставни зборови.",
    },
  },
  {
    from: 10,
    to: 12,
    referenceAge: 12,
    source: "https://www.cdc.gov/act-early/milestones/1-year.html",
    en: {
      title: "Small gestures, shared meaning",
      examples: [
        "Connection and communication: joining a simple hand game, waving goodbye and using a special name for a parent.",
        "Discovery: placing an object inside a container and looking for something they saw you hide.",
        "Movement: pulling up to stand and stepping while holding furniture; independent walking is not required by this CDC reference.",
      ],
      activity:
        "Talk or sing about what you are doing together. Build on your baby’s attempts at words by naming the object they mean, without asking them to perform.",
    },
    mk: {
      title: "Мали гестови, заедничко значење",
      examples: [
        "Поврзување и комуникација: учество во едноставна игра со раце, мавтање за поздрав и користење посебно име за родител.",
        "Откривање: ставање предмет во сад и барање нешто што видело дека го криете.",
        "Движење: подигање во стоечка положба и чекорење со придржување за мебел; самостојното одење не е услов во овој ориентир на CDC.",
      ],
      activity:
        "Зборувајте или пејте за она што го правите заедно. Надоврзете се на обидите на бебето да зборува со именување на предметот на кој мисли, без да го испитувате.",
    },
  },
];

export function developmentForMonth(month: number): DevelopmentStage {
  return (
    developmentStages.find(
      (stage) => month >= stage.from && month <= stage.to,
    ) || developmentStages[0]
  );
}

export const developmentCopy = {
  en: {
    stageNavigation: "Explore a stage",
    months: "months",
    firstWeeks: "First weeks–2 months",
    eyebrow: "GROWING TOGETHER",
    reference: "CDC reference age",
    context:
      "These reading stages group nearby months; they are not ranges for when a skill must appear. CDC reference ages describe what at least 75% of children can do by that age. Development varies. These selected examples are not a full checklist, a diagnosis or a substitute for developmental screening.",
    ahead:
      "You are reading ahead to this reference age. These examples are not expectations for your selected month.",
    examples: "Things you may notice",
    activity: "A moment to try together",
    concerns: "Questions or concerns?",
    concernText:
      "If a milestone is missing at its reference age, a previously learned skill is lost, or anything worries you, contact your child’s healthcare professional and ask about developmental screening. Do not wait for another chapter. For a baby born early, ask your care team how to interpret age. Local care and referral pathways vary.",
    source: "Read the full CDC guidance (United States)",
    reviewed:
      "Source read 31 October 2026 · CDC page dated 15 May 2026. General education, not medical advice. TinySteps is not endorsed by CDC.",
    reading: "Your progress records reading only; it never rates your baby.",
  },
  mk: {
    stageNavigation: "Истражете период",
    months: "месеци",
    firstWeeks: "Први недели–2 месеци",
    eyebrow: "РАСТЕМЕ ЗАЕДНО",
    reference: "Ориентир на CDC според возраст",
    context:
      "Овие периоди за читање групираат блиски месеци; не се опсези во кои некоја вештина мора да се појави. Возрасните ориентири на CDC опишуваат што можат да прават најмалку 75% од децата до таа возраст. Развојот варира. Избраните примери не се целосен список, дијагноза или замена за развоен скрининг.",
    ahead:
      "Читате однапред за оваа возраст. Овие примери не се очекувања за избраниот месец.",
    examples: "Што може да забележите",
    activity: "Момент што можете да го споделите",
    concerns: "Прашања или загриженост?",
    concernText:
      "Ако некоја развојна вештина недостасува на наведената возраст, ако бебето изгуби претходно стекната вештина или нешто ве загрижува, контактирајте со здравствениот работник што го следи детето и прашајте за развоен скрининг. Не чекајте друго поглавје. Ако бебето е родено предвреме, прашајте го здравствениот тим како да ја толкувате возраста. Локалните постапки за нега и упатување се разликуваат.",
    source: "Прочитајте ги целосните насоки на CDC (САД)",
    reviewed:
      "Изворот е прочитан на 31 октомври 2026 · Страница на CDC од 15 мај 2026. Општа едукација, не медицински совет. Не се тврди дека TinySteps е одобрен од CDC.",
    reading:
      "Напредокот го бележи само читањето; никогаш не го оценува бебето.",
  },
};

const macedonianStatuses: Record<string, string> = {
  "Saving your choices…": "Се зачувуваат вашите избори…",
  "Saved to your account.": "Зачувано во вашата сметка.",
  "Bookmark saved.": "Обележувачот е зачуван.",
  "Bookmark available for this visit only.":
    "Обележувачот е достапен само за оваа посета.",
  "Account sign-in is temporarily unavailable. You can still explore and save choices on this device.":
    "Најавувањето привремено не е достапно. Можете да истражувате и да зачувувате избори на овој уред.",
  "Account connection unavailable. Reload your account to continue saving.":
    "Поврзувањето со сметката не е достапно. Повторно вчитајте ја сметката за да продолжите со зачувување.",
  "Please sign in again.": "Најавете се повторно.",
  "Your appearance changed on another device. Reload your account before editing again.":
    "Поставките се изменети на друг уред. Повторно вчитајте ја сметката пред да продолжите со измените.",
};

export function firstYearStatus(
  message: string,
  language: DevelopmentLanguage,
): string {
  if (!message || language === "en") return message;
  return (
    macedonianStatuses[message] ||
    "Измените не можеа да се зачуваат. Повторно вчитајте ја сметката и обидете се повторно."
  );
}

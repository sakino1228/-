const state = { step: 0, answers: [] };

const questions = [
  { dimension: "同調", item: "1｜ルールの明確さ", color: "coral", text: "応援するときは、決まった掛け声やお決まりのやり方がある方が安心する。" },
  { dimension: "同調", item: "2｜強制度", color: "coral", text: "応援の場では、周りの人が行っている応援に合わせるべきだと思う。" },
  { dimension: "同調", item: "3｜同期性", color: "coral", text: "声援や動きなど、みんなで同じタイミングで応援するのが好きだ。" },
  { dimension: "同調", item: "4｜再現性", color: "coral", text: "初めての応援でも、やり方がわかれば他の人と同じように応援できると思う。" },
  { dimension: "表現", item: "5｜自由度", color: "blue", text: "決まったやり方に縛られず、その時の気分で応援したい。" },
  { dimension: "表現", item: "6｜識別性", color: "blue", text: "他の人とは違う、自分らしい応援を周りや応援している対象に気づいてほしい。" },
  { dimension: "表現", item: "7｜評価性", color: "blue", text: "自分の応援に対して、周りの人や応援する相手から反応や評価があると嬉しい。" },
  { dimension: "表現", item: "8｜独自性", color: "blue", text: "他の人の真似ではなく、自分なりの応援を考えるのが好きだ。" }
];

const choices = [
  { label: "とてもそう思う", score: 5 },
  { label: "ややそう思う", score: 4 },
  { label: "どちらともいえない", score: 3 },
  { label: "あまりそう思わない", score: 2 },
 　{ label: "まったくそう思わない", score: 1 }
];

const profiles = {
  "high-high": ["熱狂エンターテイナー型", "周囲との一体感をつくりながら、自分の熱意も堂々と表せる人。みんなの気持ちを束ねて、応援を前へ進める存在です。", ["一体感", "発信力", "推進力"], "#e85b52", "#fff1ed"],
  "high-mid": ["調和クリエイター型", "場の空気を大切にしつつ、自分らしい表現もほどよく楽しめる人。まとまりと個性のバランス感覚が魅力です。", ["バランス", "安心感", "工夫"], "#d36a4e", "#fff4ec"],
  "high-low": ["忠誠サポーター型", "ルールや周囲との呼吸を大切にする人。目立たなくても、安定した応援で場全体の心地よさを支えます。", ["礼節", "安定感", "信頼"], "#3d76d8", "#edf4ff"],
  "mid-high": ["自由なムードメーカー型", "自分らしさをはっきり出しながら、必要なときには周囲にも合わせられる人。自由な熱意で、応援に新しい風を運びます。", ["個性", "柔軟", "熱量"], "#e85b52", "#fff1ed"],
  "mid-mid": ["ニュートラル応援型", "周囲との一体感も、自分らしい表現も、状況に合わせて選べる人。応援する対象や場に応じて、無理のない距離感をつくれます。", ["自然体", "適応力", "心地よさ"], "#82746b", "#f2ede6"],
  "mid-low": ["見守りサポーター型", "周囲の流れを尊重しながら、静かに応援を楽しむ人。肩の力が抜けた誠実さが、長く続く応援につながります。", ["穏やか", "誠実", "持続力"], "#3d76d8", "#edf4ff"],
  "low-high": ["我が道クリエイター", "周囲に流されすぎず、自分の気持ちをのびのび表現する人。あなたならではの応援が、相手に強い印象を残します。", ["自由", "表現力", "自分軸"], "#e85b52", "#fff1ed"],
  "low-mid": ["マイペース共感型", "自分のペースを保ちながら、気持ちが動く場面では自然に応援へ参加する人。無理のない関わり方が持ち味です。", ["マイペース", "自然体", "共感"], "#82746b", "#f2ede6"],
  "low-low": ["距離観察型", "少し引いた視点で、応援の時間を自分らしく楽しむ人。言葉や動きに頼らずとも、静かなまなざしで気持ちを寄せます。", ["観察力", "落ち着き", "自分のペース"], "#3d76d8", "#edf4ff"]
};

const questionView = document.getElementById("question-view");
const resultView = document.getElementById("result-view");
const stepLabel = document.getElementById("step-label");
const progressBar = document.getElementById("progress-bar");

function renderQuestion() {
  const question = questions[state.step];
  const kicker = document.getElementById("question-kicker");
  kicker.textContent = `${question.dimension}｜${question.item}`;
  kicker.className = `question-kicker ${question.color}-kicker`;
  document.getElementById("question-text").textContent = question.text;
  const answersEl = document.getElementById("answers");
  answersEl.replaceChildren();
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `answer ${question.color}`;
    button.textContent = choice.label;
    button.addEventListener("click", () => choose(choice.score));
    answersEl.append(button);
  });
  stepLabel.textContent = `QUESTION ${state.step + 1} / 8`;
  progressBar.style.width = `${((state.step + 1) / questions.length) * 100}%`;
  progressBar.style.background = `var(--${question.color})`;
}

function choose(score) {
  state.answers.push(score);
  state.step += 1;
  if (state.step < questions.length) renderQuestion(); else renderResult();
}

function level(score) {
  if (score >= 67) return "high";
  if (score <= 39) return "low";
  return "mid";
}

function chartPosition(score) {
  // 4問・5段階評価では、取り得るスコアは20%〜100%。
  // それをチャート内の7%〜93%に収め、最小値を左下、最大値を右上へ対応させる。
  return 7 + ((score - 20) / 80) * 86;
}

function renderResult() {
  const alignment = Math.round((state.answers.slice(0, 4).reduce((sum, value) => sum + value, 0) / 20) * 100);
  const expression = Math.round((state.answers.slice(4).reduce((sum, value) => sum + value, 0) / 20) * 100);
  const [name, copy, traits, color, soft] = profiles[`${level(alignment)}-${level(expression)}`];
  questionView.hidden = true;
  resultView.hidden = false;
  stepLabel.textContent = "RESULT";
  progressBar.style.width = "100%";
  progressBar.style.background = color;
  const mark = document.getElementById("result-letter");
  mark.textContent = "✦";
  mark.style.background = color;
  document.getElementById("result-name").textContent = name;
  document.getElementById("result-copy").textContent = copy;
  document.getElementById("alignment-score").textContent = `${alignment}%`;
  document.getElementById("expression-score").textContent = `${expression}%`;
  const point = document.getElementById("chart-point");
  point.style.left = `${chartPosition(expression)}%`;
  point.style.bottom = `${chartPosition(alignment)}%`;
  point.style.color = color;
  const traitsEl = document.getElementById("result-traits");
  traitsEl.replaceChildren();
  traits.forEach((trait) => {
    const tag = document.createElement("span");
    tag.className = "trait";
    tag.textContent = `# ${trait}`;
    tag.style.background = soft;
    tag.style.color = color;
    traitsEl.append(tag);
  });
}

document.getElementById("restart-button").addEventListener("click", () => {
  state.step = 0;
  state.answers = [];
  resultView.hidden = true;
  questionView.hidden = false;
  renderQuestion();
});

renderQuestion();

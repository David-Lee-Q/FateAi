/**
 * Mock 解读模板池
 * 每个系统按章节结构组织，每个章节有多个变体段落，
 * 每次调用随机组合生成不同内容。
 */

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

export interface TemplateSection {
  heading: string;
  variants: string[];
}

export interface SystemTemplates {
  intro: string[];
  sections: TemplateSection[];
  outro: string[];
}

/** 八字排盘 */
export const BAZI_TEMPLATES: SystemTemplates = {
  intro: [
    '根据您提供的生辰八字信息，天机为您进行了详尽的命盘分析。',
    '您的八字命盘已排定，以下是从多个维度的深度解读。',
    '基于四柱八字的生克制化关系，为您呈现全面的命理分析。',
  ],
  sections: [
    {
      heading: '### 1. 性格特征',
      variants: [
        '日主五行属{dayWx}，{dayWx}主{traits}。您天生具有{dayWx}的典型特质，为人处事{style}。命局中{strong}旺，{weak}弱，这种五行配置赋予您独特的性格魅力。',
        '从日柱来看，日主{dayWx}得令，性格中带有鲜明的{dayWx}行特质。您思维{thinking}，在人际交往中{interpersonal}。五行的生克平衡让您在不同场合展现出灵活的性格面。',
        '命盘中{strong}气较盛，性情中透着{strongTraits}。日主{dayWx}为命局核心，决定了您的气质底色为{manner}。{weak}的偏弱反而让您在某些方面更加专注。',
        '通过分析您的天干地支组合可以看出，您具备{quality1}与{quality2}的双重特质。日柱坐{dayZhi}，内心世界丰富，对外则展现出{outerQuality}。',
      ],
    },
    {
      heading: '### 2. 事业方向',
      variants: [
        '官星{officeStatus}，事业宫位显示您适合从事{career1}、{career2}等领域的相关工作。随着大运流转，{timing}将是您事业的上升期。建议在{move}多做积累，厚积薄发。',
        '从十神配置来看，{helpStar}星得力，工作中常有贵人相助。您在天生的{strength}方面有独特优势，适合在{industry1}、{industry2}等行业发展。近期{recentCareer}。',
        '命局中{aspect}表明您有较强的{ability}能力。职业规划方面，建议选择{choice1}或{choice2}方向，这些领域能与您的命理特质形成共振。{advice}',
        '八字中{careerStar}星透出，事业上有{careerFeature}的特点。您适合在{env1}环境中工作，{env2}的方式能让您发挥最大潜能。',
      ],
    },
    {
      heading: '### 3. 感情婚姻',
      variants: [
        '日柱夫妻宫{spouseStatus}，感情运势{loveTrend}。{single}桃花运在{peachTime}较为旺盛。已婚者需注意{marriedNote}，多沟通能化解大部分矛盾。',
        '日支为配偶宫，{spouseZhi}坐支显示您的感情模式偏向{loveStyle}。在感情中您倾向于{preference}，与{compatible}类型的人最为投缘。{loveTip}',
        '命局桃花星配置{peach}，在感情的追求上较为{attitude}。寻找伴侣时应多留意{opportunity}场合。{suggestion}让感情更加稳固长久。',
        '从婚恋角度来看，您的感情运整体{luck}。夫妻宫与{relatedPillar}的互动关系暗示着{insight}。学会{skill}是改善感情生活的关键。',
      ],
    },
    {
      heading: '### 4. 财运分析',
      variants: [
        '财星{wealthStatus}，正财运{positiveWealth}，适合通过{method1}获取稳定收入。偏财方面{biasWealth}，{investmentAdvice}。旺财方位在{direction}。',
        '从财星旺衰来看，您的财务格局属于{financialType}。正财来源主要依靠{source1}，偏财运{bias}。建议{financeTip}，建立{financeGoal}。',
        '命局财库{treasury}，财富积累方式应以{accumulation}为主。近{period}财运走势{trend}，适合在{timeWindow}做出重要的财务决策。',
        '八字中财星的配置暗示您与金钱的缘分{relationship}。{wealthAdvice1}能助您打开财门，{wealthAdvice2}则是守住财富的关键。',
      ],
    },
    {
      heading: '### 5. 健康提醒',
      variants: [
        '五行中{weakElement}偏弱，需注意{bodyPart1}和{bodyPart2}的保养。{strongElement}过旺可能带来{risk}。建议{habit1}、{habit2}，保持{rhythm}。',
        '从五行与五脏的对应关系来看，{elementBody}需要特别关注。日常饮食宜{recommend1}，少吃{avoid1}。{exerciseType}是最适合您的运动方式。',
        '命局五行与健康密切相关，{concern}方面需要多加留意。建议定期{checkup}，保持{goodHabit}。{season}季节尤其要注意{seasonalCare}。',
        '整体来看您的体质偏向{constitution}，养生重点在于{key}。{tip}是维护健康的好习惯，{warning}则是需要警惕的身体信号。',
      ],
    },
    {
      heading: '### 6. 近期提醒',
      variants: [
        '综合当前运势，近期在{area1}方面将有{good1}的机会。{area2}需要{caution}。保持{attitudeNow}的心态，{action}将助您顺利度过这段时间。',
        '未来几个月，您将迎来{phase}的阶段。{positive}是这段时间的主旋律，但也需留意{watch}。运势是风向标，真正决定走向的是您的每一步选择。',
        '近期运势整体{overall}，{highlight}值得期待。但{riskPoint}方面需要多加小心。天机提醒您：{reminder}。好运势配好心态，方能如虎添翼。',
        '当下正处于{currentPhase}的节点，{opportunityNow}是值得把握的机遇。同时{challengeNow}需要耐心面对。建议{tipNow}，在变局中找到自己的节奏。',
      ],
    },
  ],
  outro: [
    '以上分析仅供参考，命运始终掌握在自己手中。愿您以积极的心态面对每一天。',
    '天机提醒：命理分析是了解自我的工具，而非束缚。愿您活出属于自己的精彩。',
    '八字揭示的是先天趋势，后天努力同样重要。祝愿您在前行的道路上一帆风顺。',
  ],
};

/** 塔罗牌 */
export const TAROT_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已为您完成塔罗牌阵的排列与解读。每一张牌都是当下能量的映照。',
    '您的塔罗牌阵已经显现，让我们一同探索牌面所揭示的深层含义。',
  ],
  sections: [
    {
      heading: '### 过去的影响',
      variants: [
        '牌面显示过去一段时间，您在{area1}方面经历了{exp1}。这些经历虽然{feeling}，但已经为您积累了宝贵的{resource}，让您在面对未来时更有底气。',
        '回溯过去的能量轨迹，{pattern1}的模式较为明显。{lesson}是这段历程带给您的最大收获。',
      ],
    },
    {
      heading: '### 当下的处境',
      variants: [
        '当前您正处于{stage}的关键时期。牌面提醒您在{aspect}方面保持{attitude}。此刻最重要的是{core}，这将成为破局的关键。',
        '现在的牌面能量显示，您正站在{crossroad}。{signal1}和{signal2}同时出现，暗示着{insight}。深呼吸，相信您的直觉。',
      ],
    },
    {
      heading: '### 未来的走向',
      variants: [
        '未来趋势向好，{opportunity}正在向您走近。在接下来的{period}内，您可能会在{domain}方面迎来{breakthrough}。保持开放的心态迎接变化。',
        '牌面预示着一段{trend}时期的到来。{positive}能量正在积聚，但{caution}也不可忽视。顺势而为是这段时间的关键策略。',
      ],
    },
    {
      heading: '### 指引与建议',
      variants: [
        '塔罗牌给予您的指引是：{advice1}。在{timing}做出{tactic}，将有助于{goal}。相信内心的声音，它比您想象的更值得信赖。',
        '综合所有牌面信息，核心建议是{advice2}。塔罗不是命运的判决，而是能量的镜子。您手中的选择权永远是最强大的力量。',
      ],
    },
  ],
  outro: [
    '塔罗牌展现的是当下的能量场，一切皆在变化之中。愿这份解读为您带来启发。',
    '牌面的每个符号都是您内心世界的投射，愿您在自我探索的旅程中发现更多可能。',
  ],
};

/** 星座运势 */
export const ZODIAC_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您带来最新的星座运势综合分析。星辰的运转从未停歇，每一刻都有新的能量在流动。',
    '以下是基于您的星座配置生成的专属运势解读，让我们看看行星的运行为您准备了怎样的惊喜。',
  ],
  sections: [
    {
      heading: '### 综合运势',
      variants: [
        '本周整体运势处于{trend}状态。{planet1}与{planet2}的和谐相位为您带来了{good}的能量。适合{action}，将计划付诸行动。',
        '当前星象配置对{sign}整体较为有利，{aspect}的加持让您在各方面的运势都呈现{momentum}。把握时机往往比努力本身更重要。',
      ],
    },
    {
      heading: '### 爱情运势',
      variants: [
        '金星位置对感情运势{loveImpact}。单身者{loveAdvice1}，已有伴侣者适合{loveAdvice2}，感情温度正在上升。幸运色：{loveColor}。',
        '感情方面，{loveStar}的能量正影响着您的爱情宫。{situation}，建议{loveTip}。真诚的表达是拉近彼此距离的最好方式。',
      ],
    },
    {
      heading: '### 事业运势',
      variants: [
        '水星的运行带来清晰的思维和流畅的表达。在工作中{careerAdvice1}，适合{careerAdvice2}。团队协作方面，{teamAdvice}。',
        '事业宫位的能量显示{careerTrend}。近期{opportunity}方面值得关注，{zodiac_action}能帮助您在职场中脱颖而出。',
      ],
    },
    {
      heading: '### 财运分析',
      variants: [
        '正财运{wealth1}，偏财运{wealth2}。适合在{timeWindow}做出{financeMove}的决策。幸运数字：{luckyNum}。',
        '财务方面整体{wealth_trend}，{source}是主要的收入增长点。建议{tip}，避免{avoid}。理性规划让财富持续增长。',
      ],
    },
    {
      heading: '### 健康运势',
      variants: [
        '健康方面需要注意{health1}和{health2}。建议{habit1}，保持{habit2}。{season}是调理身体的好时机。',
        '身体状态整体{condition}。{caution}是需要留意的方面，{advice}有助于维持良好的身心平衡。',
      ],
    },
  ],
  outro: [
    '星座运势是为您点亮前路的星光，而非禁锢的框架。愿这份解读为您带来温暖与启发。',
  ],
};

/** 周公解梦 —— 动态模板由 interpretFortune 中的 DREAM_PROMPT 驱动 */
export const DREAM_TEMPLATES: SystemTemplates = {
  intro: [
    '天机解梦师已收到您的梦境，让我们一同探寻梦中的奥秘。',
  ],
  sections: [
    {
      heading: '### 1. 梦境分类',
      variants: [
        '此梦属于{category}类梦境，包含{layers}层象征意义。梦中{widget}往往与近期生活中的{widgetRelate}密切相关。',
      ],
    },
    {
      heading: '### 2. 吉凶判断',
      variants: [
        '综合各元素的吉凶属性，此梦整体趋向{luck}。梦境中的{keyword}暗示着{foretell}。以平和之心待之，梦境自会显现其真实意义。',
      ],
    },
    {
      heading: '### 3. 心理分析',
      variants: [
        '从心理学角度看，此梦映射了您潜意识中对{psyArea}的关注。梦是通往潜意识的桥梁，{keyword}可能象征您清醒时{symbolize}。',
      ],
    },
    {
      heading: '### 4. 传统解读',
      variants: [
        '结合传统解梦学说，{keyword}在古籍中常被视为{symbol}的象征。综合来看，此梦境传递的是{message}的信号。',
      ],
    },
    {
      heading: '### 5. 化解与建议',
      variants: [
        '保持{attitude}的心态。{advice1}是化解不安的有效途径，{advice2}则能帮助您更好地与梦境对话。',
      ],
    },
  ],
  outro: [
    '梦境是灵魂的密语，借由探索梦境，我们能更加了解真实的自己。',
  ],
};

/** 紫微斗数 */
export const ZIWEI_TEMPLATES: SystemTemplates = {
  intro: [
    '天机根据您提供的出生信息排定紫微命盘，十二宫位的星曜分布已清晰呈现。',
  ],
  sections: [
    {
      heading: '### 命宫分析',
      variants: [
        '命宫主星{star}，代表您的核心性格特质为{trait}。{star}坐命的人往往{behavior}，在人群中{characteristic}。',
        '从命宫星曜来看，您的格局属于{type}。天资{intelligence}，为人处事{style}。命宫的辅星配置进一步强化了{plus}的特点。',
      ],
    },
    {
      heading: '### 事业宫',
      variants: [
        '事业宫见{careerStar}，显示您在职场上{careerFeature}。适合从事{industry}行业，在{position}岗位上能发挥最大价值。',
        '官禄宫的星曜配置显示您的事业轨迹为{path}。{stage}阶段将迎来重要转折，提前做好{prep}是明智之举。',
      ],
    },
    {
      heading: '### 财帛宫',
      variants: [
        '财帛宫{wealthStar}星得地，正财运{positive}。理财方面建议{tip}，{avoid}可保财库充盈。',
        '天府财库{condition}，财富积累能力{ability}。偏财运{bias}，{source}是值得开拓的财路。',
      ],
    },
    {
      heading: '### 夫妻宫',
      variants: [
        '夫妻宫{loveStar}显示感情运势{trend}。对伴侣的期待偏向{preference}，适合寻找{compatible}的对象。',
        '姻缘宫星曜暗示感情模式为{pattern}。{advice}是维系感情和谐的关键。',
      ],
    },
    {
      heading: '### 综合建议',
      variants: [
        '紫微命盘揭示的是先天格局，后天努力不可忽视。把握{timing}的运势节点，在{area}方面多下功夫，定能收获满意的人生画卷。',
      ],
    },
  ],
  outro: ['紫微斗数提供的是人生地图，行路的仍是您自己。'],
};

/** 生肖运势 */
export const SHENGXIAO_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您揭晓生肖运程。十二年一轮回，每个生肖都有属于自己的运势节奏。',
  ],
  sections: [
    {
      heading: '### 整体运势',
      variants: [
        '属{animal}人在今年的运势整体{level}。{animal}的特性决定了您在{domain1}方面有{advantage1}，{domain2}方面则需要{caution}。',
        '今年是属{animal}的{year}年，整体运气{level}。{event}是今年的关键词，{tip}能帮您趋吉避凶。',
      ],
    },
    {
      heading: '### 事业运',
      variants: [
        '事业方面，属{animal}的朋友今年{careerTrend}。{month}月份是事业上的黄金期，适合{action}。贵人属相为{helper}。',
      ],
    },
    {
      heading: '### 感情运',
      variants: [
        '感情运势{loveTrend}，{loveDetail}。{advice}能让感情生活更加和谐美满。',
      ],
    },
    {
      heading: '### 财运',
      variants: [
        '财运方面{wealthTrend}，正财{positive}偏财{bias}。宜{ok}，忌{avoid}。旺财方位在{direction}。',
      ],
    },
    {
      heading: '### 健康运',
      variants: [
        '健康方面需注意{health}。建议{habit}，{avoidHabit}。{season}时节要特别留意{seasonal}。',
      ],
    },
  ],
  outro: ['生肖是老祖宗留下的智慧，但人生的精彩由您自己书写。'],
};

/** 求签解签 */
export const DRAWLOT_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已为您摇取灵签，签文蕴含着千年智慧，待您细细参悟。',
    '您的签已落定，签筒中百签各有天意，此签正是当下的答案。',
    '灵签显现，天机为您解读此签的深层寓意与生活启示。',
  ],
  sections: [
    {
      heading: '### 1. 签文宣读',
      variants: [
        '您所求得的是第{lotNumbers}，签等为{lotLevels}。签诗云："{poemLines}"，寥寥数语却意味深长。此签属于{lotThemes}类，侧重指引您在相关领域的迷津。',
        '灵签{lotNumbers}显现，{lotLevels}之兆。签中诗曰"{poemLines}"，{deity}在上，{guanyinSays}，这便是给您的启示。',
        '签文已出——{lotNumbers}，{lotLevels}。诗曰"{poemLines}"，此签暗合{lotThemes}之运，是神明给您的慈悲指引。',
      ],
    },
    {
      heading: '### 2. 典故溯源',
      variants: [
        '此签源自一段古老典故，讲述的是{deity}显圣的故事。故事中蕴含着{auspicious}的玄机，与您当前所求{lotThemes}之事不谋而合。借古喻今，其中的智慧跨越千年依然熠熠生辉。',
        '签文典故与{deity}有关，故事讲述了{guanyinSays}的经历。这个故事在今天看来依然发人深省，它与您当前的处境有着奇妙的呼应。',
        '追溯此签的来历，原出自{deity}的一段佳话。典故的核心要义在于{lotAdvice}，这与您当下的选择有着深刻的关联。',
      ],
    },
    {
      heading: '### 3. 吉凶判断',
      variants: [
        '综合签文信息，此签整体趋向{lotLevels}。{auspicious}之象已显，但{warnings}。签文所示吉凶并非定数，心态和行动才是决定最终结果的关键变量。',
        '签文的吉凶属性为{lotLevels}。吉兆方面{auspicious}，而需警惕的是{warnings}。人定胜天之理，在签文中亦有体现。',
        '以签论签，{lotLevels}的基调已定。{deity}在此签中传递的信息是{guanyinSays}，{warnings}是签中暗藏的提醒。',
      ],
    },
    {
      heading: '### 4. 事业指引',
      variants: [
        '在功名事业方面，签文给出的建议是{lotAdvice}。当前运势{directions}方位有利，{times}是行动的最佳时间窗口。{auspicious}，只要方向正确，付出必有回报。',
        '事业前途如签中所言，{lotAdvice}是关键策略。{deity}指引您向{directions}方向努力，抓住{times}的时机窗口，前程似锦可期。',
      ],
    },
    {
      heading: '### 5. 综合建议',
      variants: [
        '灵签的根本意义不在于预知未来，而在于借神明之口提醒我们{warnings}。求签问道，最终还是要回归到日常生活中{lotAdvice}的实践。{guanyinSays}，愿您铭记于心。',
        '签文的智慧需要时间来消化。{lotAdvice}是对您最中肯的提醒。{auspicious}的好运已在路上，但{warnings}也不可掉以轻心。心诚则灵，行善则吉。',
        '天机提醒：签虽灵验，但生活的方向舵始终掌握在您自己手中。{lotAdvice}是神明赐予的智慧，将其融入日常行动中，方能真正领受神恩。',
      ],
    },
  ],
  outro: [
    '灵签已解读完毕，愿这份指引为您拨开迷雾。心诚则灵，善行必有善果。',
    '签文所言皆是当下能量之映照，一切皆在变化之中。以善心善行面对每一天。',
  ],
};

/** 手相算命 */
export const PALM_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已为您分析掌纹玄机。手中的每一条纹路都是生命旅程的独特印记。',
    '摊开手掌，天机为您细说掌中乾坤。一双手的纹路，写满了人生的密码。',
    '手相如心相，相由心生。天机为您解读掌纹背后的深层含义。',
  ],
  sections: [
    {
      heading: '### 1. 手型分析',
      variants: [
        '您的手型偏向{handShapes}，此类手型的人通常具有独特的性格气质。{palmFeatures}是您手相中的亮点，表明先天体质和运势基础不错。掌心{mounts}最为饱满，暗示着相关领域的能量充沛。',
        '从手型来看，{handShapes}的特征在您手中表现明显。{palmFeatures}反映出良好的先天基础。手掌中{mounts}区域丰隆有力，是您天赋所在的领域。',
        '您的手掌形态属于{handShapes}，{palmFeatures}的特征让人印象深刻。{mounts}发达，展示出您在该方面的突出潜能。整体手型匀称，运势基础扎实。',
      ],
    },
    {
      heading: '### 2. 三大主线',
      variants: [
        '生命线方面，{lifeLine}，说明先天体质较为强健。智慧线上，{headLine}，这决定了您的思维方式。感情线上，{heartLine}，映照出丰富而真挚的情感世界。',
        '{lines}三条主线的走向各具特色：{lifeLine}；{headLine}；{heartLine}。三条线的交汇格局暗示着身心意的整体协调度良好。',
        '从三大主线的纹路来看——生命线{lineQualities}，预示着{lifeLine}；智慧线{lineQualities}，暗示{headLine}；感情线{lineQualities}，反映{heartLine}。三者相互呼应，构成完整的性格拼图。',
      ],
    },
    {
      heading: '### 3. 辅线与特殊标记',
      variants: [
        '在辅助纹路方面，{fateLine}。此外，手掌上的{mounts}区域出现了{lineQualities}的特殊标记，这是值得关注的信号。婚姻线{lineQualities}，暗示感情生活的基本走向。',
        '命运线呈{lineQualities}之势，{fateLine}。成功线{lineQualities}，说明事业上有独特的发展轨迹。{lines}的辅助信息让整个手相分析更加立体。',
        '仔细观察辅线分布：{fateLine}；在{mounts}处可见{lineQualities}的标记，这是不错的征兆。整体辅线布局协调，与三大主线形成了良好的呼应。',
      ],
    },
    {
      heading: '### 4. 运势趋势',
      variants: [
        '综合手相各要素，近期运势处于{lineQualities}的阶段。{palmFeatures}的特征预示未来一段时间发展平稳向好。{palmAdvice}，这是手相学给您的实用建议。',
        '运势走向如掌纹般有起有伏，{palmFeatures}显示当前处于良性上升通道。{mounts}区域的变化暗示近期需重点关注相关领域。{palmAdvice}。',
      ],
    },
    {
      heading: '### 5. 建议指导',
      variants: [
        '手相真正的价值在于它是一个自我觉察的工具。{palmAdvice}。命由己造、相由心生——内心修为的提升会在掌纹中留下印记。',
        '了解手相的目的是为了更好地认识自己，而非被纹路所束缚。{palmAdvice}。记住，手相只是参考，行动才是答案。',
      ],
    },
  ],
  outro: [
    '掌纹是生命的诗篇，每一笔都是独特的韵律。愿这份解读为您带来启发与力量。',
    '手相之学，贵在自知。愿您在了解自己的同时，也拥有改变自己的勇气。',
  ],
};

/** 铁板神数 */
export const TIEBAN_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您启动铁板神数，以精密数理推演人生轨迹。铁板之数，定而不死，变在其中。',
    '铁板神数已启动，天机以数理之法为您探察命途。数字之中，自有天地。',
    '铁板神数集数理之大成，天机为您一一解读命盘中的玄机。',
  ],
  sections: [
    {
      heading: '### 1. 铁板数理',
      variants: [
        '铁板神数以{tieElements}为核心，通过{tiePatterns}的精妙的运算，得出了属于您的{tieNumbers}铁板数。此数的吉凶属性是命盘分析的基准坐标。数中有象，象中有理——这便是铁板神数的核心逻辑。',
        '从{tieElements}入手，借助{tiePatterns}的推演法则，铁板数为{tieNumbers}。{tieSecrets}，您的铁板数正是这一规律的体现。',
        '命盘以{tieElements}为纲，{tiePatterns}的算法得出了{tieNumbers}之数。{tieTip}，这张命盘是您的人生底图。',
      ],
    },
    {
      heading: '### 2. 命途总论',
      variants: [
        '命宫核心数据显示：{tieLifePath}。从{tieElements}的配置来看，一生运势的基调已经奠定，但后天的选择决定了演绎的方式。铁板虽硬，人心可柔。',
        '命途走向为{tieLifePath}。{tiePatterns}的格局让您的命运兼具稳定性与变通性。{tieAdvice}是贯穿一生的智慧。',
      ],
    },
    {
      heading: '### 3. 六亲缘分',
      variants: [
        '父母宫显示：{tieParents}。夫妻宫呈现：{tieSpouse}。子女宫信息为：{tieChildren}。六亲缘分各有深浅，珍惜当下、用心经营才是最好的态度。',
        '六亲之中，{tieParents}；{tieSpouse}；{tieChildren}。缘分如酒，愈久愈醇，彼此珍惜方能长久。',
        '父母缘分{tieParents}，夫妻缘分{tieSpouse}，子女缘分{tieChildren}。亲情是人生最温暖的底色，用心守护这份来之不易的缘分。',
      ],
    },
    {
      heading: '### 4. 财运解析',
      variants: [
        '财运宫显示{tieFortune}。铁板数{tieNumbers}揭示了财富的来路与去向。{tieAdvice}，让财富在正确的方向上自然积累。',
        '铁板数中财运宫的信息为{tieFortune}。结合{tiePatterns}的格局分析，财富积累的关键在于{tieAdvice}，不急不躁、稳扎稳打。',
      ],
    },
    {
      heading: '### 5. 趋吉避凶',
      variants: [
        '铁板神数的核心价值在于指导行动。{tieAdvice}不仅是一句口号，更是需要融入日常的修行。{tieTip}，将智慧化为行动，福报自然来。',
        '综合命盘信息，天机给出的核心建议是{tieAdvice}。{tieLifePath}，但命运之轮的方向盘始终在您手中。{tieSecrets}，顺应天道而行，自得善果。',
      ],
    },
  ],
  outro: [
    '铁板神数以数明理，愿这份解读为您的人生旅途提供一份可靠的参考坐标。',
    '命数有定，人事无穷。愿您在了解命盘的同时，更能活出超越命盘的人生。',
  ],
};

/** 大六壬 */
export const DALIUREN_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您排布大六壬课式。天时人事，尽在课传之中。',
    '大六壬课盘已成，四课三传清晰呈现。天机为您层层解读课传妙义。',
    '壬课已出，课体课传映照当下时空。天机带您深入大六壬的玄妙世界。',
  ],
  sections: [
    {
      heading: '### 1. 四课分析',
      variants: [
        '天盘四课分别对应{fourLessons}，各课之间的生克关系构成了课体的基本框架。日干课为{heavenlyStems}，日支课为{earthlyBranches}，时令课的五行属性决定了外在大环境的能量场。',
        '四课之中，{fourLessons}各有职司。{heavenlyStems}为干课主事之外显，{earthlyBranches}为支课主事之内隐。四课之间{shenShaMeanings}，整体气象已然清晰。',
        '从四课来看，{heavenlyStems}与{earthlyBranches}的配合暗示着{elementRelations}的能量格局。{fourLessons}的互动关系中，{guaJudgment}的课体属性最为突出。',
      ],
    },
    {
      heading: '### 2. 三传解读',
      variants: [
        '三传{threeTransmissions}展现了事物发展的三阶段。初传为{heavenlyStems}发动，主事之始；中传为{earthlyBranches}承转，主事之中途；末传见{shenJiang}临位，主事之终局。',
        '课传三阶分别为：初传{heavenlyStems}——预示{daliuGuaNames}的启动能量；中传{earthlyBranches}——暗示{guaJudgment}的发展态势；末传{shenJiang}——指向最终的{shenShaMeanings}。',
        '三传之中，{threeTransmissions}的递进关系揭示了{divinationTypes}的逻辑链条。初传{daliuAdvice}、中传{daliuAdvice}、末传{daliuAdvice}，三者所述一气呵成。',
      ],
    },
    {
      heading: '### 3. 神将分析',
      variants: [
        '值课神将中，{shenJiang}在{palm}位发用，{shenShaMeanings}。另有{shenJiang}在旁相助，形成{elementRelations}的有利格局。神将之间的呼应关系进一步加强了课体的吉象。',
        '课中神将{shenJiang}值事，{shenShaMeanings}。辅神{shenJiang}的参与使得整体判断更加立体。神吉则课吉，神凶则课凶——但凶中有化解之道。',
        '本课{shenJiang}当值，{shenShaMeanings}。课体中{elementRelations}的格局为吉，{daliuGuaNames}的课式属性进一步确认了整体走向。',
      ],
    },
    {
      heading: '### 4. 吉凶判断',
      variants: [
        '综合课体、课传与神将信息，此课整体趋向{guaJudgment}。{divinationTypes}法的课式属性决定了基本吉凶，但细节还需结合{shenJiang}的具体表现来分析。',
        '课体{divinationTypes}，课传有情，神将得力——{guaJudgment}。{shenShaMeanings}，这是此课最核心的判断依据。',
      ],
    },
    {
      heading: '### 5. 行动建议',
      variants: [
        '基于大六壬课盘的综合分析，建议{daliuAdvice}。{timing}是最佳的行动窗口，方位上宜关注{directions}。{shenShaMeanings}，抓住这一有利信号果断推进。',
        '课传的启示是{daliuAdvice}。{timing}为最佳时机，配合{elementRelations}的能量运用，可达事半功倍之效。大六壬指引的是方向，行动仍由您决定。',
        '天机建议：{daliuAdvice}。{timing}前后是能量最强的时间节点。{guaJudgment}的课体属性提示您{lotAdvice}，静心等待最佳时机的到来。',
      ],
    },
  ],
  outro: [
    '大六壬课指天机，愿这份解读为您提供清晰的行动指引。知天时、尽人事，方得圆满。',
    '壬课已释，天地之道尽在其中。愿您以谦卑之心体察天意，以勇敢之心践履人事。',
    '课传有尽而智慧无穷，愿这份解读成为您思考的一盏明灯。',
  ],
};

/** 综合报告 */
export const REPORT_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您生成一份综合运势报告，整合{reportSystems}等多维度信息，提供全景式的运势分析。',
    '以下是一份跨越多个占卜体系的综合报告。天机以{reportSystems}为数据源，为您呈现最全面的运势画像。',
    '综合报告已生成。天机融汇{reportSystems}的智慧，为您打造一份独特的运势导航图。',
  ],
  sections: [
    {
      heading: '### 1. 报告概要',
      variants: [
        '{reportInsights}，本次报告的基调为{reportSummary}。{reportStrengths}是您当前最大的优势，而{reportWeakness}的方面则需要更多关注。整体态势积极乐观，但不可掉以轻心。',
        '报告概览：{reportSummary}。多体系交叉验证显示{reportStrengths}尤为突出，{reportHighlight}。{reportCaution}，小心驶得万年船。',
        '综合评估：{reportInsights}——{reportSummary}。{reportSystems}的数据共同指向了{reportStrengths}这一核心优势。{reportHighlight}，是近期最值得期待的变化。',
      ],
    },
    {
      heading: '### 2. 各体系分析',
      variants: [
        '在{reportSystems}的维度上，数据显示{reportStrengths}的运势最为强劲。这一领域近期有望带来{reportHighlight}，值得重点投入精力。{reportAdvice}是此维度下的最佳策略。',
        '从{reportSystems}的视角分析，{reportWeakness}需要特别留意。虽然整体运势向好，但{reportCaution}是当下不可忽视的提醒。{reportAdvice}有助于化解潜在风险。',
        '整合{reportSystems}的信息后，{reportHighlight}的信号最为强烈。{reportStrengths}与{reportWeakness}同时存在，说明机遇与挑战并存。{reportAdvice}，方能趋利避害。',
      ],
    },
    {
      heading: '### 3. 交叉验证',
      variants: [
        '多体系交叉验证显示，{reportSystems}与{reportSystems}在{reportStrengths}方面高度一致。当{reportHighlight}成为多体系共识时，这份指引的可靠度大大增强。{reportAdvice}是综合各方信息的核心结论。',
        '将{reportSystems}的结果进行对比后发现，{reportStrengths}是各体系共同认可的亮点，而{reportWeakness}则存在一定的体系分歧。共识越强的领域，确定性越高。',
      ],
    },
    {
      heading: '### 4. 综合建议',
      variants: [
        '基于以上分析，短期（1-2周）建议{reportAdvice}，中期（1-3个月）聚焦{reportSystems}领域的发展，长期来看{reportSummary}的趋势将会持续。{reportCaution}是贯穿全程的提醒。',
        '行动策略：短期以{reportAdvice}为主，中期着重发展{reportStrengths}，长期坚持{reportSummary}的方向。{reportCaution}，在任何阶段都不应被忽视。',
      ],
    },
    {
      heading: '### 5. 关键时间节点',
      variants: [
        '报告提示{reportHighlight}的窗口期即将到来，建议提前做好准备。天机提醒：{reportCaution}，把握时机也需量力而行。',
        '关注{reportSystems}运势的变化周期，{reportHighlight}是近期最重要的时间节点。{reportAdvice}，让每一个关键节点都成为向上的阶梯。',
      ],
    },
  ],
  outro: [
    '以上综合报告仅供参考。运势是风向标，您自己才是航行的舵手。愿这份报告助您乘风破浪。',
    '天机综合报告至此结束。了解全局是为了更好地规划细节。愿您步步为营、行稳致远。',
    '报告只是开始，行动才是关键。愿这份全景分析为您带来切实的启发与温暖的力量。',
  ],
};

/** 多维对比 */
export const COMPARE_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您启动多维对比分析，从{compareDimensions}等维度进行全面评估。',
    '多体系联合比对已开启，天机从{compareDimensions}等层面为您揭示匹配度与互补性。',
    '对比分析报告即将呈现。天机整合{compareDimensions}的多维数据，为您勾勒完整的关系图谱。',
  ],
  sections: [
    {
      heading: '### 1. 综合匹配度',
      variants: [
        '多维度综合评估显示，双方的{overallVerdict}。匹配度评分约为{matchScores}，这在{partnership}关系中属于{compareLevels}的水平。{strengthCombo}是双方合作的核心优势。',
        '综合{compareDimensions}等维度的分析结果，整体匹配度为{matchScores}，属于{compareLevels}的范畴。{overallVerdict}，{compareAdvice}是保持良好关系的关键。',
        '通过多维度对比，{overallVerdict}。{compareLevels}的总体评价意味着双方具有{strengthCombo}的潜力，{compareAdvice}能让合作更加顺畅。',
      ],
    },
    {
      heading: '### 2. 维度分析',
      variants: [
        '在{compareDimensions}方面，双方表现为{compareLevels}。{elementCompat}的能量互补让这一维度的匹配度达到{matchScores}。{compareAdvice}是进一步优化这一维度的有效方法。',
        '{compareDimensions}的评测结果为{compareLevels}，{zodiacCompat}的关系使得互动基础良好。{elementCompat}的格局说明双方在核心能量层面具有天然的契合度。',
        '从{compareDimensions}来看，{compareLevels}的评定基于{strengthCombo}的天然优势。{riskWarning}是需要双方共同努力的领域。',
      ],
    },
    {
      heading: '### 3. 优势互补',
      variants: [
        '双方在{compareDimensions}上展现出{strengthCombo}的良好态势。{elementCompat}的能量格局让合作中的摩擦降到最低，{zodiacCompat}的关系则进一步巩固了互信基础。{compareAdvice}是锦上添花的做法。',
        '优势分析：{compareDimensions}方面{compareLevels}，{compareDimensions}方面{strengthCombo}明显。{overallVerdict}，双方各自发挥长处以弥补对方的短板是最佳模式。',
      ],
    },
    {
      heading: '### 4. 潜在风险',
      variants: [
        '虽然整体匹配度良好，但在{compareDimensions}方面仍需关注。{riskWarning}，这是需要双方提前有心理准备的潜在挑战。{compareAdvice}能有效降低此风险。',
        '需要留意的是{compareDimensions}维度的差异。{riskWarning}，这些差异如果处理不当可能影响关系质量。但差异也是互补的机会，{compareAdvice}是化解分歧的良方。',
      ],
    },
    {
      heading: '### 5. 合作建议',
      variants: [
        '天机对比分析的最终建议是{compareAdvice}。{overallVerdict}，这为{partnership}关系奠定了良好基础。{strengthCombo}是最值得期待的协同方向。',
        '综合各方信息，双方{compareAdvice}是维持健康关系的基石。{overallVerdict}，愿你们在彼此的陪伴中共同成长。{riskWarning}但保持善意沟通，一切皆可化解。',
      ],
    },
  ],
  outro: [
    '对比分析到此结束。关系是共同的作品，愿你们携手创作出独一无二的精彩篇章。',
    '知己知彼方能长久，愿这份对比分析为双方带来更多的理解与包容。',
    '天机提醒：对比的目的是增进理解而非比较优劣。珍惜彼此的独特，才是相处之道。',
  ],
};

/** 占星骰子 */
export const ASTRODICE_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已为您掷出占星骰子，星辰之力凝结于每一个骰面。让我们解读宇宙透过骰子传递的讯息。',
    '占星骰子将行星、星座与宫位的能量融为一体，为您揭示当下的能量场域和未来的可能走向。',
    '骰子落定，星盘中的智慧在此刻凝聚。天机为您解读三颗骰子所蕴含的深层星语。',
  ],
  sections: [
    {
      heading: '### 1. 行星骰解读',
      variants: [
        '行星骰{planets}落定，代表了本次占卜的核心能量来源。当前{planets}的能量处于{transits}，{energies}的特质将成为这段时间的主导力量。{dicePositives}是顺势而为的关键。',
        '代表核心驱动力的行星骰显示为{planets}。{planets}属于{planetQualities}，其影响力贯穿整个占卜的基调。这股{diceEnergies}提示您在行动时注意{diceAdvice}。',
        '第一骰行星为{planets}，暗示着{keywords}的能量正在您的生命场中活跃。{planets}的本性使然，{diceCautions}是这一时期的首要课题。',
      ],
    },
    {
      heading: '### 2. 星座骰解读',
      variants: [
        '星座骰落在{signs}，为行星能量染上了独特的色彩。{signs}属于{elementTypes}，其特质与{planets}的共振将带来{energies}。近期的重点应该放在{diceAdvice}。',
        '第二骰星座为{signs}，决定了能量表达的方式与风格。{signs}的本质是{energies}，这将深刻影响您在各方面的决策方式。{dicePositives}的好时机已经到来。',
        '星座骰{signs}为行星穿上了风格的外衣。{signs}的能量以{energies}著称，这意味着您将在{houseMeanings}方面感受到最直接的影响。',
      ],
    },
    {
      heading: '### 3. 宫位骰解读',
      variants: [
        '宫位骰落在{houses}，指明了能量聚焦的生活领域。{houses}关乎{houseMeanings}，是本次占卜的着力点。结合行星与星座的影响，{diceAdvice}是当前最佳策略。',
        '第三骰宫位{houses}揭示了能量作用的具体场域。在{houseMeanings}方面，您将迎来显著的突破与转变。{patterns}的形成预示着这是一个关键时期。',
        '宫位骰{houses}为您标定了运势的经纬坐标。{houseMeanings}领域的能量异常活跃，{dicePositives}能为这一领域注入强劲动力。建议在{diceColors}色调中寻找灵感。',
      ],
    },
    {
      heading: '### 4. 综合解读',
      variants: [
        '当{planets}行经{signs}落入{houses}，形成了独特的占星配置。这个组合暗示在{questionTypes}方面将有{keywords}的发展。{moonPhases}的能量加持下，{diceAdvice}是明智之举。',
        '{planets}与{signs}的{aspects}在{houses}中激活了{patterns}。这是一个{energies}的阶段。在{questionTypes}方面，{dicePositives}。随身携带{diceCrystals}有助于增强正向能量。',
        '三骰联动呈现出清晰的图景：{planets}的能量在{signs}的引导下聚焦于{houses}。这组配置特别有利于{questionTypes}的探索。{diceAdvice}是最应遵循的指引。',
      ],
    },
    {
      heading: '### 5. 骰子建议',
      variants: [
        '综合骰面信息，核心建议是{diceAdvice}。适逢{moonPhases}期间，{diceColors}色调能帮助您更好地链接行星能量。{diceCrystals}可以作为这段时间的能量护符。',
        '占星骰子提醒您：{diceCautions}，但也别忘了{dicePositives}。在{transits}期间，{diceAdvice}是打开局面的钥匙。让星辰的智慧照亮前行的道路。',
        '骰子的智慧在于它的简洁与直接。您当前最需要的品质是{diceAdvice}所指的方向。{diceColors}和{diceCrystals}将成为这段时间的能量锚点。',
      ],
    },
  ],
  outro: [
    '占星骰子映照的是当下的星象能量，命运的主笔权始终在您手中。',
    '三颗骰子、十二星座、十二宫位——星辰的排列虽复杂，但解读的终点永远是回到内心的声音。',
  ],
};

/** 月相占卜 */
export const MOONPHASE_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您解读月相之谜。月亮阴晴圆缺的每一个瞬间，都与您内心的潮汐紧密相连。',
    '月光照耀之处，皆是能量流动的轨迹。让我们透过月相，洞悉您当前所处的情感周期和行动节奏。',
    '月相占卜是古老的自然智慧。月亮不改其盈亏循环，却在不同阶段为您提供了独特的力量。',
  ],
  sections: [
    {
      heading: '### 1. 月相解读',
      variants: [
        '当前您是{phaseNames}的能量频率。{phaseNames}蕴含着{phaseEnergies}，是{bestFor}的最佳时机。这个月相阶段将持续至下一个月相转换的时刻。',
        '您出生的月相为{phaseNames}，这种{phaseEnergies}深刻影响了您的情感表达模式。{emotion}是您在这个阶段的自然状态，不必抗拒这种感受。',
        '月相正处于{phaseNames}，天地之间的{phaseEnergies}达到顶峰。此刻最适宜{bestFor}，而{avoid}则是不合时宜的选择。月亮提醒您跟随自然的节律。',
      ],
    },
    {
      heading: '### 2. 情绪指引',
      variants: [
        '{phaseNames}下，情绪状态呈现{emotion}的特质。这种情绪并非偶然，而是月亮引力在您内在世界的回响。{elements}的流动让{bodyAreas}变得更加敏感。',
        '当前月相引发的情绪主要是{emotion}。{moonEnergies}被激活，您的直觉力处于{moonEnergies}的状态。在{timing}进行{ritual}，可以更好地链接这股月相能量。',
        '情绪的潮汐在此刻表现为{emotion}。{phaseNames}天然会激活{chakras}的能量，让您在{moonEnergies}方面表现突出。接纳情绪而非对抗，是驾驭月相能量的关键。',
      ],
    },
    {
      heading: '### 3. 行动时机',
      variants: [
        '在目前的{phaseNames}阶段，{bestFor}是天时地利之举。相反，{avoid}可能遭遇更多的阻力。{timing}是采取关键行动的黄金窗口。',
        '月相日历提示您：{phaseNames}适宜{bestFor}。而{avoid}类活动建议等待至下一月相进行。让月亮的节奏成为您生活的导航仪。',
        '当前{phaseEnergies}的加持下，{ritual}能帮助您锚定意图。在{timing}开始{bestFor}，月亮将为您提供最强的能量支撑。{avoid}则留待来日。',
      ],
    },
    {
      heading: '### 4. 灵性指引',
      variants: [
        '{deities}在{phaseNames}的月光中守护着您。{moonColors}是这段时间的幸运色调，{crystal}能帮助您更好地接收月相能量。每日进行{ritual}，连接更深层的自我。',
        '月相的灵性启示是：{affirmations}。在{timing}点燃{herbs}，让{symbols}的能量清理身心。{gatherings}是与同类人共享月相能量的美好方式。',
        '在{phaseNames}的照耀下，{chakras}能量最为活跃。{crystal}配以{moonEnergies}，能大大增强灵性修习的效果。{affirmations}可作为这段时间的每日真言。',
      ],
    },
    {
      heading: '### 5. 具体建议',
      variants: [
        '在{phaseNames}期间，建议您在{timing}进行{ritual}。随身携带{crystal}，穿{moonColors}色调的衣物，与月亮的频率共振。{avoid}是这段时期的底线原则。',
        '月光之下的实用建议：{bestFor}是第一优先序。{crystal}放在枕边有助于接收月相能量。若感到{emotion}，不妨进行{ritual}来疏导情绪。',
        '顺应{phaseEnergies}的节奏，{bestFor}而非{avoid}。让{herbs}的香气充满空间，让{affirmations}成为心中的灯塔。月亮永远在您需要的时候提供指引。',
      ],
    },
  ],
  outro: [
    '月亮从不改变它的盈亏规律，改变的只是我们看待它的视角。愿您在月相中找到属于自己的节奏。',
    '月相占卜是温柔而深邃的自我探索。每一个月缺月圆，都是宇宙提醒我们：变化是唯一的不变。',
    '当您抬头望向夜空中的月亮时，请记住——它读得懂您所有说不出口的心情。',
  ],
};

/** 符文石 */
export const RUNE_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您唤醒古老的卢恩符文智慧。每一枚符文都是北欧先民与自然之力对话的结晶。',
    '符文已显现，奥丁的智慧在此刻流转。让我们解读符文所揭示的能量密码和命运走向。',
    '卢恩符文是北欧神话中最为神秘的符号系统。每一枚符文都承载着一个古老的故事和一份不变的力量。',
  ],
  sections: [
    {
      heading: '### 1. 符文解析',
      variants: [
        '您抽出的符文是{runeNames}。这枚符文在古北欧语中的含义是{runeMeanings}，属于{runeElements}元素符文的范畴。{runeEnergies}是它的核心能量特质。',
        '符文{runeNames}降临在您的面前并非偶然。它象征着{runeMeanings}，与北欧神话中的{mythStories}有着深厚的渊源。{deityMeaning}是这枚符文背后的神圣力量。',
        '探符文{runeNames}之秘，其核心含义为{runeMeanings}。在{symbols}中，这枚符文代表了{runeEnergies}的原初力量。它出现在您的{spread}中是意味深长的。',
      ],
    },
    {
      heading: '### 2. 正位含义',
      variants: [
        '符文{runeNames}以{upright}呈现，这是一个积极的信号。{runeMeanings}的能量将在您的{runeMeanings}方面充分展现。在{runOn}的加持下，{runeAdvice}是顺势之道。',
        '正位符文{runeNames}预示着{runeMeanings}的黄金时期。在{timeFrames}这段时间，{runeEnergies}将为您打开新局面。{deityMeaning}将庇佑您的前行。',
        '当{runeNames}正位显现时，{runeEnergies}已在您的生命中做好了准备。勇敢地{rmAdvice}，{runeElements}的力量将助您一臂之力。通向{symbols}的道路已然敞开。',
      ],
    },
    {
      heading: '### 3. 逆位含义',
      variants: [
        '若符文以{reversed}呈现，{runeMeanings}的能量正处于阻滞或内省的状态。这种状态并非全然不利——{runeCautions}反而是当下最需要的品质。',
        '逆位符文{runeNames}提醒您注意{runeCautions}方面的问题。{runeEnergies}可能暂时无法通畅地表达，但这正是内省与积累的好时机。{runeAdvice}能帮您度过这段时期。',
        '{reversed}的{runeNames}暗示着需要关注{runeElements}元素的失衡。能量并未消失，只是转入了内敛的模式。{deityMeaning}建议您{runeAdvice}，静待能量回归。',
      ],
    },
    {
      heading: '### 4. 神谕启示',
      variants: [
        '{deityMeaning}借{runeNames}之口传递的神谕是：{runeAdvice}。在{mythStories}的故事中，{beings}的力量与这枚符文相交织。您的{questions}之路，正等待一个{runes}转折。',
        '符文的神圣启示与{beings}的世界相连。{runeNames}的显现说明您在{questions}方面正受到{deityMeaning}的关注。{runeAdvice}是奥丁智慧给出的最中肯的建议。',
        '透过{symbols}的象征之镜，符文{runeNames}的神谕逐渐清晰。{beings}正在为您铺设一条通向{questions}的道路。{runeAdvice}，让神圣的力量为您引路。',
      ],
    },
    {
      heading: '### 5. 实践指导',
      variants: [
        '将符文{runeNames}的智慧落地为行动：在{runeDirections}方位，{timeFrames}是采取关键步骤的最佳节点。{casts}可以帮助您更深入地连接符文的能量频率。',
        '符文的实践应用建议：每天早晨凝望{runeNames}的符号{minutes}秒，感受{runeEnergies}在体内流动。在{questions}的决定上，谨记{runeAdvice}的指引。',
        '将{runeNames}铭刻在{casts}上随身携带，或者在{runeDirections}摆放{beings}的图腾。{runeEnergies}将随着这些实践逐步融入您的日常。{runes}之路，始于脚下每一个微小的行动。',
      ],
    },
  ],
  outro: [
    '卢恩符文是变幻莫测的命运刻痕，但解读符文的智慧已镌刻在您的灵魂深处。',
    '北欧的诸神已然远去，但符文的智慧穿越千年时空，仍在照亮每一个寻求指引的灵魂。',
    '每一次抽符都是一次与古老智慧的对话。带着符文的力量前行，您永远不会独行。',
  ],
};

/** 姓名测试 */
export const NAMETEST_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您分析姓名的数理与五行。寥寥数字之间，浓缩了父母的美好祝愿和祖先的殷切期望。',
    '每个人与名字之间都有着奇妙的缘分。让我们从笔画数理和五行配置，解读名字所赋予的运势密码。',
    '姓名是每个人的第一张名片，也是伴随一生的能量符号。天机为您揭示名字背后的命理玄机。',
  ],
  sections: [
    {
      heading: '### 1. 五格数理',
      variants: [
        '您的姓名属于{nameTypes}，{wugeDesc}的格局已经清晰呈现。{wugeDesc}之间形成了独特的生克关系，{sancai}的配置对整体运势有基础性的影响。',
        '从五格剖象法来看，{wugeDesc}是姓名学的核心框架。{strokes}的数字组合对应着{scoresRange}的命理评分。各格之间的五行流转决定了名字的总体品质。',
        '天格源于祖先的姓氏，{wugeDesc}则灵动多变。{sancai}的配置体现了天地人三者的互动关系。{scoreRanges}的评分表明这是一个{scoreRanges}的名字。',
      ],
    },
    {
      heading: '### 2. 三才配置',
      variants: [
        '{sancai}是姓名学的灵魂。{wuxingMatch}的三才相生格局最为理想。{wugeDesc}之间的五行互动，如{wuxingMatch}般流转不息，这是极其有利的配置。',
        '{sancai}的配置显示{strokes}与{strokes}之间存在{wuxingMatch}的美好关系。这种相生的能量流动，将为{nameTypes}的使用者带来源源不断的正能量。',
        '在{sancai}的框架下，{wugeDesc}形成了{wuxingMatch}的和谐格局。这意味着名字不仅音律优美，更在命理层面形成了积极的能量回路。{scoreRanges}的综合评价当之无愧。',
      ],
    },
    {
      heading: '### 3. 五行分析',
      variants: [
        '姓名中各字的五行分布为：{elements}与{elements}的结合。这种配置暗示您的名字在{wuxingMatch}方面表现突出。{radicals}的使用让名字的五行能量更加均衡。',
        '五行解析显示，名字主字五行属{elements}，与辅助字的{elements}形成{wuxingMatch}的良性互动。{radicals}旁的加入进一步丰富了五行格局的层次感。',
        '{elements}的命名基调决定了名字的五行气质。{wuxingMatch}的相生关系让名字整体呈现{nameStyles}的风格。{luckyNames}之类的名字正是这种配置的典型代表。',
      ],
    },
    {
      heading: '### 4. 吉凶评分',
      variants: [
        '综合评估姓名得分{scoresRange}。{strokes}均为吉数，{strokes}需稍加留意。{wugeDesc}的整体搭配在{scoresRange}的范畴内，{wuxingMatch}的五行流转功不可没。',
        '姓名的吉凶评分落在{scoresRange}区间。{luckyStrokes}是构成高分的关键，而{unluckyStrokes}则需要通过{nameAdvice}来化解和弥补。{sancai}的和谐度为评分奠定了良好基础。',
        '从数理角度评判，您的姓名获得了{scoresRange}的评价。{strokes}的组合{phonetics}，声音美感与命理吉利兼得。{nameStyles}的名字风格也为评分增色不少。',
      ],
    },
    {
      heading: '### 5. 优化建议',
      variants: [
        '若希望进一步优化，{nameAdvice}是可行的方向。可以考虑增加{radicals}部首的字或{elements}属性的字来加强五行平衡。{luckyNames}等名字可作为参考。',
        '基于当前{nameTypes}的格局，{nameAdvice}能进一步提升名字的能量层次。建议在{radicals}字中选择，以达到{wuxingMatch}的和谐效果。{meanings}的寓意也是选字的重要标准。',
        '针对{strokes}的不足之处，{nameAdvice}是最直接的调理方式。在{phonetics}的前提下，选择{radicals}旁的字，整体趋向{nameStyles}风格，让名字成为真正的助力符。',
      ],
    },
  ],
  outro: [
    '姓名是人一生的伴侣。愿每个名字都如其人，不负深情不负期许。',
    '好名字如春风拂面，虽不能决定命运的全部，却能在暗夜中点亮一盏温暖的灯。',
    '天机始终相信：名字是祝福，而人生由你书写。',
  ],
};

/** 每日黄历 */
export const ALMANAC_TEMPLATES: SystemTemplates = {
  intro: [
    '天机为您呈上今日黄历。每一天都有其独特的天干地支组合，决定了当天的能量属性和行事宜忌。',
    '黄历是古人留给我们的时间管理智慧。让我们融合天文历法与五行阴阳，看看今日适合哪些事宜。',
    '翻开今日的黄历，吉神凶煞的分布已清晰呈现。天机为您标注今日的最佳行动指南。',
  ],
  sections: [
    {
      heading: '### 1. 今日宜忌',
      variants: [
        '今日{jianchu}当值，整体{goodFor}类的活动大吉大利。尤其是{yiTags}方面有神助。而{jiTags}则宜暂缓，等{auspiciousHours}后再做打算更为妥当。',
        '根据通书所载，{goodFor}是今日的主旋律。{yiTags}可得{starGods}吉神的庇护，且宜{activities}。{jiTags}等事宜需避开{clashInfo}的方向。',
        '今日的宜忌以{yitags}为利，{jiTags}为不利。{starGods}当值之时，{goodFor}最为顺利。{badFor}等活动应延至下一个吉日。{luckLevels}的格局主导了今天的气场。',
      ],
    },
    {
      heading: '### 2. 吉时吉方',
      variants: [
        '今日吉时为{auspiciousHours}，这些时段进行{yiTags}等活动效果最佳。旺运方位在{directions}，前往此方位办事或谈判有{starGods}的加持。',
        '{starGods}汇聚的{auspiciousHours}是今日的黄金时段。{directions}方位有{shenSha}贵人，宜前往祈福。{jiDirection}方向则需绕道而行。',
        '今日的{directions}是{shenSha}的居所，非常适合{gatherings}和{activities}。而{jiDirection}为{clashInfo}之所，出行请尽量避开。{auspiciousHours}是办事效率最高的时间窗。',
      ],
    },
    {
      heading: '### 3. 冲煞提醒',
      variants: [
        '今日{clashInfo}，{jiDirection}方向是{clashInfo}的重灾区。{taiShen}位置需保持整洁清净，不宜在此区域进行{jiTags}等事宜。{directions}则为平安之向。',
        '{jiDirection}的{clashInfo}是今日最需要注意的事项。{taiShen}附近切忌{jiTags}。若要出行，建议选择{directions}的路线，避开{jiDirection}。',
        '冲煞方面，{clashInfo}尤需留意。{taiShen}的位置应保持安宁静谧。{badFor}等事项尤其需要避开{jiDirection}方向。{directions}则是化煞增吉的首选方位。',
      ],
    },
    {
      heading: '### 4. 神煞分布',
      variants: [
        '今日{shenSha}等吉神齐聚，{starGods}主事，整体{goodFor}运势向好。{starGods}和{starGods}各司其职，{luckLevels}的格局让今天成为{goodFor}的好日子。',
        '值日的神煞中，{shenSha}最为得力。{starGods}掌管{goodFor}之事，{starGods}则护佑{yiTags}出行。{numbersLucky}为今日的幸运数字，{colorLucky}为增运色调。',
        '今日神煞分布显示{shenSha}和{starGods}形成了吉利的态势。{luckLevels}的格局下，{yiTags}、{activities}等事宜都可以放心推进。{badFor}之事可在{auspiciousHours}之间寻求化解。',
      ],
    },
    {
      heading: '### 5. 生活指南',
      variants: [
        '今日宜{yiTags}，宜{activities}，宜穿{colorLucky}色调的衣物以求好运。{numbersLucky}是今天的幸运数字。在{auspiciousHours}处理重要事务，{directions}是旺运方位。',
        '今天的日常建议：清晨面向{directions}深呼吸三次，开启全新的一天。{yiTags}安排在{auspiciousHours}进行最佳。{colorLucky}色调能有效提升今日气场。{badFor}之事择日再办。',
        '{luckLevels}的运势基调下，{goodFor}是主动出击的选择，{badFor}则稳妥避让。随身携带{colorLucky}饰品，在{auspiciousHours}启动{activities}计划，今日将充实而顺遂。',
      ],
    },
  ],
  outro: [
    '黄历是祖先智慧的结晶，然而每一天的真实色彩都由您自己来描绘。',
    '通书所载仅供参考，真正的运气来自于充分的准备和正确的选择。愿今日顺遂安康。',
    '知天命而尽人事，方为智者之道。愿黄历的智慧为您的每一天增添一份从容。',
  ],
};

/** 六爻 */
export const LIUYAO_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已根据您摇得的六爻卦象完成排盘分析，卦象蕴含的天地信息已清晰呈现。',
    '您的六爻卦象已经显现，每一爻都承载着独特的时空能量，让我们一同解读其中的奥秘。',
    '六爻卦象是天地人三才在当下的能量投影，天机为您逐一剖析各爻的深层含义。',
    '卦已排成，爻象分明。天机将为您从多个维度解析本卦与变卦的玄妙关联。',
  ],
  sections: [
    {
      heading: '### 1. 卦象解读',
      variants: [
        '您所摇得的主卦为{guaNames}，卦辞曰"{guaJudgments}"。此卦属于{hexagramType}，整体运势趋向{fortuneLevel}。卦象中{shiYao}，{yingYao}，显示您与所问之事之间呈现{conflict}的互动关系。',
        '本卦{guaNames}昭示了事物发展的核心规律。{guaTransform}是当前卦象的关键特征。六亲中{sixRelations}爻最为突出，暗示此事涉及的核心领域在于此。{yaoAnalysis}是判断吉凶的重要依据。',
        '卦名{guaNames}本身就蕴含着深刻的哲理。{spiritAnalysis}，这是卦象给出的核心信号。整体而言，此卦{fortuneLevel}，{result}是近期最可能的方向。',
        '从本卦的全局来看，{guaNames}之象揭示了您当前处境的本质。卦中{monthAnimal}临位，{conflict}之势正盛。{dongYao}的出现说明能量正在流动，变化已在酝酿。',
      ],
    },
    {
      heading: '### 2. 爻辞分析',
      variants: [
        '本卦中{yaoPositions}出现{dongYao}，爻辞有云"{yaoMeanings}"。此爻处于{yaoAnalysis}的状态，说明当前阶段您正处于能量转换的关键节点。{fortuneLevel}之兆提醒您{advice}。',
        '重点分析{yaoPositions}的动向。该爻为{sixRelations}爻，{dongYao}，暗示着事业与财运方面的{guaTransform}。{yaoMeanings}的爻辞对此给出了明确的指引。',
        '各爻分析如下：{yaoPositions}{yaoAnalysis}，主{sixRelations}之事；{yaoPositions}{conflict}之象，需{advice}。{monthBreak}的影响不可忽视，它决定了爻力的旺衰程度。',
        '从动爻来看，{yaoPositions}之动最为关键。{dongYao}配合{monthBreak}的时令因素，形成了{fortuneLevel}的格局。爻辞"{yaoMeanings}"正是对此情形的精妙概括。',
      ],
    },
    {
      heading: '### 3. 世应关系',
      variants: [
        '世爻代表卦主自身，当前{shiYao}；应爻代表对方或环境，呈现{yingYao}的态势。世应之间的{conflict}关系，直接决定了事情推进的难易程度。整体来看{fortuneLevel}。',
        '从世应生克看，{shiYao}的卦主与{yingYao}的外部力量之间，形成了微妙的能量平衡。{sixRelations}临世爻，说明卦主在此事中需发挥{advice}的智慧。',
        '世应二爻是六爻分析的核心。{shiYao}配{yaoAnalysis}，应爻{yingYao}。此配置显示{fortuneLevel}，{result}是自然的发展趋势。{dongYao}的介入可能带来转机。',
        '世爻居于{yaoPositions}，{shiYao}；应爻位于{yaoPositions}，{yingYao}。{conflict}是当前世应关系的主调，建议{advice}以调整双方的能量对比。',
      ],
    },
    {
      heading: '### 4. 应期判断',
      variants: [
        '结合{monthBreak}的时令因素分析，{timings}是关键的应期节点。当前{yaoAnalysis}，待{timings}后能量格局将发生{guaTransform}的变化。耐心等待是明智之举。',
        '应期方面，{dongYao}的发动暗示{timings}将有实质性进展。{monthBreak}能量共振时，便是事情{result}的最佳时机。在此之前，建议{advice}。',
        '从时间维度判断，{yaoPositions}的{yaoAnalysis}状态将在{timings}迎来转机。{season}前后需特别注意{conflict}能量的变化。{fortuneLevel}的结果在{timings}内可期。',
        '根据六爻应期法则，{dongYao}逢合之日可应，静爻逢冲之时可观。综合来看{timings}是第一个重要窗口期，{timings}则是后续的验证节点。',
      ],
    },
    {
      heading: '### 5. 行动建议',
      variants: [
        '卦象整体显示{fortuneLevel}，{advice}是当前最稳妥的策略。{guaTransform}的趋势已经显现，关键在于把握{timings}的时机节点。{result}不是偶然，而是顺应天时的必然。',
        '建议在{sixRelations}方面多下功夫，{advice}能助您事半功倍。{conflict}之理提醒我们凡事有度，{dongYao}的出现则暗示着主动求变的重要性。',
        '综合所有爻象分析，核心建议是{advice}。{guaNames}的卦意启示我们，{guaJudgments}。在行动中保持{fortuneLevel}的心态，{result}自然水到渠成。',
        '天机提醒：卦象是能量的投影，选择权始终在您手中。{advice}是当前阶段的关键词。{dongYao}提示的变数值得关注，但不必过度焦虑。{result}需要时间的酝酿。',
      ],
    },
  ],
  outro: [
    '六爻卦象随时间和心念流转，今天的卦是当下的参照，明天的选择由您创造。',
    '天机通过卦象呈现的是能量趋势，真正的力量始终在您心中。愿这份解读为您带来启发。',
    '卦已解完，路在脚下。六爻的智慧是提醒而非判决，愿您带着这份觉察继续前行。',
  ],
};

/** 梅花易数 */
export const MEIHUA_TEMPLATES: SystemTemplates = {
  intro: [
    '天机以梅花易数之法为您起卦推演。万物皆可为卦，卦象中蕴藏着天地万物的运行规律。',
    '梅花易数以自然外应起卦，天人感应之间，卦象已昭示了事物的本质与发展方向。',
    '外应已现，卦已排定。天机为您揭示主卦、互卦、变卦三层信息中蕴含的深意。',
  ],
  sections: [
    {
      heading: '### 1. 卦象构成',
      variants: [
        '本卦由上卦{upperTrigrams}（{trigramAttr}）与下卦{lowerTrigrams}（{trigramAttr}）组成，合为{guaNames}。{phenomenon}为起卦的外应来源，卦象因此具有了特定的时空属性。{changingLines}预示了变化的层级与范围。',
        '您此卦的构成为上{upperTrigrams}下{lowerTrigrams}，{trigramAttr}与{trigramAttr}的{guainteraction}是此卦的基本格局。{guaNames}之象在梅花易数中对应着{advantage}的寓意。',
        '本卦{guaNames}由{upperTrigrams}和{lowerTrigrams}叠合而成。{upperTrigrams}{trigramAttr}在上，{lowerTrigrams}{trigramAttr}在下，形成了{guainteraction}之势。此结构中暗含{changingLines}的变动契机。',
        '从{numberMethod}之法推演，得主卦{guaNames}。上{upperTrigrams}象征{trigramAttr}，下{lowerTrigrams}象征{trigramAttr}，{guainteraction}的格局已然显现。{changingLines}将揭示其中的动态变化。',
      ],
    },
    {
      heading: '### 2. 体用生克',
      variants: [
        '体卦为{tiGua}（{trigramAttr}），用卦为{yongGua}（{trigramAttr}），体用之间呈现{tiYong}的关系。此配置显示{fortune}，{advice}是当前的最佳策略。{elementRelation}的五行流转为此提供了能量基础。',
        '体卦{tiGua}是您的能量根基，用卦{yongGua}是外部环境的映射。{tiYong}的生克格局决定了事情的难易程度。{season}时节体卦{hufortune}，这为此事提供了有利的天时条件。',
        '体用分析是梅花易数的核心。{tiGua}为体、{yongGua}为用，{tiYong}是最终结论。{luckyDirections}方位是体卦的旺方，{timeResponse}内{advice}将获得最理想的进展。',
        '从体用生克来看，{tiGua}{trigramAttr}之体与{yongGua}{trigramAttr}之用之间，呈现{tiYong}。{fortune}是综合判断的结果。{huGua}揭示了中间过程的潜在变数，它所蕴含的{trigramAttr}能量值得关注。',
      ],
    },
    {
      heading: '### 3. 变卦分析',
      variants: [
        '{changingLines}之后得变卦，即之卦。变卦揭示事物发展的最终走向。{bianGua}是梅花易数三卦体系中的关键一环，它暗示了{timeResponse}内{result}的趋势。',
        '动爻在{yaoPositions}，使得{upperTrigrams}变为{lowerTrigrams}。这一变化的核心意义在于{guainteraction}的转换。{yongGua}变为{tiGua}的过程体现了{trigramAttr}能量向{trigramAttr}的演化。',
        '互卦（{huGua}）展示了事件发展过程中的中间状态，变卦则指示了最终走向。从互到变的路径中，{fortuneLevel}的格局逐步清晰。{advice}能帮助您顺利通过互卦阶段的考验。',
        '变卦分析显示，{changingLines}带来的变动是{fortune}之兆。变爻所对应的{yongGua}能量将在{timeResponse}充分释放。{bianGua}，建议在此期间{advice}。',
      ],
    },
    {
      heading: '### 4. 吉凶判断',
      variants: [
        '综合三卦分析，整体吉凶趋向{fortune}。体卦{tiGua}在{season}当令，{elementRelation}的力量为您提供了有利支撑。{yongGua}与{tiGua}之间的{tiYong}关系是判断吉凶的核心。',
        '本卦{guainteraction}、互卦{guainteraction}、变卦{guainteraction}，三卦递进显示了{fortune}的总体格局。{luckyDirections}为吉利之方，建议在{timeResponse}于该方向{advice}。',
        '吉凶判断需兼顾体用生克与时空因素。{tiYong}为吉之根本，{advice}为趋吉之法。{changingLines}所在揭示了吉凶转化的关键节点。整体而言{fortune}，{result}是合理预期。',
        '梅花易数的吉凶判断不拘泥于公式，更重视心物感应。{tiGua}当令则吉，{yongGua}受克则凶。当前{tiYong}的格局整体{fortune}，但{huGua}中暗藏的变数需保持警觉。',
      ],
    },
    {
      heading: '### 5. 实践指导',
      variants: [
        '梅花易数的精髓在于将卦象智慧转化为行动指南。当前卦象显示{fortune}，建议{advice}。{luckyDirections}方向是能量最为聚集之处，{timeResponse}是关键的窗口期。',
        '实践中请注意{advice}的大原则，在{season}重点推进与{trigramAttr}属性相关的事项。{tiYong}的格局暗示着{result}的可能性很大，但需要您主动迈出第一步。',
        '天机建议将{advice}作为近期行动的指导方针。{guaNames}的卦意启示我们要{trigramAttr}，{yongGua}的变化则提醒{caution}。在{timeResponse}保持觉察，机遇往往在不经意间闪现。',
        '综合所有卦象信息，核心的行动纲领是：在{luckyDirections}方向、于{timeResponse}、以{advice}的方式推进。卦象是地图，行动是脚步，两者合一方能抵达目的地。',
      ],
    },
  ],
  outro: [
    '梅花易数观物取象、见微知著。卦象之妙在于触动心灵，愿这份解读为您拨开迷雾。',
    '卦象是天地写给有心人的密信，愿您读懂了属于自己的那一封。天机与您共勉。',
  ],
};

/** 奇门遁甲 */
export const QIMEN_TEMPLATES: SystemTemplates = {
  intro: [
    '天机已为您排定奇门遁甲局盘。天盘九星运转、地盘六仪承载、人盘八门主事、神盘八神值使，四方盘局已清晰呈现。',
    '奇门遁甲被誉为"帝王之术"，四盘交叠之间蕴含着时空选择的至高智慧。天机为您逐层剖析当前局盘的奥秘。',
    '遁甲局盘已开，四象各归其位。天机将从格局、宫位、方位、时令四个维度为您深度解读。',
  ],
  sections: [
    {
      heading: '### 1. 格局分析',
      variants: [
        '当前为{method}之局，{directional}盘。{stars}临{gate}，{deities}值使，形成了{fortuneLevel}的总体格局。{stall}之象需特别关注，它暗示着能量流动中可能出现的阻碍或反复。',
        '本局中{stars}落{gate}，{deities}在侧护佑，整体运势{fortuneLevel}。{heavenStem}的配置决定了局盘的能量基调，{stems}在局中的位置揭示了关键的时间节点。',
        '四盘合参：天盘{stars}主天时动向，地盘{gates}定地利格局，人盘{palaces}司人事吉凶，神盘{deities}掌神助有无。{blessings}是综合分析后得出的整体判断。',
        '值符落{gate}宫，这是全局的枢纽所在。{deities}临位带来{shenAdvice}的有利态势。{stall}的出现提醒我们{advice}，不可因局吉而掉以轻心。',
      ],
    },
    {
      heading: '### 2. 宫位解读',
      variants: [
        '{palaces}是当前最关键的宫位，{stars}与{gates}在此同宫，{keAnalysis}。此宫{deities}临之，显示{shenAdvice}。{blessings}的格局为{doorAdvice}提供了有力支撑。',
        '逐一分析各宫：{palaces}宫{stars}加{gates}，{fortuneLevel}；{palaces}宫{stars}加{gates}，{blessings}。各宫之间的生克关系构成了完整的能量网络，{stall}出现时需特别警惕。',
        '用神宫位于{palaces}，{gates}当令，{stars}旺相，{blessings}。{deities}在此宫，提示{shenAdvice}。{palaces}宫与用神宫的{conflict}关系，决定了事情的顺利程度。',
        '宫位分析显示{fortuneLevel}的总体走势。{gates}所在的{palaces}最为吉利，{doorAdvice}。而{gate}所在的{palaces}则警示{caution}，{starAdvice}。',
      ],
    },
    {
      heading: '### 3. 方位指引',
      variants: [
        '{gates}位于{directions}方向，此为吉利之方，{doorAdvice}。{gates}位于{directions}方向，宜{blessings}。{gates}所在{directions}方位，{starAdvice}，需谨慎行事。',
        '方位吉凶解析：{directions}{gates}当值，{doorAdvice}是顺势之选；{directions}{gates}临{stars}，{starAdvice}。{directions}{deities}居此，{shenAdvice}。选择吉方行动可事半功倍。',
        '当前吉方在{directions}，{gates}与{deities}同宫共振，{blessings}。出行、谈判、求财宜面向{directions}。{directions}方位{stall}之气较重，建议暂时规避。',
        '根据奇门遁甲方位学，{gates}所在{directions}为首选吉方，{doorAdvice}。次选{directions}方位，{gates}与{stars}相配，{blessings}。行动前先辨方位，是奇门遁甲的基本法则。',
      ],
    },
    {
      heading: '### 4. 时令吉凶',
      variants: [
        '当前时令{season}，天时与{stars}形成共振。{timing}是今日最为吉利的时辰，{doorAdvice}。{timing}次之，{starAdvice}。在吉时行事能最大化利用天时能量。',
        '时令分析：{heavenStem}与{stems}的组合显示{fortuneLevel}。{timing}为值符时辰，{blessings}；{timing}为{deities}值使时辰，{shenAdvice}。选择合适的时辰是奇门遁甲的精髓所在。',
        '结合{directional}盘与时令，{stall}可能在{timing}附近出现，建议此期间{advice}。{timing}之后{stall}将化解，{blessings}的格局将全面显现。{timeResponse}内可见分晓。',
        '时令吉凶判断：{season}{stems}临旺，{fortuneLevel}。{season}宜{gates}之事，{doorAdvice}。{timing}是关键的决策时间窗口，{advice}。错过此时则需等待下一个{timing}。',
      ],
    },
    {
      heading: '### 5. 行动建议',
      variants: [
        '综合奇门遁甲四盘信息，{fortuneLevel}的整体格局为您的行动提供了坚实的天时支撑。{advice}是当前的核心策略，在{directions}方向、于{timing}、以{doorAdvice}的方式推进。',
        '天机建议优先在{gates}所在的{directions}方向，选择{timing}展开行动。{deities}的{shenAdvice}提示了有利的外部助力。{stall}出现时{advice}，待{timing}过后再行推进。',
        '行动纲领：{advice}。{gates}的开启提示了{doorAdvice}的道路，{stars}的照耀赋予了{starAdvice}的能量。{deities}的庇佑让{shenAdvice}成为可能。四象齐备，只待行动。',
        '奇门遁甲的核心在于"趋避"——趋吉方、避凶位。当前{directions}{blessings}，适合积极进取；{directions}{stall}较重，适合{advice}。在吉时吉方做吉事，是趋吉避凶的最高智慧。',
      ],
    },
  ],
  outro: [
    '奇门遁甲揭示的是时空中的最佳路径，行路的决心与勇气仍需您自己拿出。天机愿为您的每一步提供参考。',
    '遁甲之局千变万化，但万变不离其宗——天时地利人和，缺一不可。愿此解读助您择善而行。',
    '局盘是时空的快照，人生是连续的篇章。天机相信，了解了方向的人，脚下的路会更加坚定。',
  ],
};

/** 风水罗盘 */
export const FENGSHUI_TEMPLATES: SystemTemplates = {
  intro: [
    '天机以玄空风水理论为您分析当前空间的气场分布。九星飞布、宫位旺衰，关乎居住与办公环境中的运势流转。',
    '风水罗盘转定，吉凶方位已明。天机将从星曜分布、五行旺衰、峦头理气等多个维度为您解读当前的空间能量。',
    '一宅一气场，一方一天地。天机以飞星布局为依据，为您剖析当前空间的吉凶所在与调理之法。',
  ],
  sections: [
    {
      heading: '### 1. 方位吉凶',
      variants: [
        '玄空飞星分析显示，{stars}飞临{directions}{palaces}，此为{wealth}所在。{flyingStars}能量充沛，宜{tip}以催旺吉气。{palaces}{stars}为退气之星，需{remedies}以化解不利影响。',
        '各方位吉凶分布：{directions}{stars}{flyingStars}，大吉，适宜布置{palaces}功能区；{directions}{stars}退气，建议{remedies}；{directions}{stars}为{wealth}，宜聚不宜散。',
        '当前{directions}方位{stars}当旺，是住宅中能量最为充沛的区域。此方宜{arrangement}，以{tip}的方式维护气场。{directions}方位{stars}失令，{remedies}是稳妥的化解方法。',
        '{period}运盘显示，{stars}在中宫主事，各宫{stars}随之飞布。{entrance}的格局{fortune}，{bedrooms}的布局{fortune}。{outdoor}的外部形势对宅运的影响同样不可忽视。',
      ],
    },
    {
      heading: '### 2. 五行旺衰',
      variants: [
        '五行气场分析：{stars}属{elements}，居{shapes}之宫，{fortune}。{stars}与{stars}之间呈现{flyingStars}的五行关系，{resolution}是调和的根本方法。{elements}行过旺则需{remedies}。',
        '当前的五行分布为：{directions}{elements}旺，{directions}{elements}衰，{directions}{elements}中和。{elements}在{season}季节当令，{elements}在{season}季节失时。{flyingStars}之气影响全年运势基调。',
        '从五行生克角度看，{stars}（{elements}）与{stars}（{elements}）之间需平衡协调。{water}是旺运的关键，{indoor}的整体布局应围绕{elements}行的流通展开。',
        '玄空五行中，{stars}的{elements}性在{season}时节最为活跃。{palaces}的{elements}气与{stars}的{elements}气形成{relationship}关系，{fortune}。{remedies}是调适五行失衡的有效手段。',
      ],
    },
    {
      heading: '### 3. 气场分析',
      variants: [
        '巒头分析：{mountains}之势{fortune}，{outdoor}是风水中的理想格局。{arrangement}的室内布局为吉，{shapes}的房型{fortune}。{shaQi}的存在需引起重视，{remedies}可有效化解。',
        '内部气场方面，{entrance}的配置{fortune}，{indoor}的整体感觉较好。{bedrooms}的布局{fortune}，{kitchen}的设置{fortune}。{shaQi}是当前需要重点处理的负面因素。',
        '综合峦头理气分析：外部环境{outdoor}，{fortune}；内部格局{arrangement}，{fortune}。{palaces}宫位{stars}旺相，适合作为{palaces}功能区域。{shaQi}建议采用{resolution}字诀处理。',
        '气场流通性分析：{indoor}是维持气场的根本。{entrance}为纳气之口，{tip}能让吉气充分进入。{bedrooms}为养气之所，{arrangement}是最佳布局。{palaces}之气{fortune}，{remedies}可锦上添花。',
      ],
    },
    {
      heading: '### 4. 调整方案',
      variants: [
        '{wealth}方位{stars}旺相，建议{remedies}以催旺财气。{directions}{palaces}方位{stars}失令，可{remedies}化解。{entrance}前建议{remedies}，以{water}引吉气入宅。',
        '调整建议：在{palaces}{directions}角{remedies}，以增强{wealth}能量。{bedrooms}中{remedies}有助于提升睡眠质量。{kitchen}宜{water}，{remedies}可化解火气过旺。整体色调以{indoor}为主。',
        '化煞增吉方案：{shaQi}可{resolution}之；{stars}旺方宜{remedies}；{stars}衰方以{remedies}调理。{arrangement}是布置调整的总原则，{tip}是日常维护的好习惯。',
        '综合调整方案分为三步：第一步，在{entrance}处{remedies}引吉气入宅；第二步，在{bedrooms}中{remedies}安神养气；第三步，在{wealth}方位{remedies}催旺财运。{resolution}字诀适用于所有煞气的处理。',
      ],
    },
    {
      heading: '### 5. 注意事项',
      variants: [
        '风水调整{caution}，{resolution}要适度。{shaQi}不可忽视但也不必恐慌，多数煞气通过{remedies}即可有效化解。{tip}是日常维护风水的根本法则。{season}时节需特别注意{elements}行能量的保养。',
        '日常注意事项：保持{indoor}，避免{shapes}。定期检查{water}的方位与状态，{water}旺则财运旺。{entrance}前{shaQi}要及时处理，{remedies}是便捷有效的化解方式。',
        '风水之道贵在自然和谐，切勿矫枉过正。{tip}是基本原则，{arrangement}是理想状态。{palaces}与{palaces}之间的平衡尤为重要，{remedies}只需适度点缀，不必大动干戈。',
        '天机提醒：风水调理讲究顺势而为，最好的风水是人与环境的和谐共生。{indoor}是基础，{arrangement}是提升，{tip}是日常。保持平常心，风水自然会越来越好。',
      ],
    },
  ],
  outro: [
    '风水之道在于顺势调理，环境与心灵的和諧是最终的目标。愿您居家安宁、事业顺遂。',
    '好风水是修来的，行善积德、心存正气，才是风水学中最根本的吉星。天机与您共勉。',
    '空间是生活的容器，调理风水就是调理生活。愿这份解读为您打开一扇通透明亮的新窗。',
  ],
};

/** 数字能量 */
export const NUMEROLOGY_TEMPLATES: SystemTemplates = {
  intro: [
    '天机以生命数字能量学为您解读出生日期中蕴含的数字密码。每一个数字都有其独特的振动频率，共同编织成您的人生蓝图。',
    '数字是人类最古老的符号，也是宇宙能量的载体。天机为您解析出生日期中的数字组合，揭示隐藏在数字背后的人生智慧。',
    '您的出生日期暗含了独特的数字地图。天机将从核心数字、性格特质、人生路径、周期运势等方面为您全面解读。',
  ],
  sections: [
    {
      heading: '### 1. 核心数字',
      variants: [
        '您的{numberCode}为{lifePaths}，{numberMeanings}是您的核心能量主题。{birthCode}的组合展现了一个{personality}的灵魂蓝图。{expression}的表达方式让您在生活中自然呈现出独特的魅力。',
        '分析{numberCode}，{lifePaths}是您此生的主要课题。{numberMeanings}的天赋让您在{potential}方面拥有显著优势。{soulUrge}是驱动您不断前进的内在动力。',
        '数字解读显示，您的{lifePaths}与{cycle}之间形成了{personality}的共振。{numberMeanings}的本质决定了您的核心价值观，而{challenges}则提示了需要突破的成长瓶颈。',
      ],
    },
    {
      heading: '### 2. 性格解读',
      variants: [
        '您是典型的{destinyTypes}，{personality}是天性使然。{numberMeanings}的能量赋予了您{potential}，而{soulUrge}是您内心深处最真实的渴望。{tip}能帮助您更好地发挥天赋特质。',
        '数字人格分析：{personality}是您的主要性格标签，{destinyTypes}为核心人格类型。在人际交往中{careerMatch}的工作风格让您如鱼得水，在独处时{soulUrge}的愿望指引着自我探索的方向。',
        '{expression}的您，在人群中最容易展现出{personality}的一面。{advice}是您与生俱来的能力，{growDirection}则是您需要关注的发展方向。{challenges}提示您在特定阶段可能面临的考验。',
      ],
    },
    {
      heading: '### 3. 人生路径',
      variants: [
        '从{lifePaths}的路径来看，您的人生大致可分为{peaks}等阶段。其中{phase}期重在积累，{phase}期重在发展。{challenges}的存在不是障碍，而是推动您向{growDirection}方向成长的内在驱动力。',
        '人生路径分析：{cycle}阶段以{numberMeanings}为主导能量，{advice}是这一时期的行动准则。{peaks}期间{careerMatch}是最佳的职业方向。{challenges}是成长道路上的必修课。',
        '{lifePaths}的路径显示，您将在{peaks}迎来人生的高光时刻。{phase}的节奏提醒我们，{advice}。{growDirection}是今生最重要的成长方向，{challenges}会在适当的时候为您提供突破的契机。',
      ],
    },
    {
      heading: '### 4. 周期运势',
      variants: [
        '当前您正处于{cycle}的能量周期中，{numberMeanings}是该周期的核心主题。这一时期{advice}是最有效的行动原则。{timeResponse}后，下一个{cycle}周期将带来{potential}的新机遇。',
        '数字周期分析：{cycle}时期适合{advice}，{careerMatch}的工作领域将在此阶段大有可为。{challenges}方面的考验可能在{timeResponse}前后出现，{tip}是应对的最佳方式。',
        '从当前{cycle}周期的能量来看，{numberMeanings}的影响力贯穿始终。{phase}的主题是积累与沉淀，{phase}的方向是释放与实现。{advice}能帮助您更好地利用这一周期的能量。',
        '数字周期的轮转提醒我们：{cycle}是{phase}的季节，{numberMeanings}是播下的种子。{timeResponse}将见证这一周期的成果，{growDirection}的过程本身就是最好的回报。',
      ],
    },
    {
      heading: '### 5. 提升建议',
      variants: [
        '基于您的数字能量图，{advice}是最核心的提升方向。{luckyColor}是与您能量共振的幸运色，在日常生活中多接触这些颜色有助于增强正能量。{loveMatch}是理想的合作伙伴类型。',
        '个人提升建议：专注发展{potential}，这是数字赋予您的天赋优势。同时有意识地在{growDirection}方面下功夫，弥补数字能量中的薄弱环节。{tip}，让数字的智慧融入日常生活。',
        '天机建议将{advice}作为近期自我提升的重点。{careerMatch}领域值得深度探索，{loveMatch}的人际组合能带来良性互动。{luckyColor}的运用可从小处着手，潜移默化地改善能量场。',
      ],
    },
  ],
  outro: [
    '数字是宇宙的语言，每一个数字都在诉说着生命的奥秘。愿这份解读让您更了解自己，也更热爱生活。',
    '生命数字提供的是一幅能量地图，真正精彩的人生画卷还需要您亲手描绘。天机与您同行。',
  ],
};

/** 合并所有模板 */
export const ALL_TEMPLATES: Record<string, SystemTemplates> = {
  bazi: BAZI_TEMPLATES,
  tarot: TAROT_TEMPLATES,
  zodiac: ZODIAC_TEMPLATES,
  dream: DREAM_TEMPLATES,
  ziwei: ZIWEI_TEMPLATES,
  shengxiao: SHENGXIAO_TEMPLATES,
  liuyao: LIUYAO_TEMPLATES,
  meihua: MEIHUA_TEMPLATES,
  qimen: QIMEN_TEMPLATES,
  fengshui: FENGSHUI_TEMPLATES,
  numerology: NUMEROLOGY_TEMPLATES,
};

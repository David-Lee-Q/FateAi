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
        '事业宫位的能量显示{careerTrend}。近期{opportunity}方面值得关注，{action}能帮助您在职场中脱颖而出。',
      ],
    },
    {
      heading: '### 财运分析',
      variants: [
        '正财运{wealth1}，偏财运{wealth2}。适合在{timeWindow}做出{financeMove}的决策。幸运数字：{luckyNum}。',
        '财务方面整体{trend}，{source}是主要的收入增长点。建议{tip}，避免{avoid}。理性规划让财富持续增长。',
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

/** 合并所有模板 */
export const ALL_TEMPLATES: Record<string, SystemTemplates> = {
  bazi: BAZI_TEMPLATES,
  tarot: TAROT_TEMPLATES,
  zodiac: ZODIAC_TEMPLATES,
  dream: DREAM_TEMPLATES,
  ziwei: ZIWEI_TEMPLATES,
  shengxiao: SHENGXIAO_TEMPLATES,
};

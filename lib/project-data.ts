export type MetricRow = {
  model: string;
  owner: string;
  setup: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  insight: string;
};

export type GroupMember = {
  name: string;
  matric: string;
  role: string;
  focus: string;
};

export type ModelProfile = {
  interpretability: number;
  stability: number;
  deploymentFit: number;
  narrative: string;
};

export const projectMeta = {
  title: 'Binary Classification of Relationship Success Using User Behavioral Metrics',
  subtitle: 'Predictive modeling of long-term relationship formation in dating applications',
  shortLabel: 'Relationship Success Classifier',
  datasetSize: 50000,
  features: 19,
  members: 6,
  modelFamilies: 6,
  target: 'Relationship Formed',
  positiveRate: 9.73,
};

export const storyModes = {
  honest: {
    label: 'Honest mode',
    description: 'Show the project as it really is: a hard classification problem where variance in the feature space limits performance.',
    accent: '#ef6b5b',
  },
  balanced: {
    label: 'Balanced mode',
    description: 'Frame the project around the most defensible takeaway: SMOTE helps reveal model behavior, but it does not create signal.',
    accent: '#2f8d83',
  },
  optimistic: {
    label: 'Optimistic mode',
    description: 'Present the project as a meaningful digital-courtship case study that still produces practical insights despite weak predictive ceilings.',
    accent: '#d5a24f',
  },
} as const;

export const narrativePoints = [
  'Binary target: predict whether a relationship is formed.',
  'Feature space: behavioral, demographic, and app-usage signals from a synthetic dating dataset.',
  'Core challenge: severe class imbalance and limited separability.',
  'Main lesson: high nominal accuracy can hide weak minority-class detection.',
];

export const pipeline = [
  {
    step: '01',
    title: 'Problem framing',
    text: 'Choose relationship formation as the target and define the task as a binary classification problem instead of a general dating-outcome survey.',
  },
  {
    step: '02',
    title: 'Preprocessing',
    text: 'Prepare train and test splits, preserve the imbalanced test set, and generate Dataset A and Dataset B for feature-track comparison.',
  },
  {
    step: '03',
    title: 'Feature track design',
    text: 'Use correlation-based feature selection for interpretability in Dataset A and PCA for compressed latent structure in Dataset B.',
  },
  {
    step: '04',
    title: 'Balancing strategy',
    text: 'Apply SMOTE only to the training split so every model sees stronger minority-class representation without contaminating evaluation.',
  },
  {
    step: '05',
    title: 'Model training',
    text: 'Compare XGBoost, Random Forest, KNN, Logistic Regression, SVM, and AutoML under consistent evaluation criteria.',
  },
  {
    step: '06',
    title: 'Interpretation',
    text: 'Explain the ceiling effect: the available behavior metrics do not carry enough stable variance to support strong long-term relationship classification.',
  },
];

export const featureTracks = [
  {
    name: 'Dataset A',
    label: 'Explainable track',
    value: 'Correlation-based feature selection',
    detail: 'Keeps human-readable variables intact, making it easier to interpret behavioral signals such as message counts and emoji usage.',
  },
  {
    name: 'Dataset B',
    label: 'Compressed track',
    value: 'Principal Component Analysis (PCA)',
    detail: 'Slightly stronger mathematically in some runs, but harder to explain because the original variables collapse into abstract components.',
  },
];

export const imbalanceFrames = [
  {
    label: 'Original train/test reality',
    negative: 90.27,
    positive: 9.73,
    takeaway: 'A model can look strong by mostly predicting the majority class.',
  },
  {
    label: 'SMOTE training view',
    negative: 50,
    positive: 50,
    takeaway: 'The classifier is forced to learn a decision boundary for the minority class.',
  },
];

export const modelProfiles: Record<string, ModelProfile> = {
  'XGBoost': {
    interpretability: 0.42,
    stability: 0.63,
    deploymentFit: 0.58,
    narrative: 'Good for nonlinear signal, but here it still struggles because the dataset itself does not support clean class separation.',
  },
  'Random Forest': {
    interpretability: 0.68,
    stability: 0.75,
    deploymentFit: 0.74,
    narrative: 'The most balanced family in this project. Tree ensembles handled the dataset better than the linear baselines without pretending the problem is solved.',
  },
  'KNN': {
    interpretability: 0.61,
    stability: 0.53,
    deploymentFit: 0.44,
    narrative: 'Useful as a local-neighborhood baseline, but sensitive to noisy structure and scaling decisions.',
  },
  'Logistic Regression': {
    interpretability: 0.86,
    stability: 0.55,
    deploymentFit: 0.8,
    narrative: 'Strong as an explainable baseline, but the linear boundary exposes how weak the available signal really is.',
  },
  'SVM': {
    interpretability: 0.48,
    stability: 0.57,
    deploymentFit: 0.51,
    narrative: 'Margin-based classification offers another perspective on separation, but the measured features remain too noisy for strong gains.',
  },
  'AutoML': {
    interpretability: 0.31,
    stability: 0.45,
    deploymentFit: 0.39,
    narrative: 'Helpful as a benchmark and for showing what automated search does under the same data constraints.',
  },
};

export const modelRuns: MetricRow[] = [
  {
    model: 'XGBoost',
    owner: 'Mohammed Khan',
    setup: 'Dataset A - Normal',
    accuracy: 0.9025,
    precision: 0.0,
    recall: 0.0,
    f1: 0.0,
    auc: 0.4844,
    insight: 'Very high accuracy, but minority-class collapse makes the run practically unusable for the target objective.',
  },
  {
    model: 'XGBoost',
    owner: 'Mohammed Khan',
    setup: 'Dataset A - SMOTE',
    accuracy: 0.8178,
    precision: 0.0883,
    recall: 0.0935,
    f1: 0.0908,
    auc: 0.4901,
    insight: 'SMOTE increases activity toward the minority class, but not enough to push the model beyond near-random discrimination.',
  },
  {
    model: 'XGBoost',
    owner: 'Mohammed Khan',
    setup: 'Dataset B - Normal',
    accuracy: 0.9027,
    precision: 0.0,
    recall: 0.0,
    f1: 0.0,
    auc: 0.4969,
    insight: 'PCA keeps the majority-class illusion intact when no balancing pressure is added.',
  },
  {
    model: 'XGBoost',
    owner: 'Mohammed Khan',
    setup: 'Dataset B - SMOTE',
    accuracy: 0.6946,
    precision: 0.0924,
    recall: 0.2425,
    f1: 0.1339,
    auc: 0.4948,
    insight: 'Recall improves more visibly here, but the model still sits close to the random baseline in ROC-AUC.',
  },
  {
    model: 'Random Forest',
    owner: 'Du Yifei',
    setup: 'Dataset A - Normal',
    accuracy: 0.8769,
    precision: 0.4902,
    recall: 0.4967,
    f1: 0.4858,
    auc: 0.4902,
    insight: 'High nominal accuracy, but the ceiling effect remains visible once minority-class metrics are examined.',
  },
  {
    model: 'Random Forest',
    owner: 'Du Yifei',
    setup: 'Dataset A - SMOTE',
    accuracy: 0.7685,
    precision: 0.4922,
    recall: 0.488,
    f1: 0.486,
    auc: 0.488,
    insight: 'SMOTE lowers superficial accuracy but produces a more honest test of minority-class mapping.',
  },
  {
    model: 'Random Forest',
    owner: 'Du Yifei',
    setup: 'Dataset B - Normal',
    accuracy: 0.9024,
    precision: 0.4513,
    recall: 0.4998,
    f1: 0.4743,
    auc: 0.5052,
    insight: 'The best raw-accuracy configuration, but not the best practical story for the classification target.',
  },
  {
    model: 'Random Forest',
    owner: 'Du Yifei',
    setup: 'Dataset B - SMOTE',
    accuracy: 0.8507,
    precision: 0.5001,
    recall: 0.5,
    f1: 0.4983,
    auc: 0.5075,
    insight: 'Best balance in the project: the strongest F1 and the best AUC among the surfaced runs.',
  },
  {
    model: 'KNN',
    owner: 'MD Musa Al Kafi',
    setup: 'Dataset A - SMOTE',
    accuracy: 0.6809,
    precision: 0.4966,
    recall: 0.4922,
    f1: 0.4701,
    auc: 0.4874,
    insight: 'A respectable baseline once balanced training is introduced, but still short of meaningful discrimination.',
  },
  {
    model: 'KNN',
    owner: 'MD Musa Al Kafi',
    setup: 'Dataset B - SMOTE',
    accuracy: 0.7396,
    precision: 0.5005,
    recall: 0.5009,
    f1: 0.4897,
    auc: 0.4998,
    insight: 'The strongest KNN run, though the AUC again shows the boundary of what the data can support.',
  },
  {
    model: 'Logistic Regression',
    owner: 'Rasha Kultsum Mahdiyah',
    setup: 'Dataset A - SMOTE',
    accuracy: 0.5261,
    precision: 0.094,
    recall: 0.4481,
    f1: 0.1554,
    auc: 0.4947,
    insight: 'An important linear baseline that makes the class imbalance problem highly visible.',
  },
  {
    model: 'Logistic Regression',
    owner: 'Rasha Kultsum Mahdiyah',
    setup: 'Dataset B - Normal',
    accuracy: 0.5145,
    precision: 0.0976,
    recall: 0.4841,
    f1: 0.1625,
    auc: 0.5054,
    insight: 'Near-random separation, but still useful as evidence that linear structure is not enough for this target.',
  },
  {
    model: 'SVM',
    owner: 'Selva Kumari a/p Vasudevan',
    setup: 'Dataset A - Normal',
    accuracy: 0.562,
    precision: 0.0983,
    recall: 0.4286,
    f1: 0.16,
    auc: 0.499,
    insight: 'SVM changes the geometry of the classifier, but the underlying information content still limits performance.',
  },
  {
    model: 'AutoML',
    owner: 'Selva Kumari a/p Vasudevan',
    setup: 'Dataset A - SMOTE',
    accuracy: 0.1431,
    precision: 0.0975,
    recall: 0.9455,
    f1: 0.1768,
    auc: 0.499,
    insight: 'A strong example of why recall alone is not enough to declare a model useful.',
  },
  {
    model: 'SVM',
    owner: 'Selva Kumari a/p Vasudevan',
    setup: 'Dataset B - Normal',
    accuracy: 0.5143,
    precision: 0.0979,
    recall: 0.4861,
    f1: 0.163,
    auc: 0.5025,
    insight: 'Slightly better threshold-free behavior than some other baselines, but still fundamentally constrained.',
  },
  {
    model: 'AutoML',
    owner: 'Selva Kumari a/p Vasudevan',
    setup: 'Dataset B - SMOTE',
    accuracy: 0.1101,
    precision: 0.0972,
    recall: 0.9825,
    f1: 0.1769,
    auc: 0.5025,
    insight: 'Shows how automated search can still over-commit to recall when the task itself is under-informative.',
  },
];

export const groupMembers: GroupMember[] = [
  {
    name: 'Rasha Kultsum Mahdiyah',
    matric: '25065905',
    role: 'Problem framing and Logistic Regression',
    focus: 'Helped frame the target and produced linear baseline analysis with interpretation.',
  },
  {
    name: 'Sun Yaxin',
    matric: '25066696',
    role: 'EDA support and integration',
    focus: 'Supported exploratory interpretation and synthesis across team outputs for presentation readiness.',
  },
  {
    name: 'Selva Kumari a/p Vasudevan',
    matric: '25065753',
    role: 'SVM and AutoML',
    focus: 'Handled margin-based classification and automated benchmarking for comparison.',
  },
  {
    name: 'MD Musa Al Kafi',
    matric: '25063686',
    role: 'KNN experiments',
    focus: 'Built distance-based experiments and evaluated SMOTE effects on local-neighborhood models.',
  },
  {
    name: 'Du Yifei',
    matric: '25063187',
    role: 'Random Forest analysis',
    focus: 'Produced the strongest-performing tree ensemble results and interpretation around the performance ceiling.',
  },
  {
    name: 'Mohammed Khan',
    matric: '25051794',
    role: 'XGBoost and tuning',
    focus: 'Built boosting models, tuning routines, and supporting comparison outputs.',
  },
];

export const insights = [
  {
    title: 'Data variance is the real bottleneck',
    text: 'The models do not fail because the algorithms are weak. They fail because the observable features do not contain enough stable variance to support reliable long-term relationship classification.',
  },
  {
    title: 'SMOTE improves honesty, not certainty',
    text: 'Balancing helps the models stop hiding behind majority-class accuracy, but it does not create a clean separable boundary where the dataset lacks one.',
  },
  {
    title: 'Dataset B wins slightly on score, Dataset A wins on meaning',
    text: 'PCA gives a small mathematical edge in some runs, while the original feature track remains far easier to interpret in human terms.',
  },
  {
    title: 'The project still matters even without a perfect classifier',
    text: 'The strongest academic value comes from the pipeline design, honest evaluation, and the ability to explain why performance saturates near the random baseline.',
  },
];

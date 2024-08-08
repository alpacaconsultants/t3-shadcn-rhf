export const PROJECT_NAME = 'tj-nm';

const conSep = '-';

export const getConstructId = (constructId: string, stage?: string): string => {
  const contItems = [PROJECT_NAME, stage, constructId].filter((v) => v != null);

  return contItems.join(conSep);
};

export const getConstructName = (constructId: string, stage?: string): string => getConstructId(constructId, stage);

export const getConstructDescription = (constructId: string, stage?: string): string => getConstructId(constructId, stage);

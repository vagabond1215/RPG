export const QUEST_FIELDS = ['title','description','location','requirements','conditions','timeline','risks','reward'];

export function questHelper(details) {
  const quest = { ...details };
  QUEST_FIELDS.forEach(field => {
    if (quest[field] === undefined) {
      console.warn(`Quest missing ${field}`);
      quest[field] = null;
    }
  });
  return quest;
}

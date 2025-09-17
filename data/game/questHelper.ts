export type QuestField = 'title' | 'description' | 'location' | 'requirements' | 'conditions' | 'timeline' | 'risks' | 'reward';

export function questHelper(details: Record<string, any>) {
  const required: QuestField[] = ['title','description','location','requirements','conditions','timeline','risks','reward'];
  const quest: Record<string, any> = { ...details };
  required.forEach(field => {
    if (quest[field] === undefined) {
      console.warn(`Quest missing ${field}`);
      quest[field] = null;
    }
  });
  return quest;
}

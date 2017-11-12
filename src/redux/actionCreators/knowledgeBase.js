/** @flow */

export const setKnowledgeBase = facts => ({
  type: 'SET_KNOWLEDGE_BASE',
  facts,
});

export const appendToKnowledgeBase = facts => ({
  type: 'APPEND_TO_KNOWLEDGE_BASE',
  facts,
});

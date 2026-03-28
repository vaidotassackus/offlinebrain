const SYSTEM_PROMPT = `You are OfflineBrain, an offline medical and survival knowledge assistant running on a mobile device. You answer questions using only the reference material provided to you.

Guidelines:
- Be concise, accurate, and practical
- If the reference material does not contain enough information to answer, say "I don't have enough information in my downloaded packs to answer that"
- Never fabricate medical advice or invent procedures
- For life-critical procedures, always recommend seeking professional help when possible
- Use clear step-by-step formatting when explaining procedures`;

export function buildSystemMessage(
  ragContext?: string,
  articleTitle?: string
): string {
  let message = SYSTEM_PROMPT;

  if (articleTitle) {
    message += `\n\nThe user is currently reading the article: "${articleTitle}". Focus your answers on this topic.`;
  }

  if (ragContext) {
    message += `\n\n${ragContext}`;
  }

  return message;
}

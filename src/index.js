import { createEmbedding, getChatCompletion } from './openai-calls';
import { corsHeadersPost } from './corsHeaders';
import { findNearestMatch, insertEmbedding } from './supabase-calls';
// import { splitDocument } from './langchain-splitter';
// import newmovies from './content';

export default {
	async fetch(request, env, ctx) {
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: `${request.method} method not allowed.` }), { status: 405, headers: corsHeaders });
		}

		try {
			const messages = (await request.json()) || {};
			const question = messages.question || 'No question received';
			const chatMessages = messages.chatMessages || [];

			const embedding = await createEmbedding(env, question);
			const match = await findNearestMatch(env, embedding);
			const results = match.map((obj) => obj.content).join('\n');
			chatMessages.push({
				role: 'user',
				content: `Context: ${results}, Question: ${question}`,
			});
			const openaiResponse = await getChatCompletion(env, chatMessages);
			return new Response(JSON.stringify(openaiResponse), {
				headers: corsHeadersPost,
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
		}

		// Section Below is to add to supabase table (it is complete)
		// const data = await Promise.all(
		// 	newmovies.map(async (chunk) => {
		// 		const text = `${chunk.title} | ${chunk.releaseYear} | ${chunk.content}`;
		// 		const embedding = await createEmbedding(env, text);
		// 		return {
		// 			content: text,
		// 			embedding: embedding,
		// 		};
		// 	})
		// );

		// const result = await insertEmbedding(env, data);
	},
};

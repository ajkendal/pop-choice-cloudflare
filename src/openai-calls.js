import OpenAI from 'openai';

const baseURL = 'https://gateway.ai.cloudflare.com/v1/e6ce664595e6c095158447cc6b80bc37/pop-choice/openai';

export async function createEmbedding(env, inputText) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
		baseURL: baseURL,
	});
	try {
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-ada-002',
			input: inputText,
		});

		const response = embeddingResponse.data[0].embedding;
		return response;
	} catch (error) {
		console.error('Error creating embedding:', error);
		return error;
	}
}

export async function getChatCompletion(env, messages) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
		baseURL: baseURL,
	});
	const response = await openai.chat.completions.create({
		model: 'gpt-4.1-mini',
		messages: messages,
		temperature: 0.65,
		frequency_penalty: 0.5,
	});

	const choices = { role: response.choices[0].message.role, content: response.choices[0].message.content };

	return choices;
}

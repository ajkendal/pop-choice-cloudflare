import { createClient } from '@supabase/supabase-js';

export async function findNearestMatch(env, embedding) {
	const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);
	const { data } = await supabase.rpc('match_movies', {
		query_embedding: embedding,
		match_threshold: 0.5,
		match_count: 4,
	});

	return data;
}

export async function insertEmbedding(env, data) {
	const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_API_KEY);
	try {
		await supabase.from('movies').insert(data);
	} catch (error) {
		console.error('Error inserting embedding:', error);
		return error;
	}
	return data;
}

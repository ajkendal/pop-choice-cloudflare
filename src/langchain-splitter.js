import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import newmovies from './content';

export async function splitDocument() {
	const text = newmovies.map((movie) => `${movie.title} | ${movie.releaseYear} | ${movie.content}`).join('\n\n');

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 200,
		chunkOverlap: 2,
	});
	const output = await splitter.createDocuments([text]);

	return output;
}

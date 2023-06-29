import { Resolver, Query } from '@nestjs/graphql';
import { Lexicon } from './lexicon.model';

@Resolver(() => Lexicon)
export class LexiconResolver {
  @Query(() => [Lexicon])
  async lexFindAll(): Promise<Lexicon[]> {
    return [];
  }
}

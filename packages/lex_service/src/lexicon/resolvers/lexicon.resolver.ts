import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LexiconCreate } from '../dtos/lexicon.dto';
import { Lexicon } from '../models/lexicon.model';
import { LexiconCreatePipe } from '../pipes/lexicon-create.pipe';
import { LexiconService } from '../services/lexicon.service';

@Resolver(() => Lexicon)
export class LexiconResolver {
  constructor(private readonly lexiconService: LexiconService) {}

  @Mutation(() => Lexicon)
  async lexiconCreate(@Args('lexicon', LexiconCreatePipe) lexicon: LexiconCreate): Promise<Lexicon> {
    return this.lexiconService.create(lexicon);
  }

  @Query(() => [Lexicon])
  async lexFindAll(): Promise<Lexicon[]> {
    return this.lexiconService.findAll();
  }
}

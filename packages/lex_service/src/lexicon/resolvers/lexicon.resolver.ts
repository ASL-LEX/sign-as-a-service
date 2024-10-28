import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LexiconCreate } from '../dtos/lexicon.dto';
import { Lexicon } from '../models/lexicon.model';
import { LexiconCreatePipe } from '../pipes/lexicon-create.pipe';
import { LexiconService } from '../services/lexicon.service';
import { AuthGuard } from '../../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Schema as JSONSchema } from 'ajv';
import { LexiconPipe } from '../pipes/lexicon.pipe';

@Resolver(() => Lexicon)
export class LexiconResolver {
  constructor(private readonly lexiconService: LexiconService) {}

  @Mutation(() => Lexicon)
  @UseGuards(AuthGuard)
  async lexiconCreate(@Args('lexicon', LexiconCreatePipe) lexicon: LexiconCreate): Promise<Lexicon> {
    return this.lexiconService.create(lexicon);
  }

  @Mutation(() => Lexicon)
  @UseGuards(AuthGuard)
  async lexiconUpdate(
    @Args('lexicon', { type: () => String }, LexiconPipe) lexicon: Lexicon,  
  ): Promise<Lexicon> {
    const updatedLexicon = await this.lexiconService.update(lexicon);  
    if (!updatedLexicon) {
      throw new Error(`Lexicon not found`);
    }
    return updatedLexicon;
  }

  @Query(() => [Lexicon])
  async lexFindAll(): Promise<Lexicon[]> {
    return this.lexiconService.findAll();
  }
}

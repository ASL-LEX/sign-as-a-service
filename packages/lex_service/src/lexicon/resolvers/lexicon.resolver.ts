import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LexiconCreate, LexiconUpdate } from '../dtos/lexicon.dto';
import { Lexicon } from '../models/lexicon.model';
import { LexiconCreatePipe } from '../pipes/lexicon-create.pipe';
import { LexiconService } from '../services/lexicon.service';
import { AuthGuard } from '../../auth/auth.guard';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { Schema as JSONSchema } from 'ajv';
import { LexiconPipe } from '../pipes/lexicon.pipe';

@Resolver(() => Lexicon)
export class LexiconResolver {
  constructor(private readonly lexiconService: LexiconService, private lexiconPipe: LexiconPipe) {}

  @Mutation(() => Lexicon)
  @UseGuards(AuthGuard)
  async lexiconCreate(@Args('lexicon', LexiconCreatePipe) lexicon: LexiconCreate): Promise<Lexicon> {
    return this.lexiconService.create(lexicon);
  }

  @Mutation(() => Lexicon)
  @UseGuards(AuthGuard)
  async lexiconUpdate(
    @Args('updateData', { type: () => LexiconUpdate }) updateData: LexiconUpdate // Optional update data
  ): Promise<Lexicon> {
    await this.lexiconPipe.transform(updateData._id);
    const updatedLexicon = await this.lexiconService.update(updateData);
    if (!updatedLexicon) {
      throw new NotFoundException(`Lexicon not found`);
    }
    return updatedLexicon;
  }

  @Query(() => [Lexicon])
  async lexFindAll(): Promise<Lexicon[]> {
    return this.lexiconService.findAll();
  }
}

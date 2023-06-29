import { Test, TestingModule } from '@nestjs/testing';
import { LexiconEntryResolver } from './lexicon-entry.resolver';

describe('LexiconEntryResolver', () => {
  let resolver: LexiconEntryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LexiconEntryResolver],
    }).compile();

    resolver = module.get<LexiconEntryResolver>(LexiconEntryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

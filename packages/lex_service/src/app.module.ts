import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import { LexiconModule } from './lexicon/lexicon.module';
import { LexiconEntryModule } from './lexicon-entry/lexicon-entry.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql'
      },
      driver: ApolloFederationDriver
    }),
    LexiconModule,
    LexiconEntryModule
  ],
})
export class AppModule {}

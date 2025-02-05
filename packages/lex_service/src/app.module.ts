import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { LexiconModule } from './lexicon/lexicon.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      autoSchemaFile: {
        federation: 2,
        path: 'schema.gql'
      },
      driver: ApolloFederationDriver
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('database.host')
      }),
      inject: [ConfigService]
    }),
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        googleApplicationCredential: {
          clientEmail: configService.getOrThrow('gcp.clientEmail'),
          projectId: configService.getOrThrow('gcp.projectId'),
          privateKey: configService.getOrThrow('gcp.privateKey')
        }
      }),
      inject: [ConfigService]
    }),
    LexiconModule,
    AuthModule
  ]
})
export class AppModule {}

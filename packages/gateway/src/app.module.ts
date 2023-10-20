import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import configuration from './config/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloGatewayDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: {
          path: 'schema.gql',
          federation: 2
        },
        gateway: {
          buildService: ({ url }) => {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                if (context.req && context.req.headers) {
                  // Copy over authentication
                  request.http!.headers.set('authorization', context.req.headers.authorization);
                }
              }
            });
          },
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'lex', url: configService.getOrThrow('lex.uri') },
              { name: 'model', url: configService.getOrThrow('model.uri') }
            ],
          })
        }
      })
    })
  ]
})
export class AppModule {}

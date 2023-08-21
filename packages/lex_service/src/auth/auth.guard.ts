import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Temporary auth guard that validates against a fixed "key"
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly token: string;

  constructor(configService: ConfigService) {
    this.token = configService.getOrThrow<string>('auth.token');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = GqlExecutionContext.create(context).getContext().req;

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    return token == this.token;
  }
}

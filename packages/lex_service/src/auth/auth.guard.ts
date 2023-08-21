import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

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
    const req = context.switchToHttp().getRequest();

    const authHeader = req.header['Authorization'];
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(' ');
    if (token.length < 2) {
      return false;
    }

    return token == this.token;
  }
}

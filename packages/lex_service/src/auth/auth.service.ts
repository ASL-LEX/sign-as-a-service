import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class AuthService {
  private readonly serviceKey = this.configService.getOrThrow<string>('auth.token');

  constructor(@InjectFirebaseAdmin() private firebaseAdmin: FirebaseAdmin, private readonly configService: ConfigService) {}

  async verifyToken(token: string): Promise<boolean> {
    if (token == this.serviceKey) {
      return true;
    }

    try {
      await this.firebaseAdmin.auth.verifyIdToken(token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

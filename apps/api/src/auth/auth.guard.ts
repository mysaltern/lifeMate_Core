import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService,private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const token = authHeader.split(' ')[1];

    try {
      const AUTH_URL = this.configService.get<string>('AUTH_URL');
      console.log(AUTH_URL);
      console.log('auth was<--')
      
      const authServiceUrl = `${AUTH_URL}/auth/validate-token`;
      const response = await lastValueFrom(
        this.httpService.post(authServiceUrl, { token })
      );
      console.log(response)
      
      // Attach user data to the request
      request.user = response.data.decoded;
      return true;
    } catch (error) {

      const AUTH_URL = this.configService.get<string>('AUTH_URL');
      console.log('TEST AWS');
      console.log(AUTH_URL);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

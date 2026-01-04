import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    if (!token) throw new ForbiddenException('NO AUTH TOKEN FOUND');
    token = token.split(' ')[1];
    const user = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    request.user = user;
    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

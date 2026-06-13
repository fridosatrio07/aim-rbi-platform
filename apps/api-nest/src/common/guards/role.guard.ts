import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { REQUIRED_ROLES_KEY, type KnowledgeRole } from "../decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<KnowledgeRole[]>(REQUIRED_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    // TODO: Replace this header-based placeholder with the platform RBAC/auth context.
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();
    const roleHeader = request.headers["x-user-role"];
    const role = Array.isArray(roleHeader) ? roleHeader[0] : roleHeader;

    return Boolean(role && requiredRoles.includes(role as KnowledgeRole));
  }
}

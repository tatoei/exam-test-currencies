import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	override canActivate(context: ExecutionContext) {
		return super.canActivate(context)
	}

	override handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
		if (err || !user) {
			throw new UnauthorizedException('Unauthorized')
		}

		const request = context.switchToHttp().getRequest()
		request.user = user // ✅ ใส่ user ลงใน request

		return user
	}
}

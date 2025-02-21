import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user?.id // ดึง userId จาก request (ต้องแน่ใจว่า JWT Guard ทำงานก่อน)
})

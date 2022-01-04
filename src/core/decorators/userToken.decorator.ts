import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'


export const UserToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['token'];
    if ( token ) {
        return token
    } else {
        throw new BadRequestException("User's Token not found");
    }
})
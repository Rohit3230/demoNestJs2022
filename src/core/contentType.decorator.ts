import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common'


export const ContentType = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const contentType = request.headers['Content-Type'] || request.headers['content-type']
    if (!contentType) {
        throw new BadRequestException("ContentType missing");
    } else {
        return contentType;
    }
})
module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        switch (error.name) {
            case 'ValidationError':
                ctx.status = 400;
                ctx.body = { message: error.message };
                break;
            case 'CastError':
                ctx.status = 400;
                ctx.body = { message: 'Invalid object type' };
                break;
            case 'QuerySyntaxError':
                ctx.status = 400;
                ctx.body = { message: 'Invalid query syntax' };
                break;
            default:
                ctx.status = 500;
                ctx.body = { message: 'Internal server error' };
        }
    }
};


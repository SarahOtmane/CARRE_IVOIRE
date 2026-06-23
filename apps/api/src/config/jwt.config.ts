import type { JwtModuleOptions } from '@nestjs/jwt'

export const jwtConfig = (): JwtModuleOptions => {
    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET
    const accessTokenExpiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h'

    if (!accessTokenSecret) {
        throw new Error('JWT_ACCESS_TOKEN_SECRET environment variable is not set')
    }

    return {
        secret: accessTokenSecret,
        signOptions: {
            expiresIn: accessTokenExpiresIn,
            algorithm: 'HS256',
        },
    }
}

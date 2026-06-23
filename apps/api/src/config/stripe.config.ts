export interface StripeConfig {
    secretKey: string
    webhookSecret: string
    apiVersion: string
}

export const stripeConfig = (): StripeConfig => {
    const secretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }

    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set')
    }

    return {
        secretKey,
        webhookSecret,
        apiVersion: '2023-10-16',
    }
}

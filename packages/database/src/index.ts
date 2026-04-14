import {PrismaClient} from './generated/client/index.js';

// Singleton pattern to avoid leaking database connections in development with hot reload
declare global {
    var __prisma: PrismaClient | undefined;
}

export const prisma = (global as any).__prisma ?? new PrismaClient({log: ["warn", "error"]});

if (process.env.NODE_ENV !== 'production') {
    (global as any).__prisma = prisma;
}

export * from "./generated/client";
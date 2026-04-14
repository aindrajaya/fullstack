import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {prisma} from "@repo/database";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await prisma.$connect();
        console.log("✅ Terhubung ke database");
    }
    async onModuleDestroy() {
        await prisma.$disconnect();
        console.log("❌ Database disconnected");
    }

    get client() {
        return prisma;
    }
}
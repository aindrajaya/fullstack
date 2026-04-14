import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {CreateUserDTO} from "@repo/shared";

@Injectable()
export class UsersService {
    private prisma: PrismaService;

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        this.prisma = prisma;
    }

    async findAll(){
        return this.prisma.client.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });  
    }

    async findOne(id: string) {
        return this.prisma.client.user.findUnique({
            where: {
                id
            }
        });
    }

    async create(data: CreateUserDTO) {
        return this.prisma.client.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: "USER"
            }
        });
    }    
}
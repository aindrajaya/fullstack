import {Body, Controller, Get, Inject, Param, Post} from "@nestjs/common";
import { UsersService } from "./users.service";
import {CreateUserDTO} from "@repo/shared";

@Controller("users")
export class UsersController {
    private usersService: UsersService;

    constructor(@Inject(UsersService) usersService: UsersService) {
        this.usersService = usersService;
        this.findAll = this.findAll.bind(this);
        this.findOne = this.findOne.bind(this);
        this.create = this.create.bind(this);
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.usersService.create(data);
    }
}
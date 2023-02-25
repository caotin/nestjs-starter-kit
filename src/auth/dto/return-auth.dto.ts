import { Expose, Type } from "class-transformer";
import { ReturnAccountDto } from "./return-account.dto";

export class ReturnAuthDto {
    @Expose()
    accessToken: string;
    
    @Expose()
    refreshToken: string;

    @Expose()
    @Type(() => ReturnAccountDto)
    account: ReturnAccountDto
}
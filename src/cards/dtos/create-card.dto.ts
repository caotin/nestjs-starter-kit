import { PaymentMethods } from "@enums/paymentMethods"
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, Length, Matches } from "class-validator";
import { CARD_NUMBER_PATTERN, CVC_NUMBER_PATTERN } from "@/common/regex-pattern";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PaymentMethods)
    type: PaymentMethods;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Matches(CARD_NUMBER_PATTERN)
    number: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    expMonth: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    expYear: number;
    
    @ApiProperty()
    @IsNotEmpty()
    @Matches(CVC_NUMBER_PATTERN)
    cvc: string;
}
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  phoneNo: string;
}

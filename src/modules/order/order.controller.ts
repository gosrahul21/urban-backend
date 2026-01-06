import { Body, Controller, Param, Post, Req, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}
    @Post()
    createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
        return this.orderService.createOrder(req.user.id, dto);
    }

    @Patch(':id/cancel')
    cancelOrder(
    @Param('id') orderId: string,
    @Req() req: any,
    @Body() dto: CancelOrderDto,
    ) {
    return this.orderService.cancelOrder(orderId, req.user.id, dto);
    }

}
import { Controller, Get, Patch, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { HistoireService } from './histoire.service'
import { UpdateHistoireSectionDto } from './dto/update-histoire-section.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'

@Controller('histoire')
export class HistoireController {
  constructor(private readonly histoireService: HistoireService) {}

  @Get()
  findAll() {
    return this.histoireService.findAll()
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHistoireSectionDto) {
    return this.histoireService.update(id, dto)
  }
}

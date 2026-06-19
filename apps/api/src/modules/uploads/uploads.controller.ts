import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'
import type { Request } from 'express'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const multer = require('multer')

const UPLOAD_DIR = join(process.cwd(), 'uploads')
const ALLOWED_EXT = /\.(jpg|jpeg|png|webp)$/i
const MAX_SIZE_BYTES = 5 * 1024 * 1024

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req: unknown, file: { originalname: string }, cb: (err: null, name: string) => void) => {
    cb(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`)
  },
})

@Controller('uploads')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: { fileSize: MAX_SIZE_BYTES },
      fileFilter: (_req: unknown, file: { originalname: string }, cb: (err: Error | null, accept: boolean) => void) => {
        if (!ALLOWED_EXT.test(extname(file.originalname))) {
          return cb(new BadRequestException('Format non supporté. Utilisez JPG, PNG ou WebP.'), false)
        }
        cb(null, true)
      },
    }),
  )
  upload(
    @UploadedFile() file: { filename: string } | undefined,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu')
    }
    const baseUrl = process.env.APP_URL ?? `${req.protocol}://${req.get('host')}`
    return { url: `${baseUrl}/uploads/${file.filename}` }
  }
}

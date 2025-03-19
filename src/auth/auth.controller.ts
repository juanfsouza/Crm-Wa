import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private whatsappService: WhatsAppService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    const token = await this.authService.login(user);

    // Aqui você pode enviar uma mensagem pelo WhatsApp após o login
    const phoneNumber = 'whatsapp_number_here'; // Adapte para pegar o número de telefone do usuário
    const message = 'Bem-vindo ao sistema!';
    await this.whatsappService.sendMessage(phoneNumber, message);

    return { access_token: token.access_token };
  }
}

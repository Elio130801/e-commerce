import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 👇 Importamos el ValidationPipe de NestJS
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Habilitamos CORS para permitir peticiones desde el frontend
  
  // 👇 Activamos las validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos basura que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían datos no permitidos
      transform: true, // Transforma automáticamente los tipos de datos
    })
  );
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
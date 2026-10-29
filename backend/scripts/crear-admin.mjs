import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL no está configurada.');
  process.exit(1);
}

if (!email || !password) {
  console.error(
    'Configurá ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env antes de continuar.',
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error('La contraseña debe tener al menos 12 caracteres.');
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

try {
  const existente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (existente) {
    console.error('Ya existe un usuario con ese email. No se realizaron cambios.');
    process.exitCode = 1;
  } else {
    const passwordHash = await argon2.hash(password);

    const usuario = await prisma.usuario.create({
      data: {
        email,
        passwordHash,
        rol: 'ADMIN',
        activo: true,
      },
      select: {
        id: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    console.log('Administrador creado correctamente:');
    console.table(usuario);
  }
} catch (error) {
  console.error('No se pudo crear el administrador:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}

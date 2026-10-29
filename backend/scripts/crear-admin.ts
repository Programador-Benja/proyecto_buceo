import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const terminal = createInterface({ input, output });

async function main() {
  const email = (
    await terminal.question('Email del administrador: ')
  ).trim().toLowerCase();

  const password = await terminal.question(
    'Contraseña del administrador (mínimo 12 caracteres): ',
  );

  if (!email || password.length < 12) {
    throw new Error('Email inválido o contraseña demasiado corta.');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada.');
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
      throw new Error('Ya existe un usuario con ese email.');
    }

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

    console.log('\nAdministrador creado correctamente:');
    console.table(usuario);
  } finally {
    await prisma.$disconnect();
  }
}

try {
  await main();
} catch (error) {
  console.error(
    '\nError al crear el administrador:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
} finally {
  terminal.close();
}

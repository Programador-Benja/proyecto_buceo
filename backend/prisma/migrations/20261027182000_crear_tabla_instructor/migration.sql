-- CreateTable
CREATE TABLE "Instructor" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "email" VARCHAR(150),
    "telefono" VARCHAR(30),
    "especialidad" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "escuelaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_dni_key" ON "Instructor"("dni");

-- CreateIndex
CREATE INDEX "Instructor_escuelaId_idx" ON "Instructor"("escuelaId");

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_escuelaId_fkey" FOREIGN KEY ("escuelaId") REFERENCES "Escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

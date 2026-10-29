-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "nivel" VARCHAR(50) NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "cupoMaximo" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADO',
    "escuelaId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Curso_escuelaId_idx" ON "Curso"("escuelaId");

-- CreateIndex
CREATE INDEX "Curso_instructorId_idx" ON "Curso"("instructorId");

-- CreateIndex
CREATE INDEX "Curso_estado_idx" ON "Curso"("estado");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_escuelaId_fkey" FOREIGN KEY ("escuelaId") REFERENCES "Escuela"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

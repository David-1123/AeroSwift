-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('NORTE', 'CENTRO', 'VALLES', 'SUR');

-- CreateEnum
CREATE TYPE "RideDirection" AS ENUM ('AL_AEROPUERTO', 'DESDE_AEROPUERTO');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDIENTE', 'ASIGNADO', 'EN_RUTA', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSFERENCIA', 'DEUNA', 'TARJETA');

-- CreateEnum
CREATE TYPE "RideEventType" AS ENUM ('CREADO', 'ASIGNADO', 'ESTADO', 'NOTA');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "vehicle" TEXT,
    "plate" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "direction" "RideDirection" NOT NULL DEFAULT 'AL_AEROPUERTO',
    "sector" "Sector" NOT NULL,
    "numPassengers" INTEGER NOT NULL,
    "numBags" INTEGER NOT NULL,
    "flightNumber" TEXT,
    "price" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod",
    "status" "RideStatus" NOT NULL DEFAULT 'PENDIENTE',
    "driverId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_events" (
    "id" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,
    "type" "RideEventType" NOT NULL,
    "detail" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "rides_scheduledAt_idx" ON "rides"("scheduledAt");

-- CreateIndex
CREATE INDEX "rides_status_idx" ON "rides"("status");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_events" ADD CONSTRAINT "ride_events_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "rides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_events" ADD CONSTRAINT "ride_events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

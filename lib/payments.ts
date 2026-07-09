// Datos de pago del negocio que se muestran al cliente en el paso "Pago".
// Edita aquí las cuentas o el QR; la UI los toma automáticamente.

export type BankAccount = {
  bank: string;
  type: string;
  holder: string;
  number: string;
  idNumber: string; // Cédula / RUC
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bank: "Banco Pichincha",
    type: "Cuenta de Ahorros",
    holder: "Elizabeth Silva",
    number: "4279721800",
    idNumber: "0201512365",
  },
  {
    bank: "Banco Produbanco",
    type: "Cuenta de Ahorros",
    holder: "Elizabeth Silva",
    number: "12009289386",
    idNumber: "0201512365",
  },
];

// QR de Deuna! (imagen en /public). Reemplázala por tu QR actualizado cuando sea
// necesario, manteniendo el mismo nombre de archivo.
export const DEUNA = {
  holder: "Irlanda Elizabeth",
  qrSrc: "/deuna-qr.png",
};

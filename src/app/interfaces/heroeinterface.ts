//permite definir los tipos de los datos y tener tipado fuerte, para evitar usar any
export interface HeroeInterface {
  id: number;
  name: string;
  poderes: string;
  descripcion: string;
  lugar: string;
  imagen: File | null;
}

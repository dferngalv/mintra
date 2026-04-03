import { useState } from "react";

export interface Book {
    titulo: string;
    autor: string;
    anio: number;
    imagen: string;
}

export function useBooks() {
    const [books] = useState<Book[]>([
    { titulo: "El nombre del viento", autor: "Patrick Rothfuss", anio: 2007, imagen: "https://picsum.photos/200?random=1" },
    { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", anio: 1967, imagen: "https://picsum.photos/200?random=2" },
    { titulo: "1984", autor: "George Orwell", anio: 1949, imagen: "https://picsum.photos/200?random=3" },
    { titulo: "El señor de los anillos", autor: "J. R. R. Tolkien", anio: 1954, imagen: "https://picsum.photos/200?random=4" },
    { titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón", anio: 2001, imagen: "https://picsum.photos/200?random=5" },
    { titulo: "Fahrenheit 451", autor: "Ray Bradbury", anio: 1953, imagen: "https://picsum.photos/200?random=6" },
    { titulo: "Orgullo y prejuicio", autor: "Jane Austen", anio: 1813, imagen: "https://picsum.photos/200?random=7" },
    { titulo: "Crónica de una muerte anunciada", autor: "Gabriel García Márquez", anio: 1981, imagen: "https://picsum.photos/200?random=8" },
    { titulo: "Dune", autor: "Frank Herbert", anio: 1965, imagen: "https://picsum.photos/200?random=9" },
    { titulo: "El principito", autor: "Antoine de Saint-Exupéry", anio: 1943, imagen: "https://picsum.photos/200?random=10" },
    { titulo: "Drácula", autor: "Bram Stoker", anio: 1897, imagen: "https://picsum.photos/200?random=11" },
    { titulo: "Frankenstein", autor: "Mary Shelley", anio: 1818, imagen: "https://picsum.photos/200?random=12" },
    { titulo: "El alquimista", autor: "Paulo Coelho", anio: 1988, imagen: "https://picsum.photos/200?random=13" },
    { titulo: "Los juegos del hambre", autor: "Suzanne Collins", anio: 2008, imagen: "https://picsum.photos/200?random=14" },
    { titulo: "Harry Potter y la piedra filosofal", autor: "J. K. Rowling", anio: 1997, imagen: "https://picsum.photos/200?random=15" },
    { titulo: "El código Da Vinci", autor: "Dan Brown", anio: 2003, imagen: "https://picsum.photos/200?random=16" },
    { titulo: "La chica del tren", autor: "Paula Hawkins", anio: 2015, imagen: "https://picsum.photos/200?random=17" },
    { titulo: "It", autor: "Stephen King", anio: 1986, imagen: "https://picsum.photos/200?random=18" },
    { titulo: "El psicoanalista", autor: "John Katzenbach", anio: 2002, imagen: "https://picsum.photos/200?random=19" },
    { titulo: "Rebelión en la granja", autor: "George Orwell", anio: 1945, imagen: "https://picsum.photos/200?random=20" },
    { titulo: "El hobbit", autor: "J. R. R. Tolkien", anio: 1937, imagen: "https://picsum.photos/200?random=21" },
    { titulo: "La ladrona de libros", autor: "Markus Zusak", anio: 2005, imagen: "https://picsum.photos/200?random=22" },
    { titulo: "El perfume", autor: "Patrick Süskind", anio: 1985, imagen: "https://picsum.photos/200?random=23" },
    { titulo: "Metro 2033", autor: "Dmitry Glukhovsky", anio: 2005, imagen: "https://picsum.photos/200?random=24" },
    { titulo: "Neuromante", autor: "William Gibson", anio: 1984, imagen: "https://picsum.photos/200?random=25" }
]);

    return { books };
}
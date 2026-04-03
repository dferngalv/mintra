export const PRODUCTS3000 = Array.from({ length: 3000 }, (_, i) => ({
    image: require('../assets/images/No_Image_Available.jpg'),
    altImage: "Dummy",
    nameNormal: "Dummy",
    name: "Dummy",
    prize: "Dummy",
    stars: require('../assets/images/No_Image_Available.jpg'),
    altStars: "Dummy",
    id: (i + 1).toString(),
}));
export interface Room {
  id: string;
  title: string;
  description: string;
  tags: string[];
  capacity?: string;
  beds?: string;
  images?: { src: string; alt: string }[];
}

// Spoločné fotky pre všetky izby (lobby, obývačka, kuchyňa, spoločné priestory)
export const commonImages = [
  {
    src: "/assets/apartment/common/lobby-1.jpeg",
    alt: "Vstupná hala / Recepcia",
  },
  {
    src: "/assets/apartment/common/living-area-1.jpeg",
    alt: "Spoločná obývacia časť",
  },
  {
    src: "/assets/apartment/common/kitchen-1.jpeg",
    alt: "Kuchynský kút",
  },
  {
    src: "/assets/apartment/common/common-4.jpeg",
    alt: "Spoločné priestory",
  },
  {
    src: "/assets/apartment/common/common-5.jpeg",
    alt: "Spoločné priestory",
  },
  {
    src: "/assets/apartment/common/common-6.jpeg",
    alt: "Spoločné priestory",
  },
  {
    src: "/assets/apartment/common/IMG_1201_1.jpeg",
    alt: "Apartman – interiér",
  },
  {
    src: "/assets/apartment/common/IMG_1202.jpeg",
    alt: "Apartman – priestory",
  },
  {
    src: "/assets/apartment/common/IMG_1206.jpeg",
    alt: "Apartman – pohľad",
  },
  {
    src: "/assets/apartment/common/IMG_1207.jpeg",
    alt: "Apartman – detaily",
  },
  {
    src: "/assets/apartment/common/IMG_1208.jpeg",
    alt: "Apartman – vybavenie",
  },
  {
    src: "/assets/apartment/common/IMG_1147.jpeg",
    alt: "Apartman – obývacia časť",
  },
  {
    src: "/assets/apartment/common/IMG_1148.jpeg",
    alt: "Apartman – kuchyňa",
  },
  {
    src: "/assets/apartment/common/IMG_1151.jpeg",
    alt: "Apartman – spoločné priestory",
  },
  {
    src: "/assets/apartment/common/IMG_1159.jpeg",
    alt: "Apartman – interiér",
  },
  {
    src: "/assets/apartment/common/IMG_1200.jpeg",
    alt: "Apartman – priestory",
  },
  {
    src: "/assets/apartment/common/IMG_1201_2.jpeg",
    alt: "Apartman – pohľad",
  },
];

const rooms: Room[] = [
  {
    id: "izba-1",
    title: "Izba 1 – Štandard",
    description:
      "Útulná izba s pohodlnou posteľou, ideálna pre jednotlivcov alebo páry hľadajúce pokojný odpočinok.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-1/IMG_1153.jpeg", alt: "Izba 1 – pohľad 1" },
      { src: "/assets/rooms/izba-1/IMG_1154.jpeg", alt: "Izba 1 – pohľad 2" },
      { src: "/assets/rooms/izba-1/IMG_1155.jpeg", alt: "Izba 1 – pohľad 3" },
      { src: "/assets/rooms/izba-1/IMG_1156.jpeg", alt: "Izba 1 – pohľad 4" },
    ],
  },
  {
    id: "izba-2",
    title: "Izba 2 – Superior",
    description:
      "Dvojpriestorová izba oddelená dverami. V jednej časti manželská posteľ a 1 jednolôžková posteľ, v druhej časti 2 jednolôžkové postele.",
    tags: ["Wi-Fi", "TV", "Klimatizácia", "Dva priestory"],
    capacity: "5 osôb",
    beds: "1 manželská posteľ + 1 jednolôžko | 2 jednolôžka",
    images: [
      { src: "/assets/rooms/izba-2/IMG_1157.jpeg", alt: "Izba 2 – spálňa" },
      { src: "/assets/rooms/izba-2/IMG_1158.jpeg", alt: "Izba 2 – pohľad 2" },
      { src: "/assets/rooms/izba-2/IMG_1159_1.jpeg", alt: "Izba 2 – obývacia časť" },
      { src: "/assets/rooms/izba-2/IMG_1161.jpeg", alt: "Izba 2 – kuchynka" },
      { src: "/assets/rooms/izba-2/IMG_1162.jpeg", alt: "Izba 2 – jedáleň" },
      { src: "/assets/rooms/izba-2/IMG_1170.jpeg", alt: "Izba 2 – pohľad na izbu" },
    ],
  },
  {
    id: "izba-3",
    title: "Izba 3 – Štandard",
    description:
      "Veľká rodinná izba s priestorom pre celú rodinu a detským kútikom.",
    tags: ["Wi-Fi", "TV", "Klimatizácia", "Detský kútik"],
    capacity: "4 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-3/IMG_1163.jpeg", alt: "Izba 3 – spálňa s kanapé" },
      { src: "/assets/rooms/izba-3/IMG_1164.jpeg", alt: "Izba 3 – manželská posteľ" },
      { src: "/assets/rooms/izba-3/IMG_1165.jpeg", alt: "Izba 3 – pohľad s TV" },
      { src: "/assets/rooms/izba-3/IMG_1166.jpeg", alt: "Izba 3 – pohľad 4" },
      { src: "/assets/rooms/izba-3/IMG_1167.jpeg", alt: "Izba 3 – pohľad 5" },
    ],
  },
  {
    id: "izba-4",
    title: "Izba 4 – Štandard",
    description:
      "Luxusná izba s prémiovým vybavením a elegantným dizajnom.",
    tags: ["Wi-Fi", "TV"],
    capacity: "4 osoby",
    beds: "1 manželská posteľ, 1 poschodová posteľ",
    images: [
      { src: "/assets/rooms/izba-4/IMG_1172.jpeg", alt: "Izba 4 – kuchynka s jedálňou" },
      { src: "/assets/rooms/izba-4/IMG_1173.jpeg", alt: "Izba 4 – poschodová posteľ" },
      { src: "/assets/rooms/izba-4/IMG_1174.jpeg", alt: "Izba 4 – manželská posteľ" },
      { src: "/assets/rooms/izba-4/IMG_1176.jpeg", alt: "Izba 4 – pohľad na izbu" },
      { src: "/assets/rooms/izba-4/IMG_1177.jpeg", alt: "Izba 4 – pohľad 5" },
    ],
  },
  {
    id: "izba-5",
    title: "Izba 5 – Komfort",
    description:
      "Romantická izba s jemným osvetlením a príjemnou atmosférou pre páry.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-5/IMG_1178.jpeg", alt: "Izba 5 – spálňa s balkónom" },
      { src: "/assets/rooms/izba-5/IMG_1179.jpeg", alt: "Izba 5 – manželská posteľ s klimatizáciou" },
      { src: "/assets/rooms/izba-5/IMG_1180.jpeg", alt: "Izba 5 – obývacia časť s TV" },
      { src: "/assets/rooms/izba-5/IMG_1181.jpeg", alt: "Izba 5 – pohľad na izbu" },
      { src: "/assets/rooms/izba-5/IMG_1182.jpeg", alt: "Izba 5 – pohľad 5" },
      { src: "/assets/rooms/izba-5/IMG_1183.jpeg", alt: "Izba 5 – pohľad 6" },
    ],
  },
  {
    id: "izba-6",
    title: "Izba 6 – Komfort",
    description:
      "Moderné štúdio s kuchynským kútom a samostatným sedením.",
    tags: ["Wi-Fi", "TV", "Kuchynka"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-6/IMG_1184.jpeg", alt: "Izba 6 – obývacia časť" },
      { src: "/assets/rooms/izba-6/IMG_1185.jpeg", alt: "Izba 6 – pohľad na izbu" },
      { src: "/assets/rooms/izba-6/IMG_1187.jpeg", alt: "Izba 6 – spálňa s kameňovou stenou" },
      { src: "/assets/rooms/izba-6/IMG_1188.jpeg", alt: "Izba 6 – pohľad 4" },
      { src: "/assets/rooms/izba-6/IMG_1189.jpeg", alt: "Izba 6 – pohľad 5" },
      { src: "/assets/rooms/izba-6/IMG_1190.jpeg", alt: "Izba 6 – pohľad 6" },
    ],
  },
  {
    id: "izba-7",
    title: "Izba 7 – Komfort",
    description:
      "Klasická dvojlôžková izba s dvoma samostatnými posteľami.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-7/IMG_1563.jpeg", alt: "Izba 7 – pohľad 1" },
      { src: "/assets/rooms/izba-7/IMG_1564.jpeg", alt: "Izba 7 – pohľad 2" },
      { src: "/assets/rooms/izba-7/IMG_1565.jpeg", alt: "Izba 7 – pohľad 3" },
      { src: "/assets/rooms/izba-7/IMG_1566.jpeg", alt: "Izba 7 – pohľad 4" },
      { src: "/assets/rooms/izba-7/IMG_1567.jpeg", alt: "Izba 7 – pohľad 5" },
    ],
  },
  {
    id: "izba-8",
    title: "Izba 8 – Komfort",
    description:
      "Nadštandardná izba s balkónom a panoramatickým výhľadom.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-8/IMG_1569.jpeg", alt: "Izba 8 – pohľad 1" },
      { src: "/assets/rooms/izba-8/IMG_1570.jpeg", alt: "Izba 8 – pohľad 2" },
      { src: "/assets/rooms/izba-8/IMG_1571.jpeg", alt: "Izba 8 – pohľad 3" },
      { src: "/assets/rooms/izba-8/IMG_1572.jpeg", alt: "Izba 8 – pohľad 4" },
      { src: "/assets/rooms/izba-8/IMG_1575.jpeg", alt: "Izba 8 – pohľad 5" },
    ],
  },
  {
    id: "izba-9",
    title: "Izba 9 – Štandard",
    description:
      "Samostatný apartmán s obývačkou, spálňou a plne vybavenou kuchyňou.",
    tags: ["Wi-Fi", "TV", "Klimatizácia", "Kuchyňa", "Obývačka"],
    capacity: "4 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-9/IMG_1577.jpeg", alt: "Izba 9 – pohľad 1" },
      { src: "/assets/rooms/izba-9/IMG_1578.jpeg", alt: "Izba 9 – pohľad 2" },
      { src: "/assets/rooms/izba-9/IMG_1579.jpeg", alt: "Izba 9 – pohľad 3" },
      { src: "/assets/rooms/izba-9/IMG_1580.jpeg", alt: "Izba 9 – pohľad 4" },
      { src: "/assets/rooms/izba-9/IMG_1581.jpeg", alt: "Izba 9 – pohľad 5" },
    ],
  },
  {
    id: "izba-10",
    title: "Izba 10 – Štandard",
    description:
      "Exkluzívna izba na najvyššom poschodí s terasou a výhľadom.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    beds: "1 manželská posteľ, 1 prístelka (pre 1–2 osoby)",
    images: [
      { src: "/assets/rooms/izba-10/IMG_1583.jpeg", alt: "Izba 10 – pohľad 1" },
      { src: "/assets/rooms/izba-10/IMG_1584.jpeg", alt: "Izba 10 – pohľad 2" },
      { src: "/assets/rooms/izba-10/IMG_1585.jpeg", alt: "Izba 10 – pohľad 3" },
      { src: "/assets/rooms/izba-10/IMG_1588.jpeg", alt: "Izba 10 – pohľad 4" },
      { src: "/assets/rooms/izba-10/IMG_1589.jpeg", alt: "Izba 10 – pohľad 5" },
      { src: "/assets/rooms/izba-10/IMG_1590.jpeg", alt: "Izba 10 – pohľad 6" },
    ],
  },
  {
    id: "izba-11",
    title: "Izba 11 – Podkrovná izba",
    description:
      "Podkrovná izba s jedinečnou atmosférou a šikmými stropmi, útulný priestor pod strechou. Kľúč odovzdáva majiteľ osobne.",
    tags: ["Wi-Fi", "TV", "Klimatizácia"],
    capacity: "2 osoby",
    images: [
      { src: "/assets/rooms/izba-11/IMG_1191.jpeg", alt: "Izba 11 – jedálenský kút s klimatizáciou" },
      { src: "/assets/rooms/izba-11/IMG_1192.jpeg", alt: "Izba 11 – spálňa s TV" },
      { src: "/assets/rooms/izba-11/IMG_1193.jpeg", alt: "Izba 11 – kuchynka s jedálňou" },
      { src: "/assets/rooms/izba-11/IMG_1194.jpeg", alt: "Izba 11 – kuchynský kút" },
      { src: "/assets/rooms/izba-11/IMG_1195.jpeg", alt: "Izba 11 – obývacia časť" },
      { src: "/assets/rooms/izba-11/IMG_1196.jpeg", alt: "Izba 11 – pohľad na izbu" },
      { src: "/assets/rooms/izba-11/IMG_1197.jpeg", alt: "Izba 11 – pohľad 7" },
    ],
  },
];

export default rooms;
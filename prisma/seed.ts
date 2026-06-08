import 'dotenv/config';
import { prisma } from '../src/config/database';

interface SeedProductDraft {
  nom: string;
  prix: number;
  couleurs: string[];
  description: string;
  badge?: string;
  image_url?: string;
}

interface SeedProduct {
  id: string;
  nom: string;
  prix: number;
  categorie: string;
  couleurs: string;
  description: string;
  badge: string;
  image_url: string;
  image_urls: string[];
}

const CATEGORY_IMAGE_FALLBACKS: Record<string, string[]> = {
  'Casques anti-heurt': [
    '/catalog/helmet-01.svg',
    '/catalog/helmet-02.svg',
  ],
  'Gilets haute visibilité': [
    '/catalog/vest-01.svg',
    '/catalog/vest-02.svg',
  ],
  'Chaussures de sécurité': [
    '/catalog/shoe-01.svg',
    '/catalog/shoe-02.svg',
  ],
  'Matelas gonflables': [
    '/catalog/mattress-01.svg',
    '/catalog/mattress-02.svg',
  ],
};

const DEFAULT_IMAGE_URL = CATEGORY_IMAGE_FALLBACKS['Casques anti-heurt'][0];

const createSeedId = (index: number) =>
  `10000000-0000-4000-8000-${index.toString().padStart(12, '0')}`;

const toSeedProducts = (
  categorie: string,
  items: SeedProductDraft[],
  startIndex: number,
): SeedProduct[] =>
  items.map((item, offset) => {
    const categoryImages = CATEGORY_IMAGE_FALLBACKS[categorie] || [DEFAULT_IMAGE_URL];

    const imageUrl = item.image_url || categoryImages[offset % categoryImages.length];

    return {
      id: createSeedId(startIndex + offset),
      nom: item.nom,
      prix: item.prix,
      categorie,
      couleurs: item.couleurs.join(', '),
      description: item.description,
      badge: item.badge || 'Aucun',
      image_url: imageUrl,
      image_urls: [imageUrl],
    };
  });

const produits = [
  ...toSeedProducts(
    'Casques anti-heurt',
    [
      {
        nom: 'Casque Chantier Pro Secure',
        prix: 7500,
        couleurs: ['Jaune', 'Blanc', 'Bleu'],
        badge: 'Best seller',
        description: 'Casque de chantier leger avec coiffe ajustable et bonne resistance aux chocs du quotidien.',
      },
      {
        nom: 'Casque Ventile Dakar',
        prix: 8900,
        couleurs: ['Orange', 'Blanc'],
        badge: 'Nouveau',
        description: 'Modele ventile concu pour les travaux en exterieur et les fortes chaleurs.',
      },
      {
        nom: 'Casque BTP Renforce',
        prix: 9800,
        couleurs: ['Jaune', 'Rouge'],
        description: 'Casque robuste pour chantier intensif avec maintien confortable pendant toute la journee.',
      },
      {
        nom: 'Casque Electricien Isolant',
        prix: 12500,
        couleurs: ['Blanc', 'Jaune'],
        badge: 'Premium',
        description: 'Casque avec isolation renforcee adapte aux interventions techniques et electriques.',
      },
      {
        nom: 'Casque Visiere Integrale',
        prix: 14200,
        couleurs: ['Orange', 'Noir'],
        badge: 'Confort+',
        description: 'Protection de tete avec visiere transparente rabattable pour les environnements exposes.',
      },
      {
        nom: 'Casque Ajustable Pro Max',
        prix: 8600,
        couleurs: ['Bleu', 'Blanc', 'Orange'],
        description: 'Reglage rapide et maintien stable pour les equipes de terrain et les techniciens.',
      },
      {
        nom: 'Casque Travaux Publics Elite',
        prix: 10900,
        couleurs: ['Jaune', 'Bleu'],
        badge: 'Marque Premium',
        description: 'Casque de protection pour usage professionnel avec finition soignee et coque durable.',
      },
      {
        nom: 'Casque Anti-Heurt Compact',
        prix: 6900,
        couleurs: ['Noir', 'Gris'],
        description: 'Format compact et pratique pour les ateliers, depots et zones de manutention.',
      },
    ],
    1,
  ),
  ...toSeedProducts(
    'Gilets haute visibilité',
    [
      {
        nom: 'Gilet Securite Orange Standard',
        prix: 3200,
        couleurs: ['Orange'],
        badge: 'Best seller',
        description: 'Gilet leger haute visibilite avec bandes reflechissantes pour usage quotidien.',
      },
      {
        nom: 'Gilet Securite Jaune Pro',
        prix: 3900,
        couleurs: ['Jaune fluo'],
        description: 'Modele confortable pour les agents de terrain et les interventions exterieures.',
      },
      {
        nom: 'Gilet Multi-Poches Chantier',
        prix: 5400,
        couleurs: ['Orange', 'Jaune'],
        badge: 'Pack',
        description: 'Gilet pratique avec poches avant pour accessoires, badges et petit materiel.',
      },
      {
        nom: 'Gilet Maille Respirante',
        prix: 4100,
        couleurs: ['Orange'],
        badge: 'Nouveau',
        description: 'Maille aerée adaptee aux conditions chaudes et aux longues journees de travail.',
      },
      {
        nom: 'Gilet Haute Visibilite Premium',
        prix: 6200,
        couleurs: ['Jaune fluo', 'Noir'],
        badge: 'Premium',
        description: 'Finitions renforcées et visibilite optimisee pour les environnements exigeants.',
      },
      {
        nom: 'Gilet Superviseur Reflechissant',
        prix: 5800,
        couleurs: ['Vert', 'Orange'],
        description: 'Ideal pour les chefs d equipe et les superviseurs de chantier ou logistique.',
      },
      {
        nom: 'Gilet Transport Nuit',
        prix: 4700,
        couleurs: ['Orange', 'Argent'],
        badge: 'Confort+',
        description: 'Concu pour une visibilite elevee sur route, parking et zone de chargement.',
      },
      {
        nom: 'Gilet Economique EPI',
        prix: 2500,
        couleurs: ['Jaune', 'Orange'],
        badge: 'Pack économique',
        description: 'Solution accessible pour equiper rapidement une equipe complete.',
      },
    ],
    9,
  ),
  ...toSeedProducts(
    'Chaussures de sécurité',
    [
      {
        nom: 'Chaussures Securite Dakar S1P',
        prix: 18500,
        couleurs: ['Noir', 'Gris'],
        badge: 'Best seller',
        description: 'Chaussures de securite basses avec coque renforcee et semelle antiderapante.',
      },
      {
        nom: 'Bottes Securite Hydro Pro',
        prix: 22900,
        couleurs: ['Noir'],
        description: 'Modele montant adapte aux sols humides et aux travaux exterieurs intensifs.',
      },
      {
        nom: 'Chaussures Atelier Confort',
        prix: 16800,
        couleurs: ['Noir', 'Bleu'],
        badge: 'Confort+',
        description: 'Confort de marche renforce pour les equipes en atelier, usine ou magasin.',
      },
      {
        nom: 'Chaussures Securite Runner',
        prix: 21400,
        couleurs: ['Noir', 'Rouge'],
        badge: 'Nouveau',
        description: 'Look moderne et poids reduit pour les professionnels actifs toute la journee.',
      },
      {
        nom: 'Chaussures Anti-Perforation X5',
        prix: 24800,
        couleurs: ['Noir', 'Orange'],
        badge: 'Premium',
        description: 'Protection avancee contre perforation et chocs pour les zones industrielles.',
      },
      {
        nom: 'Chaussures Securite Cuir Pro',
        prix: 19800,
        couleurs: ['Marron', 'Noir'],
        description: 'Modele en cuir resistant avec bonne tenue du pied et durabilite elevee.',
      },
      {
        nom: 'Baskets Securite Urban Work',
        prix: 17600,
        couleurs: ['Noir', 'Blanc'],
        badge: 'Marque Premium',
        description: 'Baskets de securite pratiques pour logistique, commerce et manutention legere.',
      },
      {
        nom: 'Chaussures Securite Terrain Plus',
        prix: 23200,
        couleurs: ['Noir', 'Kaki'],
        description: 'Accroche fiable et maintien solide pour chantier, livraison et interventions terrain.',
      },
    ],
    17,
  ),
  ...toSeedProducts(
    'Matelas gonflables',
    [
      {
        nom: 'Matelas Gonflable Solo EasyRest',
        prix: 14500,
        couleurs: ['Bleu marine'],
        badge: 'Best seller',
        description: 'Matelas 1 place pratique pour repos, deplacement ou accueil temporaire.',
      },
      {
        nom: 'Matelas Gonflable Double Comfort',
        prix: 23900,
        couleurs: ['Gris', 'Bleu'],
        badge: 'Confort+',
        description: 'Modele 2 places avec surface floquee douce et gonflage rapide.',
      },
      {
        nom: 'Matelas Camping Resistant',
        prix: 17200,
        couleurs: ['Vert', 'Noir'],
        description: 'Concu pour usage exterieur avec bonne resistance et transport facile.',
      },
      {
        nom: 'Matelas Bureau Visiteur',
        prix: 15800,
        couleurs: ['Gris'],
        badge: 'Nouveau',
        description: 'Solution simple pour couchage occasionnel dans logement, bureau ou chantier.',
      },
      {
        nom: 'Matelas Gonflable Premium Plus',
        prix: 28900,
        couleurs: ['Beige', 'Gris'],
        badge: 'Premium',
        description: 'Grand confort avec renfort interieur et finition stable pour usage frequent.',
      },
      {
        nom: 'Matelas Compact Voyage',
        prix: 13200,
        couleurs: ['Bleu', 'Gris'],
        description: 'Format compact ideal pour transport et rangement rapide.',
      },
      {
        nom: 'Matelas Gonflable Pack Famille',
        prix: 31500,
        couleurs: ['Bleu', 'Noir'],
        badge: 'Pack',
        description: 'Modele large pour equipement d accueil ou besoins ponctuels de plusieurs personnes.',
      },
      {
        nom: 'Matelas Usage Intensif Pro',
        prix: 26400,
        couleurs: ['Gris fonce'],
        badge: 'Marque Premium',
        description: 'Structure renforcée pour usage repeté dans base vie, bureau ou hebergement temporaire.',
      },
    ],
    25,
  ),
];

const seedProducts = async () => {
  const isDryRun = process.argv.includes('--dry-run');

  if (isDryRun) {
    console.log(`[dry-run] ${produits.length} produits sont prets a etre synchronises.`);
    console.table(
      produits.slice(0, 8).map((produit) => ({
        categorie: produit.categorie,
        nom: produit.nom,
        prix: produit.prix,
        badge: produit.badge,
      })),
    );
    return;
  }

  for (const produit of produits) {
    const { id, ...data } = produit;

    await prisma.produit.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  }

  console.log(`${produits.length} produits ont ete crees ou mis a jour.`);
};

seedProducts()
  .catch((error) => {
    console.error('Erreur pendant le seed des produits:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

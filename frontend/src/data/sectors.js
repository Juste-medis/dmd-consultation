const SectorData = [
  'Activités associatives',
  'Administration publique',
  'Aéronautique, Navale',
  'Agriculture, pêche, aquaculture',
  'Agroalimentaire',
  'Ameublement, décoration',
  'Automobile, matériels de transport, réparation',
  'Banque, assurance, finances',
  'BTP, construction',
  'Centres d´appel, hotline, call center',
  'Chimie, pétrochimie, matières premières',
  'Conseil, audit, comptabilité',
  'Distribution, vente, commerce de gros',
  'Édition, imprimerie',
  'Éducation, formation',
  'Electricité, eau, gaz, nucléaire, énergie',
  'Environnement, recyclage',
  'Equip. électriques, électroniques, optiques, précision',
  'Equipements mécaniques, machines',
  'Espaces verts, forêts, chasse',
  'Évènementiel, hôte(sse), accueil',
  'Hôtellerie, restauration',
  'Immobilier, architecture, urbanisme',
  'Import, export',
  'Industrie pharmaceutique',
  'Industrie, production, fabrication, autres',
  'Informatique, SSII, Internet',
  'Ingénierie, études développement',
  'Intérim, recrutement',
  'Location',
  'Luxe, cosmétiques',
  'Maintenance, entretien, service après vente',
  'Manutention',
  'Marketing, communication, médias',
  'Métallurgie, sidérurgie',
  'Nettoyage, sécurité, surveillance',
  'Papier, bois, caoutchouc, plastique, verre, tabac',
  'Produits de grande consommation',
  'Qualité, méthodes',
  'Recherche et développement',
  'Santé, pharmacie, hôpitaux, équipements médicaux',
  'Secrétariat',
  'Services aéroportuaires et maritimes',
  'Services autres',
  'Services collectifs et sociaux, services à la personne',
  'Sport, action culturelle et sociale',
  'Télécom',
  'Textile, habillement, cuir, chaussures',
  'Tourisme, loisirs',
  'Transports, logistique, services postaux'
];
const SectorData1 = SectorData.map(mes => {
  return { value: mes.toLowerCase(), label: mes };
});
export default SectorData1;
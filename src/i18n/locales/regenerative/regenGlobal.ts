import { LocalizedRegenerativeUIStrings } from './types';

export const REGEN_EN: LocalizedRegenerativeUIStrings = {
  title: '8 Pillars of Regenerative Agriculture',
  subtitle: 'Restoring living ecosystems, soil carbon, and biodiversity while boosting yields.',
  calibratedFor: 'Calibrated for',
  onSoil: 'on',
  farmVitalityScore: 'Farm Vitality Score',
  saving: 'Saving...',
  savedToFarm: 'Saved to Farm',
  unableToSave: 'Unable to save',
  purposeTitle: 'Purpose of Regenerative Farming:',
  purposeDesc: (farm, crop) =>
    `Regenerative Farming connects soil health improvement, water-use efficiency, cover cropping, and biodiversity targets directly to active farm telemetry (${farm} — ${crop}) to build long-term climate resilience and soil organic carbon.`,
  activeFarmFallback: 'Active Farm',
  carbonSequestered: 'Estimated Carbon Sequestered',
  carbonUnit: 'tons CO₂e / year',
  acrossSoil: 'Across',
  waterConserved: 'Irrigation Water Conserved',
  waterSavingsUnit: 'reduction in run-time',
  viaMulch: 'Via mulch cover and improved humus water-holding capacity.',
  activePillarsCount: 'Active Biological Practices',
  pillarsUnit: 'Pillars in Action',
  clickToAdopt: 'Click any pillar card below to mark as adopted on your farm.',
  pillarsHeading: '8 Pillars of Regenerative Agriculture',
  clickArrowsExpand: 'Click arrows to expand guides',
  adoptBtn: '+ Adopt',
  activeBtn: '✓ Active',
  viewDetails: 'View Details',
  collapse: 'Collapse',
  guideLabel: 'Guide:',
  benefitsLabel: 'Benefits:',
  pillarSpotlight: 'Pillar Spotlight',
  markImplemented: 'Mark as Implemented',
  activeOnFarm: '✓ Active on Current Farm',
  ecologicalBenefits: 'Documented Ecological Benefits:',
  implementationGuide: 'Implementation Guide:',
  pillars: {
    'crop-rotation': {
      title: 'Crop Rotation & Diversification',
      tag: 'Soil Vitality',
      description:
        'Alternating deep-rooted tap crops with shallow fibrous rooters and legumes disrupts pest and disease life cycles, restores nutrient strata, and breaks weed monocultures.',
      benefits: ['Breaks weed and pest cycles', 'Natural nitrogen balance', 'Improves soil structure'],
      implementation:
        'Design a 3-4 season rotation alternating cereals (wheat/maize) with pulses (chickpeas/lentils) and brassicas.',
    },
    'cover-crops': {
      title: 'Multi-Species Cover Crops',
      tag: 'Erosion & Biology',
      description:
        'Keeping living roots in the soil 365 days a year feeds the soil food web with liquid carbon exudates while physically shielding topsoil from torrential rain and wind erosion.',
      benefits: ['Suppresses 80%+ weeds', 'Prevents erosion', 'Increases active mycorrhizae'],
      implementation:
        'Sow multi-species mixes (e.g., cowpea, millet, radish) during fallow periods between main cash crops.',
    },
    'compost-organic': {
      title: 'Compost & Bio-Inoculants',
      tag: 'Microbial Life',
      description:
        'Replacing high-salinity synthetic fertilizers with microbially active vermicompost, biochar, and aerated compost tea inoculates billions of beneficial bacteria and fungi.',
      benefits: ['Buffers soil pH', 'Increases water infiltration', 'Slow-release organic fertility'],
      implementation:
        'Apply 2-3 tons of cured compost per hectare before sowing, supplemented with foliar fermented bio-stimulants.',
    },
    'reduced-tillage': {
      title: 'Reduced / Zero Tillage',
      tag: 'Carbon Sequestration',
      description:
        'Mechanical tilling oxidizes organic carbon into atmospheric CO2 and tears fragile fungal hyphae. Low/zero-till preserves soil architecture, macro-pores, and worm tunnels.',
      benefits: ['Saves fuel and labor', 'Retains soil moisture', 'Locks carbon in the ground'],
      implementation:
        'Transition to strip-till or direct seed drilling through rolling-crimped cover crop residues.',
    },
    'water-conservation': {
      title: 'Precision Water Conservation',
      tag: 'Climate Resilience',
      description:
        'Adopting subsurface drip, sensor-guided scheduling, swales, and rainwater harvesting bunds prevents salinization and slashes irrigation water consumption by up to 50%.',
      benefits: ['Conserves groundwater', 'Prevents root asphyxiation', 'Mitigates drought shock'],
      implementation:
        'Install gravity-fed or low-pressure drip lines coupled with simple tensiometer soil moisture probes.',
    },
    'soil-moisture': {
      title: 'Living Mulch & Moisture Mantle',
      tag: 'Evaporation Shield',
      description:
        'Covering bare ground with 7-10 cm of crop residue or living groundcover cuts soil surface temperatures by 10-15°C and cuts evaporation by up to 40%.',
      benefits: ['Protects soil microbiome from heat', 'Conserves moisture', 'Creates worm habitat'],
      implementation:
        'Never burn crop stubble; spread chopped straw, leaves, or bagasse evenly over inter-row beds.',
    },
    biodiversity: {
      title: 'Agro-Biodiversity & Hedgerows',
      tag: 'Ecosystem Balance',
      description:
        'Planting flowering perimeter hedgerows, pollinator strips, and agroforestry shelterbelts creates permanent refuges for predatory wasps, ladybugs, birds, and pollinators.',
      benefits: ['Natural pest predation', 'Windbreak protection', 'Supplemental honey & timber'],
      implementation:
        'Dedicate 5-8% of farm boundary zones to native flowering shrubs, marigolds, and nitrogen-fixing trees.',
    },
    ipm: {
      title: 'Integrated Ecological Pest Management',
      tag: 'Non-Chemical Control',
      description:
        'Using biological control agents (Trichoderma, Bacillus thuringiensis, neem oil), pheromone disruption, and trap cropping instead of toxic synthetic organophosphates.',
      benefits: ['Zero toxic runoff', 'Preserves honeybees', 'Prevents chemical resistance'],
      implementation:
        'Install trap crops (e.g. castor/marigold on borders) and release beneficial parasitoid cards at early pest sighting.',
    },
  },
};

export const REGEN_ES: LocalizedRegenerativeUIStrings = {
  title: '8 Pilares de la Agricultura Regenerativa',
  subtitle: 'Restaurando ecosistemas vivos, carbono del suelo y biodiversidad mientras aumentan los rendimientos.',
  calibratedFor: 'Calibrado para',
  onSoil: 'en suelo',
  farmVitalityScore: 'Puntuación de Vitalidad de la Finca',
  saving: 'Guardando...',
  savedToFarm: 'Guardado en la Finca',
  unableToSave: 'No se pudo guardar',
  purposeTitle: 'Propósito de la Agricultura Regenerativa:',
  purposeDesc: (farm, crop) =>
    `La agricultura regenerativa conecta la mejora del suelo, la eficiencia hídrica, los cultivos de cobertura y la biodiversidad directamente con la telemetría activa de la finca (${farm} — ${crop}) para construir resiliencia climática y carbono orgánico a largo plazo.`,
  activeFarmFallback: 'Finca Activa',
  carbonSequestered: 'Carbono Secuestrado Estimado',
  carbonUnit: 'toneladas CO₂e / año',
  acrossSoil: 'En',
  waterConserved: 'Agua de Riego Conservada',
  waterSavingsUnit: 'reducción en tiempo de bombeo',
  viaMulch: 'Mediante cobertura de mantillo y mayor capacidad de retención de agua del humus.',
  activePillarsCount: 'Prácticas Biológicas Activas',
  pillarsUnit: 'Pilares en Acción',
  clickToAdopt: 'Haga clic en cualquier pilar para marcarlo como adoptado en su finca.',
  pillarsHeading: '8 Pilares de la Agricultura Regenerativa',
  clickArrowsExpand: 'Haga clic en las flechas para expandir las guías',
  adoptBtn: '+ Adoptar',
  activeBtn: '✓ Activo',
  viewDetails: 'Ver Detalles',
  collapse: 'Colapsar',
  guideLabel: 'Guía:',
  benefitsLabel: 'Beneficios:',
  pillarSpotlight: 'Pilar Destacado',
  markImplemented: 'Marcar como Implementado',
  activeOnFarm: '✓ Activo en la Finca Actual',
  ecologicalBenefits: 'Beneficios Ecológicos Documentados:',
  implementationGuide: 'Guía de Implementación:',
  pillars: {
    'crop-rotation': {
      title: 'Rotación y Diversificación de Cultivos',
      tag: 'Vitalidad del Suelo',
      description:
        'Alternar cultivos de raíces profundas con raíces fibrosas y leguminosas rompe el ciclo de plagas, restaura estratos de nutrientes y combate malezas.',
      benefits: ['Rompe ciclos de malezas y plagas', 'Equilibrio natural de nitrógeno', 'Mejora la estructura del suelo'],
      implementation:
        'Diseñe una rotación de 3-4 temporadas alternando cereales (trigo/maíz) con legumbres (garbanzos/lentejas) y crucíferas.',
    },
    'cover-crops': {
      title: 'Cultivos de Cobertura Multiespecie',
      tag: 'Erosión y Biología',
      description:
        'Mantener raíces vivas los 365 días del año alimenta la red trófica del suelo con exudados de carbono y protege la superficie contra la erosión.',
      benefits: ['Suprime más del 80% de malezas', 'Previene la erosión del suelo', 'Aumenta micorrizas activas'],
      implementation:
        'Siembre mezclas multiespecie (caupí, mijo, rábano) durante períodos de barbecho entre cultivos principales.',
    },
    'compost-organic': {
      title: 'Compost y Bioinoculantes',
      tag: 'Vida Microbiana',
      description:
        'Reemplazar fertilizantes sintéticos por lombricompost activo, biocarbón y té de compost inocula miles de millones de bacterias y hongos benéficos.',
      benefits: ['Amortigua el pH del suelo', 'Aumenta la infiltración de agua', 'Fertilidad orgánica gradual'],
      implementation:
        'Aplique 2-3 toneladas de compost maduro por hectárea antes de la siembra, suplementado con bioestimulantes foliares.',
    },
    'reduced-tillage': {
      title: 'Labranza Reducida / Siembra Directa',
      tag: 'Captura de Carbono',
      description:
        'El laboreo mecánico oxida el carbono orgánico a CO2 y rompe las hifas fúngicas. La siembra directa preserva la porosidad y los túneles de lombrices.',
      benefits: ['Ahorra combustible y mano de obra', 'Retiene la humedad del suelo', 'Fija carbono en la tierra'],
      implementation:
        'Haga la transición a siembra directa sobre rastrojos mediante rodillo crimper y sembradoras especializadas.',
    },
    'water-conservation': {
      title: 'Conservación Hídrica de Precisión',
      tag: 'Resiliencia Climática',
      description:
        'Adoptar riego por goteo subterráneo, sensores, zanjas y captación de lluvia previene la salinidad y reduce el uso de agua hasta en un 50%.',
      benefits: ['Conserva aguas subterráneas', 'Evita asfixia radicular', 'Mitiga el estrés por sequía'],
      implementation:
        'Instale líneas de goteo de baja presión calibradas con sondas sencillas de humedad tensiométrica.',
    },
    'soil-moisture': {
      title: 'Mantillo Vivo y Protección de Humedad',
      tag: 'Escudo de Evaporación',
      description:
        'Cubrir el suelo con 7-10 cm de residuos reduce la temperatura superficial en 10-15°C y disminuye la evaporación hasta un 40%.',
      benefits: ['Protege el microbioma del calor', 'Conserva la humedad', 'Crea hábitat para lombrices'],
      implementation:
        'Nunca queme rastrojos; esparza paja picada, hojas o bagazo de manera uniforme entre las hileras.',
    },
    biodiversity: {
      title: 'Agrobiodiversidad y Setos Vivos',
      tag: 'Equilibrio Ecológico',
      description:
        'Sembrar setos florales perimetrales y cortinas cortavientos crea refugios permanentes para avispas depredadoras, mariquitas y polinizadores.',
      benefits: ['Depredación natural de plagas', 'Protección cortavientos', 'Miel y madera complementarias'],
      implementation:
        'Dedique del 5 al 8% de los linderos de la finca a arbustos florales autóctonos y árboles fijadores de nitrógeno.',
    },
    ipm: {
      title: 'Manejo Ecológico Integrado de Plagas (MIP)',
      tag: 'Control Biológico',
      description:
        'Uso de agentes biológicos (Trichoderma, Bt, aceite de neem), feromonas y cultivos trampa en lugar de insecticidas químicos sintéticos.',
      benefits: ['Cero escorrentía tóxica', 'Protege las abejas', 'Previene resistencia química'],
      implementation:
        'Siembre cultivos trampa en linderos y libere tarjetas de parasitoides benéficos al detectar las primeras plagas.',
    },
  },
};

export const REGEN_FR: LocalizedRegenerativeUIStrings = {
  title: '8 Piliers de l’Agriculture Régénératrice',
  subtitle: 'Restaurer les écosystèmes vivants, le carbone du sol et la biodiversité tout en augmentant les rendements.',
  calibratedFor: 'Calibré pour',
  onSoil: 'sur sol',
  farmVitalityScore: 'Score de Vitalité de l’Exploitation',
  saving: 'Enregistrement...',
  savedToFarm: 'Enregistré sur la ferme',
  unableToSave: 'Impossible d’enregistrer',
  purposeTitle: 'Objectif de l’Agriculture Régénératrice :',
  purposeDesc: (farm, crop) =>
    `L’agriculture régénératrice relie l’amélioration des sols, l’efficacité hydrique, les couverts végétaux et la biodiversité aux données télémétriques de l’exploitation (${farm} — ${crop}) pour renforcer la résilience climatique et le carbone organique.`,
  activeFarmFallback: 'Ferme Active',
  carbonSequestered: 'Carbone Séquestré Estimé',
  carbonUnit: 'tonnes CO₂e / an',
  acrossSoil: 'Sur',
  waterConserved: 'Eau d’Irrigation Économisée',
  waterSavingsUnit: 'réduction du temps de pompage',
  viaMulch: 'Grâce au paillage et à la rétention d’eau accrue de l’humus.',
  activePillarsCount: 'Pratiques Biologiques Actives',
  pillarsUnit: 'Piliers en Action',
  clickToAdopt: 'Cliquez sur une carte pour marquer la pratique comme adoptée.',
  pillarsHeading: '8 Piliers de l’Agriculture Régénératrice',
  clickArrowsExpand: 'Cliquez sur les flèches pour afficher les guides',
  adoptBtn: '+ Adopter',
  activeBtn: '✓ Actif',
  viewDetails: 'Voir Détails',
  collapse: 'Réduire',
  guideLabel: 'Guide :',
  benefitsLabel: 'Bénéfices :',
  pillarSpotlight: 'Pilier en Vedette',
  markImplemented: 'Marquer comme Appliqué',
  activeOnFarm: '✓ Actif sur cette ferme',
  ecologicalBenefits: 'Bénéfices Écologiques Prouvés :',
  implementationGuide: 'Guide de Mise en Œuvre :',
  pillars: {
    'crop-rotation': {
      title: 'Rotation et Diversification des Cultures',
      tag: 'Vitalité du Sol',
      description:
        'Alterner les cultures à enracinement profond avec des racines fasciculées et des légumineuses brise le cycle des bioagresseurs et régénère la fertilité.',
      benefits: ['Rupture des cycles d’adventices', 'Équilibre azoté naturel', 'Amélioration de la structure du sol'],
      implementation:
        'Concevez une rotation sur 3 à 4 saisons alternant céréales (blé/maïs), légumineuses (pois chiches/lentilles) et crucifères.',
    },
    'cover-crops': {
      title: 'Couverts Végétaux Multi-Espèces',
      tag: 'Érosion et Biologie',
      description:
        'Maintenir des racines vivantes toute l’année nourrit le réseau trophique avec des exsudats carbonés et protège la surface de l’érosion.',
      benefits: ['Suppression de plus de 80% des adventices', 'Prévention de l’érosion', 'Augmentation des mycorhizes actives'],
      implementation:
        'Semez des mélanges multi-espèces (niébé, millet, radis) pendant les périodes d’interculture.',
    },
    'compost-organic': {
      title: 'Compost et Bio-Inoculants',
      tag: 'Vie Microbienne',
      description:
        'Remplacer les engrais chimiques salins par du lombricompost actif, du biochar et du thé de compost inocule des milliards de micro-organismes bénéfiques.',
      benefits: ['Effet tampon sur le pH', 'Meilleure infiltration de l’eau', 'Fertilisation organique progressive'],
      implementation:
        'Apportez 2 à 3 tonnes de compost mûr par hectare avant le semis, complété par des biostimulants foliaires.',
    },
    'reduced-tillage': {
      title: 'Travail Réduit du Sol / Semis Direct',
      tag: 'Séquestration du Carbone',
      description:
        'Le labour oxyde le carbone en CO2 et détruit les hyphes mycéliennes. Le semis direct préserve la porosité et les galeries de vers de terre.',
      benefits: ['Économie de carburant et de temps', 'Rétention d’humidité', 'Stockage durable du carbone'],
      implementation:
        'Passez au semis direct sous couvert végétal roulé au rouleau Faca à l’aide de semoirs spécifiques.',
    },
    'water-conservation': {
      title: 'Gestion Précise de l’Eau',
      tag: 'Résilience Climatique',
      description:
        'Goutte-à-goutte enterré, sondes tensiométriques et retenues collinaires réduisent la consommation d’eau jusqu’à 50% et éliminent la salinisation.',
      benefits: ['Préservation des nappes', 'Prévention de l’asphyxie racinaire', 'Atténuation du stress hydrique'],
      implementation:
        'Installez des lignes de goutte-à-goutte basse pression associées à des tensiomètres simples.',
    },
    'soil-moisture': {
      title: 'Paillage Protecteur et Mulch Vivant',
      tag: 'Protection contre l’Évaporation',
      description:
        'Couvrir le sol de 7 à 10 cm de paillis abaisse la température de surface de 10 à 15°C et réduit l’évaporation de 40%.',
      benefits: ['Protection du microbiome de la chaleur', 'Maintien de l’humidité', 'Habitat pour les vers de terre'],
      implementation:
        'Ne brûlez jamais les résidus ; épandez la paille broyée ou les feuilles régulièrement entre les rangs.',
    },
    biodiversity: {
      title: 'Agrobiodiversité et Haies Champêtres',
      tag: 'Équilibre Écologique',
      description:
        'Planter des haies mellifères et des bandes fleuries offre un refuge permanent aux auxiliaires prédateurs et aux pollinisateurs.',
      benefits: ['Régulation naturelle des ravageurs', 'Protection brise-vent', 'Production annexe de miel et de bois'],
      implementation:
        'Consacrez 5 à 8% des bordures de parcelles à des arbustes indigènes fleuris et des arbres fixateurs d’azote.',
    },
    ipm: {
      title: 'Protection Biologique Intégrée (PBI)',
      tag: 'Contrôle Biologique',
      description:
        'Utilisation d’agents biologiques (Trichoderma, Bt, huile de neem), pièges à phéromones et plantes-pièges à la place des pesticides toxiques.',
      benefits: ['Zéro résidu toxique', 'Préservation des abeilles', 'Évite l’accoutumance des ravageurs'],
      implementation:
        'Imposez des cultures-pièges en lisières et lâchez des parasitoïdes dès les premiers signalements.',
    },
  },
};

export const REGEN_PT: LocalizedRegenerativeUIStrings = {
  title: '8 Pilares da Agricultura Regenerativa',
  subtitle: 'Restaurando ecossistemas vivos, carbono do solo e biodiversidade enquanto aumentam as produtividades.',
  calibratedFor: 'Calibrado para',
  onSoil: 'em solo',
  farmVitalityScore: 'Pontuação de Vitalidade da Fazenda',
  saving: 'Salvando...',
  savedToFarm: 'Salvo na Fazenda',
  unableToSave: 'Não foi possível salvar',
  purposeTitle: 'Propósito da Agricultura Regenerativa:',
  purposeDesc: (farm, crop) =>
    `A agricultura regenerativa conecta a recuperação do solo, a eficiência hídrica, as culturas de cobertura e a biodiversidade diretamente à telemetria da fazenda (${farm} — ${crop}) para construir resiliência climática e carbono orgânico a longo prazo.`,
  activeFarmFallback: 'Fazenda Ativa',
  carbonSequestered: 'Carbono Sequestrado Estimado',
  carbonUnit: 'toneladas CO₂e / ano',
  acrossSoil: 'Em',
  waterConserved: 'Água de Irrigação Conservada',
  waterSavingsUnit: 'redução no tempo de bombeamento',
  viaMulch: 'Por meio de cobertura vegetal e maior capacidade de retenção de água do húmus.',
  activePillarsCount: 'Práticas Biológicas Ativas',
  pillarsUnit: 'Pilares em Ação',
  clickToAdopt: 'Clique em qualquer pilar abaixo para adotá-lo na fazenda.',
  pillarsHeading: '8 Pilares da Agricultura Regenerativa',
  clickArrowsExpand: 'Clique nas setas para expandir os guias',
  adoptBtn: '+ Adotar',
  activeBtn: '✓ Ativo',
  viewDetails: 'Ver Detalhes',
  collapse: 'Recolher',
  guideLabel: 'Guia:',
  benefitsLabel: 'Benefícios:',
  pillarSpotlight: 'Pilar em Destaque',
  markImplemented: 'Marcar como Implantado',
  activeOnFarm: '✓ Ativo nesta Fazenda',
  ecologicalBenefits: 'Benefícios Ecológicos Comprovados:',
  implementationGuide: 'Guia de Implementação:',
  pillars: {
    'crop-rotation': {
      title: 'Rotação e Diversificação de Culturas',
      tag: 'Vitalidade do Solo',
      description:
        'Alternar culturas de raízes profundas com leguminosas quebra o ciclo de pragas e doenças, restaurando a fertilidade natural do solo.',
      benefits: ['Quebra ciclos de pragas e ervas', 'Equilíbrio natural de nitrogênio', 'Melhora a estrutura do solo'],
      implementation:
        'Desenhe uma rotação de 3-4 safras alternando cereais (milho/trigo) com leguminosas (soja/feijão) e brássicas.',
    },
    'cover-crops': {
      title: 'Culturas de Cobertura Multi-espécies',
      tag: 'Erosão e Biologia',
      description:
        'Manter raízes vivas no solo o ano todo nutre a teia alimentar microbiológica e protege o solo contra erosão e altas temperaturas.',
      benefits: ['Suprime mais de 80% das plantas daninhas', 'Previne erosão hídrica e eólica', 'Aumenta micorrizas ativas'],
      implementation:
        'Semeie misturas de leguminosas, milheto e rabanete forrageiro nos períodos de pousio entre as safras principais.',
    },
    'compost-organic': {
      title: 'Compostagem e Bio-inoculantes',
      tag: 'Vida Microbiana',
      description:
        'Substituir fertilizantes químicos de alta salinidade por biofertilizantes, biochar e compostagem ativa inocula bilhões de fungos e bactérias benéficas.',
      benefits: ['Equilibra o pH do solo', 'Aumenta infiltração de água', 'Nutrição orgânica de liberação gradual'],
      implementation:
        'Aplique 2 a 3 toneladas de composto orgânico curado por hectare antes da semeadura, com bioestimulantes foliares.',
    },
    'reduced-tillage': {
      title: 'Plantio Direto na Palha (SPD)',
      tag: 'Sequestro de Carbono',
      description:
        'O preparo mecânico do solo oxida a matéria orgânica em CO2. O plantio direto preserva a arquitetura do solo e a biologia subterrânea.',
      benefits: ['Economiza combustível e mão de obra', 'Retém umidade profunda no solo', 'Fixa carbono no solo'],
      implementation:
        'Transite para o plantio direto na palha utilizando rolo-faca e semeadoras especializadas.',
    },
    'water-conservation': {
      title: 'Conservação de Água de Precisão',
      tag: 'Resiliência Climática',
      description:
        'Gotejamento, agendamento com sensores e curvas de nível evitam a salinização e reduzem o uso de água em até 50%.',
      benefits: ['Preserva água subterrânea', 'Evita asfixia radicular', 'Mitiga estresse por estiagem'],
      implementation:
        'Instale fitas gotejadoras de baixa pressão guiadas por tensiômetros manuais simples.',
    },
    'soil-moisture': {
      title: 'Palhada Protetora e Mulching Vivo',
      tag: 'Proteção contra Evaporação',
      description:
        'Cobrir o solo com 7 a 10 cm de resíduos reduz a temperatura da superfície em 10-15°C e corta a evaporação em até 40%.',
      benefits: ['Protege microbioma do calor excessivo', 'Mantém a umidade constante', 'Cria habitat para minhocas'],
      implementation:
        'Nunca queime a palhada; distribua palha picada ou bagaço uniformemente nas entrelinhas.',
    },
    biodiversity: {
      title: 'Agrobiodiversidade e Cercas Vivas',
      tag: 'Equilíbrio Ecológico',
      description:
        'O plantio de faixas florais de polinizadores e quebra-ventos cria refúgios permanentes para predadores naturais e abelhas.',
      benefits: ['Predação biológica de pragas', 'Proteção contra ventos fortes', 'Produção complementar de mel'],
      implementation:
        'Dedique de 5% a 8% das bordas da fazenda para arbustos nativos, tagetes e árvores fixadoras de nitrogênio.',
    },
    ipm: {
      title: 'Manejo Ecológico Integrado de Pragas (MIP)',
      tag: 'Controle Biológico',
      description:
        'Utilização de agentes biológicos (Trichoderma, Bacillus thuringiensis, óleo de nim), armadilhas e feromônios no lugar de organofosforados.',
      benefits: ['Zero resíduos tóxicos no alimento', 'Protege abelhas e polinizadores', 'Evita resistência química de pragas'],
      implementation:
        'Instale culturas-armadilha e libere agentes parasitoides biológicos logo no início do monitoramento.',
    },
  },
};

export const REGEN_RU: LocalizedRegenerativeUIStrings = {
  title: '8 Принципов Регенеративного Земледелия',
  subtitle: 'Восстановление живых экосистем, почвенного углерода и биоразнообразия с одновременным ростом урожайности.',
  calibratedFor: 'Откалибровано для',
  onSoil: 'на почве',
  farmVitalityScore: 'Индекс Жизнеспособности Почвы',
  saving: 'Сохранение...',
  savedToFarm: 'Сохранено в хозяйстве',
  unableToSave: 'Не удалось сохранить',
  purposeTitle: 'Цель Регенеративного Земледелия:',
  purposeDesc: (farm, crop) =>
    `Регенеративное земледелие связывает оздоровление почв, водосбережение, покровные культуры и биоразнообразие с данными полевой телеметрии (${farm} — ${crop}) для повышения углеродного баланса и климатической устойчивости.`,
  activeFarmFallback: 'Активное хозяйство',
  carbonSequestered: 'Оценка Связанного Углерода',
  carbonUnit: 'тонн CO₂e / год',
  acrossSoil: 'На площади',
  waterConserved: 'Сбережение Оросительной Воды',
  waterSavingsUnit: 'сокращение времени полива',
  viaMulch: 'За счет мульчирующего слоя и повышенной влагоемкости гумуса.',
  activePillarsCount: 'Активные Биологические Практики',
  pillarsUnit: 'Практик в Действии',
  clickToAdopt: 'Нажмите на карточку практики, чтобы отметить внедрение на поле.',
  pillarsHeading: '8 Принципов Регенеративного Земледелия',
  clickArrowsExpand: 'Нажмите на стрелку для подробного руководства',
  adoptBtn: '+ Внедрить',
  activeBtn: '✓ Активно',
  viewDetails: 'Подробнее',
  collapse: 'Свернуть',
  guideLabel: 'Руководство:',
  benefitsLabel: 'Преимущества:',
  pillarSpotlight: 'Ключевая Практика',
  markImplemented: 'Отметить как Внедренное',
  activeOnFarm: '✓ Применяется на поле',
  ecologicalBenefits: 'Доказанные Экологические Преимущества:',
  implementationGuide: 'Руководство по Внедрению:',
  pillars: {
    'crop-rotation': {
      title: 'Севооборот и диверсификация культур',
      tag: 'Плодородие почвы',
      description:
        'Чередование глубокоукореняющихся культур с бобовыми разрушает жизненный цикл вредителей и болезней, восстанавливая баланс питательных веществ.',
      benefits: ['Прерывание циклов сорняков и вредителей', 'Естественный азотный баланс', 'Улучшение структуры почвы'],
      implementation:
        'Спланируйте 3-4-летний севооборот, чередуя зерновые (пшеница/кукуруза) с зернобобовыми (нут/чечевица) и крестоцветными.',
    },
    'cover-crops': {
      title: 'Многовидовые покровные культуры',
      tag: 'Эрозия и биология',
      description:
        'Круглогодичное присутствие живых корней в почве питает полезные почвенные микроорганизмы и физически защищает плодородный слой от эрозии.',
      benefits: ['Подавление сорняков более чем на 80%', 'Защита от водной и ветровой эрозии', 'Увеличение популяции микоризы'],
      implementation:
        'Высевайте многовидовые смеси (вика, горчица, редька масличная) в межатмосферные периоды между основными товарными культурами.',
    },
    'compost-organic': {
      title: 'Компост и биоинокулянты',
      tag: 'Микробная жизнь',
      description:
        'Замена высокосолевых синтетических удобрений зрелым биогумусом, биоуглем и аэрированным компостным чаем оживляет почвенную микрофлору.',
      benefits: ['Буферизация pH почвы', 'Улучшение влагопоглощения', 'Пролонгированное органическое питание'],
      implementation:
        'Вносите 2–3 тонны созревшего компоста на гектар перед посевом в сочетании с некорневой биологической подкормкой.',
    },
    'reduced-tillage': {
      title: 'Минимальная / Нулевая обработка (No-Till)',
      tag: 'Связывание углерода',
      description:
        'Механическая вспашка окисляет почвенный углерод до CO2 и разрушает мицелий. No-till сохраняет капиллярную структуру почвы и ходы дождевых червей.',
      benefits: ['Экономия топлива и трудозатрат', 'Удержание влаги в почве', 'Фиксация углерода в почве'],
      implementation:
        'Переходите на прямой посев по растительным остаткам с использованием специализированных сеялок прямого сева.',
    },
    'water-conservation': {
      title: 'Точное водосбережение и микроорошение',
      tag: 'Климатическая устойчивость',
      description:
        'Капельное орошение, контроль влажности датчиками и террасирование предотвращают засоление и снижают расход воды на 50%.',
      benefits: ['Сбережение подземных вод', 'Предотвращение кислородного голодания корней', 'Снижение рисков засухи'],
      implementation:
        'Установите гравитационные или низконапорные капельные линии с использованием простых почвенных тензиометров.',
    },
    'soil-moisture': {
      title: 'Мульчирующий покров и сохранение влаги',
      tag: 'Защита от испарения',
      description:
        'Слой мульчи из пожнивных остатков толщиной 7–10 см снижает температуру поверхности на 10–15°C и сокращает испарение на 40%.',
      benefits: ['Защита микробиома от перегрева', 'Сохранение почвенной влаги', 'Благоприятная среда для червей'],
      implementation:
        'Никогда не сжигайте стерню; равномерно распределяйте измельченную солому по междурядьям.',
    },
    biodiversity: {
      title: 'Агробиоразнообразие и живые изгороди',
      tag: 'Экологический баланс',
      description:
        'Цветущие полосы по периметру полей и лесополосы создают надежные убежища для хищных насекомых-энтомофагов и пчел-опылителей.',
      benefits: ['Естественный контроль вредителей', 'Ветрозащитная функция', 'Дополнительный сбор меда'],
      implementation:
        'Выделяйте 5–8% площади границ полей под цветущие многолетники, бархатцы и азотфиксирующие кустарники.',
    },
    ipm: {
      title: 'Интегрированная экологическая защита растений (ИЗР)',
      tag: 'Биологический контроль',
      description:
        'Использование биопрепаратов (Триходерма, Битоксибациллин, масло нима), феромонных ловушек и ловчих культур вместо токсичных химикатов.',
      benefits: ['Отсутствие токсичных остатков в урожае', 'Безопасность для пчел', 'Предотвращение резистентности вредителей'],
      implementation:
        'Высаживайте ловчие культуры на границах полей и применяйте биопрепараты при первых признаках появления вредителей.',
    },
  },
};

export const REGEN_ZH: LocalizedRegenerativeUIStrings = {
  title: '再生农业 8 大核心支柱',
  subtitle: '恢复农田鲜活生态、土壤碳汇与生物多样性，同时实现稳产增产。',
  calibratedFor: '精准适配',
  onSoil: '土质',
  farmVitalityScore: '农场生机活力指数',
  saving: '正在保存...',
  savedToFarm: '已保存至农场档案',
  unableToSave: '保存失败',
  purposeTitle: '再生农业核心宗旨：',
  purposeDesc: (farm, crop) =>
    `再生农业将耕地地力培育、精准节水、绿肥覆盖与生物多样性指标，深度融入当前农场感知监测（${farm} — ${crop}），筑牢长期应对气候变化的生态韧性与有机碳积累。`,
  activeFarmFallback: '当前活跃农场',
  carbonSequestered: '预计土壤年固碳量',
  carbonUnit: '吨 CO₂e / 年',
  acrossSoil: '覆盖面积',
  waterConserved: '农田节约灌溉水量',
  waterSavingsUnit: '机井运行时间缩减',
  viaMulch: '依托秸秆覆盖层与腐殖质土壤强劲的蓄水保墒保水能力。',
  activePillarsCount: '已启动生物农业举措',
  pillarsUnit: '项落地实践',
  clickToAdopt: '点击下方任意实践卡片，将其标记为农场采纳方案。',
  pillarsHeading: '再生农业 8 大核心支柱实践',
  clickArrowsExpand: '点击箭头展开技术规程指南',
  adoptBtn: '+ 采纳实践',
  activeBtn: '✓ 已在实施',
  viewDetails: '查看技术详情',
  collapse: '折叠收起',
  guideLabel: '技术指南：',
  benefitsLabel: '综合效益：',
  pillarSpotlight: '核心实践深度解读',
  markImplemented: '标记为已落地执行',
  activeOnFarm: '✓ 正在本农场严格实施',
  ecologicalBenefits: '实证生态效益清单：',
  implementationGuide: '农事操作实施指南：',
  pillars: {
    'crop-rotation': {
      title: '轮作与作物多样化',
      tag: '土壤活力',
      description:
        '深根性与浅根性作物交替种植，结合豆科固氮作物，能有效打破病虫害生命周期并补充各土层养分。',
      benefits: ['打破杂草与病虫害周期', '天然氮素生态平衡', '显著改善土壤物理团粒结构'],
      implementation:
        '制定3-4季轮作方案，将禾谷类（小麦/玉米）与豆类（鹰嘴豆/扁豆）及十字花科作物轮换。',
    },
    'cover-crops': {
      title: '多物种覆盖作物 (Cover Crops)',
      tag: '水土保持与生物增殖',
      description:
        '让农田全年保持活体根系，持续向地下分泌有机碳源滋养微生物群落，同时防止暴雨冲刷和风蚀。',
      benefits: ['抑制80%以上杂草萌发', '防止水土流失与地表板结', '促进菌根真菌活性增长'],
      implementation:
        '在主粮作物收获后的休耕期间，播种绿豆、高粱、红三叶草等复合覆盖种子。',
    },
    'compost-organic': {
      title: '堆肥与活性生物接种剂',
      tag: '微生态系统',
      description:
        '以高活性蚯蚓堆肥、生物炭和发酵堆肥茶替代高盐分化肥，向土壤接种数十亿有益菌群与真菌。',
      benefits: ['调节并缓冲土壤pH值', '大幅提高水分下渗效率', '长效缓释有机养分供给'],
      implementation:
        '播种前每公顷施用2-3吨充分腐熟的有机堆肥，配合傍晚叶面微生态发酵液喷施。',
    },
    'reduced-tillage': {
      title: '保护性耕作 / 免耕栽培 (No-Till)',
      tag: '土壤固碳',
      description:
        '剧烈机械翻耕会使土壤有机碳加速氧化为CO2并破坏菌丝。免耕能完好保护土壤孔隙度和蚯蚓通道。',
      benefits: ['节约燃油与人工成本', '深层保蓄土壤毛管水分', '将碳长效锁定在土壤中'],
      implementation:
        '通过压青留茬机并在覆草秸秆覆盖物上直接使用免耕精量播种机作业。',
    },
    'water-conservation': {
      title: '精准节水与高效微灌技术',
      tag: '气候适应韧性',
      description:
        '采用膜下滴灌、张力计土壤湿度传感器监测及雨水集蓄梯田，杜绝次生盐碱化并节水达50%。',
      benefits: ['涵养保护深层地下水', '防止作物根系缺氧沤根', '增强农田抗旱缓冲能力'],
      implementation:
        '敷设低压或重力滴灌管线，并在田间关键根系层埋设简易土壤湿度张力探针。',
    },
    'soil-moisture': {
      title: '活体覆盖物与秸秆保墒',
      tag: '抑制水分蒸发',
      description:
        '用7-10厘米秸秆残茬覆盖地表，可使盛夏地表温度降低10-15°C，并将无效蒸发损耗削减40%。',
      benefits: ['保护根际微生物免受高温灼伤', '持久保蓄耕作层有效水', '为蚯蚓繁衍营造温润栖息地'],
      implementation:
        '严禁田间焚烧秸秆；将粉碎秸秆或甘蔗渣均匀撒布于行间土表。',
    },
    biodiversity: {
      title: '农田生物多样性与生态植被隔离带',
      tag: '生态系统平衡',
      description:
        '在农田田埂边缘种植蜜源开花植物与农田防护林带，为天敌昆虫（草蛉、寄生蜂、瓢虫）提供永久栖息地。',
      benefits: ['天然生物天敌治虫', '营造防风固沙微气候', '兼收天然蜂蜜与优质绿肥'],
      implementation:
        '在农田5-8%的边界带种植万寿菊、油菜花及固氮灌木等本土蜜源植物。',
    },
    ipm: {
      title: '生态综合有害生物防治 (IPM)',
      tag: '非化学绿色防控',
      description:
        '运用哈茨木霉菌、苏云金杆菌 (Bt)、印楝素生物农药配合性诱剂性迷向，全面替代剧毒化学农药。',
      benefits: ['农产品零化学农残风险', '全面保护传粉蜜蜂种群', '避免害虫快速产生抗药性'],
      implementation:
        '地头种植诱集作物（如蓖麻/向日葵），在监测到害虫初发期及时释放天敌昆虫卵卡。',
    },
  },
};

export const REGEN_AR: LocalizedRegenerativeUIStrings = {
  title: 'الركائز الثماني للزراعة التجديدية',
  subtitle: 'استعادة النظم البيئية الحية وكربون التربة والتنوع البيولوجي مع زيادة المحصول.',
  calibratedFor: 'معاير لـ',
  onSoil: 'على تربة',
  farmVitalityScore: 'مؤشر حيوية المزرعة',
  saving: 'جارٍ الحفظ...',
  savedToFarm: 'تم الحفظ في المزرعة',
  unableToSave: 'تعذر الحفظ',
  purposeTitle: 'الهدف من الزراعة التجديدية:',
  purposeDesc: (farm, crop) =>
    `تربط الزراعة التجديدية تحسين صحة التربة وكفاءة استخدام المياه والمحاصيل التغطوية والتنوع البيولوجي مباشرةً ببيانات المزرعة النشطة (${farm} — ${crop}) لبناء المرونة المناخية والكربون العضوي.`,
  activeFarmFallback: 'المزرعة النشطة',
  carbonSequestered: 'الكربون المخزن المقدر',
  carbonUnit: 'طن مكافئ CO₂ / سنة',
  acrossSoil: 'عبر مساحة',
  waterConserved: 'مياه الري الموفرة',
  waterSavingsUnit: 'تقليل وقت تشغيل المضخات',
  viaMulch: 'من خلال التغطية بالمهاد وتحسين قدرة الدبال على الاحتفاظ بالماء.',
  activePillarsCount: 'الممارسات البيولوجية النشطة',
  pillarsUnit: 'ركائز قيد التنفيذ',
  clickToAdopt: 'انقر على أي ركيزة لتسجيل تبنيها في مزرعتك.',
  pillarsHeading: 'الركائز الثماني للزراعة التجديدية',
  clickArrowsExpand: 'انقر على الأسهم لتوسيع الأدلة الإرشادية',
  adoptBtn: '+ تبنّي',
  activeBtn: '✓ مفعّل',
  viewDetails: 'عرض التفاصيل',
  collapse: 'طي',
  guideLabel: 'الدليل:',
  benefitsLabel: 'الفوائد:',
  pillarSpotlight: 'تسليط الضوء على الركيزة',
  markImplemented: 'تحديد كمنفّذ',
  activeOnFarm: '✓ مفعّل في المزرعة الحالية',
  ecologicalBenefits: 'الفوائد البيئية الموثقة:',
  implementationGuide: 'دليل التطبيق العملي:',
  pillars: {
    'crop-rotation': {
      title: 'الدورة الزراعية وتنوع المحاصيل',
      tag: 'حيوية التربة',
      description:
        'المناوبة بين المحاصيل عميقة الجذور والسطحية والبقوليات يكسر دورات الآفات والأمراض ويعيد خصوبة التربة.',
      benefits: ['كسر دورات الأعشاب والآفات', 'توازن النيتروجين الطبيعي', 'تحسين بنية التربة'],
      implementation:
        'صمم دورة زراعية من 3-4 مواسم تناوب فيها الحبوب مع البقوليات والمحاصيل الزيتية.',
    },
    'cover-crops': {
      title: 'محاصيل التغطية متعددة الأصناف',
      tag: 'مكافحة التآكل والبيولوجيا',
      description:
        'الحفاظ على جذور حية طوال العام يغذي الكائنات الدقيقة في التربة ويحميها من الانجراف وحرارة الشمس.',
      benefits: ['تثبيط أكثر من 80% من الأعشاب', 'منع انجراف التربة', 'زيادة الفطريات الجذرية'],
      implementation:
        'ازرع خلطات بذور متنوعة مثل اللوبيا والدخن والفجل العلفي خلال فترات البور بين المحاصيل الأساسية.',
    },
    'compost-organic': {
      title: 'السماد العضوي والمخصبات الحيوية',
      tag: 'الحياة الميكروبية',
      description:
        'استبدال الأسمدة الكيميائية بالسماد الدودي عالي الجودة والفحم الحيوي وشاي الكمبوست ينشط الميكروبات النافعة.',
      benefits: ['موازنة درجة حموضة التربة', 'زيادة امتصاص المياه', 'تغذية عضوية ممتدة المفعول'],
      implementation:
        'أضف 2-3 أطنان من السماد العضوي المتحلل لكل هكتار قبل الزراعة مع الرش الورقي بالمعززات الحيوية.',
    },
    'reduced-tillage': {
      title: 'الزراعة بدون حرث / حراثة منعدمة',
      tag: 'تخزين الكربون',
      description:
        'الحراثة الميكانيكية الزائدة تفقد التربة كربونها وتهدم شبكات الفطريات. الحراثة الصفرية تحافظ على مسام التربة والديدان.',
      benefits: ['توفير الوقود والجهد', 'الاحتفاظ برطوبة التربة', 'حبس الكربون في الأرض'],
      implementation:
        'تحول إلى الزراعة المباشرة في بقايا المحاصيل باستخدام بذارات الحراثة الصفرية المتخصصة.',
    },
    'water-conservation': {
      title: 'الحفاظ الدقيق على المياه والري الموضعي',
      tag: 'المرونة المناخية',
      description:
        'الري بالتنقيط والحساسات وحصاد مياه الأمطار يوفر ما يصل إلى 50% من المياه ويمنع التملح.',
      benefits: ['الحفاظ على المياه الجوفية', 'منع اختناق الجذور', 'مقاومة نوبات الجفاف'],
      implementation:
        'ركّب شبكات ري بالتنقيط منخفضة الضغط مزودة بمقاييس رطوبة التربة التوتيرية.',
    },
    'soil-moisture': {
      title: 'المهاد الحي وحفظ رطوبة التربة',
      tag: 'حاجز التبخر',
      description:
        'تغطية التربة بطبقة 7-10 سم من القش وبقايا المحاصيل تخفض حرارة السطح بـ 10-15°C وتقلل التبخر بـ 40%.',
      benefits: ['حماية ميكروبات التربة من الحرارة', 'حفظ الرطوبة الدائمة', 'توفير بيئة مثالية للديدان'],
      implementation:
        'تجنب حرق مخلفات المحاصيل؛ انثر القش المفروم بالتساوي بين خطوط الزراعة.',
    },
    biodiversity: {
      title: 'التنوع البيولوجي الزراعي والأسيجة النباتية',
      tag: 'التوازن البيئي',
      description:
        'زراعة نباتات مزهرة مصدات للرياح حول الحقل يخلق موائل دائمة للحشرات المفترسة النافعة والنحل.',
      benefits: ['المكافحة الحيوية الطبيعية', 'حماية الحقول من الرياح', 'فوائد إضافية في إنتاج العسل'],
      implementation:
        'خصص 5-8% من حواف المزرعة للشجيرات المزهرة المحلية والأشجار المثبتة للنيتروجين.',
    },
    ipm: {
      title: 'الإدارة البيئية المتكاملة للآفات (IPM)',
      tag: 'المكافحة الحيوية',
      description:
        'استخدام الكائنات الحية الدقيقة (تريكوديرما، بكتيريا Bt، زيت النيم) والمصائد الفرمونية بديلاً للمبيدات السامة.',
      benefits: ['منتجات خالية من السموم', 'حماية النحل والملقحات', 'منع اكتساب الآفات للمناعة'],
      implementation:
        'ازرع محاصيل جاذبة للآفات على الحدود وأطلق الأعداء الطبيعية عند أول ظهور للإصابة.',
    },
  },
};

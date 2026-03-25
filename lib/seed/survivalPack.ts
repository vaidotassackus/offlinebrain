export const SURVIVAL_PACK = {
  id: 'survival',
  name: 'Wilderness Survival',
  description: 'Essential wilderness and emergency survival techniques',
  category: 'survival',
  sizeBytes: 1_800_000,
  version: '2026.03.01',
  isRequired: false,
};

export interface SeedArticle {
  id: string;
  packId: string;
  title: string;
  content: string;
  category: string;
  tags: string; // JSON array string
  isCritical: boolean;
  readTime: number; // minutes
}

export const SURVIVAL_ARTICLES: SeedArticle[] = [
  {
    id: 'surv-water',
    packId: 'survival',
    title: 'Water Purification Methods',
    content:
      '## Why Water Purification Matters\n\n' +
      'Drinking untreated water in the wilderness can expose you to bacteria (E. coli, Salmonella), protozoa (Giardia, Cryptosporidium), and viruses (Hepatitis A, Norovirus). Symptoms of waterborne illness — diarrhea, vomiting, cramps — cause rapid dehydration that can become life-threatening within hours in a survival scenario. Always treat water from streams, lakes, ponds, and rivers before drinking, even if it looks clear.\n\n' +
      '## Boiling\n\n' +
      'Boiling is the most reliable field method for killing all classes of pathogens. Bring water to a rolling boil and maintain it for at least one minute. At elevations above 2,000 meters (6,562 feet), boil for three minutes because water boils at a lower temperature at altitude. Let the water cool before drinking. If the water is cloudy, filter it first through a cloth or improvised sand filter to remove sediment.\n\n' +
      '## Chemical Treatment with Household Bleach\n\n' +
      'Unscented liquid household bleach containing 5-6% sodium hypochlorite can disinfect water. Add 2 drops of bleach per liter (or 8 drops per gallon) of clear water. If the water is cloudy or cold, double the dose to 4 drops per liter. Stir and let stand for 30 minutes. The water should have a slight chlorine smell after treatment — if it does not, repeat the dose and wait another 15 minutes. This method is effective against bacteria and most viruses but may not eliminate Cryptosporidium.\n\n' +
      '## Solar Disinfection (SODIS)\n\n' +
      'SODIS uses UV radiation from sunlight to inactivate pathogens. Fill a clean, clear PET plastic bottle (up to 2 liters) with water. If the water is cloudy, pre-filter it until you can read newspaper print through the bottle. Lay the bottle on its side on a dark or reflective surface (such as a sheet of metal) in direct sunlight for at least 6 hours. If the sky is more than 50% overcast, extend exposure to two full days. SODIS is effective against bacteria, viruses, and protozoa including Giardia, but works best in tropical and subtropical regions with strong sunlight.\n\n' +
      '## Prioritizing Your Method\n\n' +
      'When possible, combine methods for greater safety — for example, filter cloudy water through cloth, then boil it. If you have no fire-starting ability and no bleach, SODIS is your fallback. Always collect water from the fastest-moving, clearest source available, and take it upstream of any camps or trails.',
    category: 'survival',
    tags: '["water","purification","survival","boiling","bleach","SODIS","hydration"]',
    isCritical: true,
    readTime: 4,
  },
  {
    id: 'surv-fire',
    packId: 'survival',
    title: 'Starting a Fire Without Matches',
    content:
      '## Preparing Your Materials\n\n' +
      'Before attempting ignition, gather three categories of fuel. Tinder is the fine, highly flammable material that catches a spark or ember — dry grass, birch bark, cattail fluff, dryer lint, or finely shredded cedar bark all work well. Kindling consists of small dry sticks and twigs, roughly pencil-thickness or thinner. Fuel wood is larger pieces that will sustain the fire once established. Arrange kindling in a teepee or log-cabin structure over your tinder bundle, leaving gaps for airflow. Having everything prepared before you attempt ignition is critical — an ember dies in seconds without ready tinder.\n\n' +
      '## Friction Methods: Bow Drill\n\n' +
      'The bow drill is the most practical friction-based technique. You need a fireboard (a flat piece of dry softwood like cedar, willow, or cottonwood), a spindle (a straight, dry stick about 30 cm long and 2 cm in diameter from the same or similar wood), a bow (a curved stick about arm-length with cordage tied between its ends), and a handhold (a harder piece of wood, stone, or shell to press down on the spindle top). Carve a small depression in the fireboard and cut a V-shaped notch from the edge into the depression. Loop the bow string around the spindle, place the spindle in the depression, press down with the handhold, and saw the bow back and forth with long, steady strokes. Increase speed and downward pressure as friction builds. Dark powder will accumulate in the notch — this is your ember. Transfer it gently to your tinder bundle.\n\n' +
      '## Spark-Based Methods\n\n' +
      'Striking a ferrocerium rod (ferro rod) against a steel striker or the spine of a carbon-steel knife produces a shower of sparks exceeding 3,000 degrees Celsius. Direct these sparks into a tinder bundle of fine, dry material. If you lack a ferro rod, strike a piece of high-carbon steel (such as a knife spine) against a sharp edge of flint, quartz, or jasper to produce sparks. You can also use a steel wool pad touched to both terminals of a battery — the thin filaments glow and ignite readily.\n\n' +
      '## Tips for Success\n\n' +
      'Moisture is the enemy of fire-starting. Keep tinder dry by storing it inside your clothing or in a sealed container. In wet conditions, look for standing dead wood (dead branches still attached to trees) and shave away the damp outer layer to reach dry wood underneath. Split larger pieces to expose the dry interior. Shield your tinder bundle from wind while building the initial flame, then use gentle blowing to feed oxygen to the growing fire.',
    category: 'survival',
    tags: '["fire","friction","bow drill","ferro rod","survival","warmth"]',
    isCritical: false,
    readTime: 5,
  },
  {
    id: 'surv-shelter',
    packId: 'survival',
    title: 'Building Emergency Shelter',
    content:
      '## Shelter Priorities\n\n' +
      'In most survival situations, shelter is your top priority — hypothermia can kill in as little as three hours in cold or wet conditions, while heat exposure can cause fatal heatstroke within hours. Choose a location that is protected from wind, away from flood-prone areas (dry riverbeds, low ground), clear of dead-standing trees ("widow-makers"), and close to building materials. Avoid hilltops (wind exposure) and valley floors (cold air pooling). If you have limited energy, build the smallest shelter that fits your body to conserve heat.\n\n' +
      '## Debris Hut\n\n' +
      'A debris hut is one of the most effective emergency shelters in a temperate forest. Find or create a ridgepole — a sturdy branch about 3 meters long. Prop one end on a stump, rock, or forked stick about waist height, with the other end on the ground. Lean shorter branches along both sides at a 45-degree angle to form ribs, spaced roughly a hand-width apart. Layer leaves, pine needles, grass, or other debris thickly over the ribs — you need at least 60 cm (2 feet) of insulation to be effective against rain and cold. Pile more debris inside as bedding to insulate you from the ground, which can draw away body heat 25 times faster than still air.\n\n' +
      '## Lean-To and Tarp Shelters\n\n' +
      'If you have a tarp, poncho, or emergency space blanket, a lean-to is fast to construct. Tie a ridgeline between two trees at about chest height. Drape the tarp over the line and stake or weigh down the edges. Angle the open side away from the prevailing wind. A lean-to built in front of a long fire (a log fire reflected off a rock wall or log reflector) provides effective warmth. Without a tarp, lean thick branches against a horizontal ridgepole and layer bark slabs or leafy boughs over them, overlapping from bottom to top like shingles so rain runs off.\n\n' +
      '## Ground Insulation\n\n' +
      'Never sleep directly on bare ground. The ground conducts heat away from your body far more efficiently than air. Pile at least 15 cm (6 inches) of dry leaves, pine needles, grass, or evergreen boughs beneath you. In snow, stamp down a platform and layer boughs on top. This single step can be the difference between surviving the night and succumbing to hypothermia.',
    category: 'survival',
    tags: '["shelter","debris hut","lean-to","hypothermia","insulation","survival"]',
    isCritical: false,
    readTime: 4,
  },
  {
    id: 'surv-signal',
    packId: 'survival',
    title: 'Signalling for Rescue',
    content:
      '## Making Yourself Visible\n\n' +
      'Rescuers are looking for you, but the wilderness makes visual detection extremely difficult. Your goal is to create contrast against the natural environment. Use bright clothing, space blankets, or any reflective material spread out in an open area. Move to clearings, ridgelines, or shorelines where you are visible from the air. Three of anything is the universal distress signal — three fires in a triangle, three whistle blasts, three gunshots, or three piles of rocks. Space signal fires at least 30 meters apart for aerial visibility.\n\n' +
      '## Signal Fires and Smoke\n\n' +
      'A signal fire should produce maximum smoke during the day and maximum flame at night. For daytime signalling, build a hot base fire and then add green leaves, live branches, damp grass, or even rubber or oil if available to generate thick white or dark smoke. For nighttime visibility, build a bright, high-flame fire using dry hardwood. Keep signal fire materials prepared and dry so you can light them quickly when you hear an aircraft. A single fire is hard to distinguish from a campfire; three fires arranged in a triangle are unmistakable.\n\n' +
      '## Mirror and Light Signals\n\n' +
      'A signal mirror is one of the most effective rescue tools — its flash can be seen from over 50 km (30 miles) away on a clear day. Hold the mirror close to your face, extend your other hand toward the target (aircraft or vessel), and tilt the mirror so the reflected sunlight hits your outstretched hand. Slowly adjust until the flash sweeps across the target. Any reflective surface works: a phone screen, glasses lens, metal lid, or aluminum foil. At night, a flashlight or headlamp aimed at an aircraft in a sweeping pattern can attract attention.\n\n' +
      '## Ground-to-Air Signals\n\n' +
      'If you cannot move from your location, create large ground signals visible from the air. The standard ground-to-air symbols include a large "V" meaning "require assistance," "X" meaning "require medical help," and an arrow indicating your direction of travel. Make these at least 3 meters tall and 10 meters long using contrasting materials — dark rocks on light ground, trampled snow, logs, or clothing. Maintain them and keep the area around them clear so they remain visible.',
    category: 'survival',
    tags: '["rescue","signal","fire","mirror","ground signals","survival"]',
    isCritical: false,
    readTime: 4,
  },
  {
    id: 'surv-plants',
    packId: 'survival',
    title: 'Edible vs Toxic Plants — Identification Basics',
    content:
      '## The Universal Edibility Test\n\n' +
      'If you cannot positively identify a plant, the Universal Edibility Test (UET) can help you determine safety, though it takes time and carries some risk. First, test only one plant part (leaf, stem, root, or fruit) at a time. Fast for 8 hours before testing. During the fast, hold a small piece of the plant against your inner wrist for 15 minutes and check for rash, burning, or swelling. If no reaction occurs, touch a small piece to your outer lip for 15 minutes. Then place a piece on your tongue for 15 minutes without chewing. If still no reaction, chew a small piece and hold it in your mouth for 15 minutes — spit it out if you detect intense bitterness, burning, or soapy taste. If no ill effect, swallow a small portion and wait 8 hours. If no nausea, cramps, or diarrhea occur, the plant part is likely safe to eat in moderate quantities.\n\n' +
      '## Warning Signs of Toxic Plants\n\n' +
      'Avoid any plant that has a milky or discolored sap (with the exception of dandelions and coconuts). Stay away from plants with beans, bulbs, or seeds inside pods, as many are toxic. Avoid plants with thorns, fine hairs, or spines on the leaves or stems. Plants with an almond-like scent in the leaves or bark may contain cyanide compounds. Umbrella-shaped flower clusters (like those of poison hemlock and water hemlock) are associated with some of the deadliest plants in North America. Never eat mushrooms in a survival situation unless you have expert-level identification skills — many deadly species closely resemble edible ones.\n\n' +
      '## Commonly Safe Wild Edibles\n\n' +
      'Some widely distributed plants are generally safe and recognizable. Dandelions (Taraxacum) are entirely edible — leaves, flowers, and roots. Cattails (Typha) found near water have edible shoots, roots, and pollen heads. Clover (Trifolium) flowers and leaves are edible raw or boiled. Plantain (Plantago major, the broadleaf weed, not the banana relative) is found in disturbed ground worldwide and its young leaves are edible. Pine needles from most pine species can be steeped in hot water for a vitamin-C-rich tea — avoid yew, Norfolk Island pine, and Ponderosa pine, which are toxic.\n\n' +
      '## Critical Safety Rules\n\n' +
      'Never rely on what animals eat as a guide — many animals tolerate plants that are lethal to humans. Do not eat plants growing in contaminated water or near roads where chemical runoff is likely. When in doubt, do not eat it. Starvation takes weeks to become life-threatening, but a single meal of the wrong plant can kill you within hours. Focus your foraging energy on plants you can identify with absolute certainty.',
    category: 'survival',
    tags: '["plants","foraging","edible","toxic","identification","survival"]',
    isCritical: false,
    readTime: 5,
  },
  {
    id: 'surv-navigation',
    packId: 'survival',
    title: 'Navigation by Stars',
    content:
      '## Finding North Using Polaris (Northern Hemisphere)\n\n' +
      'Polaris, the North Star, sits within one degree of true celestial north and is the most reliable nighttime navigation reference in the Northern Hemisphere. To locate it, first find the Big Dipper (Ursa Major) — a pattern of seven bright stars resembling a ladle. The two stars forming the outer edge of the Dipper\'s bowl (Dubhe and Merak) are the "pointer stars." Draw an imaginary line through them, extending about five times the distance between them, and you will arrive at Polaris. Polaris is the last star in the handle of the Little Dipper (Ursa Minor). If the Big Dipper is below the horizon, find Cassiopeia — a W-shaped constellation on the opposite side of Polaris. The middle star of the W points roughly toward Polaris.\n\n' +
      '## Finding South Using the Southern Cross (Southern Hemisphere)\n\n' +
      'In the Southern Hemisphere, there is no bright star directly at the south celestial pole. Instead, use the Southern Cross (Crux), a compact constellation of four bright stars forming a cross shape. Extend the long axis of the cross (from the top star through the bottom star) by 4.5 times its length. The point you arrive at is approximately the south celestial pole. Drop an imaginary vertical line from that point to the horizon to determine due south. You can cross-reference this with the two bright "pointer stars" (Alpha and Beta Centauri) that lie nearby — draw a perpendicular line from the midpoint between them, and it will intersect with the line extended from the Southern Cross.\n\n' +
      '## Using Star Movement for East-West\n\n' +
      'If you cannot identify specific constellations, you can still determine cardinal directions by observing any star\'s movement. Drive two sticks into the ground and align them with a star. Wait 15-20 minutes and observe which way the star has moved. In the Northern Hemisphere, if the star moved left, you are facing north; if right, you are facing south; if up, you are facing east; if down, you are facing west. These directions are reversed in the Southern Hemisphere. This method works with any visible star and requires no constellation knowledge.\n\n' +
      '## Practical Tips for Stellar Navigation\n\n' +
      'Stars are most useful for setting a bearing, not for continuous navigation while walking. Identify your target direction, pick a landmark on the horizon in that direction, and walk toward it. When you reach it, re-sight on the stars and choose a new landmark. Stars shift about 15 degrees per hour due to Earth\'s rotation, so re-check your bearing every 30 minutes. Overcast skies block this method entirely — in those conditions, rely on terrain features, prevailing wind, or other navigation techniques.',
    category: 'survival',
    tags: '["navigation","stars","Polaris","Southern Cross","compass","survival"]',
    isCritical: false,
    readTime: 4,
  },
];

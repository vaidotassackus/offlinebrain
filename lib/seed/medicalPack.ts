export const MEDICAL_PACK = {
  id: 'medical',
  name: 'Emergency Medical',
  description: 'Critical first aid and emergency medical procedures',
  category: 'medical',
  sizeBytes: 2_500_000,
  version: '2026.03.01',
  isRequired: true,
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

export const MEDICAL_ARTICLES: SeedArticle[] = [
  {
    id: 'med-tourniquet',
    packId: 'medical',
    title: 'Tourniquet Application for Severe Bleeding',
    content:
      '## When to Use a Tourniquet\n\n' +
      'A tourniquet is indicated for life-threatening bleeding from an arm or leg that cannot be controlled by direct pressure alone. Signs that a tourniquet is needed include blood that is spurting or pooling rapidly, blood-soaked bandages that are not slowing the flow, or a traumatic amputation. Do not delay — severe hemorrhage can cause death within minutes.\n\n' +
      '## How to Apply a Tourniquet\n\n' +
      '1. Place the tourniquet 2 to 3 inches above the wound, between the wound and the heart. Never place it directly on a joint (elbow or knee).\n' +
      '2. Pull the strap tight and secure it through the buckle or fastener.\n' +
      '3. Twist the windlass rod until the bleeding stops completely.\n' +
      '4. Lock the windlass in place using the clip or holder.\n' +
      '5. Note the time the tourniquet was applied and write it on the tourniquet or on the patient\'s skin near the device.\n\n' +
      '## Improvised Tourniquets\n\n' +
      'If a commercial tourniquet is not available, use a strip of fabric at least 1.5 inches wide (a belt, torn shirt, or bandana) and a rigid stick or rod as a windlass. Do not use narrow materials like rope, wire, or paracord — they cause tissue damage without effectively stopping blood flow. Wrap the fabric around the limb, tie a half-knot, place the rod on top, tie a full knot over it, and twist until bleeding stops.\n\n' +
      '## Critical Reminders\n\n' +
      'Once applied, do not loosen or remove the tourniquet — this should only be done by medical professionals. A tourniquet will cause significant pain; this is expected and necessary. If bleeding continues after the first tourniquet, apply a second tourniquet side by side with the first, slightly closer to the torso. Call emergency services immediately.',
    category: 'medical',
    tags: '["bleeding","tourniquet","trauma","hemorrhage","first aid"]',
    isCritical: true,
    readTime: 3,
  },
  {
    id: 'med-cpr',
    packId: 'medical',
    title: 'CPR — Adult and Child',
    content:
      '## Recognizing Cardiac Arrest\n\n' +
      'Cardiac arrest occurs when the heart stops pumping blood effectively. The person will be unresponsive (does not react when you tap their shoulders and shout), and will not be breathing normally — look for the absence of breathing or only occasional gasping. If you see these signs, call emergency services immediately and begin CPR. Every minute without CPR reduces the chance of survival by approximately 10%.\n\n' +
      '## Adult CPR (Age 12 and Older)\n\n' +
      '1. Place the person on a firm, flat surface on their back.\n' +
      '2. Kneel beside their chest. Place the heel of one hand on the center of the chest, on the lower half of the breastbone (sternum). Place your other hand on top and interlace your fingers.\n' +
      '3. Keep your arms straight and position your shoulders directly above your hands.\n' +
      '4. Push hard and fast — compress the chest at least 2 inches deep at a rate of 100 to 120 compressions per minute. Allow the chest to fully recoil between compressions.\n' +
      '5. If you are trained in rescue breathing, give 2 breaths after every 30 compressions. Tilt the head back, lift the chin, pinch the nose, and blow into the mouth for about 1 second per breath, watching for the chest to rise.\n' +
      '6. If you are not trained or not comfortable with rescue breathing, perform continuous chest compressions without stopping.\n\n' +
      '## Child CPR (Ages 1 to 12)\n\n' +
      'The technique for children is similar to adults with key differences. Use one or two hands for compressions depending on the size of the child. Compress the chest about 2 inches deep (approximately one-third the depth of the chest). Maintain the same rate of 100 to 120 compressions per minute with a 30:2 compression-to-breath ratio. For children, give 2 minutes of CPR before calling emergency services if you are alone.\n\n' +
      '## Using an AED\n\n' +
      'If an automated external defibrillator (AED) is available, turn it on and follow the voice prompts. Attach the pads to the bare chest as shown in the diagrams on the pads. Do not stop CPR except when the AED is analyzing the rhythm or delivering a shock. Resume CPR immediately after a shock is delivered. Continue CPR until emergency medical services arrive or the person begins to breathe normally.',
    category: 'medical',
    tags: '["cpr","cardiac arrest","resuscitation","aed","chest compressions"]',
    isCritical: true,
    readTime: 4,
  },
  {
    id: 'med-stroke',
    packId: 'medical',
    title: 'Signs of Stroke — The FAST Method',
    content:
      '## What Is a Stroke?\n\n' +
      'A stroke occurs when blood flow to part of the brain is interrupted, either by a clot blocking a blood vessel (ischemic stroke) or by a blood vessel bursting (hemorrhagic stroke). Brain cells begin to die within minutes, making rapid recognition and treatment critical. The phrase "time is brain" reflects the fact that every minute of delay results in further irreversible brain damage.\n\n' +
      '## The FAST Assessment\n\n' +
      'Use the FAST method to quickly identify stroke symptoms:\n\n' +
      '- **F — Face drooping.** Ask the person to smile. Does one side of the face droop or feel numb? An uneven smile is a warning sign.\n' +
      '- **A — Arm weakness.** Ask the person to raise both arms. Does one arm drift downward or feel weak? Inability to hold one arm up is a key indicator.\n' +
      '- **S — Speech difficulty.** Ask the person to repeat a simple sentence such as "The sky is blue." Is their speech slurred, garbled, or hard to understand? Can they speak at all?\n' +
      '- **T — Time to call emergency services.** If any of these signs are present, call your local emergency number immediately. Note the time when symptoms first appeared — this information is critical for treatment decisions.\n\n' +
      '## Additional Stroke Symptoms\n\n' +
      'Beyond the FAST signs, other symptoms of stroke include sudden severe headache with no known cause, sudden confusion or trouble understanding speech, sudden difficulty seeing in one or both eyes, sudden dizziness, loss of balance, or difficulty walking. These symptoms typically come on abruptly rather than gradually.\n\n' +
      '## What to Do While Waiting for Help\n\n' +
      'Do not give the person food, water, or medication — they may have difficulty swallowing. Do not let them "sleep it off" or wait to see if symptoms improve. Have them lie down with their head slightly elevated. If they are unconscious but breathing, place them in the recovery position on their side. Keep them calm and monitor their breathing until emergency services arrive.',
    category: 'medical',
    tags: '["stroke","FAST","brain","emergency","neurological"]',
    isCritical: true,
    readTime: 3,
  },
  {
    id: 'med-burns',
    packId: 'medical',
    title: 'Treating Burns — Severity and First Response',
    content:
      '## Classifying Burn Severity\n\n' +
      'Burns are classified by depth. First-degree burns (superficial) affect only the outer skin layer and appear red and dry, like a sunburn. Second-degree burns (partial thickness) extend into the second layer of skin, causing blisters, swelling, and wet-looking skin with intense pain. Third-degree burns (full thickness) destroy all layers of skin and may appear white, brown, or charred; these may be painless in the center because nerve endings are destroyed. Any burn larger than 3 inches, or burns on the face, hands, feet, groin, or over a major joint, require emergency medical care.\n\n' +
      '## Immediate First Aid for Burns\n\n' +
      '1. Ensure the scene is safe. Remove the person from the source of the burn.\n' +
      '2. Cool the burn immediately under cool (not cold) running water for at least 10 to 20 minutes. This is the single most effective first aid measure and works best when started within the first 3 minutes. Do not use ice, ice water, butter, toothpaste, or any home remedies — these can worsen the injury.\n' +
      '3. Remove clothing and jewelry near the burn area before swelling begins, unless they are stuck to the skin.\n' +
      '4. After cooling, cover the burn loosely with a clean, non-stick dressing or cling film. Do not wrap tightly.\n' +
      '5. For pain relief, over-the-counter ibuprofen or acetaminophen may be taken at standard doses.\n\n' +
      '## When to Seek Emergency Care\n\n' +
      'Call emergency services for any third-degree burn, burns covering a large area of the body, burns on the face or airway (indicated by singed nasal hair, soot around the mouth, or difficulty breathing), electrical burns, or chemical burns. For chemical burns, brush off any dry chemical first, then flush with large amounts of water for at least 20 minutes. For electrical burns, always seek medical evaluation even if the skin injury appears minor — internal tissue damage may be significant.',
    category: 'medical',
    tags: '["burns","thermal injury","first aid","wound care"]',
    isCritical: false,
    readTime: 3,
  },
  {
    id: 'med-fracture',
    packId: 'medical',
    title: 'Managing a Broken Bone Before Hospital',
    content:
      '## Recognizing a Fracture\n\n' +
      'A broken bone (fracture) may present with intense pain at the injury site that worsens with movement, visible swelling and bruising, deformity or an unnatural angle of the limb, inability to bear weight or use the affected area, a grinding or crunching sensation, or bone protruding through the skin (open fracture). Not all fractures are obvious — if the mechanism of injury was significant (a fall, impact, or twist) and the person cannot use the limb normally, treat it as a fracture.\n\n' +
      '## Splinting and Immobilization\n\n' +
      'The goal of first aid for fractures is to prevent further injury by immobilizing the broken bone. Follow these principles:\n\n' +
      '1. Do not attempt to straighten or realign the bone. Splint the limb in the position you find it.\n' +
      '2. Immobilize the joints above and below the fracture. For example, a forearm fracture requires immobilizing both the wrist and the elbow.\n' +
      '3. Use any rigid material for a splint — boards, rolled newspapers, a pillow, or even a neighboring finger (buddy taping). Pad the splint with soft material to prevent pressure sores.\n' +
      '4. Secure the splint with bandages, strips of cloth, or tape. It should be snug but not so tight that it cuts off circulation.\n' +
      '5. Check circulation below the splint by feeling for a pulse, checking that fingers or toes are warm, and asking whether the patient feels numbness or tingling. Loosen the splint immediately if circulation is impaired.\n\n' +
      '## Special Situations\n\n' +
      'For an open fracture where bone is visible or has broken through the skin, cover the wound with a clean, moist dressing and splint as described above. Do not push bone fragments back in. Control bleeding with gentle pressure around (not over) the fracture site. For suspected spinal injuries (neck or back pain after trauma, numbness or weakness in the limbs), do not move the person unless they are in immediate danger. Keep them still and wait for emergency medical services.',
    category: 'medical',
    tags: '["fracture","broken bone","splint","immobilization","trauma"]',
    isCritical: false,
    readTime: 3,
  },
  {
    id: 'med-anaphylaxis',
    packId: 'medical',
    title: 'Anaphylaxis and Epinephrine Use',
    content:
      '## Recognizing Anaphylaxis\n\n' +
      'Anaphylaxis is a severe, life-threatening allergic reaction that can develop within seconds to minutes after exposure to a trigger such as food (nuts, shellfish, eggs), insect stings (bees, wasps), medications (penicillin, NSAIDs), or latex. Symptoms involve multiple body systems and include: skin reactions such as hives, flushing, or itching; swelling of the lips, tongue, or throat; difficulty breathing, wheezing, or a tight feeling in the chest; a rapid or weak pulse; dizziness or fainting; nausea, vomiting, or abdominal cramps. Anaphylaxis can progress to cardiovascular collapse and death if untreated.\n\n' +
      '## Using an Epinephrine Auto-Injector\n\n' +
      '1. Call emergency services immediately. Epinephrine is a critical first treatment but professional care is still required.\n' +
      '2. Retrieve the auto-injector (e.g., EpiPen, Auvi-Q). Check the expiration date — use it even if expired, as some efficacy may remain when no alternative exists.\n' +
      '3. Remove the safety cap.\n' +
      '4. Hold the injector in your fist with the orange (needle) tip pointing down.\n' +
      '5. Press the tip firmly into the outer thigh (the vastus lateralis muscle) — this can be done through clothing. Hold in place for 10 seconds in newer models (or 3 seconds for some older models — follow the device instructions).\n' +
      '6. Remove and note the time of injection.\n' +
      '7. If symptoms do not improve within 5 to 15 minutes, and a second auto-injector is available, administer a second dose.\n\n' +
      '## After Administering Epinephrine\n\n' +
      'Have the person lie down with their legs elevated, unless they are having difficulty breathing, in which case allow them to sit up. Do not let them stand or walk. Be aware that symptoms can return after the epinephrine wears off (biphasic reaction), so hospital observation for at least 4 to 6 hours is essential even if the person feels better. If the person becomes unresponsive and stops breathing, begin CPR immediately.',
    category: 'medical',
    tags: '["anaphylaxis","allergy","epinephrine","EpiPen","allergic reaction"]',
    isCritical: true,
    readTime: 3,
  },
  {
    id: 'med-hypothermia',
    packId: 'medical',
    title: 'Hypothermia — Recognition and Warming',
    content:
      '## Recognizing Hypothermia\n\n' +
      'Hypothermia occurs when the body\'s core temperature drops below 95 degrees Fahrenheit (35 degrees Celsius). It can develop from prolonged exposure to cold air, wind, rain, or cold water immersion. The condition progresses through stages. Mild hypothermia (90 to 95 degrees F) causes intense shivering, numbness in the extremities, difficulty with fine motor tasks, and confusion. Moderate hypothermia (82 to 90 degrees F) causes shivering to slow or stop, increasing confusion, slurred speech, drowsiness, and loss of coordination. Severe hypothermia (below 82 degrees F) causes shivering to cease, extreme confusion or unconsciousness, very slow breathing and heart rate, rigid muscles, and a risk of cardiac arrest.\n\n' +
      '## Rewarming Procedures\n\n' +
      '1. Move the person to shelter and out of the cold, wind, and wet conditions. Handle them gently — rough movement can trigger a dangerous heart rhythm in severe hypothermia.\n' +
      '2. Remove any wet clothing and replace it with dry layers or blankets.\n' +
      '3. Insulate the person from the ground using sleeping pads, blankets, or dry leaves.\n' +
      '4. Focus warming on the core of the body — chest, neck, head, and groin. Use warm (not hot) compresses, heating pads wrapped in cloth, or skin-to-skin contact under blankets.\n' +
      '5. If the person is alert and able to swallow, give warm (not hot) sweet beverages. Do not give alcohol — it dilates blood vessels and accelerates heat loss.\n' +
      '6. Do not rub or massage the extremities. Do not immerse the person in hot water. These actions can cause cold blood from the limbs to rush to the heart, potentially causing cardiac arrest (a phenomenon called afterdrop).\n\n' +
      '## When to Seek Emergency Help\n\n' +
      'All cases of moderate and severe hypothermia require emergency medical treatment. Call for help immediately. If the person is not breathing or has no pulse, begin CPR — but be aware that in severe hypothermia, pulse and breathing may be very faint and slow. Check for a pulse for up to 60 seconds before concluding it is absent. Continue CPR and rewarming efforts until emergency services arrive; hypothermic patients have survived prolonged resuscitation because cold temperatures can protect the brain.',
    category: 'medical',
    tags: '["hypothermia","cold exposure","rewarming","cold weather","temperature"]',
    isCritical: true,
    readTime: 4,
  },
  {
    id: 'med-dehydration',
    packId: 'medical',
    title: 'Dehydration Signs and Oral Rehydration',
    content:
      '## Recognizing Dehydration\n\n' +
      'Dehydration occurs when the body loses more fluid than it takes in, commonly from diarrhea, vomiting, excessive sweating, fever, or inadequate water intake. Mild to moderate dehydration presents as thirst, dry mouth and lips, dark yellow urine, decreased urine output, headache, dizziness when standing, and fatigue. Severe dehydration is a medical emergency indicated by very dark or absent urine, rapid heartbeat, rapid breathing, sunken eyes, confusion or irritability, cool and blotchy extremities, and in infants, a sunken soft spot (fontanelle) on the head and no tears when crying.\n\n' +
      '## Oral Rehydration Therapy\n\n' +
      'For mild to moderate dehydration, oral rehydration is the most effective treatment. A proper oral rehydration solution (ORS) contains both salts and sugar, which work together to maximize water absorption in the intestine. If commercial ORS packets are available, mix according to the package instructions using clean water. If commercial ORS is not available, prepare a homemade solution: mix 1 liter of clean water with 6 level teaspoons of sugar and half a level teaspoon of salt. Stir until fully dissolved. This ratio is critical — too much sugar causes diarrhea and too much salt can be dangerous.\n\n' +
      '## How to Administer ORS\n\n' +
      'Give the solution in small, frequent sips rather than large amounts at once, especially if the person is vomiting. For adults, aim for at least 2 to 3 liters in the first 4 hours, then continue as needed. For children, give 50 to 100 milliliters per kilogram of body weight over 4 hours. If vomiting occurs, wait 10 minutes and restart with smaller sips. Gradually increase the amount as tolerated. Continue breastfeeding infants alongside ORS. Resume normal eating as soon as the person can tolerate food — bland foods like rice, bananas, and toast are well tolerated initially.\n\n' +
      '## Prevention and When to Seek Help\n\n' +
      'Prevent dehydration by drinking water regularly, increasing intake in hot weather or during illness, and replacing fluids lost to vomiting or diarrhea promptly. Seek emergency medical care if the person cannot keep fluids down, shows signs of severe dehydration, has bloody diarrhea, has not urinated in 8 or more hours, or is an infant, elderly, or has chronic medical conditions. Severe dehydration requires intravenous fluid replacement and cannot be safely managed with oral rehydration alone.',
    category: 'medical',
    tags: '["dehydration","oral rehydration","ORS","fluid loss","electrolytes"]',
    isCritical: false,
    readTime: 4,
  },
];

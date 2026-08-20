import { RandomEvent, Player } from '../types';
import { CLUBS_2026 } from './database2026';

export const RANDOM_EVENTS: RandomEvent[] = [
  // --- EXISTING BASE EVENTS ---
  {
    id: "breakthrough_season",
    title: "🚀 Breakthrough Season!",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age <= 21 && p.ovr < 80,
    execute: (p: Player) => {
      const bonus = Math.floor(Math.random() * 2) + 2; // +2 or +3 OVR
      p.ovr += bonus;
      return {
        ovrDelta: bonus,
        legacyBonus: 250,
        text: `You experienced a dramatic breakthrough season! Your confidence skyrocketed, granting an extra +${bonus} OVR!`
      };
    }
  },
  {
    id: "late_bloomer_spark",
    title: "✨ Late Bloomer Spark",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 24 && p.age <= 28,
    execute: (p: Player) => {
      p.ovr += 2;
      return {
        ovrDelta: 2,
        legacyBonus: 200,
        text: "Pundits praised your refined tactical maturity this season! You gained +2 OVR unexpectedly."
      };
    }
  },
  {
    id: "veteran_renaissance",
    title: "👑 Veteran Renaissance",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 32,
    execute: (p: Player) => {
      p.ovr += 1;
      return {
        ovrDelta: 1,
        legacyBonus: 300,
        text: "Defying your age, your supreme positioning led to an exceptional campaign! You gained +1 OVR instead of declining."
      };
    }
  },
  {
    id: "motivation_dip",
    title: "📉 Motivation Dip",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.ovr > 75,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return {
        ovrDelta: -1,
        legacyBonus: 0,
        text: "Off-pitch distractions impacted your training focus. You suffered a temporary -1 OVR setback."
      };
    }
  },
  {
    id: "minor_injury_setback",
    title: "🩹 Minor Injury Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return {
        ovrDelta: -1,
        legacyBonus: 0,
        text: "A recurring hamstring niggle disrupted your match rhythm late in the season (-1 OVR)."
      };
    }
  },
  {
    id: "peak_conditioning",
    title: "💪 Peak Physical Conditioning",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return {
        ovrDelta: 1,
        legacyBonus: 100,
        text: "Work with a specialist sports scientist boosted your stamina and agility (+1 OVR)."
      };
    }
  },
  {
    id: "board_takeover",
    title: "💼 Billionaire Board Takeover",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A wealthy consortium completed a takeover of your club! The new chairman approaches you personally with two options:",
    choices: [
      {
        label: "🌟 Accept Super-Star Target Role",
        description: "Embrace the pressure. Target immediate trophies.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return {
            ovrDelta: 2,
            legacyBonus: 500,
            text: "You relished the high-pressure spotlight! The club invested in elite squad players around you (+2 OVR, +500 Legacy Score)."
          };
        }
      },
      {
        label: "🛡️ Request Team-First Balanced Growth",
        description: "Avoid pressure. Focus on squad cohesion.",
        resolve: () => {
          return {
            ovrDelta: 0,
            legacyBonus: 200,
            text: "You kept a cool head. Squad morale remained stable with zero added pressure (+200 Legacy Score)."
          };
        }
      }
    ]
  },
  {
    id: "transfer_ultimatum",
    title: "⚡ Transfer Ultimatum",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.ovr >= 78,
    description: "Your recent performances attracted major European media attention. Your agent suggests pushing for a high-profile move.",
    choices: [
      {
        label: "📝 Request Official Transfer",
        description: "Force a move to a bigger club next season.",
        resolve: () => {
          return {
            ovrDelta: 0,
            legacyBonus: 100,
            text: "Your transfer request was accepted! You will receive higher-tier transfer offers this window.",
            forceHigherOffers: true
          };
        }
      },
      {
        label: "🤝 Declare Loyalty to Current Club",
        description: "Reject transfer rumors and commit your future.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return {
            ovrDelta: 1,
            legacyBonus: 400,
            text: "Fans praised your loyalty! Your standing at the club soared (+1 OVR, +400 Legacy Score)."
          };
        }
      }
    ]
  },
  {
    id: "golden_generation",
    title: "🎓 Youth Academy Golden Generation",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A wave of talented academy youngsters joined the senior squad. The manager asks if you will mentor the new prodigy.",
    choices: [
      {
        label: "👨‍🏫 Mentor the Youth Star",
        description: "Spend extra time coaching the youngster.",
        resolve: () => {
          return {
            ovrDelta: 0,
            legacyBonus: 600,
            text: "Your leadership elevated the entire club's future! You earned massive respect (+600 Legacy Score)."
          };
        }
      },
      {
        label: "🎯 Focus Exclusively on Your Own Game",
        description: "Maintain 100% focus on individual training.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return {
            ovrDelta: 1,
            legacyBonus: 100,
            text: "Your intense personal regime paid off with sharper match stats (+1 OVR)."
          };
        }
      }
    ]
  },

  // ==========================================
  // --- POSITIVE NEW EVENTS (1 TO 50) ---
  // ==========================================
  {
    id: "ev_pos_01_breakthrough_season",
    title: "🚀 Breakthrough Season",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age <= 22,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "You announced yourself to world football with a stellar breakthrough season! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_02_late_bloomer",
    title: "🌟 Late Bloomer",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 24 && p.age <= 28,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 250, text: "Tactical understanding clicked late in your career, unlocking peak performance! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_03_rapid_development",
    title: "⚡ Rapid Development",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age <= 21,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 350, text: "An astonishing physical and technical growth spurt elevated your game to new heights! (+3 OVR)" };
    }
  },
  {
    id: "ev_pos_04_confidence_boost",
    title: "🔥 Confidence Boost",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 150, text: "A series of decisive match-winning moments gave you supreme confidence on the ball! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_05_perfect_preseason",
    title: "⚽ Perfect Pre-Season",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 200, text: " Flawless summer conditioning and friendly goals set you up for a sensational campaign! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_06_fitness_programme",
    title: "🏋️ Elite Fitness Programme",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 150, text: "Tailored sports science regimens enhanced your stamina, speed, and recovery. (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_07_world_class_mentor",
    title: "🧠 World-Class Mentor",
    category: "DEVELOPMENT",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A legendary veteran striker joins your club and offers to take you under his wing after training sessions.",
    choices: [
      {
        label: "📖 Absorb Tactical Wisdom",
        description: "Focus on match reading and off-the-ball positioning.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 500, text: "Your mentor's subtle positional advice transformed your match intelligence! (+2 OVR)" };
        }
      },
      {
        label: "⚡ Focus On Raw Athletic Instincts",
        description: "Rely on natural explosive pace and flair.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 800, text: "You maintained your unique instinctual flair and won over fan hearts nationwide! (+800 Legacy)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_08_new_manager_favourite",
    title: "👔 New Manager's Favourite",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 200, text: "The newly appointed manager built the team's tactics around your key strengths! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_09_tactical_fit",
    title: "🧩 Tactical System Fits Perfectly",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "The club's new formation suits your natural movement like a glove! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_10_becomes_first_choice",
    title: "🥇 Becomes First Choice",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 250, text: "You cemented your position as the undisputed first-name on the team sheet! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_11_club_captain",
    title: "👑 Club Captain",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 23,
    description: "The senior squad voted you as the new team captain! How will you wear the armband?",
    choices: [
      {
        label: "📢 Vocal On-Pitch Leader",
        description: "Demanding excellence from every teammate.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 800, text: "Your commanding presence rallied the squad through tough fixtures! (+1 OVR, +800 Legacy)" };
        }
      },
      {
        label: "🧘 Lead Quietly By Example",
        description: "Focus on personal composure and consistency.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 600, text: "Your ice-cold composure inspired the squad without unnecessary dressing-room drama! (+600 Legacy)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_12_national_team_debut",
    title: "🌐 National Team Debut",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.intCaps >= 1,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 400, text: "Earning your senior international cap brought immense national pride and media praise! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_13_national_team_captain",
    title: "🎖️ National Team Captain",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.intCaps >= 20,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 1000, text: "Leading your nation onto the international stage elevated you into an iconic ambassador! (+1 OVR, +1000 Legacy)" };
    }
  },
  {
    id: "ev_pos_14_dream_transfer",
    title: "✈️ Dream Transfer",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 80,
    description: "A world mega-club submitted a glowing inquiry to sign you as their next flagship star.",
    choices: [
      {
        label: "📝 Push For The Dream Move",
        description: "Guarantee higher-tier transfer offers this window.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 1200, text: "Your agent opened direct talks! Expect marquee European offers this window.", forceHigherOffers: true };
        }
      },
      {
        label: "❤️ Stay Loyal to Current Project",
        description: "Refuse the mega-offer and build your local legacy.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 1500, text: "Your loyalty ignited legendary fan adoration! (+2 OVR, +1500 Legacy)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_15_fans_favourite",
    title: "❤️ Fans' Favourite",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 350, text: "The supporters created a custom chant in your honour, singing your name every matchday! (+350 Legacy)" };
    }
  },
  {
    id: "ev_pos_16_media_darling",
    title: "📰 Media Darling",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 300, text: "Pundits consistently highlighted your highlights on national sports broadcasts! (+300 Legacy)" };
    }
  },
  {
    id: "ev_pos_17_sponsorship_boom",
    title: "💰 Sponsorship Boom",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 450, text: "Major sportswear brands competed to sign you as their global brand ambassador! (+450 Legacy)" };
    }
  },
  {
    id: "ev_pos_18_leadership_growth",
    title: "📢 Leadership Growth",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 200, text: "Your voice in team huddles transformed match momentum during tight finishes! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_19_big_match_specialist",
    title: "🎯 Big Match Specialist",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 400, text: "You scored or created crucial goals in derby matches and cup finals! (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev_pos_20_clinical_finisher",
    title: "⚽ Clinical Finisher",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "Hours of extra shooting drills paid off with lethal xG conversion in front of goal! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_21_creative_genius",
    title: "🎨 Creative Genius",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "Your visionary through-balls continuously unlocked stubborn low-block defenses! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_22_defensive_masterclass",
    title: "🛡️ Defensive Masterclass",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "Imperious tackles and interception instincts made you an unbreachable wall! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_23_playmaker_evolution",
    title: "🎼 Playmaker Evolution",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 350, text: "Dictating the tempo of matches from midfield earned you rave reviews nationwide! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_24_golden_boot_challenge",
    title: "🏆 Golden Boot Challenge",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "You find yourself near the top of the league goalscoring charts approaching the final run-in.",
    choices: [
      {
        label: "🎯 Shoot At Every Opportunity",
        description: "Prioritise individual goals over team passing.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 500, text: "Your relentless goal-scoring streak dazzled fans! (+2 OVR, +500 Legacy)" };
        }
      },
      {
        label: "🤝 Team-First Unselfish Play",
        description: "Pass to better-positioned teammates.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 700, text: "Your selfless play secured vital team victories and earned dressing-room praise! (+700 Legacy)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_25_ucl_hero",
    title: "🇪🇺 Champions League Hero",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 82,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 1200, text: "Unforgettable European night heroics etched your name into Champions League history! (+2 OVR, +1200 Legacy)" };
    }
  },
  {
    id: "ev_pos_26_world_cup_hero",
    title: "🌍 World Cup Hero",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.intCaps >= 5,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 2000, text: "Masterclass performances on the World Cup stage captivated billions of viewers across the planet! (+3 OVR, +2000 Legacy)" };
    }
  },
  {
    id: "ev_pos_27_euro_hero",
    title: "🏆 European Championship Hero",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.intCaps >= 5,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 1500, text: "Sensational knockout tournament goals carried your national side to glory! (+2 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev_pos_28_legendary_partnership",
    title: "🤝 Legendary Partnership",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 400, text: "An telepathic dynamic with your teammate created the most feared tandem in the league! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_29_winning_mentality",
    title: "🏆 Winning Mentality",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 300, text: "Refusing to accept defeat turned multiple losing positions into late victories! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_30_iron_man",
    title: "🛡️ Iron Man (No Injuries)",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 250, text: "You completed 100% of competitive matches without missing a single minute to injury! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_31_veteran_renaissance",
    title: "👑 Veteran Renaissance",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 32,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 600, text: "Pundits were silenced as your veteran intelligence produced a career-best statistical season! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_32_homegrown_hero",
    title: "🏡 Homegrown Hero",
    category: "CLUB",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 500, text: "As a local boy done good, your connection with the matchday faithful is unbreakable! (+500 Legacy)" };
    }
  },
  {
    id: "ev_pos_33_youth_academy_success_story",
    title: "🌱 Youth Academy Success Story",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age <= 20,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "Your meteoric rise from academy prodigy to senior star inspired young kids everywhere! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_34_record_transfer",
    title: "💸 Record Transfer",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 84,
    description: "A world-record breaking transfer fee offer arrives on the club president's desk.",
    choices: [
      {
        label: "💰 Accept Historic Mega-Deal",
        description: "Become the most expensive transfer headline.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 1000, text: "The astronomical transfer fee set breaking news alerts worldwide!", forceHigherOffers: true };
        }
      },
      {
        label: "🛡️ Reject The Money & Stay",
        description: "Prove that loyalty cannot be bought with money.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 1500, text: "Turning down mega-money cemented your immortal status at the club! (+2 OVR, +1500 Legacy)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_35_massive_reputation_boost",
    title: "⭐ Massive Reputation Boost",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 500, text: "Global football magazines featured your portrait on their front covers worldwide! (+500 Legacy)" };
    }
  },
  {
    id: "ev_pos_36_club_legend_status",
    title: "🏛️ Club Legend Status",
    category: "CLUB",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 100,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 1000, text: "A massive stadium banner was unveiled commemorating your legendary club service! (+2 OVR, +1000 Legacy)" };
    }
  },
  {
    id: "ev_pos_37_hall_of_fame_candidate",
    title: "🎖️ Hall of Fame Candidate",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 28,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 1500, text: "Experts officially listed you among the all-time greats destined for the Hall of Fame! (+1500 Legacy)" };
    }
  },
  {
    id: "ev_pos_38_perfect_season",
    title: "✨ Perfect Season",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "legendary",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 2000, text: "Goals, assists, trophies, and flawless ratings... You experienced an immortal campaign! (+3 OVR, +2000 Legacy)" };
    }
  },
  {
    id: "ev_pos_39_unstoppable_form",
    title: "🔥 Unstoppable Form",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 300, text: "Opposition defenders simply could not contain your sharp acceleration and skill! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_40_career_revival",
    title: "🔄 Career Revival",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.ovr < 75,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 500, text: "Reinventing your tactical role sparked a dramatic resurgence in your performance! (+3 OVR)" };
    }
  },
  {
    id: "ev_pos_41_training_obsession",
    title: "🏃 Training Obsession",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 150, text: "First to arrive at training and last to leave—your relentless work ethic delivered gains! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_42_improved_professionalism",
    title: "🧘 Improved Professionalism",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 200, text: "Adopting strict nutrition and sleep analytics maximized your energy levels. (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_43_tactical_intelligence",
    title: "🧠 Tactical Intelligence",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 1;
      return { ovrDelta: 1, legacyBonus: 250, text: "Studying opposition video footage allowed you to read every play seconds in advance! (+1 OVR)" };
    }
  },
  {
    id: "ev_pos_44_position_change_success",
    title: "🔄 Position Change Success",
    category: "DEVELOPMENT",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The coaching staff suggests testing you in a new secondary position to maximize your tactical impact.",
    choices: [
      {
        label: "🔄 Embrace Versatile Tactical Adaptation",
        description: "Learn the new role to help squad flexibility.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 400, text: "Your versatility made you an indispensable tactical asset! (+1 OVR, +400 Legacy)" };
        }
      },
      {
        label: "🎯 Specialize In Core Position",
        description: "Refuse position changes to master your current role.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 100, text: "Refining your primary role paid off with lethal specialized stats! (+2 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_pos_45_goal_scoring_explosion",
    title: "⚽ Goal Scoring Explosion",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 350, text: "A run of consecutive hat-tricks thrilled fans and shattered club goal records! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_46_assist_machine",
    title: "🅰️ Assist Machine",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 350, text: "Precision crosses and key passes saw you lead the league assist leaderboard! (+2 OVR)" };
    }
  },
  {
    id: "ev_pos_47_international_recognition",
    title: "🌐 International Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 350, text: "Respected international coaches singled you out as one of football's premier talents! (+350 Legacy)" };
    }
  },
  {
    id: "ev_pos_48_ballon_dor_momentum",
    title: "🏆 Ballon d'Or Momentum",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 86,
    execute: (p: Player) => {
      p.ovr += 2;
      return { ovrDelta: 2, legacyBonus: 1200, text: "Widespread media campaigns positioned you among the front-runners for the Golden Ball! (+2 OVR, +1200 Legacy)" };
    }
  },
  {
    id: "ev_pos_49_global_superstar",
    title: "🌟 Global Superstar",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 88,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 2500, text: "Your fame transcended sports into pop culture, solidifying you as a household global icon! (+3 OVR, +2500 Legacy)" };
    }
  },
  {
    id: "ev_pos_50_goat_debate",
    title: "🐐 Greatest Of All Time Debate",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 92,
    execute: (p: Player) => {
      p.ovr += 3;
      return { ovrDelta: 3, legacyBonus: 3000, text: "Analysts officially debated whether your prime peak surpassed the historic legends of football history! (+3 OVR, +3000 Legacy)" };
    }
  },

  // ==========================================
  // --- NEGATIVE NEW EVENTS (51 TO 100) ---
  // ==========================================
  {
    id: "ev_neg_51_long_term_injury",
    title: "🚑 Long-Term Injury",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "A severe tendon tear sidelined you for 6 months, hampering your physical sharpness. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_52_acl_injury",
    title: "💔 ACL Injury",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 3);
      return { ovrDelta: -3, legacyBonus: 0, text: "A heartbreaking knee ligament injury required reconstructive surgery and months of grueling rehab. (-3 OVR)" };
    }
  },
  {
    id: "ev_neg_53_broken_leg",
    title: "🦴 Broken Leg",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 3);
      return { ovrDelta: -3, legacyBonus: 0, text: "A heavy late tackle resulted in a fractured tibia, cutting your season short. (-3 OVR)" };
    }
  },
  {
    id: "ev_neg_54_repeated_muscle_injuries",
    title: "🩹 Repeated Muscle Injuries",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Recurring calf tightness repeatedly broke up your match continuity. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_55_injury_prone",
    title: "⚠️ Injury Prone",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Minor niggly injuries prevented you from reaching 100% peak rhythm. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_56_loss_of_confidence",
    title: "📉 Loss Of Confidence",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A few missed chances led to overthinking and hesitation on the pitch. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_57_poor_form",
    title: "🥶 Poor Form",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A cold streak of sub-par match ratings tested your mental resilience. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_58_confidence_crisis",
    title: "🧠 Confidence Crisis",
    category: "DEVELOPMENT",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "Doubt has crept deep into your game following a string of poor team performances.",
    choices: [
      {
        label: "🧠 Hire Elite Mindset Coach",
        description: "Invest personal time in mental conditioning.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 200, text: "Mental coaching restored your belief and sharpened your focus! (+1 OVR)" };
        }
      },
      {
        label: "🏃 Grind Harder In Training",
        description: "Push through the slump without extra support.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, p.ovr - 1);
          return { ovrDelta: -1, legacyBonus: 0, text: "Overtraining led to fatigue and worsened your slump. (-1 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_neg_59_new_manager_distrust",
    title: "👔 New Manager Doesn't Trust You",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "The incoming head coach prefers a different tactical profile for your position. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_60_benched",
    title: "🪑 Benched",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A tactical shift saw you dropped to the substitute bench for key matches. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_61_transfer_listed",
    title: "📋 Transfer Listed",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The club board officially placed you on the transfer list due to squad restructuring.",
    choices: [
      {
        label: "✈️ Demand Immediate Transfer",
        description: "Instruct your representative to secure a new club.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 100, text: "You requested an exit! You will receive new club transfer offers this window.", forceHigherOffers: true };
        }
      },
      {
        label: "⚔️ Fight For Your Spot",
        description: "Refuse to leave and force your way back into the team.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 300, text: "Your fierce determination impressed coaches and earned back your place! (+1 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_neg_62_loan_listed",
    title: "🔄 Loan Listed",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "The manager deemed you in need of temporary loan experience to maintain match fitness. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_63_contract_dispute",
    title: "⚖️ Contract Dispute",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "Contract extension negotiations hit a bitter stalemate between your agent and the executive director.",
    choices: [
      {
        label: "💼 Hold Firm On Wage Demands",
        description: "Refuse lower terms, risking club tension.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, p.ovr - 1);
          return { ovrDelta: -1, legacyBonus: 100, text: "Tension in contract talks distracted your match focus. (-1 OVR)" };
        }
      },
      {
        label: "🤝 Accept Club Compromise",
        description: "Sign the offered deal and restore team harmony.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 200, text: "Signing the extension cleared your head and boosted team focus! (+1 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_neg_64_dressing_room_conflict",
    title: "💥 Dressing Room Conflict",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Squabbles among senior players disrupted squad harmony and chemistry. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_65_media_criticism",
    title: "🗞️ Media Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Harsh tabloid headlines singled out your performance after a derby defeat. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_66_fan_backlash",
    title: "🗣️ Fan Backlash",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Frustrated home fans whistled after a poor collective team outing. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_67_trophy_drought",
    title: "🚫 Trophy Drought",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 0, text: "Another trophyless campaign ended with cup knockout disappointments." };
    }
  },
  {
    id: "ev_neg_68_relegation",
    title: "📉 Relegation",
    category: "CLUB",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A nightmare season concluded with painful relegation heartbreak. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_69_club_financial_crisis",
    title: "💸 Club Financial Crisis",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club hit financial difficulties and asks key players to assist with wage deferrals.",
    choices: [
      {
        label: "🛡️ Agree To Wage Deferral",
        description: "Help save the club's financial stability.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 500, text: "Your selfless sacrifice saved club staff jobs and earned legendary fan respect! (+500 Legacy)" };
        }
      },
      {
        label: "✈️ Demand Immediate Transfer",
        description: "Protect your career and seek a move elsewhere.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 100, text: "Your transfer request was processed immediately due to club money trouble.", forceHigherOffers: true };
        }
      }
    ]
  },
  {
    id: "ev_neg_70_failed_transfer",
    title: "❌ Failed Transfer",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A deadline day move collapsed at the final minute due to paperwork delays. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_71_international_snub",
    title: "🚫 International Snub",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "The national team manager surprisingly excluded you from the upcoming squad call-up. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_72_international_retirement",
    title: "🏳️ International Retirement",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 30,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 300, text: "You officially stepped down from international duty to preserve club longevity! (+300 Legacy)" };
    }
  },
  {
    id: "ev_neg_73_captaincy_removed",
    title: "🚫 Captaincy Removed",
    category: "CLUB",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A tactical reshuffle saw the leadership armband handed to a new signing. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_74_declining_professionalism",
    title: "🍺 Declining Professionalism",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Late nights and poor recovery habits caught up with your fitness metrics. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_75_weight_problems",
    title: "🏋️ Weight Problems",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Returning from summer break overweight delayed your sharp match fitness. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_76_motivation_issues",
    title: "📉 Motivation Issues",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Monotony in daily training drills saw your mental sharpness drop slightly. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_77_homesick",
    title: "✈️ Homesick",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "Living far from family and friends has begun taking a toll on your day-to-day happiness.",
    choices: [
      {
        label: "✈️ Request Transfer Closer To Home",
        description: "Instruct your agent to seek domestic league offers.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 100, text: "Your transfer request was submitted to prioritize your mental wellbeing.", forceHigherOffers: true };
        }
      },
      {
        label: "🧠 Fly Family Out & Adapt",
        description: "Overcome cultural adjustment and stay focused.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 300, text: "Settling into your surroundings restored your passion and form! (+1 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_neg_78_career_plateau",
    title: "⛰️ Career Plateau",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 23,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 0, text: "Your progression stalled into a steady plateau with flat developmental growth." };
    }
  },
  {
    id: "ev_neg_79_rapid_decline",
    title: "📉 Rapid Decline",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 29,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 3);
      return { ovrDelta: -3, legacyBonus: 0, text: "A sharp physical drop-off made it difficult to keep up with intense match speeds. (-3 OVR)" };
    }
  },
  {
    id: "ev_neg_80_pace_loss",
    title: "🐢 Pace Loss",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 28,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "A loss of top-end sprint speed forced you to alter your positional style. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_81_serious_knee_injury",
    title: "🦵 Serious Knee Injury",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "A serious meniscus tear forced a lengthy lay-off in the treatment room. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_82_misses_world_cup",
    title: "💔 Misses World Cup",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.intCaps >= 3,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A cruel late injury ruled you out of the World Cup squad on the eve of the tournament. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_83_misses_euros",
    title: "💔 Misses European Championship",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.intCaps >= 3,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Unexpected illness forced you to withdraw from the European Championship squad. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_84_club_administration",
    title: "📉 Club Administration",
    category: "CLUB",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Points deductions and financial collapse demoralized the entire club structure. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_85_manager_sacked",
    title: "👔 Manager Sacked",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 0, text: "Poor results led to the manager's dismissal, bringing uncertainty to tactics." };
    }
  },
  {
    id: "ev_neg_86_falls_out_with_manager",
    title: "🤬 Falls Out With Manager",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A heated argument in the dugout after being substituted leaked to the sports press.",
    choices: [
      {
        label: "🗣️ Issue Public Apology",
        description: "Swallow your pride and reconcile with the boss.",
        resolve: (p: Player) => {
          p.ovr += 1;
          return { ovrDelta: 1, legacyBonus: 100, text: "Your professional apology defused the tension and restored your starting spot! (+1 OVR)" };
        }
      },
      {
        label: "🥊 Stand Your Ground",
        description: "Refuse to back down and demand a transfer.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, p.ovr - 1);
          return { ovrDelta: -1, legacyBonus: 0, text: "You were banished from first-team training. Offers will be sought.", forceHigherOffers: true };
        }
      }
    ]
  },
  {
    id: "ev_neg_87_loses_starting_position",
    title: "🪑 Loses Starting Position",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Inconsistent match ratings cost you your guaranteed starting position. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_88_goal_drought",
    title: "🧱 Goal Drought",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "A painful 12-match drought tested your patience in front of goal. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_89_transfer_value_falls",
    title: "📉 Transfer Value Falls",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 0, text: "Decreased match sharpness resulted in lower valuation estimates from scouts." };
    }
  },
  {
    id: "ev_neg_90_reputation_damage",
    title: "⚠️ Reputation Damage",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "On-pitch red cards and disciplinary issues damaged your public standing. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_91_wonderkid_failure",
    title: "💔 Wonderkid Failure",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age <= 23 && p.ovr < 75,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "Unrealistic early media hype proved too heavy to bear, stalling your potential. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_92_public_scandal",
    title: "📰 Public Scandal",
    category: "WORLD",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "An off-pitch private controversy made front-page news across national tabloids.",
    choices: [
      {
        label: "💼 Hire PR Crisis Specialist",
        description: "Manage press coverage professionally.",
        resolve: () => {
          return { ovrDelta: 0, legacyBonus: 300, text: "Swift PR action contained the media story and protected your image! (+300 Legacy)" };
        }
      },
      {
        label: "🤐 Keep Silence & Ignore News",
        description: "Refuse media comments and focus on football.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, p.ovr - 1);
          return { ovrDelta: -1, legacyBonus: 0, text: "Media speculation lingered throughout the season, disrupting match focus. (-1 OVR)" };
        }
      }
    ]
  },
  {
    id: "ev_neg_93_career_collapse",
    title: "💥 Career Collapse",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "legendary",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 3);
      return { ovrDelta: -3, legacyBonus: 0, text: "A disastrous combination of injuries, poor form, and tactical misuse derailed your year. (-3 OVR)" };
    }
  },
  {
    id: "ev_neg_94_persistent_injuries",
    title: "🏥 Persistent Injuries",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "Unresolved ankle ligament weakness repeatedly put you back in the medical room. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_95_loss_of_pace",
    title: "🐢 Loss Of Pace",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 27,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Natural loss of sprint acceleration made beating defenders 1v1 harder. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_96_tactical_mismatch",
    title: "❌ Tactical Mismatch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Being asked to play an unnatural defensive role limited your attacking output. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_97_squad_competition",
    title: "⚔️ Squad Competition Increases",
    category: "CLUB",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: () => {
      return { ovrDelta: 0, legacyBonus: 0, text: "The club signed an expensive rival in your position, intensifying team competition." };
    }
  },
  {
    id: "ev_neg_98_confidence_shattered",
    title: "💔 Confidence Shattered",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 2);
      return { ovrDelta: -2, legacyBonus: 0, text: "A high-profile penalty miss in a crucial derby shattered your match confidence. (-2 OVR)" };
    }
  },
  {
    id: "ev_neg_99_forgotten_talent",
    title: "👻 Forgotten Talent",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, p.ovr - 1);
      return { ovrDelta: -1, legacyBonus: 0, text: "Spending long stretches in the reserves caused pundits to question your future. (-1 OVR)" };
    }
  },
  {
    id: "ev_neg_100_early_retirement_threat",
    title: "⚠️ Early Retirement Threat",
    category: "INJURY",
    isInteractive: true,
    rarity: "legendary",
    condition: (p: Player) => p.age >= 26,
    description: "Specialist doctors warned that a chronic joint issue could threaten your long-term career if unaddressed.",
    choices: [
      {
        label: "🏥 Undergo High-Risk Surgery",
        description: "Attempt a full cure to prolong elite career years.",
        resolve: (p: Player) => {
          p.ovr += 2;
          return { ovrDelta: 2, legacyBonus: 1000, text: "Surgery was a complete success! You returned stronger than ever! (+2 OVR, +1000 Legacy)" };
        }
      },
      {
        label: "🛡️ Manage Minutes Conservatively",
        description: "Avoid surgery and play through pain on reduced minutes.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, p.ovr - 2);
          return { ovrDelta: -2, legacyBonus: 0, text: "Managing pain meant reduced training intensity and lower sharpness. (-2 OVR)" };
        }
      }
    ]
  },

  // ==========================================
  // --- EXPANSION PACK: 312 ADDITIONAL EVENTS ---
  // ==========================================
  {
    id: "ev2_inj_1",
    title: "🚑 Hamstring Tear Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a hamstring tear that sidelined you for six weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_2",
    title: "🚑 Groin Strain Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a groin strain that forced a slow, frustrating recovery. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_3",
    title: "🚑 Ankle Ligament Sprain Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — an ankle ligament sprain that kept you out of the starting XI for months. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_4",
    title: "🚑 Stress Fracture In Your Foot Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a stress fracture in your foot that required a scan that ended your rhythm for the season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_5",
    title: "🚑 Shoulder Dislocation Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a shoulder dislocation that happened in a heavy collision with the goalkeeper. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_6",
    title: "🚑 Concussion Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a concussion that kept you sidelined under precautionary protocol for weeks. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_7",
    title: "🚑 Achilles Tendinitis Flare-up Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — an achilles tendinitis flare-up that hit during a heavy fixture run. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_8",
    title: "🚑 Knee Cartilage Wear Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a knee cartilage wear that was picked up on a routine scan. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_9",
    title: "🚑 Back Spasm Issue Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a back spasm issue that disrupted your training load all season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_10",
    title: "🚑 Hip Flexor Strain Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a hip flexor strain that nagged at you through a packed schedule. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_11",
    title: "🚑 Calf Strain Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a calf strain that kept recurring every few weeks. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_12",
    title: "🚑 Wrist Fracture Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a wrist fracture that came from an awkward fall. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_13",
    title: "🚑 Rib Injury Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a rib injury that made every twist and turn painful. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_14",
    title: "🚑 Quad Strain Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a quad strain that pulled up short in a sprint during training. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_15",
    title: "🚑 Facial Fracture Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a facial fracture that needed a protective mask for weeks. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_16",
    title: "🚑 Torn Meniscus Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a torn meniscus that required a minor arthroscopic procedure. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_17",
    title: "🚑 Achilles Rupture Scare Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — an achilles rupture scare that was caught early by the medical staff, but the fright cost you match sharpness. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_18",
    title: "🚑 Run Of Recurring Migraines Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a run of recurring migraines that was eventually traced to a minor head knock. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_19",
    title: "🚑 Illness That Swept The Dressing Room Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — an illness that swept the dressing room that left you drained for weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_20",
    title: "🚑 Overuse Tendon Flare-up Setback",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — an overuse tendon flare-up that was the price of an unforgiving fixture list. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_21",
    title: "🚑 Hamstring Tear Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a hamstring tear that sidelined you for six weeks. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_22",
    title: "🚑 Groin Strain Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a groin strain that forced a slow, frustrating recovery. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_23",
    title: "🚑 Ankle Ligament Sprain Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — an ankle ligament sprain that kept you out of the starting XI for months. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_24",
    title: "🚑 Stress Fracture In Your Foot Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a stress fracture in your foot that required a scan that ended your rhythm for the season. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_25",
    title: "🚑 Shoulder Dislocation Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a shoulder dislocation that happened in a heavy collision with the goalkeeper. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_26",
    title: "🚑 Concussion Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a concussion that kept you sidelined under precautionary protocol for weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_27",
    title: "🚑 Achilles Tendinitis Flare-up Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — an achilles tendinitis flare-up that hit during a heavy fixture run. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_28",
    title: "🚑 Knee Cartilage Wear Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a knee cartilage wear that was picked up on a routine scan. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_29",
    title: "🚑 Back Spasm Issue Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a back spasm issue that disrupted your training load all season. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_30",
    title: "🚑 Hip Flexor Strain Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a hip flexor strain that nagged at you through a packed schedule. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_31",
    title: "🚑 Calf Strain Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a calf strain that kept recurring every few weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_32",
    title: "🚑 Wrist Fracture Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a wrist fracture that came from an awkward fall. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_33",
    title: "🚑 Rib Injury Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a rib injury that made every twist and turn painful. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_34",
    title: "🚑 Quad Strain Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a quad strain that pulled up short in a sprint during training. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_35",
    title: "🚑 Facial Fracture Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a facial fracture that needed a protective mask for weeks. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_36",
    title: "🚑 Torn Meniscus Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a torn meniscus that required a minor arthroscopic procedure. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_37",
    title: "🚑 Achilles Rupture Scare Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — an achilles rupture scare that was caught early by the medical staff, but the fright cost you match sharpness. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_38",
    title: "🚑 Run Of Recurring Migraines Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a run of recurring migraines that was eventually traced to a minor head knock. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_39",
    title: "🚑 Illness That Swept The Dressing Room Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — an illness that swept the dressing room that left you drained for weeks. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_40",
    title: "🚑 Overuse Tendon Flare-up Scare",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — an overuse tendon flare-up that was the price of an unforgiving fixture list. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_41",
    title: "🚑 Hamstring Tear Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a hamstring tear that sidelined you for six weeks. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_42",
    title: "🚑 Groin Strain Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a groin strain that forced a slow, frustrating recovery. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_43",
    title: "🚑 Ankle Ligament Sprain Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — an ankle ligament sprain that kept you out of the starting XI for months. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_44",
    title: "🚑 Stress Fracture In Your Foot Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a stress fracture in your foot that required a scan that ended your rhythm for the season. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_45",
    title: "🚑 Shoulder Dislocation Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a shoulder dislocation that happened in a heavy collision with the goalkeeper. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_46",
    title: "🚑 Concussion Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a concussion that kept you sidelined under precautionary protocol for weeks. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_47",
    title: "🚑 Achilles Tendinitis Flare-up Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — an achilles tendinitis flare-up that hit during a heavy fixture run. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_48",
    title: "🚑 Knee Cartilage Wear Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a knee cartilage wear that was picked up on a routine scan. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_49",
    title: "🚑 Back Spasm Issue Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a back spasm issue that disrupted your training load all season. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_50",
    title: "🚑 Hip Flexor Strain Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a hip flexor strain that nagged at you through a packed schedule. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_51",
    title: "🚑 Calf Strain Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — a calf strain that kept recurring every few weeks. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_52",
    title: "🚑 Wrist Fracture Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a wrist fracture that came from an awkward fall. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_53",
    title: "🚑 Rib Injury Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — a rib injury that made every twist and turn painful. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_54",
    title: "🚑 Quad Strain Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — a quad strain that pulled up short in a sprint during training. (-4 OVR)" };
    }
  },
  {
    id: "ev2_inj_55",
    title: "🚑 Facial Fracture Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a minor issue — a facial fracture that needed a protective mask for weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_56",
    title: "🚑 Torn Meniscus Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "You picked up a nagging issue — a torn meniscus that required a minor arthroscopic procedure. (-1 OVR)" };
    }
  },
  {
    id: "ev2_inj_57",
    title: "🚑 Achilles Rupture Scare Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a significant issue — an achilles rupture scare that was caught early by the medical staff, but the fright cost you match sharpness. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_58",
    title: "🚑 Run Of Recurring Migraines Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "You picked up a concerning issue — a run of recurring migraines that was eventually traced to a minor head knock. (-2 OVR)" };
    }
  },
  {
    id: "ev2_inj_59",
    title: "🚑 Illness That Swept The Dressing Room Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "You picked up a serious issue — an illness that swept the dressing room that left you drained for weeks. (-3 OVR)" };
    }
  },
  {
    id: "ev2_inj_60",
    title: "🚑 Overuse Tendon Flare-up Layoff",
    category: "INJURY",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "You picked up a severe issue — an overuse tendon flare-up that was the price of an unforgiving fixture list. (-4 OVR)" };
    }
  },

  {
    id: "ev2_devpos_61",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A revamped pre-season fitness regime paid off in visible sharpness. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_62",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Extra video-analysis sessions sharpened your decision-making under pressure. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_63",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "A new position tweak from the coaching staff unlocked a level you hadn't shown before. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_64",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "Countless hours on the training ground finally clicked into instinct. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_65",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A mentorship from a senior teammate accelerated your tactical understanding. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_66",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "You found a leaner, more explosive physical peak this season. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_67",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Your set-piece routines became a genuine weapon after months of repetition. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_68",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A summer spent training with the national team's senior stars rubbed off on you. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_69",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "Sports psychology sessions untangled a mental block that had held you back. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_70",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "A change in diet and recovery protocol visibly extended your matchday output. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_71",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "Studying footage of the world's best in your position reshaped your game. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_72",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A breakout run of man-of-the-match displays snowballed your self-belief. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_73",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Your decision-making in the final third matured dramatically this season. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_74",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A new manager's man-management got the very best out of you. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_75",
    title: "📈 Growth Spurt",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "You embraced a leadership role in training that lifted your own standards too. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_76",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "A revamped pre-season fitness regime paid off in visible sharpness. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_77",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "Extra video-analysis sessions sharpened your decision-making under pressure. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_78",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A new position tweak from the coaching staff unlocked a level you hadn't shown before. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_79",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Countless hours on the training ground finally clicked into instinct. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_80",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A mentorship from a senior teammate accelerated your tactical understanding. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_81",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "You found a leaner, more explosive physical peak this season. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_82",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "Your set-piece routines became a genuine weapon after months of repetition. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_83",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A summer spent training with the national team's senior stars rubbed off on you. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_84",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "Sports psychology sessions untangled a mental block that had held you back. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_85",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A change in diet and recovery protocol visibly extended your matchday output. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_86",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Studying footage of the world's best in your position reshaped your game. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_87",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "A breakout run of man-of-the-match displays snowballed your self-belief. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_88",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "Your decision-making in the final third matured dramatically this season. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_89",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A new manager's man-management got the very best out of you. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_90",
    title: "📈 Turning Point",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "You embraced a leadership role in training that lifted your own standards too. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devpos_91",
    title: "📈 Step Forward",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "A revamped pre-season fitness regime paid off in visible sharpness. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_92",
    title: "📈 Step Forward",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 80, text: "Extra video-analysis sessions sharpened your decision-making under pressure. (+1 OVR)" };
    }
  },
  {
    id: "ev2_devpos_93",
    title: "📈 Step Forward",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "A new position tweak from the coaching staff unlocked a level you hadn't shown before. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_94",
    title: "📈 Step Forward",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 160, text: "Countless hours on the training ground finally clicked into instinct. (+2 OVR)" };
    }
  },
  {
    id: "ev2_devpos_95",
    title: "📈 Step Forward",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 240, text: "A mentorship from a senior teammate accelerated your tactical understanding. (+3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_96",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A slump in form crept in and proved hard to shake. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_97",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Off-field distractions chipped away at your focus in training. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_98",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A change in tactical system never quite suited your game. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_99",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Media criticism after a rough patch started to weigh on your confidence. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_100",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A falling-out with a coach over tactics left you second-guessing yourself. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_101",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "Burnout from a punishing fixture schedule dulled your sharpness. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_102",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A public comparison to a rising rival got into your head. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_103",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Personal issues away from the pitch bled into your performances. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_104",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A run of below-par ratings triggered real self-doubt. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_105",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Complacency crept in after early-season success and cost you consistency. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_106",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A dressing-room dispute left you distracted for weeks. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_107",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "Social media scrutiny over a viral mistake rattled your composure. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_108",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Overtraining in an attempt to force improvement backfired badly. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_109",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A loss of trust from the coaching staff limited your role and rhythm. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_110",
    title: "📉 Rough Patch",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Doubt about your long-term role at the club crept into your game. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_111",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A slump in form crept in and proved hard to shake. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_112",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "Off-field distractions chipped away at your focus in training. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_113",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A change in tactical system never quite suited your game. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_114",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Media criticism after a rough patch started to weigh on your confidence. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_115",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A falling-out with a coach over tactics left you second-guessing yourself. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_116",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Burnout from a punishing fixture schedule dulled your sharpness. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_117",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A public comparison to a rising rival got into your head. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_118",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "Personal issues away from the pitch bled into your performances. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_119",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A run of below-par ratings triggered real self-doubt. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_120",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Complacency crept in after early-season success and cost you consistency. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_121",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A dressing-room dispute left you distracted for weeks. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_122",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Social media scrutiny over a viral mistake rattled your composure. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_123",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Overtraining in an attempt to force improvement backfired badly. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_124",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A loss of trust from the coaching staff limited your role and rhythm. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_125",
    title: "📉 Wobble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "Doubt about your long-term role at the club crept into your game. (-3 OVR)" };
    }
  },
  {
    id: "ev2_devneg_126",
    title: "📉 Stumble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "very_common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A slump in form crept in and proved hard to shake. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_127",
    title: "📉 Stumble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Off-field distractions chipped away at your focus in training. (-1 OVR)" };
    }
  },
  {
    id: "ev2_devneg_128",
    title: "📉 Stumble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A change in tactical system never quite suited your game. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_129",
    title: "📉 Stumble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Media criticism after a rough patch started to weigh on your confidence. (-2 OVR)" };
    }
  },
  {
    id: "ev2_devneg_130",
    title: "📉 Stumble",
    category: "DEVELOPMENT",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-3)));
      return { ovrDelta: -3, legacyBonus: 0, text: "A falling-out with a coach over tactics left you second-guessing yourself. (-3 OVR)" };
    }
  },
  {
    id: "ev2_club_131",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_132",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_133",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_134",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_135",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_136",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_137",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_138",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "uncommon",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_139",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_140",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_141",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_142",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_143",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_144",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_145",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_146",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "common",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_147",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_148",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_149",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_150",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_151",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_152",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_153",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_154",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_155",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_156",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_157",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_158",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_159",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_160",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_161",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_162",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_163",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_164",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_165",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_166",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_167",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_168",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_169",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_170",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_171",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_172",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_173",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_174",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_175",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_176",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_177",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_178",
    title: "🏟️ Sponsor Wants You As The Face Of The Club",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A major sponsor has approached the club wanting you to front their new campaign.",
    choices: [
      {
        label: "Embrace The Spotlight",
        description: "Take on the extra media and commercial workload.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 600, text: "Your profile exploded and the exposure boosted your commercial legacy (+600 Legacy)." }
        }
      },
      {
        label: "Politely Decline, Stay Focused",
        description: "Ask the club to find another face for the campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 150, text: "Staying out of the spotlight let you focus purely on football (+1 OVR, +150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_179",
    title: "🏟️ New Manager Arrives",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board sacked your manager and a new head coach has taken charge, with very different ideas about how you fit in.",
    choices: [
      {
        label: "Fight For Your Starting Spot",
        description: "Prove your worth in training every single day.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 300, text: "You won the new manager over with relentless effort and sharp performances (+2 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Request Showcase Minutes Elsewhere",
        description: "Push for a role where you can keep playing regularly.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You secured a smaller but guaranteed role to stay match-fit (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_180",
    title: "🏟️ Captaincy Decision",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The armband is vacant and the manager is weighing up who should wear it next season.",
    choices: [
      {
        label: "Accept The Captaincy",
        description: "Take on the leadership responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 500, text: "Wearing the armband lifted your standing and your own performances (+1 OVR, +500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On Your Game",
        description: "Let a senior player take it instead.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and let your football do the talking (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_181",
    title: "🏟️ Dressing Room Rift",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A rift has opened up in the dressing room between two cliques, and both sides want you on their side.",
    choices: [
      {
        label: "Stay Neutral",
        description: "Refuse to take sides.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 200, text: "Your neutrality earned respect from everyone once the dust settled (+200 Legacy)." }
        }
      },
      {
        label: "Back The Senior Pros",
        description: "Side with the club\'s most established players.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Aligning with the veterans smoothed your path in the squad (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_182",
    title: "🏟️ Board Contract Renewal Push",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The board wants to tie you down to a long-term deal before suitors come calling.",
    choices: [
      {
        label: "Sign The Extension",
        description: "Commit your long-term future to the club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Fans loved the show of commitment and the club backed you further (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Hold Out, Keep Options Open",
        description: "Wait and see what interest develops elsewhere.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 150, text: "You kept your leverage, even if it created some tension (+150 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_183",
    title: "🏟️ New Signing Threatens Your Spot",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "The club has signed a big-money player in your position, and minutes are suddenly not guaranteed.",
    choices: [
      {
        label: "Raise Your Standards",
        description: "Respond by training and playing even harder.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
          return { ovrDelta: 2, legacyBonus: 350, text: "You outperformed the new arrival and cemented your place (+2 OVR, +350 Legacy)." }
        }
      },
      {
        label: "Request Rotation Assurances",
        description: "Ask the manager for a clear plan to keep playing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You secured a fair rotation but lost some rhythm (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_184",
    title: "🏟️ Youth Prospect Emerges",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A teenage academy graduate is being talked up as the future of your position.",
    choices: [
      {
        label: "Mentor The Youngster",
        description: "Take the prospect under your wing.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 400, text: "Your leadership off the pitch was noticed and respected across the club (+1 OVR, +400 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Yourself",
        description: "Keep your head down and worry about your own game.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You quietly kept performing while the noise swirled elsewhere (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_club_185",
    title: "🏟️ Fan Group Demands Answers",
    category: "CLUB",
    isInteractive: true,
    rarity: "rare",
    condition: () => true,
    description: "A section of supporters is unhappy with results and has singled out the squad for criticism.",
    choices: [
      {
        label: "Address The Fans Directly",
        description: "Speak publicly and take responsibility.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Your honesty won the fanbase back over (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Let Performances Do The Talking",
        description: "Stay quiet and focus on the pitch.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "The noise died down once results improved (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_wpos_1001",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "Global pundits singled you out as one of the breakout stars of the season. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1002",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "A viral highlight reel of your season sent your profile soaring worldwide. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1003",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "You were named in a prestigious international team-of-the-season shortlist. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1004",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "Rival fanbases begrudgingly admitted you were the best in your position this year. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1005",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "A documentary crew began following your season, boosting your global profile. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1006",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "Legendary former players publicly praised your development on air. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1007",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "You featured on the cover of a major football magazine's season preview. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1008",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "International broadcasters built entire pre-match segments around your performances. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1009",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "A respected statistics outlet ranked you among the league's most effective players. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1010",
    title: "🌍 Global Recognition",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "Your national federation held you up as proof of a golden generation coming through. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1011",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "Global pundits singled you out as one of the breakout stars of the season. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1012",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "A viral highlight reel of your season sent your profile soaring worldwide. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1013",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "You were named in a prestigious international team-of-the-season shortlist. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1014",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "Rival fanbases begrudgingly admitted you were the best in your position this year. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1015",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "A documentary crew began following your season, boosting your global profile. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1016",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "Legendary former players publicly praised your development on air. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1017",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "You featured on the cover of a major football magazine's season preview. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1018",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "International broadcasters built entire pre-match segments around your performances. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1019",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "A respected statistics outlet ranked you among the league's most effective players. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1020",
    title: "🌍 Media Spotlight",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "Your national federation held you up as proof of a golden generation coming through. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1021",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "Global pundits singled you out as one of the breakout stars of the season. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1022",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "A viral highlight reel of your season sent your profile soaring worldwide. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1023",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "You were named in a prestigious international team-of-the-season shortlist. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1024",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "Rival fanbases begrudgingly admitted you were the best in your position this year. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1025",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 200, text: "A documentary crew began following your season, boosting your global profile. (+1 OVR, +200 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1026",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 400, text: "Legendary former players publicly praised your development on air. (+2 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1027",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.ovr >= 76,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 800, text: "You featured on the cover of a major football magazine's season preview. (+2 OVR, +800 Legacy)" };
    }
  },
  {
    id: "ev2_wpos_1028",
    title: "🌍 International Praise",
    category: "WORLD",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.ovr >= 84,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (3)));
      return { ovrDelta: 3, legacyBonus: 1500, text: "International broadcasters built entire pre-match segments around your performances. (+3 OVR, +1500 Legacy)" };
    }
  },
  {
    id: "ev2_wneg_1029",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A brutal statistical breakdown from a rival pundit picked apart your season. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1030",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Comparisons to a rival in your position turned unfavourable in the press. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1031",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A poor showing on the biggest stage overshadowed a solid domestic season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1032",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Old critics resurfaced questioning whether you'd ever fulfil your early promise. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1033",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A leaked scouting report described your ceiling as lower than once believed. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1034",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Fans on social media piled on after a high-profile mistake went viral. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1035",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A former teammate's frank interview cast doubt on your mentality under pressure. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1036",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "International media speculated openly about a stalled career trajectory. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1037",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A rival nation's press mocked a costly error in a high-stakes fixture. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1038",
    title: "📰 Media Scrutiny",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Your reputation took a hit after being left out of a major award shortlist entirely. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1039",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A brutal statistical breakdown from a rival pundit picked apart your season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1040",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Comparisons to a rival in your position turned unfavourable in the press. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1041",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A poor showing on the biggest stage overshadowed a solid domestic season. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1042",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Old critics resurfaced questioning whether you'd ever fulfil your early promise. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1043",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A leaked scouting report described your ceiling as lower than once believed. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1044",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Fans on social media piled on after a high-profile mistake went viral. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1045",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A former teammate's frank interview cast doubt on your mentality under pressure. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1046",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "International media speculated openly about a stalled career trajectory. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1047",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A rival nation's press mocked a costly error in a high-stakes fixture. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1048",
    title: "📰 Public Criticism",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Your reputation took a hit after being left out of a major award shortlist entirely. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1049",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A brutal statistical breakdown from a rival pundit picked apart your season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1050",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Comparisons to a rival in your position turned unfavourable in the press. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1051",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A poor showing on the biggest stage overshadowed a solid domestic season. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1052",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Old critics resurfaced questioning whether you'd ever fulfil your early promise. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1053",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "common",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A leaked scouting report described your ceiling as lower than once believed. (-1 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1054",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "uncommon",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Fans on social media piled on after a high-profile mistake went viral. (-2 OVR)" };
    }
  },
  {
    id: "ev2_wneg_1055",
    title: "📰 Reputation Dent",
    category: "WORLD",
    isInteractive: false,
    rarity: "rare",
    condition: () => true,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A former teammate's frank interview cast doubt on your mentality under pressure. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carint_1056",
    title: "📋 Agent Pushes For A Pay Rise",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "Your agent believes you\'re underpaid relative to your performances and wants to open talks.",
    choices: [
      {
        label: "Push Hard For More Money",
        description: "Let your agent negotiate aggressively.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "You secured a bumper new deal, though it created some friction with the board (+300 Legacy)." }
        }
      },
      {
        label: "Prioritise Playing Time Over Money",
        description: "Focus on your role, not your wage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 200, text: "Staying focused on football paid off with a stronger season (+1 OVR, +200 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1057",
    title: "📋 Rival Club Makes A Public Approach",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "A rival club\'s manager has publicly praised you in a way that reads like a tapping-up approach.",
    choices: [
      {
        label: "Fuel The Transfer Speculation",
        description: "Let the rumours build your leverage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 250, text: "The speculation boosted your profile even though nothing came of it (+250 Legacy)." }
        }
      },
      {
        label: "Shut Down The Rumours Immediately",
        description: "Publicly commit to your current club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Fans and teammates respected the show of loyalty (+1 OVR, +300 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1058",
    title: "📋 Testimonial Match Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "The club has offered you a testimonial match to honour your years of service.",
    choices: [
      {
        label: "Accept, Celebrate The Milestone",
        description: "Embrace the occasion and the club\'s gratitude.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 500, text: "A wonderful night reminded everyone of your legacy at the club (+500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On The Season",
        description: "Keep all focus on the current campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You kept your head down and let form do the talking instead (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1059",
    title: "📋 Offered A Coaching Badge Course",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "The club\'s academy has invited you to start your coaching badges during the off-season.",
    choices: [
      {
        label: "Take The Course",
        description: "Invest in your post-playing future.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "The tactical education subtly sharpened your own in-game understanding (+300 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Playing",
        description: "Put all your energy into this season.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Staying singularly focused kept you sharp on the pitch (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1060",
    title: "📋 Book Deal Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "A publisher has approached you about a memoir covering your career so far.",
    choices: [
      {
        label: "Sign The Deal",
        description: "Tell your story to the world.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 700, text: "The book became a bestseller and cemented your off-field legacy (+700 Legacy)." }
        }
      },
      {
        label: "Wait Until Retirement",
        description: "Keep the story for later in your career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and stayed out of the media glare (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1061",
    title: "📋 National Team Retirement Question",
    category: "CAREER",
    isInteractive: true,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 22,
    description: "Journalists are asking whether it\'s time to step back from international duty to protect your club form.",
    choices: [
      {
        label: "Keep Playing For Your Country",
        description: "Continue answering the national call.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "You balanced both commitments and thrived under the extra exposure (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Step Back From International Duty",
        description: "Prioritise your club career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "The lighter schedule visibly refreshed your club performances (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1062",
    title: "📋 Agent Pushes For A Pay Rise",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "Your agent believes you\'re underpaid relative to your performances and wants to open talks.",
    choices: [
      {
        label: "Push Hard For More Money",
        description: "Let your agent negotiate aggressively.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "You secured a bumper new deal, though it created some friction with the board (+300 Legacy)." }
        }
      },
      {
        label: "Prioritise Playing Time Over Money",
        description: "Focus on your role, not your wage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 200, text: "Staying focused on football paid off with a stronger season (+1 OVR, +200 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1063",
    title: "📋 Rival Club Makes A Public Approach",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "A rival club\'s manager has publicly praised you in a way that reads like a tapping-up approach.",
    choices: [
      {
        label: "Fuel The Transfer Speculation",
        description: "Let the rumours build your leverage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 250, text: "The speculation boosted your profile even though nothing came of it (+250 Legacy)." }
        }
      },
      {
        label: "Shut Down The Rumours Immediately",
        description: "Publicly commit to your current club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Fans and teammates respected the show of loyalty (+1 OVR, +300 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1064",
    title: "📋 Testimonial Match Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "The club has offered you a testimonial match to honour your years of service.",
    choices: [
      {
        label: "Accept, Celebrate The Milestone",
        description: "Embrace the occasion and the club\'s gratitude.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 500, text: "A wonderful night reminded everyone of your legacy at the club (+500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On The Season",
        description: "Keep all focus on the current campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You kept your head down and let form do the talking instead (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1065",
    title: "📋 Offered A Coaching Badge Course",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "The club\'s academy has invited you to start your coaching badges during the off-season.",
    choices: [
      {
        label: "Take The Course",
        description: "Invest in your post-playing future.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "The tactical education subtly sharpened your own in-game understanding (+300 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Playing",
        description: "Put all your energy into this season.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Staying singularly focused kept you sharp on the pitch (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1066",
    title: "📋 Book Deal Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "A publisher has approached you about a memoir covering your career so far.",
    choices: [
      {
        label: "Sign The Deal",
        description: "Tell your story to the world.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 700, text: "The book became a bestseller and cemented your off-field legacy (+700 Legacy)." }
        }
      },
      {
        label: "Wait Until Retirement",
        description: "Keep the story for later in your career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and stayed out of the media glare (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1067",
    title: "📋 National Team Retirement Question",
    category: "CAREER",
    isInteractive: true,
    rarity: "rare",
    condition: (p: Player) => p.age >= 22,
    description: "Journalists are asking whether it\'s time to step back from international duty to protect your club form.",
    choices: [
      {
        label: "Keep Playing For Your Country",
        description: "Continue answering the national call.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "You balanced both commitments and thrived under the extra exposure (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Step Back From International Duty",
        description: "Prioritise your club career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "The lighter schedule visibly refreshed your club performances (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1068",
    title: "📋 Agent Pushes For A Pay Rise",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "Your agent believes you\'re underpaid relative to your performances and wants to open talks.",
    choices: [
      {
        label: "Push Hard For More Money",
        description: "Let your agent negotiate aggressively.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "You secured a bumper new deal, though it created some friction with the board (+300 Legacy)." }
        }
      },
      {
        label: "Prioritise Playing Time Over Money",
        description: "Focus on your role, not your wage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 200, text: "Staying focused on football paid off with a stronger season (+1 OVR, +200 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1069",
    title: "📋 Rival Club Makes A Public Approach",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "A rival club\'s manager has publicly praised you in a way that reads like a tapping-up approach.",
    choices: [
      {
        label: "Fuel The Transfer Speculation",
        description: "Let the rumours build your leverage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 250, text: "The speculation boosted your profile even though nothing came of it (+250 Legacy)." }
        }
      },
      {
        label: "Shut Down The Rumours Immediately",
        description: "Publicly commit to your current club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Fans and teammates respected the show of loyalty (+1 OVR, +300 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1070",
    title: "📋 Testimonial Match Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "The club has offered you a testimonial match to honour your years of service.",
    choices: [
      {
        label: "Accept, Celebrate The Milestone",
        description: "Embrace the occasion and the club\'s gratitude.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 500, text: "A wonderful night reminded everyone of your legacy at the club (+500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On The Season",
        description: "Keep all focus on the current campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You kept your head down and let form do the talking instead (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1071",
    title: "📋 Offered A Coaching Badge Course",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "The club\'s academy has invited you to start your coaching badges during the off-season.",
    choices: [
      {
        label: "Take The Course",
        description: "Invest in your post-playing future.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "The tactical education subtly sharpened your own in-game understanding (+300 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Playing",
        description: "Put all your energy into this season.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Staying singularly focused kept you sharp on the pitch (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1072",
    title: "📋 Book Deal Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "A publisher has approached you about a memoir covering your career so far.",
    choices: [
      {
        label: "Sign The Deal",
        description: "Tell your story to the world.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 700, text: "The book became a bestseller and cemented your off-field legacy (+700 Legacy)." }
        }
      },
      {
        label: "Wait Until Retirement",
        description: "Keep the story for later in your career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and stayed out of the media glare (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1073",
    title: "📋 National Team Retirement Question",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "Journalists are asking whether it\'s time to step back from international duty to protect your club form.",
    choices: [
      {
        label: "Keep Playing For Your Country",
        description: "Continue answering the national call.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "You balanced both commitments and thrived under the extra exposure (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Step Back From International Duty",
        description: "Prioritise your club career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "The lighter schedule visibly refreshed your club performances (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1074",
    title: "📋 Agent Pushes For A Pay Rise",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "Your agent believes you\'re underpaid relative to your performances and wants to open talks.",
    choices: [
      {
        label: "Push Hard For More Money",
        description: "Let your agent negotiate aggressively.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "You secured a bumper new deal, though it created some friction with the board (+300 Legacy)." }
        }
      },
      {
        label: "Prioritise Playing Time Over Money",
        description: "Focus on your role, not your wage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 200, text: "Staying focused on football paid off with a stronger season (+1 OVR, +200 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1075",
    title: "📋 Rival Club Makes A Public Approach",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "A rival club\'s manager has publicly praised you in a way that reads like a tapping-up approach.",
    choices: [
      {
        label: "Fuel The Transfer Speculation",
        description: "Let the rumours build your leverage.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 250, text: "The speculation boosted your profile even though nothing came of it (+250 Legacy)." }
        }
      },
      {
        label: "Shut Down The Rumours Immediately",
        description: "Publicly commit to your current club.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "Fans and teammates respected the show of loyalty (+1 OVR, +300 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1076",
    title: "📋 Testimonial Match Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "The club has offered you a testimonial match to honour your years of service.",
    choices: [
      {
        label: "Accept, Celebrate The Milestone",
        description: "Embrace the occasion and the club\'s gratitude.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 500, text: "A wonderful night reminded everyone of your legacy at the club (+500 Legacy)." }
        }
      },
      {
        label: "Decline, Stay Focused On The Season",
        description: "Keep all focus on the current campaign.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "You kept your head down and let form do the talking instead (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1077",
    title: "📋 Offered A Coaching Badge Course",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "The club\'s academy has invited you to start your coaching badges during the off-season.",
    choices: [
      {
        label: "Take The Course",
        description: "Invest in your post-playing future.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 300, text: "The tactical education subtly sharpened your own in-game understanding (+300 Legacy)." }
        }
      },
      {
        label: "Focus Purely On Playing",
        description: "Put all your energy into this season.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "Staying singularly focused kept you sharp on the pitch (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1078",
    title: "📋 Book Deal Offer",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "A publisher has approached you about a memoir covering your career so far.",
    choices: [
      {
        label: "Sign The Deal",
        description: "Tell your story to the world.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 700, text: "The book became a bestseller and cemented your off-field legacy (+700 Legacy)." }
        }
      },
      {
        label: "Wait Until Retirement",
        description: "Keep the story for later in your career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (0)));
          return { ovrDelta: 0, legacyBonus: 100, text: "You kept things simple and stayed out of the media glare (+100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carint_1079",
    title: "📋 National Team Retirement Question",
    category: "CAREER",
    isInteractive: true,
    rarity: "common",
    condition: (p: Player) => p.age >= 22,
    description: "Journalists are asking whether it\'s time to step back from international duty to protect your club form.",
    choices: [
      {
        label: "Keep Playing For Your Country",
        description: "Continue answering the national call.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 300, text: "You balanced both commitments and thrived under the extra exposure (+1 OVR, +300 Legacy)." }
        }
      },
      {
        label: "Step Back From International Duty",
        description: "Prioritise your club career.",
        resolve: (p: Player) => {
          p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
          return { ovrDelta: 1, legacyBonus: 100, text: "The lighter schedule visibly refreshed your club performances (+1 OVR, +100 Legacy)." }
        }
      }
    ]
  },
  {
    id: "ev2_carpos_1080",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "A milestone appearance for the club was marked with a guard of honour. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1081",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "You were officially inducted into the club's hall of fame conversation. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1082",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "Reaching a major personal statistical milestone earned wide praise. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1083",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "A testimonial tribute video celebrating your career went viral among fans. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1084",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "Your consistency over the years was formally recognised by the league itself. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1085",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "A veteran leadership role suited you perfectly this season. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1086",
    title: "🏅 Career Milestone",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "You quietly became a dressing-room institution, respected by every new arrival. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1087",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "A milestone appearance for the club was marked with a guard of honour. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1088",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "You were officially inducted into the club's hall of fame conversation. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1089",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "Reaching a major personal statistical milestone earned wide praise. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1090",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "A testimonial tribute video celebrating your career went viral among fans. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1091",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "Your consistency over the years was formally recognised by the league itself. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1092",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "A veteran leadership role suited you perfectly this season. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1093",
    title: "🏅 Legacy Moment",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "You quietly became a dressing-room institution, respected by every new arrival. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1094",
    title: "🏅 Club Institution",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "A milestone appearance for the club was marked with a guard of honour. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1095",
    title: "🏅 Club Institution",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 250, text: "You were officially inducted into the club's hall of fame conversation. (+1 OVR, +250 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1096",
    title: "🏅 Club Institution",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (1)));
      return { ovrDelta: 1, legacyBonus: 400, text: "Reaching a major personal statistical milestone earned wide praise. (+1 OVR, +400 Legacy)" };
    }
  },
  {
    id: "ev2_carpos_1097",
    title: "🏅 Club Institution",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.totalApps >= 60,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (2)));
      return { ovrDelta: 2, legacyBonus: 700, text: "A testimonial tribute video celebrating your career went viral among fans. (+2 OVR, +700 Legacy)" };
    }
  },
  {
    id: "ev2_carneg_1098",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Contract stand-off tension with the board bled into your performances. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1099",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Whispers about your long-term future at the club created real distraction. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1100",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A messy exit from a boyhood club left a mark on your mentality. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1101",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "An agent dispute over image rights dragged on and wore you down. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1102",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Uncertainty over your role next season crept into your head mid-campaign. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1103",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A public transfer saga you never wanted dragged your focus away from football. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1104",
    title: "⚖️ Contract Turmoil",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Rumours of a training-ground fallout with the manager refused to go away. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1105",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Contract stand-off tension with the board bled into your performances. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1106",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Whispers about your long-term future at the club created real distraction. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1107",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "A messy exit from a boyhood club left a mark on your mentality. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1108",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "An agent dispute over image rights dragged on and wore you down. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1109",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Uncertainty over your role next season crept into your head mid-campaign. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1110",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A public transfer saga you never wanted dragged your focus away from football. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1111",
    title: "⚖️ Off-Field Distraction",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Rumours of a training-ground fallout with the manager refused to go away. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1112",
    title: "⚖️ Uncertain Future",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "Contract stand-off tension with the board bled into your performances. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1113",
    title: "⚖️ Uncertain Future",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "Whispers about your long-term future at the club created real distraction. (-2 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1114",
    title: "⚖️ Uncertain Future",
    category: "CAREER",
    isInteractive: false,
    rarity: "common",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-1)));
      return { ovrDelta: -1, legacyBonus: 0, text: "A messy exit from a boyhood club left a mark on your mentality. (-1 OVR)" };
    }
  },
  {
    id: "ev2_carneg_1115",
    title: "⚖️ Uncertain Future",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 20,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-2)));
      return { ovrDelta: -2, legacyBonus: 0, text: "An agent dispute over image rights dragged on and wore you down. (-2 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2001",
    title: "💥 Career-Threatening Injury",
    category: "CAREER",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-6)));
      return { ovrDelta: -6, legacyBonus: 0, text: "A catastrophic injury required multiple surgeries and an agonizing year-plus recovery. Doctors were candid that you might never fully get back to where you were. (-6 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2002",
    title: "💥 Public Scandal Exposed",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-5)));
      return { ovrDelta: -5, legacyBonus: 0, text: "A damaging story broke in the press, and the fallout — internal disciplinary action, sponsor withdrawals, dressing-room fallout — hit your standing hard. (-5 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2003",
    title: "💥 Lost The Dressing Room",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "Teammates stopped backing you publicly after a bitter internal dispute, and performances suffered as the isolation dragged on. (-4 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2004",
    title: "💥 Exposed By The Data",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "A widely-shared advanced-metrics breakdown argued your underlying numbers had quietly collapsed, and clubs across Europe took notice. (-4 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2005",
    title: "💥 Confidence Never Recovered",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-5)));
      return { ovrDelta: -5, legacyBonus: 0, text: "A single high-profile failure spiralled into something you couldn't shake — every mistake afterward felt like it confirmed the doubters were right. (-5 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2006",
    title: "💥 Burnout Diagnosis",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-5)));
      return { ovrDelta: -5, legacyBonus: 0, text: "Years of relentless expectation finally caught up with you. A formal burnout diagnosis forced time away from the game at the worst possible moment. (-5 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2007",
    title: "💥 Family Crisis Derails Focus",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "A serious situation at home pulled your focus completely away from football for months, and your form never fully recovered that season. (-4 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2008",
    title: "💥 Manager Publicly Loses Faith",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-5)));
      return { ovrDelta: -5, legacyBonus: 0, text: "Your head coach criticised you openly in a press conference, and the very public loss of faith visibly rattled your performances for weeks. (-5 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2009",
    title: "💥 Chronic Injury Diagnosis",
    category: "CAREER",
    isInteractive: false,
    rarity: "legendary",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-6)));
      return { ovrDelta: -6, legacyBonus: 0, text: "What looked like a routine knock turned out to be a degenerative condition. Managing it, rather than fixing it, became the new reality of your career. (-6 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2010",
    title: "💥 Replaced As The Untouchable One",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "A younger, hungrier talent took your spot and never gave it back, and the psychological blow of no longer being first-choice hit harder than expected. (-4 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2011",
    title: "💥 Betting Scandal Investigation",
    category: "CAREER",
    isInteractive: false,
    rarity: "rare",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-5)));
      return { ovrDelta: -5, legacyBonus: 0, text: "An investigation into irregular betting patterns around matches you played in put you under a cloud that took months to clear, even once cleared of wrongdoing. (-5 OVR)" };
    }
  },
  {
    id: "ev2_collapse_2012",
    title: "💥 The Wonderkid Label Became A Weight",
    category: "CAREER",
    isInteractive: false,
    rarity: "uncommon",
    condition: (p: Player) => p.age >= 21 && p.ovr >= 72,
    execute: (p: Player) => {
      p.ovr = Math.max(48, Math.min(99, p.ovr + (-4)));
      return { ovrDelta: -4, legacyBonus: 0, text: "Years of being called 'the next great one' finally became a burden rather than a compliment, and the pressure of never quite arriving took a visible toll. (-4 OVR)" };
    }
  }
];

const RARITY_WEIGHTS: Record<string, number> = {
  very_common: 50,
  common: 30,
  uncommon: 15,
  rare: 4,
  legendary: 1
};

export function triggerRandomEvent(player: Player): RandomEvent | null {
  const validEvents = RANDOM_EVENTS.filter(e => e.condition(player));
  if (validEvents.length === 0) return null;

  // 35% chance for interactive choice event, 65% for auto-applied
  const isInteractiveRoll = Math.random() < 0.35;
  let pool = validEvents.filter(e => isInteractiveRoll ? e.isInteractive : !e.isInteractive);
  if (pool.length === 0) pool = validEvents;

  // Weighted random selection based on rarity
  const totalWeight = pool.reduce((acc, ev) => acc + (RARITY_WEIGHTS[ev.rarity] || 10), 0);
  let randomRoll = Math.random() * totalWeight;

  for (const event of pool) {
    const weight = RARITY_WEIGHTS[event.rarity] || 10;
    if (randomRoll < weight) {
      return event;
    }
    randomRoll -= weight;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * The "next Giggs" crossroads: a young player who signed for a huge club,
 * hasn't been able to force his way into the side for years, and now has
 * to make a defining decision. Checked with priority ahead of the normal
 * weighted event pool (see the callers in App.tsx / quickfireEngine.ts)
 * so it reliably fires exactly once at the right moment, rather than
 * competing against a hundred other events on rarity odds. Both choices
 * genuinely gamble with the rest of the career — this isn't a flavor
 * event, it changes what club the player is at.
 */
export function checkWonderkidCrossroads(player: Player, clubRating: number): RandomEvent | null {
  if (player.crossroadsResolved) return null;
  if (player.age < 21 || player.age > 23) return null;
  if (player.totalApps >= 45) return null; // already genuinely broke through
  if (clubRating - player.ovr < 12) return null; // not actually a big-club reach

  const stuckClub = player.club;
  const stuckOvr = player.ovr;
  const stuckApps = player.totalApps;

  return {
    id: "crossroads_wonderkid",
    title: "🔀 Crossroads",
    category: "CAREER",
    isInteractive: true,
    rarity: "legendary",
    condition: () => true,
    description: `Years at ${stuckClub} and the first team still feels a long way off — just ${stuckApps} senior appearances to show for it. You're ${player.age}, rated ${stuckOvr}, and everyone still talks about your potential. But potential doesn't play matches. It's time to decide what happens next.`,
    choices: [
      {
        label: "⚔️ Fight For Your Place",
        description: "Stay and force your way into the side, whatever it takes.",
        resolve: (p: Player) => {
          p.crossroadsResolved = true;
          const roll = Math.random();
          if (roll < 0.22) {
            const bonus = 8 + Math.floor(Math.random() * 5); // +8 to +12
            return { ovrDelta: bonus, legacyBonus: 3000, text: `Everything clicked. An injury crisis up front opened the door and you never looked back — you're finally, undeniably, a first-team player at ${stuckClub}. (+${bonus} OVR, +3000 Legacy)` };
          } else if (roll < 0.65) {
            const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
            return { ovrDelta: delta, legacyBonus: 200, text: `You stayed and kept fighting for your chance. Still no real breakthrough at ${stuckClub}, but you're still there, still believing. (+200 Legacy)` };
          } else {
            const fallback = CLUBS_2026
              .filter(c => c.rating <= stuckOvr - 5 && c.name !== stuckClub)
              .sort((a, b) => Math.abs(a.rating - (stuckOvr - 10)) - Math.abs(b.rating - (stuckOvr - 10)))[0]
              || CLUBS_2026[CLUBS_2026.length - 1];
            p.club = fallback.name;
            p.clubColor = fallback.color;
            p.clubSecondaryColor = fallback.secondaryColor || '#1E1E1E';
            p.currentClubTenure = 0;
            p.unsettledSeasonsRemaining = 2;
            const delta = -(2 + Math.floor(Math.random() * 3)); // -2 to -4
            return { ovrDelta: delta, legacyBonus: 0, text: `The club finally moved on without you. Released and dropped down to ${fallback.name} — a hard landing after years of being told you were the future. (${delta} OVR)` };
          }
        }
      },
      {
        label: "🚪 Leave For Regular Football",
        description: "Walk away and find a club that will actually play you.",
        resolve: (p: Player) => {
          p.crossroadsResolved = true;
          const fallback = CLUBS_2026
            .filter(c => Math.abs(c.rating - stuckOvr) <= 6 && c.name !== stuckClub)
            .sort((a, b) => Math.abs(a.rating - stuckOvr) - Math.abs(b.rating - stuckOvr))[0]
            || CLUBS_2026[0];
          p.club = fallback.name;
          p.clubColor = fallback.color;
          p.clubSecondaryColor = fallback.secondaryColor || '#1E1E1E';
          p.currentClubTenure = 0;
          return { ovrDelta: 0, legacyBonus: 500, text: `You walked away from the dream move and signed for ${fallback.name}, trading prestige for actual first-team football. Not the career you pictured at eighteen, but a real one. (+500 Legacy)` };
        }
      }
    ]
  };
}

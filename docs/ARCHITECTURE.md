# Football Legacy — Database Architecture

Reference doc for `src/data/`. If you're adding a database, a DLC, or touching
club/league logic, start here.

## Folder Structure

```
src/data/
  types/database.ts          Normalized authoring types (Country, LeagueRecord,
                              ClubRecord, OwnerEntity, Competition, FootballDatabase)
  utilities/rating.ts         computeClubOverall() — the ONLY place overall is calculated
  validation/validateDatabase.ts   Referential-integrity + data-quality checks
  databases/
    registry.ts                THE single file to edit to add/remove an installed database
    2026_27/                   Current season database
      manifest.ts               id, displayName, version, includedRegions
      countries/index.ts
      leagues/index.ts
      clubs/<country>.ts        One file per country (england.ts, spain.ts, ...)
      clubs/index.ts            Combines all country files into CLUBS_2026_27
      ownership/index.ts        Individual owners + multi-club groups
      competitions/index.ts     Domestic leagues (derived) + cups + UEFA comps
      rules/index.ts            Promotion/relegation helper functions
      index.ts                  Assembles the above into one FootballDatabase
    historical/roadmap.ts       Planned historical DLC (metadata only, not loadable yet)
  databaseLoader.ts             Single entry point: loadDatabase(id) -> LoadedDatabase
  database2026.ts               Compatibility shim — same API the engine/UI has always used
```

## The Two Type Layers, and Why

**Authoring layer** (`src/data/types/database.ts`): normalized, ID-referencing,
used only when defining a database. A club here has `leagueId`, `ownerEntityId`,
`attributes` — never a name-duplicated owner object, never a stored overall.

**Runtime layer** (`src/types.ts`): flat, denormalized, what the engine and every
component actually consumes. A `Club` here has a resolved `owner` object, a
plain numeric `rating`, etc. — exactly the shape the game has always used.

`databaseLoader.ts` is the only code that converts one into the other
(`materializeClub`, `materializeLeague`). **The engine never sees the
authoring layer.** This is what makes swapping databases (a new season, a
historical DLC) an engine-free change.

## ID Rules

IDs are permanent once assigned — never reused, never repurposed.

- Countries: 3-letter, e.g. `ENG`, `ESP`, `TUR`
- Leagues: `<COUNTRY>_<TIER>`, e.g. `ENG_PREM`, `ENG_CHAMP`, `GER_BL1`
- Clubs: short unique codes, e.g. `MUN`, `MCI`, `RMA` — **must be globally
  unique across every country**, not just within one league. (This bit us
  once already: `STP` collided between FC St. Pauli and St Patrick's
  Athletic. Check `docs/` or run the validator before assuming a new code
  is free.)
- Owner entities: `own_<clubcode>` for individuals, `mcg_<name>` for
  multi-club groups
- Competitions: `comp_<leagueid>` for league competitions, `cup_<country>_<name>`
  for domestic cups

## Dynamic Ratings — Never Store Overall

A club's overall is `computeClubOverall(attributes)`, calculated from six
weighted attributes (`src/data/utilities/rating.ts`):

| Attribute | Weight |
|---|---|
| Reputation | 0.35 |
| Finances | 0.20 |
| Youth | 0.15 |
| Facilities | 0.10 |
| Fanbase | 0.10 |
| Stadium Rating | 0.10 |

This formula runs once when a database loads, producing each club's
**starting** rating for a new save. After that, gameplay (`evolveWorldClubsAndOwners`
in `database2026.ts`) evolves the runtime `rating` number every season based
on ownership, finances, and momentum — that evolution is a gameplay system,
not a database-authoring concern, and is unchanged from before this
architecture existed. If you're tuning how ratings *change over a career*,
that function is what you want, not the weights table above.

## Owner Groups

Every club references ownership via `ownerEntityId` (an individual/consortium)
and/or `groupId` (a multi-club network like City Football Group) — never
duplicates owner data inline. Both point into the same `OwnerEntity[]` array;
a club can have neither, either, or both (e.g. Manchester City has an
individual owner AND belongs to City Football Group — two separate facts).

Three reusable generic entities exist for clubs without a specific known
owner: `Private Ownership`, `Supporter Ownership`, `State Ownership`. Prefer
these over inventing a fictional named owner for a real club.

## Competitions

Competitions never hard-code participants. A `DOMESTIC_LEAGUE` competition
determines its clubs at simulation time via `club.leagueId === competition.leagueId`.
Domestic cups and UEFA competitions carry a `qualificationRule` describing
how participants are determined — today that's descriptive text; a future
DLC can formalize it into an executable rule without changing this shape.

## Validation

`validateDatabase(db)` runs automatically inside `loadDatabase()`.
**ERRORs throw and refuse to load** (duplicate IDs, broken references,
country/league mismatches, invalid rating values, missing required fields).
**WARNINGs log but don't block** (dangling rivals/owner refs pointing at
clubs not yet populated — expected during incremental content build-out,
not corruption).

## Adding a Database (New Season or DLC)

1. Create `src/data/databases/<id>/` following the `2026_27/` shape exactly.
2. Add one line to `DATABASE_REGISTRY` in `src/data/databases/registry.ts`.
3. Nothing else. The loader, validator, and every component already work
   with whatever's in the registry.

## Historical Databases

`src/data/databases/historical/roadmap.ts` lists planned eras
(1992/93 through 2015/16) as metadata only — no `FootballDatabase` exists
for them yet, deliberately, since an empty one would fail validation. When
an era is actually built, follow "Adding a Database" above and flip
`populated: true` in the roadmap entry.

## Save Compatibility

`SaveSlot` (in `src/types.ts`) records `databaseId`, `databaseVersion`,
`installedDLC`, and `gameVersion` alongside the actual save data, plus
`dynamicClubs` (the evolved club ratings/ownership at save time — without
this, club evolution was silently lost on reload). On load, a mismatched
`databaseId` logs a warning but doesn't block — the intent is that a save
from a database you no longer have installed should degrade gracefully,
not corrupt or crash.

## Future Systems This Architecture Is Ready For

Not implemented, but nothing here should require a redesign to add:
Manager Mode (clubs already carry `philosophy`/`ambition`/finances to react
to), Chairman/Sporting Director Mode (same club attributes, different UI),
Women's football and Youth/Reserve teams (would be new `Competition` types
+ a parallel club-attribute set, not a new architecture), additional
continents (more countries + leagues in the existing shape).

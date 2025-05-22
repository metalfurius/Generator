document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM para Usuario
    const usernameOutput = document.getElementById('usernameOutput');
    const generateUsernameBtn = document.getElementById('generateUsernameBtn');
    const copyUsernameBtn = document.getElementById('copyUsernameBtn');
    const includeAdjectivesCheckbox = document.getElementById('includeAdjectives');
    const includeNounsCheckbox = document.getElementById('includeNouns');
    const numDigitsInput = document.getElementById('numDigits');
    const usernameSeparatorSelect = document.getElementById('usernameSeparator');
    const usernameCapitalizationSelect = document.getElementById('usernameCapitalization');

    // Elementos del DOM para Contraseña
    const passwordOutput = document.getElementById('passwordOutput');
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');

    // Toast notification
    const toast = document.getElementById('toast');

    // Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- Lógica para generar Nombres de Usuario ---
    // Formato: AdjectiveNounNumber (e.g., AgileCoder123, ArcaneDragon456, EpicSaiyan789)

    const adjectives = [
        // Programming/IT
        "Agile", "Async", "Binary", "Boolean", "Bugged", "Cached", "Cloud", "Compiled", "Cyber",
        "Data", "Debugged", "Decrypted", "Digital", "Dynamic", "Encrypted", "Firewalled", "Floating",
        "Fuzzy", "Glitchy", "Global", "Hashed", "Hex", "Indexed", "Inline", "Kernel", "Legacy",
        "Linked", "Logical", "Looping", "Macro", "Micro", "Mobile", "Modular", "Neural", "Null",
        "Offline", "Online", "OpenSource", "Optimized", "Parallel", "Pixel", "Polymorphic",
        "Recursive", "Redundant", "Root", "Runtime", "Scalable", "Scripted", "Secure", "Semantic",
        "Serial", "Serverless", "Shadow", "Static", "Stateless", "Streaming", "Syntax", "System",
        "Terabyte", "Threaded", "Virtual", "Volatile", "Wired", "Wireless", "Zombie",

        // D&D
        "Ancient", "Arcane", "Armored", "Barbarian", "Bardic", "Battle", "Beastly", "Blessed",
        "Bloody", "Bold", "Brave", "Chaotic", "Charmed", "Cleric", "Cosmic", "Crafty", "Cursed",
        "Dark", "Deadly", "Demonic", "Divine", "Draconic", "Dread", "Druidic", "Dwarven",
        "Eldritch", "Elemental", "Elven", "Enchanted", "Enigmatic", "Epic", "Eternal", "Ethereal",
        "Exalted", "Fabled", "Fallen", "Fanatic", "Fey", "Fiendish", "Fierce", "Forgotten",
        "Forsaken", "Frozen", "Ghostly", "Giant", "Gilded", "Glacial", "Glimmering", "Gnomish",
        "Goblin", "Golden", "Gothic", "Grand", "Grave", "Grim", "Guardian", "Halfling", "Haunted",
        "Heroic", "Hidden", "Holy", "Honorable", "Humanoid", "Humble", "Hungry", "Hunter",
        "Icewind", "Illusory", "Immortal", "Imperial", "Infernal", "Iron", "Jade", "Keen",
        "Knightly", "Legendary", "Lich", "Light", "Living", "Lost", "Lucky", "Lunar", "Mad",
        "Magic", "Majestic", "Masked", "Master", "Mithril", "Molten", "Monstrous", "Moonlit",
        "Mystic", "Mythic", "Necrotic", "Noble", "Nomad", "Obsidian", "Ominous", "Orcish",
        "Paladin", "Pale", "Phantom", "Planar", "Poisoned", "Primal", "Primeval", "Princely",
        "Prophetic", "Proud", "Psionic", "Pure", "Radiant", "Raging", "Regal", "Relic", "Rogue",
        "Royal", "Ruby", "Runic", "Sacred", "Savage", "Scarlet", "Screaming", "Secret",
        "Serpent", "Shadow", "Shamanic", "Shattered", "Silent", "Silver", "Sinister", "Skeletal",
        "Sky", "Solar", "Solitary", "Sorcerous", "Soul", "Spectral", "Spiked", "Spirit", "Star",
        "Stealthy", "Steel", "Stone", "Storm", "Stout", "Sunken", "Sylvan", "Sacred", "Tainted",
        "Terra", "Thorned", "Thunder", "Timeless", "Titan", "Tranquil", "Twisted", "Undead",
        "Unholy", "Valiant", "Vampiric", "Vengeful", "Venomous", "Vigilant", "Vile", "Void",
        "Warlock", "Warrior", "Watchful", "Whispering", "Wild", "Winged", "Winter", "Wise",
        "Witch", "Wizardly", "Wooden", "Wrathful", "Wyvern", "Zealous",

        // Anime
        "Akira", "Astro", "Baka", "Berserk", "Bishonen", "Buster", "Chibi", "Comrade",
        "Cosplay", "Crystal", "Cute", "Cyberpunk", "Dai", "Doki", "Dreamy", "Ecchi", "Eva",
        "Fairy", "Final", "Flame", "Galaxy", "Giga", "Gundam", "Harajuku", "Hentai", "Heroic",
        "Hikari", "Hime", "Hollow", "Idol", "Infinite", "Isekai", "Josei", "Jutsu", "Kaiju",
        "Kami", "Kawaii", "Kimono", "Kunoichi", "Kyoto", "Legend", "Lolita", "Lovely",
        "Lunar", "Magical", "Manga", "Mecha", "Miracle", "Moe", "Mystic", "Neko", "Neo",
        "Ninja", "Omega", "Oni", "Otaku", "Pastel", "Phantom", "Pilot", "Pixel", "Pocket",
        "Power", "Pretty", "Psychic", "Pure", "Rebel", "Robo", "Ronin", "Saiyan", "Sakura",
        "Samurai", "Schoolgirl", "Seinen", "Senpai", "Sensei", "Sentai", "Shinigami", "Shinobi",
        "Shonen", "Shojo", "Silent", "Silver", "Soul", "Space", "Spirit", "Star", "Super",
        "Sushi", "Sword", "Tactic", "Tokyo", "Tsundere", "Ultimate", "Ultra", "Vocaloid",
        "Waifu", "Wing", "Wonder", "Yakuza", "Yandere", "Yokai", "Yuri", "Yaoi", "Zen", "Zero"
    ];

    const nouns = [
        // Programming/IT
        "Algorithm", "AI", "API", "App", "Array", "Assembler", "Avatar", "Backend", "Bandwidth",
        "Bit", "Blockchain", "Bot", "Buffer", "Bug", "Byte", "Cache", "Circuit", "Class", "Client",
        "Cloud", "Code", "Compiler", "Component", "Cookie", "Core", "CPU", "Crash", "Cyberpunk",
        "Daemon", "Database", "Dataframe", "Debugger", "Decryption", "DevOps", "Digital", "Directory",
        "DNS", "Docker", "Domain", "Dongle", "Driver", "Encryption", "Endpoint", "Engine", "Error",
        "Ethernet", "Firewall", "Firmware", "Flow", "Framework", "Frontend", "Function", "Gateway",
        "Gigabyte", "Git", "Glitch", "GPU", "GUI", "Hacker", "Hardware", "Hash", "Heap", "Host",
        "HTML", "HTTP", "Hub", "IDE", "Index", "Input", "Interface", "Internet", "Interrupt", "IP",
        "Java", "JavaScript", "JQuery", "JSON", "Kernel", "Key", "Keyboard", "Keyword", "Lambda",
        "LAN", "Laptop", "Library", "Linux", "Linker", "Loader", "Logic", "Loop", "Macro",
        "Mainframe", "Malware", "Matrix", "Megabyte", "Memory", "Metaverse", "Microchip", "Microservice",
        "Modem", "Module", "Monitor", "Motherboard", "Mouse", "Network", "Node", "NoSQL", "Null",
        "Object", "OS", "Output", "Packet", "Parameter", "Password", "Patch", "Perl", "Phishing",
        "PHP", "Pipeline", "Pixel", "Platform", "Plugin", "Pointer", "Port", "Process", "Processor",
        "Program", "Protocol", "Proxy", "Python", "Query", "Queue", "RAM", "RaspberryPi", "React",
        "Register", "Repo", "Request", "Root", "Router", "Ruby", "Runtime", "SaaS", "Scalar",
        "Scanner", "Schema", "Screen", "Script", "SDK", "Security", "Semaphore", "Server", "Session",
        "Shell", "Socket", "Software", "Spam", "SQL", "Stack", "Storage", "Stream", "String",
        "Struct", "Switch", "Syntax", "System", "Table", "TCP", "Template", "Terabyte", "Terminal",
        "Thread", "Token", "Trojan", "Tuple", "UI", "Unix", "URL", "USB", "User", "Utility",
        "Variable", "Vector", "View", "Virus", "VM", "VPN", "VR", "Web", "Website", "Widget",
        "WiFi", "Windows", "Workflow", "XML", "YAML", "Zip", "Zombie",

        // D&D
        "Abyss", "Acolyte", "Adventurer", "Aegis", "Alchemist", "Ally", "Amulet", "Angel", "Archer",
        "Armor", "Arrow", "Artifact", "Assassin", "Axe", "Bahamut", "Balor", "Banshee", "Barbarian",
        "Bard", "Basilisk", "Bastion", "Battleaxe", "Bear", "Beast", "Beholder", "Blade", "Blight",
        "Boots", "Bow", "Bracers", "Cadaver", "Campaign", "Castle", "Catacomb", "Cauldron", "Cave",
        "Celestial", "Chainmail", "Champion", "Chant", "Chaos", "Charisma", "Charm", "Chimera",
        "Citadel", "Claw", "Cleric", "Cloak", "Codex", "Coin", "Conjurer", "Coven", "Creature",
        "Crossbow", "Crown", "Crusader", "Crypt", "Crystal", "Cultist", "Curse", "Cyclops",
        "Dagger", "Darkness", "Deathknight", " Deity", "Demiplane", "Demon", "Den", "Destiny",
        "Deva", "Dice", "Dimension", "Divinity", "Djinn", "Domain", "Doom", "Dracolich", "Dragon",
        "Dragonborn", "Drake", "Dream", "Druid", "Dryad", "Dungeon", "Dwarf", "Efreet", "Elder",
        "Elemental", "Elf", "Elixir", "Emblem", "Empire", "Enchanter", "Encounter", "Energy",
        "Ettin", "Familiar", "Fang", "Fate", "Faun", "Fey", "Fiend", "Fighter", "Flameskull",
        "Forest", "Forge", "Fortress", "Fountain", "Gargoyle", "Gauntlet", "Gem", "Genie",
        "Ghost", "Ghoul", "Giant", "Glade", "Gladiator", "Glaive", "Glyph", "Gnome", "Gnoll",
        "Goblin", "God", "Golem", "Gorgon", "Grail", "Greataxe", "Greaves", "Griffin", "Grimoire",
        "Grove", "Guardian", "Guild", "Halberd", "Halfelf", "Halforc", "Halfling", "Hammer",
        "Harpy", "Haunt", "Haven", "Healer", "Helm", "Herald", "Hermit", "Hero", "Hex", "Hoard",
        "Hobgoblin", "Homunculus", "Horn", "Horse", "Hound", "Human", "Hydra", "Icon", "Idol",
        "Illusion", "Imp", "Incantation", "Inferno", "Inquisitor", "Insight", "Javelin", "Jester",
        "Jewel", "Journey", "Keep", "Key", "Knight", "Kobold", "Kraken", "Labyrinth", "Lair",
        "Lance", "Law", "Legend", "Legion", "Lich", "Light", "Lion", "Lizardfolk", "Lock",
        "Longbow", "Longsword", "Lore", "Lycanthrope", "Mace", "Mage", "Magic", "Magister",
        "Malediction", "Mana", "Manticore", "Mantle", "Manual", "Map", "Mark", "Martyr",
        "Mask", "Master", "Maul", "Medallion", "Medusa", "Mercenary", "Mimic", "Mindflayer",
        "Minion", "Minotaur", "Mirage", "Mist", "Mithral", "Monastery", "Monk", "Monster",
        "Moon", "Mound", "Mountain", "Mummy", "Muse", "Mystery", "Mystic", "Myth", "Nature",
        "Necromancer", "Nexus", "Nightmare", "Nymph", "Oath", "Obelisk", "Ogre", "Omen",
        "Ooze", "Oracle", "Orb", "Orc", "Order", "Otyugh", "Outcast", "Outlaw", "Paladin",
        "Pantheon", "Paradise", "Parchment", "Path", "Patron", "Pendant", "Phantom", "Phoenix",
        "Pickaxe", "Pilgrim", "Pit", "Plague", "Plane", "Portal", "Potion", "Power", "Prayer",
        "Priest", "Prophecy", "Protector", "Prowler", "Psion", "Pyramid", "Quake", "Quarterstaff",
        "Quasit", "Queen", "Quest", "Quill", "Rakshasa", "Ranger", "Rapier", "Raven", "Realm",
        "Reaper", "Reaver", "Relic", "Remnant", "Requiem", "Retreat", "Revenant", "Riddle",
        "Ring", "Rite", "Robe", "Roc", "Rogue", "Rook", "Ruin", "Rune", "Saber", "Sage",
        "Salamander", "Sanctuary", "Satyr", "Scepter", "Scimitar", "Scorpion", "Scourge",
        "Scout", "Scroll", "Scythe", "Sea", "Seer", "Sentinel", "Serpent", "Servant", "Shadow",
        "Shaman", "Shard", "Shield", "Shrine", "Sigil", "Silence", "Siren", "Skeleton", "Skull",
        "Slayer", "Slime", "Sling", "Snake", "Song", "Sorcerer", "Soul", "Spawn", "Spear",
        "Specter", "Spell", "Sphere", "Sphinx", "Spider", "Spike", "Spirit", "Sprite", "Spy",
        "Staff", "Stag", "Star", "Statue", "Steed", "Storm", "Strength", "Stronghold", "Summoner",
        "Sun", "Swamp", "Sword", "Symbol", "Talisman", "Tankard", "Tarot", "Tarrasque", "Tavern",
        "Tempest", "Temple", "Tentacle", "Thief", "Thorn", "Throne", "Thunder", "Tiefling",
        "Tiger", "Titan", "Tome", "Tomb", "Totem", "Tower", "Trail", "Trance", "Trap", "Treant",
        "Treasure", "Tribe", "Trickster", "Troll", "Trophy", "Tunnel", "Tyrant", "Undead",
        "Unicorn", "Valkyrie", "Vampire", "Vanguard", "Veil", "Venom", "Vestige", "Vision",
        "Void", "Vortex", "Vow", "Wand", "Warlock", "Warlord", "Warrior", "Warhammer", "Watcher",
        "Waterdeep", "Weapon", "Werewolf", "Whip", "Whisper", "Wight", "Wilderness", "Will",
        "Wind", "Witch", "Wizard", "Wolf", "Wood", "Wraith", "Wyrm", "Wyvern", "Yeti", "Zealot",
        "Zombie", "Zone",

        // Anime
        "Akuma", "Angel", "Anime", "Arcade", "Artifact", "Artist", "Ashigaru", "Assassin",
        "Aura", "Avatar", "Bakemono", "Battler", "Beast", "Bento", "Bishojo", "Blade", "Blazer",
        "Brawler", "Buddy", "Butler", "Captain", "Card", "Catgirl", "Chakra", "Champion",
        "Channel", "Character", "Charm", "CherryBlossom", "Chibi", "Clan", "Climax", "Club",
        "Collector", "Comiket", "Commander", "Concert", "Contract", "Cosplayer", "Creator",
        "Crisis", "Crusader", "Cyberbrain", "Cyborg", "Daisho", "Daimyo", "Deja Vu", "Delinquent",
        "Demon", "Destiny", "Detective", "Dimension", "Diva", "Dojo", "Doujinshi", "Dragon",
        "Dream", "Duelist", "Dungeon", "Edition", "Element", "Elf", "Emblem", "Empire", "Encounter",
        "Energy", "Episode", "Esper", "Fairy", "Fandom", "Fangirl", "Fanboy", "Fantasy", "Fate",
        "Festival", "Fighter", "Figure", "Flashback", "Foxgirl", "Friend", "Fusion", "Gacha",
        "Gakuran", "Gamer", "Gang", "Geisha", "Gem", "Generation", "Genin", "Ghost", "Ghoul",
        "Giant", "Gijinka", "Goblin", "God", "Gothic", "Grimoire", "Guardian", "Guild", "Gunpla",
        "Harem", "Harpy", "Healer", "Heart", "Heiress", "Henshin", "Hero", "Heroine", "Hikikomori",
        "Hobby", "Hokage", "Homunculus", "Hope", "Host", "Idol", "Illusion", "Imp", "Incarnation",
        "Inu", "Island", "Isekai", "Janken", "JRPG", "Jutsu", "Kaiju", "Kami", "Kanji", "Katana",
        "Kemonomimi", "Kensei", "Kitsune", "Knight", "Kohai", "Kokoro", "Kunai", "Kunoichi",
        "Legend", "LightNovel", "LimitBreak", "Loli", "Mage", "Magic", "Magician", "Maid", "Majin",
        "Manga", "Mangaka", "MartialArtist", "Masamune", "Mask", "Master", "Matsuri", "Mecha",
        "Medium", "Megami", "Melody", "Memories", "Mentor", "Merch", "Meta", "Mikoshi", "Miko",
        "Miracle", "Monmusu", "Monster", "Moon", "Musha", "Music", "Musou", "Mystery", "Myth",
        "Nakama", "Narrator", "Neko", "Nemesis", "NetIdol", "Ninja", "Nobushi", "Novel", "Ojou",
        "Okami", "Omen", "Oni", "Onmyoji", "Oracle", "Otaku", "Otome", "OVA", "Pact", "Pantsu",
        "Paradox", "Parasite", "Partner", "Path", "Patron", "Phantom", "Pilot", "Pirate",
        "Pixel", "Plushie", "PocketMonster", "Portal", "Power", "Prince", "Princess", "Prodigy",
        "Prophecy", "Protagonist", "Psychic", "Puppet", "Quest", "Ragnarok", "Ramen", "Ranger",
        "Reality", "Rebirth", "Reincarnation", "Relic", "Rival", "Robot", "Roleplay", "Romance",
        "Ronin", "Rookie", "Rune", "Saga", "SailorFuku", "Saint", "Saiyan", "Sakura", "Samurai",
        "Sanctuary", "Sasuke", "Savior", "Scout", "Scroll", "Secret", "Seifuku", "Seiyuu",
        "Sempai", "Sensei", "Servant", "Shadow", "Shikigami", "Shinigami", "Shinobi", "Shogun",
        "Shonen", "Shojo", "Shrine", "Sidekick", "Siren", "Slayer", "SliceOfLife", "Sorcerer",
        "Soul", "Spaceship", "Spell", "Spirit", "Star", "Student", "Summoner", "Superpower",
        "Sushi", "Swordsman", "Tactic", "Talisman", "Tanuki", "Team", "Tempura", "Tengu", "Tenshi",
        "Titan", "Token", "Tokyo", "Tomo", "Tournament", "Tradition", "Tragedy", "Transformation",
        "Trap", "Treasure", "Tsundere", "Twin", "Umbrella", "Uniform", "Universe", "Usagi",
        "Vampire", "Vanguard", "Villain", "VisualNovel", "Vocaloid", "VoiceActor", "Waifu",
        "Wanderer", "Warrior", "Weapon", "Wizard", "World", "Yakuza", "Yandere", "Yojimbo",
        "Yokai", "Yurei", "Zodiac"
    ];


    function generateUsername() {
        const includeAdjectives = includeAdjectivesCheckbox.checked;
        const includeNouns = includeNounsCheckbox.checked;
        let numDigits = parseInt(numDigitsInput.value);
        const separator = usernameSeparatorSelect.value;
        const capitalization = usernameCapitalizationSelect.value;

        if (!includeAdjectives && !includeNouns) {
            alert("Please select at least one component (adjectives or nouns) for the username.");
            return usernameOutput.value || ""; // Return current or empty if none
        }

        if (numDigits < 0) numDigits = 0;
        if (numDigits > 5) numDigits = 5;
        numDigitsInput.value = numDigits; // Correct the input field if necessary

        let parts = [];
        if (includeAdjectives) {
            parts.push(adjectives[Math.floor(Math.random() * adjectives.length)]);
        }
        if (includeNouns) {
            parts.push(nouns[Math.floor(Math.random() * nouns.length)]);
        }

        let username = "";
        if (parts.length > 0) {
            switch (capitalization) {
                case "pascalcase":
                    username = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(separator === 'none' ? '' : (separator === 'hyphen' ? '-' : '_'));
                    break;
                case "camelcase":
                    username = parts[0].toLowerCase() +
                               parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(separator === 'none' ? '' : (separator === 'hyphen' ? '-' : '_'));
                    if (parts.length > 1 && separator !== 'none') { // camelCase joins parts directly unless separator is used
                        username = parts[0].toLowerCase() + parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('');
                        if (separator === 'hyphen') username = username.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''); //簡易的 hyphenated camelCase
                        if (separator === 'underscore') username = username.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''); //簡易的 underscored camelCase
                    } else {
                         username = parts.map((part, index) => 
                            index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                        ).join('');
                    }
                    break;
                case "lowercase":
                    username = parts.map(part => part.toLowerCase()).join(separator === 'none' ? '' : (separator === 'hyphen' ? '-' : '_'));
                    break;
                case "uppercase":
                    username = parts.map(part => part.toUpperCase()).join(separator === 'none' ? '' : (separator === 'hyphen' ? '-' : '_'));
                    break;
            }
        }

        if (numDigits > 0) {
            const randomNumber = Math.floor(Math.random() * Math.pow(10, numDigits));
            username += randomNumber.toString().padStart(numDigits, '0');
        }

        // Ensure username is not empty if adjectives/nouns were initially selected but resulted in empty string (e.g. due to separator logic)
        if ((includeAdjectives || includeNouns) && !username && numDigits === 0) {
            // Fallback to a simple random adjective/noun if generation results in empty and no numbers
            if (includeAdjectives) username = adjectives[Math.floor(Math.random() * adjectives.length)];
            else if (includeNouns) username = nouns[Math.floor(Math.random() * nouns.length)];
            // Apply basic capitalization if it was empty
            if (capitalization === "pascalcase" || capitalization === "uppercase") username = username.charAt(0).toUpperCase() + username.slice(1);
            else username = username.toLowerCase();
        }

        return username;
    }

    generateUsernameBtn.addEventListener('click', () => {
        usernameOutput.value = generateUsername();
    });

    // --- Lógica para generar Contraseñas ---
    const charSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:',.<>/?`~"
    };

    // Set max length for password input based on its HTML max attribute or a defined practical max
    const MAX_PASSWORD_LENGTH = 64; // Define a practical maximum
    if (lengthInput) {
        lengthInput.max = MAX_PASSWORD_LENGTH.toString(); // Update HTML attribute if not already set
    }

    function generatePassword() {
        let length = parseInt(lengthInput.value);

        // Ensure length does not exceed the new maximum
        if (length > MAX_PASSWORD_LENGTH) {
            length = MAX_PASSWORD_LENGTH;
            lengthInput.value = MAX_PASSWORD_LENGTH; // Update the input field as well
            alert(`Password length cannot exceed ${MAX_PASSWORD_LENGTH}. It has been adjusted.`);
        }
         if (length < 8) { // Or your desired minimum
            length = 8;
            lengthInput.value = 8;
            // alert(`Password length cannot be less than 8. It has been adjusted.`); // Optional alert
        }


        let characterPool = "";
        let generatedPassword = "";

        if (uppercaseCheckbox.checked) characterPool += charSets.uppercase;
        if (lowercaseCheckbox.checked) characterPool += charSets.lowercase;
        if (numbersCheckbox.checked) characterPool += charSets.numbers;
        if (symbolsCheckbox.checked) characterPool += charSets.symbols;

        if (characterPool === "") {
            // Default to all types if none selected, and ensure checkboxes reflect this
            uppercaseCheckbox.checked = true;
            lowercaseCheckbox.checked = true;
            numbersCheckbox.checked = true;
            symbolsCheckbox.checked = true;
            characterPool = charSets.uppercase + charSets.lowercase + charSets.numbers + charSets.symbols;
            alert("Please select at least one character type. Defaulting to all types.");
        }

        // Ensure at least one character from each selected type if possible
        let guaranteedChars = "";
        if (uppercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.uppercase);
        if (lowercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.lowercase);
        if (numbersCheckbox.checked) guaranteedChars += getRandomChar(charSets.numbers);
        if (symbolsCheckbox.checked) guaranteedChars += getRandomChar(charSets.symbols);
        
        // If the length is less than the number of guaranteed characters,
        // use only a subset of guaranteed characters, shuffled.
        if (length < guaranteedChars.length) {
            generatedPassword = shuffleString(guaranteedChars).substring(0, length);
        } else {
            generatedPassword = guaranteedChars;
            for (let i = guaranteedChars.length; i < length; i++) {
                generatedPassword += getRandomChar(characterPool);
            }
            generatedPassword = shuffleString(generatedPassword);
        }
        
        return generatedPassword;
    }

    function getRandomChar(str) {
        if (!str || str.length === 0) return ''; // Safeguard
        return str[Math.floor(Math.random() * str.length)];
    }

    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
        return arr.join('');
    }

    generatePasswordBtn.addEventListener('click', () => {
        const pass = generatePassword();
        if (pass) passwordOutput.value = pass;
    });


    // --- Lógica para Copiar al Portapapeles ---
    function copyToClipboard(text, btnElement) {
        if (!text) return; // No copiar si no hay texto

        navigator.clipboard.writeText(text).then(() => {
            showToast();
            const originalIcon = btnElement.innerHTML;
            btnElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>`;
            setTimeout(() => {
                btnElement.innerHTML = originalIcon;
            }, 1500);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            // Fallback for older browsers or if clipboard API fails (less common now)
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed"; // Avoid scrolling to bottom
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast(); // Still show toast on successful fallback
                 const originalIcon = btnElement.innerHTML;
                btnElement.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>`;
                setTimeout(() => {
                    btnElement.innerHTML = originalIcon;
                }, 1500);
            } catch (e) {
                alert('No se pudo copiar al portapapeles.');
            }
        });
    }

    copyUsernameBtn.addEventListener('click', () => {
        copyToClipboard(usernameOutput.value, copyUsernameBtn);
    });

    copyPasswordBtn.addEventListener('click', () => {
        copyToClipboard(passwordOutput.value, copyPasswordBtn);
    });
    
    function showToast() {
        toast.className = "toast show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 2500); 
    }

    // Generar un usuario y contraseña al cargar la página
    usernameOutput.value = generateUsername();
    // Ensure password generation on load also respects constraints
    const initialPass = generatePassword();
    if (initialPass) passwordOutput.value = initialPass;

});
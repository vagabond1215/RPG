from enum import Enum

class StandardClass(Enum):
    """Standard Dungeons & Dragons base classes."""
    BARBARIAN = "Barbarian"
    BARD = "Bard"
    CLERIC = "Cleric"
    DRUID = "Druid"
    FIGHTER = "Fighter"
    MONK = "Monk"
    PALADIN = "Paladin"
    RANGER = "Ranger"
    ROGUE = "Rogue"
    SORCERER = "Sorcerer"
    WARLOCK = "Warlock"
    WIZARD = "Wizard"


class AdvancedClass(Enum):
    """A selection of advanced/ prestige classes."""
    ARCANE_ARCHER = "Arcane Archer"
    ASSASSIN = "Assassin"
    BLACKGUARD = "Blackguard"
    DRAGON_DISCIPLE = "Dragon Disciple"
    DUELIST = "Duelist"
    LOREMASTER = "Loremaster"
    MYSTIC_THEURGE = "Mystic Theurge"
    SHADOWDANCER = "Shadowdancer"

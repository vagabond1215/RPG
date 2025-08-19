from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Dict, Optional


class EquipmentSlot(Enum):
    """All possible equipment slots for a character."""
    MAIN_HAND = auto()
    OFF_HAND = auto()
    HEAD = auto()
    LEFT_EAR = auto()
    RIGHT_EAR = auto()
    NECK = auto()
    BODY = auto()
    HANDS = auto()
    WAIST = auto()
    LEGS = auto()
    FEET = auto()
    BACK = auto()


@dataclass
class Character:
    """Basic character template with attributes and equipment."""
    name: str
    level: int = 1
    hp: int = 0
    mp: int = 0
    stamina: int = 0
    hp_regen: int = 0
    mp_regen: int = 0
    stamina_regen: int = 0
    str: int = 0
    dex: int = 0
    agi: int = 0
    con: int = 0
    int: int = 0
    wis: int = 0
    cha: int = 0
    luk: int = 0
    equipment: Dict[EquipmentSlot, Optional[str]] = field(
        default_factory=lambda: {slot: None for slot in EquipmentSlot}
    )

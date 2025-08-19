"""Simple Tkinter-based UI with a persistent top menu."""

import tkinter as tk
from tkinter import ttk
from typing import Callable, Dict, Optional, Set

from .character import Alignment, Nature, Race
from .dnd_classes import StandardClass

BUTTON_SIZE = 40


RACE_RESTRICTIONS: Dict[Race, Dict[str, Optional[Set]]] = {
    Race.ORC: {"alignment": {Alignment.EVIL}, "nature": None},
    Race.DWARF: {"alignment": None, "nature": {Nature.LAWFUL}},
    Race.ELF: {"alignment": None, "nature": {Nature.CHAOTIC}},
}

JOB_RESTRICTIONS: Dict[StandardClass, Dict[str, Optional[Set]]] = {
    StandardClass.PALADIN: {"alignment": {Alignment.GOOD}, "nature": {Nature.LAWFUL}},
    StandardClass.BARBARIAN: {"alignment": None, "nature": {Nature.CHAOTIC}},
    StandardClass.DRUID: {"alignment": {Alignment.NEUTRAL}, "nature": None},
}


class NewCharacterWindow(tk.Toplevel):
    """Dialog for creating a new character with basic data."""

    def __init__(self, master: tk.Widget) -> None:
        super().__init__(master)
        self.title("New Character")

        self.name_var = tk.StringVar()
        self.race_var = tk.StringVar()
        self.job_var = tk.StringVar()
        self.align_var = tk.StringVar()
        self.nature_var = tk.StringVar()

        ttk.Label(self, text="Name:").grid(row=0, column=0, sticky="w", padx=4, pady=2)
        ttk.Entry(self, textvariable=self.name_var).grid(row=0, column=1, padx=4, pady=2)

        ttk.Label(self, text="Race:").grid(row=1, column=0, sticky="w", padx=4, pady=2)
        self.race_cb = ttk.Combobox(
            self,
            textvariable=self.race_var,
            values=[r.value for r in Race],
            state="readonly",
        )
        self.race_cb.grid(row=1, column=1, padx=4, pady=2)

        ttk.Label(self, text="Class:").grid(row=2, column=0, sticky="w", padx=4, pady=2)
        self.job_cb = ttk.Combobox(
            self,
            textvariable=self.job_var,
            values=[c.value for c in StandardClass],
            state="readonly",
        )
        self.job_cb.grid(row=2, column=1, padx=4, pady=2)

        ttk.Label(self, text="Alignment:").grid(row=3, column=0, sticky="w", padx=4, pady=2)
        self.align_cb = ttk.Combobox(
            self,
            textvariable=self.align_var,
            values=[a.value for a in Alignment],
            state="readonly",
        )
        self.align_cb.grid(row=3, column=1, padx=4, pady=2)

        ttk.Label(self, text="Nature:").grid(row=4, column=0, sticky="w", padx=4, pady=2)
        self.nature_cb = ttk.Combobox(
            self,
            textvariable=self.nature_var,
            values=[n.value for n in Nature],
            state="readonly",
        )
        self.nature_cb.grid(row=4, column=1, padx=4, pady=2)

        ttk.Button(self, text="Create", command=self.destroy).grid(
            row=5, column=0, columnspan=2, pady=6
        )

        self.race_cb.bind("<<ComboboxSelected>>", self._update_choices)
        self.job_cb.bind("<<ComboboxSelected>>", self._update_choices)
        self._update_choices()

    def _update_choices(self, event: Optional[tk.Event] = None) -> None:
        allowed_alignments: Set[Alignment] = set(Alignment)
        allowed_natures: Set[Nature] = set(Nature)

        race_str = self.race_var.get()
        job_str = self.job_var.get()

        if race_str:
            race = Race(race_str)
            restrict = RACE_RESTRICTIONS.get(race, {})
            if restrict.get("alignment"):
                allowed_alignments &= restrict["alignment"]
            if restrict.get("nature"):
                allowed_natures &= restrict["nature"]

        if job_str:
            job = StandardClass(job_str)
            restrict = JOB_RESTRICTIONS.get(job, {})
            if restrict.get("alignment"):
                allowed_alignments &= restrict["alignment"]
            if restrict.get("nature"):
                allowed_natures &= restrict["nature"]

        align_values = [a.value for a in allowed_alignments]
        nature_values = [n.value for n in allowed_natures]

        self.align_cb["values"] = align_values
        self.nature_cb["values"] = nature_values

        if self.align_var.get() not in align_values:
            self.align_var.set(align_values[0] if align_values else "")
        if self.nature_var.get() not in nature_values:
            self.nature_var.set(nature_values[0] if nature_values else "")


class App(tk.Tk):
    """Main application window with menu buttons."""

    def __init__(self) -> None:
        super().__init__()
        self.scale = 1.0
        self.orientation = "portrait"
        self.theme = "light"
        self.title("RPG UI")
        self._build_menu()
        self._build_slide_menu()
        self._apply_theme()

    def _build_menu(self) -> None:
        self.menu = ttk.Frame(self, height=BUTTON_SIZE)
        self.menu.pack(side="top", fill="x")
        self.menu.pack_propagate(False)

        self.menu_btn = self._make_button("Menu", self._toggle_menu)
        self.zoom_in_btn = self._make_button("+", self._zoom_in)
        self.zoom_out_btn = self._make_button("-", self._zoom_out)
        self.orientation_btn = self._make_button("↻", self._toggle_orientation)
        self.theme_btn = self._make_button("☾", self._toggle_theme)

    def _make_button(self, text: str, command: Callable[[], None]) -> ttk.Button:
        frame = ttk.Frame(self.menu, width=BUTTON_SIZE, height=BUTTON_SIZE)
        frame.pack_propagate(False)
        frame.pack(side="left", padx=2, pady=2)
        btn = ttk.Button(frame, text=text, command=command, style="Menu.TButton")
        btn.pack(fill="both", expand=True)
        return btn

    def _build_slide_menu(self) -> None:
        self.slide_menu = ttk.Frame(self, height=0)
        self.slide_menu.pack(side="top", fill="x")
        self.slide_menu.pack_propagate(False)
        self.slide_visible = False

        new_char_btn = ttk.Button(
            self.slide_menu,
            text="New Character",
            command=self._new_character,
            style="Menu.TButton",
        )
        new_char_btn.pack(fill="x", padx=2, pady=2)

    def _toggle_menu(self) -> None:
        if self.slide_visible:
            self._slide_up()
        else:
            self._slide_down()

    def _slide_down(self, height: int = 100) -> None:
        self.slide_visible = True
        self._animate_slide(self.slide_menu.winfo_height(), height)

    def _slide_up(self) -> None:
        self._animate_slide(self.slide_menu.winfo_height(), 0)
        self.slide_visible = False

    def _animate_slide(self, start: int, end: int) -> None:
        step = 5 if end > start else -5

        def _step(current: int) -> None:
            self.slide_menu.config(height=current)
            if current != end:
                self.after(10, lambda: _step(current + step))

        _step(start)

    def _new_character(self) -> None:
        NewCharacterWindow(self)

    def _zoom_in(self) -> None:
        self.scale *= 1.1
        self.tk.call("tk", "scaling", self.scale)

    def _zoom_out(self) -> None:
        self.scale /= 1.1
        self.tk.call("tk", "scaling", self.scale)

    def _toggle_orientation(self) -> None:
        if self.orientation == "portrait":
            self.orientation = "landscape"
            self.geometry("800x600")
        else:
            self.orientation = "portrait"
            self.geometry("600x800")

    def _toggle_theme(self) -> None:
        self.theme = "dark" if self.theme == "light" else "light"
        self._apply_theme()
        self.theme_btn.config(text="☾" if self.theme == "light" else "☀")

    def _apply_theme(self) -> None:
        style = ttk.Style()
        if self.theme == "light":
            bg = "#ffffff"
            fg = "#000000"
        else:
            bg = "#333333"
            fg = "#ffffff"
        style.configure("Menu.TFrame", background=bg)
        style.configure("Menu.TButton", background=bg, foreground=fg)
        self.configure(background=bg)
        self.menu.configure(style="Menu.TFrame")
        self.slide_menu.configure(style="Menu.TFrame")


def main() -> None:
    App().mainloop()


if __name__ == "__main__":
    main()

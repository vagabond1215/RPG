"""Simple Tkinter-based UI with a persistent top menu."""

import tkinter as tk
from tkinter import ttk
from typing import Callable

BUTTON_SIZE = 40


class App(tk.Tk):
    """Main application window with menu buttons."""

    def __init__(self) -> None:
        super().__init__()
        self.scale = 1.0
        self.orientation = "portrait"
        self.theme = "light"
        self.title("RPG UI")
        self._build_menu()
        self._apply_theme()

    def _build_menu(self) -> None:
        self.menu = ttk.Frame(self, height=BUTTON_SIZE)
        self.menu.pack(side="top", fill="x")
        self.menu.pack_propagate(False)

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


def main() -> None:
    App().mainloop()


if __name__ == "__main__":
    main()

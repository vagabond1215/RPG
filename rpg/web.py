"""Web interface for RPG character creation using Flask."""

from typing import Dict, List, Optional, Set

from flask import Flask, redirect, render_template_string, request, url_for

from .character import Alignment, Character, Nature, Race
from .dnd_classes import StandardClass

app = Flask(__name__)

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

characters: List[Character] = []

FORM_TEMPLATE = """
<!doctype html>
<title>Create Character</title>
<h1>Create Character</h1>
{% if error %}<p style="color:red">{{ error }}</p>{% endif %}
<form method="post">
  Name: <input name="name"><br>
  Race: <select name="race">
    {% for race in races %}
    <option value="{{ race.value }}">{{ race.value }}</option>
    {% endfor %}
  </select><br>
  Class: <select name="cls">
    {% for cls in classes %}
    <option value="{{ cls.value }}">{{ cls.value }}</option>
    {% endfor %}
  </select><br>
  Alignment: <select name="alignment">
    {% for align in alignments %}
    <option value="{{ align.value }}">{{ align.value }}</option>
    {% endfor %}
  </select><br>
  Nature: <select name="nature">
    {% for nat in natures %}
    <option value="{{ nat.value }}">{{ nat.value }}</option>
    {% endfor %}
  </select><br>
  <input type="submit" value="Create">
</form>
<p><a href="{{ url_for('index') }}">Back to list</a></p>
"""

LIST_TEMPLATE = """
<!doctype html>
<title>Characters</title>
<h1>Characters</h1>
<ul>
{% for c in characters %}
<li>{{ c.name }} - {{ c.race.value }} {{ c.base_class.value }}</li>
{% endfor %}
</ul>
<p><a href="{{ url_for('new_character') }}">New character</a></p>
"""


@app.route("/")
def index():
    """Display list of created characters."""
    return render_template_string(LIST_TEMPLATE, characters=characters)


@app.route("/new", methods=["GET", "POST"])
def new_character():
    """Form to create a new character."""
    error = None
    if request.method == "POST":
        name = request.form["name"].strip()
        race = Race(request.form["race"])
        cls = StandardClass(request.form["cls"])
        alignment = Alignment(request.form["alignment"])
        nature = Nature(request.form["nature"])

        restrict = RACE_RESTRICTIONS.get(race, {})
        align_set = restrict.get("alignment")
        nature_set = restrict.get("nature")
        if align_set and alignment not in align_set:
            error = "Invalid alignment for race."
        restrict = JOB_RESTRICTIONS.get(cls, {})
        align_set2 = restrict.get("alignment")
        nature_set2 = restrict.get("nature")
        if not error and align_set2 and alignment not in align_set2:
            error = "Invalid alignment for class."
        if not error:
            if nature_set and nature not in nature_set:
                error = "Invalid nature for race."
            elif nature_set2 and nature not in nature_set2:
                error = "Invalid nature for class."

        if not error:
            characters.append(
                Character(
                    name=name,
                    alignment=alignment,
                    nature=nature,
                    race=race,
                    base_class=cls,
                )
            )
            return redirect(url_for("index"))

    return render_template_string(
        FORM_TEMPLATE,
        races=list(Race),
        classes=list(StandardClass),
        alignments=list(Alignment),
        natures=list(Nature),
        error=error,
    )


def main() -> None:
    """Run the Flask development server."""
    app.run(debug=True)


if __name__ == "__main__":
    main()

from pyscript import document

def set_status(text, error=False, ready=False):
    el = document.getElementById("pyStatusText")
    box = document.getElementById("pyStatus")
    if el is not None:
        el.innerText = text
    if box is not None:
        if error:
            box.classList.add("py-error")
        if ready:
            box.classList.add("py-ready")

set_status("MicroPython started \u2014 wiring up the page\u2026")

try:
    import json
    from pyscript import window

    # =========================================================
    # KNOWLEDGE BASE
    # (same as the original desktop app's knowledge dict)
    # =========================================================

    knowledge = {
        "General Medicine": {"fever", "cough", "sore throat"},
        "Neurology": {"headache", "dizziness", "migraine"},
        "Orthopedics": {"joint pain", "bone pain", "swelling"},
        "Gastroenterology": {"stomach pain", "vomiting", "diarrhea"},
    }

    # =========================================================
    # FRAME ENGINE
    # (same structure as the original frame_engine.py)
    # =========================================================

    class Frame:

        def __init__(self, name, parent=None):
            self.name = name
            self.parent = parent
            self.slots = {}

        def set_slot(self, slot, value):
            self.slots[slot] = value

        def get_slot(self, slot):
            if slot in self.slots:
                return self.slots[slot]
            if self.parent is not None:
                return self.parent.get_slot(slot)
            return None

    # =========================================================
    # REASONING
    # (same scoring logic as the original suggest_department)
    # =========================================================

    def suggest_department(symptoms):
        symptom_set = set()
        for item in symptoms.split(","):
            item = item.strip().lower()
            if item:
                symptom_set.add(item)

        best_department = "General Medicine"
        highest_score = 0

        for department in knowledge:
            known_symptoms = knowledge[department]
            score = len(symptom_set & known_symptoms)
            if score > highest_score:
                highest_score = score
                best_department = department

        return best_department

    # =========================================================
    # PATIENT STORE
    # (in-memory list + browser localStorage, replaces SQLite)
    # =========================================================

    STORAGE_KEY = "smart-frame-hospital-patients"

    def load_patients():
        raw = window.localStorage.getItem(STORAGE_KEY)
        if raw:
            return json.loads(raw)
        return []

    def save_patients():
        window.localStorage.setItem(STORAGE_KEY, json.dumps(patients))

    patients = load_patients()

    # =========================================================
    # UI HELPERS
    # =========================================================

    def escape_html(value):
        text = str(value) if value is not None else ""
        text = text.replace("&", "&amp;")
        text = text.replace("<", "&lt;")
        text = text.replace(">", "&gt;")
        text = text.replace('"', "&quot;")
        text = text.replace("'", "&#39;")
        return text

    def render_table(filter_text=""):
        query = filter_text.strip().lower()
        tbody = document.getElementById("patientTableBody")
        empty_note = document.getElementById("emptyNote")

        rows_html = ""
        visible_count = 0

        for p in patients:
            if query and (query not in p["id"].lower()) and (query not in p["name"].lower()):
                continue
            visible_count += 1
            doctor = p.get("doctor") or "Not assigned"
            room = p.get("room") or "Not assigned"
            rows_html += "<tr>"
            rows_html += "<td>" + escape_html(p["id"]) + "</td>"
            rows_html += "<td>" + escape_html(p["name"]) + "</td>"
            rows_html += "<td>" + escape_html(p["age"]) + "</td>"
            rows_html += "<td><span class='badge'>" + escape_html(p["department"]) + "</span></td>"
            rows_html += "<td>" + escape_html(doctor) + "</td>"
            rows_html += "<td>" + escape_html(room) + "</td>"
            rows_html += "<td><button class='row-delete' data-id='" + escape_html(p["id"]) + "'>\u2715</button></td>"
            rows_html += "</tr>"

        tbody.innerHTML = rows_html
        empty_note.style.display = "none" if visible_count else "block"

        delete_buttons = document.querySelectorAll(".row-delete")
        for i in range(delete_buttons.length):
            btn = delete_buttons.item(i)
            btn.addEventListener("click", make_delete_handler(btn.getAttribute("data-id")))

    def make_delete_handler(patient_id):
        def handler(event):
            global patients
            remaining = []
            for p in patients:
                if p["id"] != patient_id:
                    remaining.append(p)
            patients = remaining
            save_patients()
            render_table(document.getElementById("searchBox").value)
        return handler

    # =========================================================
    # EVENT HANDLERS
    # =========================================================

    def on_symptoms_input(event):
        text = document.getElementById("f-symptoms").value.strip()
        suggestion_el = document.getElementById("suggestedDept")
        suggestion_el.innerText = suggest_department(text) if text else "\u2014"

    def on_search_input(event):
        render_table(document.getElementById("searchBox").value)

    def on_form_submit(event):
        event.preventDefault()

        patient_id = document.getElementById("f-id").value.strip()
        form_note = document.getElementById("formNote")

        for p in patients:
            if p["id"].lower() == patient_id.lower():
                form_note.innerText = "Patient ID \"" + patient_id + "\" already exists \u2014 use a different ID."
                return

        symptoms = document.getElementById("f-symptoms").value.strip()
        department = suggest_department(symptoms) if symptoms else "General Medicine"

        record = {
            "id": patient_id,
            "name": document.getElementById("f-name").value.strip(),
            "age": document.getElementById("f-age").value.strip(),
            "gender": document.getElementById("f-gender").value,
            "blood": document.getElementById("f-blood").value.strip(),
            "allergies": document.getElementById("f-allergies").value.strip(),
            "symptoms": symptoms,
            "department": department,
            "doctor": document.getElementById("f-doctor").value.strip(),
            "room": document.getElementById("f-room").value.strip(),
        }

        patients.append(record)
        save_patients()
        render_table(document.getElementById("searchBox").value)

        form_note.innerText = "Saved \u2014 Python routed this patient to " + department + "."
        document.getElementById("patientForm").reset()
        document.getElementById("suggestedDept").innerText = "\u2014"

    # =========================================================
    # WIRE UP THE PAGE
    # =========================================================

    document.getElementById("f-symptoms").addEventListener("input", on_symptoms_input)
    document.getElementById("searchBox").addEventListener("input", on_search_input)
    document.getElementById("patientForm").addEventListener("submit", on_form_submit)

    document.getElementById("f-symptoms").removeAttribute("disabled")
    document.getElementById("saveBtn").removeAttribute("disabled")

    render_table()

    set_status(
        "Python runtime ready \u2014 this form is running real Python (MicroPython via PyScript).",
        ready=True,
    )

except Exception as exc:
    set_status("Python error: " + str(exc), error=True)

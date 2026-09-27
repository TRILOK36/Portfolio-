// ===== The actual Python source running this page =====
// Adapted from the original Smart Frame Hospital main.py:
// Tkinter and SQLite are removed (they need a local OS, not a browser),
// the reasoning logic (knowledge base, suggest_department, Frame class)
// and the patient record handling are kept as-is.
const PY_SOURCE = `
import json

# =========================================================
# KNOWLEDGE BASE
# =========================================================

knowledge = {

    "General Medicine": {
        "fever",
        "cough",
        "sore throat"
    },

    "Neurology": {
        "headache",
        "dizziness",
        "migraine"
    },

    "Orthopedics": {
        "joint pain",
        "bone pain",
        "swelling"
    },

    "Gastroenterology": {
        "stomach pain",
        "vomiting",
        "diarrhea"
    }

}


# =========================================================
# FRAME ENGINE
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

    def all_slots(self):

        result = {}

        if self.parent is not None:
            result.update(self.parent.all_slots())

        result.update(self.slots)

        return result


# =========================================================
# REASONING
# =========================================================

def suggest_department(symptoms):

    symptom_set = {
        item.strip().lower()
        for item in symptoms.split(",")
        if item.strip()
    }

    best_department = "General Medicine"
    highest_score = 0

    for department, known_symptoms in knowledge.items():

        score = len(
            symptom_set.intersection(known_symptoms)
        )

        if score > highest_score:
            highest_score = score
            best_department = department

    return best_department


# =========================================================
# PATIENT STORE (in-memory list, replaces the SQLite table)
# =========================================================

patients = []

def add_patient(record_json):
    record = json.loads(record_json)
    record["department"] = suggest_department(record.get("symptoms", ""))
    patients.append(record)
    return json.dumps(record)

def delete_patient(patient_id):
    global patients
    patients = [p for p in patients if p["id"] != patient_id]
    return json.dumps(patients)

def all_patients_json():
    return json.dumps(patients)

def load_patients_json(data_json):
    global patients
    patients = json.loads(data_json)

def preview_department(symptoms):
    return suggest_department(symptoms)
`;

const STORAGE_KEY = "smart-frame-hospital-patients";

const statusText = document.getElementById('pyStatusText');
const statusBox = document.getElementById('pyStatus');
const form = document.getElementById('patientForm');
const symptomsInput = document.getElementById('f-symptoms');
const suggestedDeptEl = document.getElementById('suggestedDept');
const tableBody = document.getElementById('patientTableBody');
const emptyNote = document.getElementById('emptyNote');
const searchBox = document.getElementById('searchBox');
const formNote = document.getElementById('formNote');
const saveBtn = document.getElementById('saveBtn');
const pySourceView = document.getElementById('pySourceView');

pySourceView.textContent = PY_SOURCE.trim();

let pyodide;
let allPatients = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function renderTable(filter = '') {
  const q = filter.trim().toLowerCase();
  const rows = allPatients.filter(p =>
    !q || p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
  );

  tableBody.innerHTML = '';
  emptyNote.style.display = rows.length ? 'none' : 'block';

  rows.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(p.id)}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.age)}</td>
      <td><span class="badge">${escapeHtml(p.department)}</span></td>
      <td>${escapeHtml(p.doctor || 'Not assigned')}</td>
      <td>${escapeHtml(p.room || 'Not assigned')}</td>
      <td><button class="row-delete" data-id="${escapeHtml(p.id)}" aria-label="Delete patient">✕</button></td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll('.row-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const json = pyodide.globals.get('delete_patient')(btn.dataset.id);
      allPatients = JSON.parse(json);
      persist();
      renderTable(searchBox.value);
    });
  });
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPatients));
}

async function init() {
  const timeout = setTimeout(() => {
    if (!pyodide) {
      statusText.textContent = 'Still loading… if this takes more than a minute, check your connection or try a different browser.';
    }
  }, 15000);

  try {
    pyodide = await loadPyodide();
    clearTimeout(timeout);
    await pyodide.runPythonAsync(PY_SOURCE);

    // restore any patients saved from a previous visit
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      pyodide.globals.get('load_patients_json')(saved);
      allPatients = JSON.parse(saved);
    }

    statusText.textContent = 'Python runtime ready — this form is now running real Python.';
    statusBox.classList.add('py-ready');
    symptomsInput.disabled = false;
    saveBtn.disabled = false;
    renderTable();
  } catch (err) {
    clearTimeout(timeout);
    statusText.textContent = 'Could not load the Python runtime (check your connection and reload).';
    statusBox.classList.add('py-error');
    console.error(err);
  }
}

symptomsInput.addEventListener('input', () => {
  if (!pyodide) return;
  const text = symptomsInput.value.trim();
  suggestedDeptEl.textContent = text
    ? pyodide.globals.get('preview_department')(text)
    : '—';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!pyodide) return;

  const id = document.getElementById('f-id').value.trim();
  if (allPatients.some(p => p.id.toLowerCase() === id.toLowerCase())) {
    formNote.textContent = `Patient ID "${id}" already exists — use a different ID.`;
    return;
  }

  const record = {
    id,
    name: document.getElementById('f-name').value.trim(),
    age: document.getElementById('f-age').value.trim(),
    gender: document.getElementById('f-gender').value,
    blood: document.getElementById('f-blood').value.trim(),
    allergies: document.getElementById('f-allergies').value.trim(),
    symptoms: document.getElementById('f-symptoms').value.trim(),
    doctor: document.getElementById('f-doctor').value.trim(),
    room: document.getElementById('f-room').value.trim(),
  };

  const savedJson = pyodide.globals.get('add_patient')(JSON.stringify(record));
  const saved = JSON.parse(savedJson);
  allPatients.push(saved);
  persist();
  renderTable(searchBox.value);

  formNote.textContent = `Saved — Python routed this patient to ${saved.department}.`;
  form.reset();
  suggestedDeptEl.textContent = '—';
});

searchBox.addEventListener('input', () => renderTable(searchBox.value));

init();

# A.I.S.W.
## AI Test Prep Web App (A.I.S.W.)

A Django-based web application for practicing exam questions and viewing results through a structured interface.<br><br>

### Features
User login page<br>
Dashboard interface<br>
Practice questions page<br>
Results display page<br>
Reusable template system (base.html)<br>
Basic interactivity using JavaScript<br>
UI enhanced with images and illustrations (.png)<br><br>

### Tech Stack
Backend: Django<br>
Language: Python<br>
Frontend: HTML, CSS, JavaScript<br><br>

### Structure
`A.I.S.W./`<br>
`│── app/`<br>
`│   ├── templates/app/`<br>
`│   │   ├── base.html`<br>
`│   │   ├── home.html`<br>
`│   │   ├── login.html`<br>
`│   │   ├── dashboard.html`<br>
`│   │   ├── practice.html`<br>
`│   │   └── results.html`<br>
`│   ├── views.py`<br>
`│   └── urls.py`<br>
`│`<br>
`│── static/`<br>
`│   ├── js/`<br>
`│   ├── images/   # .png assets (icons, illustrations)`<br>
`│   └── css/`<br>
`│`<br>
`│── AISW/`<br>
`│── manage.py`<br><br>

### Setup
`git clone <your-repo-link>`<br>
`cd <repo>`<br>
`pip install django`<br>
`python manage.py migrate`<br>
`python manage.py runserver`<br>

Open:

`http://127.0.0.1:8000/`<br><br>

### Troubleshooting
TemplateSyntaxError (`endblock`)<br>
    → Fix incorrect `{% block %}` structure<br>
Template not found<br>
    → Add templates directory in `settings.py`<br>
Static files not loading (CSS/JS/images)<br>
    → Use: `{% load static %}` in templates<br><br>

### Preview
Home
<img width="1851" height="934" alt="Screenshot 2026-03-10 121636" src="https://github.com/user-attachments/assets/50de70ff-36ae-419e-8120-1204fa899c9b" />
Dashboard
<img width="1849" height="933" alt="Screenshot 2026-03-10 121650" src="https://github.com/user-attachments/assets/bfd9af77-40c6-4f74-b703-6058e346bb88" />
Practice
<img width="1854" height="930" alt="Screenshot 2026-03-10 121704" src="https://github.com/user-attachments/assets/e72860c7-e5b3-44ab-953a-c381ebb157c3" /><br><br>

### Future Work
AI-generated questions<br>
User authentication system<br>
Performance tracking<br><br>

### Author

Charno A.<br><br>

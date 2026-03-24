# A.I.S.W.
## AI Test Prep Web App (A.I.S.W.)

A Django-based web application for practicing exam questions and viewing results through a structured interface.

### Features
User login page
Dashboard interface
Practice questions page
Results display page
Reusable template system (base.html)
Basic interactivity using JavaScript
UI enhanced with images and illustrations (.png)

### Tech Stack
Backend: Django
Language: Python
Frontend: HTML, CSS, JavaScript

### Structure
`A.I.S.W./
│── app/
│   ├── templates/app/
│   │   ├── base.html
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── practice.html
│   │   └── results.html
│   ├── views.py
│   └── urls.py
│
│── static/
│   ├── js/
│   ├── images/   # .png assets (icons, illustrations)
│   └── css/
│
│── AISW/
│── manage.py`

### Setup
`git clone <your-repo-link>
cd <repo>
pip install django
python manage.py migrate
python manage.py runserver`

Open:

`http://127.0.0.1:8000/`

### Troubleshooting
TemplateSyntaxError (`endblock`)
→ Fix incorrect `{% block %}` structure
Template not found
→ Add templates directory in `settings.py`
Static files not loading (CSS/JS/images)
→ Use: `{% load static %}` in templates

### Preview
Home
<img width="1851" height="934" alt="Screenshot 2026-03-10 121636" src="https://github.com/user-attachments/assets/50de70ff-36ae-419e-8120-1204fa899c9b" />
Dashboard
<img width="1849" height="933" alt="Screenshot 2026-03-10 121650" src="https://github.com/user-attachments/assets/bfd9af77-40c6-4f74-b703-6058e346bb88" />
Practice
<img width="1854" height="930" alt="Screenshot 2026-03-10 121704" src="https://github.com/user-attachments/assets/e72860c7-e5b3-44ab-953a-c381ebb157c3" />

### Future Work
AI-generated questions
User authentication system
Performance tracking

### Author

Charno A.

# System Wycen Usług Malarskich (Painting Service Estimation System)

Zaawansowana aplikacja Full-Stack służąca do kompleksowego zarządzania procesem wyceny usług malarskich i remontowych. System umożliwia klientom składanie zapytań poprzez podanie szczegółowych wymiarów pomieszczeń oraz wybór usług dodatkowych. Pracownicy mają możliwość weryfikacji zapytań, opierając się na zdefiniowanym cenniku, by ostatecznie zatwierdzać lub odrzucać estymacje. Projekt pozwala na automatyzację przepływu pracy pomiędzy klientem a firmą wykonawczą.

## Tech Stack

**Frontend:**
* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Lucide React

**Backend:**
* Python
* Django
* Django REST Framework (DRF)

**Baza Danych:**
* PostgreSQL
* Supabase

**Hosting / Deployment:**
* Frontend: Vercel
* Backend: Render

## Funkcjonalności

* **System ról i autoryzacji:** Podział na role (Klient, Pracownik) oparty o Token Authentication. Rejestracja pracowników z użyciem tajnego kodu firmy.
* **Składanie zapytań:** Formularz pozwalający klientom wprowadzić adres, wymiary powierzchni ścian i sufitów, liczbę drzwi i okien oraz dobór usług dodatkowych.
* **Zarządzanie wycenami:** Panel pracownika umożliwiający przypisywanie kosztów (kalkulacja automatyczna / ręczna poprawka) oraz aktualizację statusów wycen (nowa, wyceniona, zaakceptowana, odrzucona).
* **Dynamiczny cennik:** Skalowalny model usług i cen jednostkowych pozwalający na bieżące zarządzanie stawkami w systemie.

## Instrukcja uruchomienia lokalnego

### Klonowanie repozytorium

```bash
git clone <adres_repozytorium>
cd malowanieprojekt2
```

### Backend (Django)

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)

Otwórz nową kartę terminala i przejdź do folderu frontendowego:

```bash
cd frontend
npm install
npm run dev
```

## Zmienne środowiskowe

### Backend (`.env` w głównym katalogu dla Django)

```env
SECRET_KEY=
DEBUG=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
DATABASE_URL=
SECRET_COMPANY_CODE=
```

### Frontend (`.env` w głównym katalogu lub katalogu `frontend`)

```env
NEXT_PUBLIC_API_URL=
```

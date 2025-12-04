# 🌿 WellBalance — Wellness- & Ernährungstracker

**WellBalance** ist eine moderne Web-App zur Erfassung von Ernährung, Kalorien, Makronährstoffen, Wasser, Schlaf und allgemeinem Wohlbefinden.  
Das Projekt basiert auf **Next.js**, **Supabase** und einem integrierten **KI-Chatassistenten (Gemini)**.

---

## ✨ Hauptfunktionen

### 🔐 Authentifizierung (Supabase)
- Registrierung & Login per E-Mail und Passwort  
- Benutzerprofil in `auth.users` + `profiles`  

---

## 📊 Dashboard

Das Dashboard enthält mehrere interaktive Diagramme und Zusammenfassungen:

### **1. Today’s Progress (Tagesfortschritt)**
- Täglicher Kalorienverbrauch  
- Vergleich zu persönlichen Kalorienzielwerten  
- Navigation zwischen Tagen  

### **2. Macronutrients Balance (Makronährstoff-Balance)**
- Kreisdiagramm der Gesamtsumme aller Makros  
- Drei Fortschrittsbalken für: **Protein**, **Kohlenhydrate**, **Fette**  
- Abgleich mit Zielwerten aus dem Benutzerprofil  

### **3. Weekly Calorie Trend (Kalorienverlauf der letzten 7 Tage)**
- Liniendiagramm mit Tageswerten  
- Tooltip mit exakten Kalorienwerten  
- Hervorhebung des aktiven Tages  

---

## 🍽️ Meals & Foods

### Add Meal – Lebensmittel nach Kategorien  
Beim Hinzufügen einer Mahlzeit ist die Lebensmittelliste in Kategorien gegliedert:

- **Protein**  
- **Carbs**  
- **Fat**  
- **Vegetables**  
- **Fruits**  
- **Custom Foods** (vom Benutzer hinzugefügt)

Der Benutzer kann:
- Lebensmittel auswählen  
- Menge ändern  
- **eigene Lebensmittelkarten anlegen**, die in seiner Datenbank gespeichert bleiben  

---

## 🎯 Benutzerziele (Profile)

Auf der Seite **Profile** kann der Nutzer persönliche Tagesziele festlegen:

- Kalorien  
- Protein  
- Kohlenhydrate  
- Fett  

Diese Werte steuern:
- die visuelle Darstellung auf dem Dashboard  
- die Berechnung der Tagesfortschritte  
- die Antworten des KI-Assistenten  

---

## 🤖 KI-Chatassistent (Gemini)

Der intelligente Chat kann:

- Fragen zu Ernährung, Wellness und gesunder Lebensweise beantworten  
- unterschiedliche Gesprächsstile nutzen (neutral, casual, formal, pirate)  
- Nachrichtenverlauf automatisch lokal speichern  

### 🔍 Zugriff auf echte Benutzerdaten  
Der Chat verfügt über Tools, um Daten direkt aus Supabase abzurufen — darunter:

**• tägliche konsumierte Kalorien**  
**• Protein-, Kohlenhydrat- und Fettwerte**  
**• persönliche Zielwerte**  

Beispiele möglicher Fragen:
- „Wie viele Kalorien habe ich heute gegessen?“  
- „Wie viel Protein fehlt mir noch?“  
- „Vergleiche meine letzten 7 Tage.“  

---

## 💧 Water & Sleep

Die Seite **Water & Sleep** ist bereits vorgesehen, aber aktuell noch **für zukünftige Entwicklung reserviert**.

Geplante Erweiterungen:
- tägliche Wasseraufnahme  
- Schlafdauer & Schlafqualität  
- Diagramme & Trends  

---

## 🎨 UI-Design (kurz)

Erstellt in **Figma Make** mit Fokus auf Wellness-Ästhetik:

- sanfte Grüntöne  
- helle, minimalistische Komposition  
- Font **Inter**  
- abgerundete, ruhige UI-Elemente  

---

## 🧩 Technologiestack

### Frontend
- Next.js 
- React Server & Client Components  
- Tailwind CSS  
- Storybook 
- Recharts  

### Backend
- Supabase (Auth, PostgreSQL, RLS Policies)
- Automatisch generierte TypeScript-Typen 

### 🤖 KI
- Google Gemini (Chatassistent in der App)
- GitHub Copilot (Entwicklungsunterstützung)
- OpenAI GPT (zusätzliche KI-Hilfe während der Entwicklung)


---

## 🗄️ Datenbankschema (Kurzfassung)

Wesentliche Tabellen:
- `profiles`  
- `daily_logs`  
- `meals`  
- `meal_items`  
- `foods`  
- `user_targets`  
- `water_intake`  
- `sleep_logs`  

---

## ✍️ Autor

**Nataly Bova**  
Design, Entwicklung und KI-Integration  
GitHub: https://github.com/NatalyBova111

# AGH Data Agency Holding - Plateforme de Gestion des Stages

## 🎓 À propos

Plateforme de gestion des stages à distance développée pour **AGH Data Agency Holding SA**. Cette application permet de gérer les programmes de stage, les stagiaires, et de délivrer des badges numériques vérifiables pour les certifications.

## ✨ Fonctionnalités Actuelles

### 🔐 Authentification
- **Inscription et connexion** des utilisateurs (stagiaires)
- **Système de rôles** (Stagiaire, Administrateur)
- **Protection des routes** selon les rôles
- **Gestion automatique des sessions**

### 👨‍💼 Espace Administrateur (`/admin`)
L'administrateur a accès à un tableau de bord complet avec :

#### 📊 Statistiques en temps réel
- Nombre total de stagiaires
- Nombre de programmes actifs
- Nombre total de badges délivrés
- Nombre de stages complétés

#### 📋 Gestion des inscriptions (Enrollments)
- Visualisation de toutes les inscriptions aux stages
- **Validation des stages** et génération automatique de badges
- Mise à jour du statut des inscriptions (actif, complété, annulé)
- Affichage des informations détaillées (stagiaire, programme, dates, score)

#### 📚 Gestion des programmes
- **Création de nouveaux programmes** de stage
- Configuration des programmes : titre, domaine, description
- Définition de la durée (en semaines)
- Attribution des compétences requises
- Gestion du statut (actif/inactif)

#### 👥 Gestion des stagiaires
- Liste complète de tous les stagiaires inscrits
- Visualisation des informations de profil
- Affichage du rôle de chaque utilisateur

### 🎓 Espace Stagiaire (`/dashboard`)
- Visualisation des **programmes disponibles**
- **Inscription aux stages**
- Suivi de ses **propres inscriptions**
- Consultation de ses **badges obtenus**
- Mise à jour de son profil

### 🏅 Système de Badges Numériques
- Génération automatique de badges après validation par l'admin
- **Hash de vérification unique** pour chaque badge
- Métadonnées incluant la date de délivrance et l'émetteur
- Badges liés au profil du stagiaire et au programme complété

### 🎨 Design
- **Interface moderne** inspirée du logo AGH (bleu marine et orange cuivré)
- **Animations fluides** avec Framer Motion
- **Design responsive** pour tous les appareils
- **Mode sombre** disponible
- **Page de chargement** personnalisée au démarrage

## 🔒 Sécurité

### Accès Administrateur
- **Email admin** : `travail.apprentissage.2025@gmail.com`
- **Mot de passe** : `aghenterprise@2025`

### Protection des données
- **Row Level Security (RLS)** activée sur toutes les tables
- Vérification des rôles côté serveur avec `has_role()` function
- Isolation des données par utilisateur
- Validation automatique des permissions

## 🚀 Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build ultra-rapide
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants UI
- **Framer Motion** pour les animations
- **React Router** pour la navigation
- **React Query** pour la gestion des données

### Backend (Lovable Cloud - Supabase)
- **PostgreSQL** pour la base de données
- **Supabase Auth** pour l'authentification
- **Row Level Security** pour la sécurité
- **Triggers** pour l'automatisation
- **Functions** pour la logique métier

## 📁 Structure de la Base de Données

### Tables principales

#### `profiles`
Profils utilisateurs avec informations personnelles
- `id`, `full_name`, `email`, `avatar_url`, `created_at`

#### `user_roles`
Gestion des rôles (admin, intern)
- `id`, `user_id`, `role`

#### `internship_programs`
Programmes de stage disponibles
- `id`, `title`, `description`, `domain`, `duration_weeks`, `skills`, `status`, `created_at`

#### `enrollments`
Inscriptions des stagiaires aux programmes
- `id`, `user_id`, `program_id`, `status`, `start_date`, `end_date`, `performance_score`, `created_at`

#### `badges`
Badges numériques délivrés
- `id`, `user_id`, `program_id`, `verification_hash`, `image_url`, `metadata`, `issued_at`

## 🎯 Fonctionnalités à Développer

### 📈 Améliorations Prioritaires

1. **Système de Notifications**
   - Notifications en temps réel pour les stagiaires
   - Alertes pour les nouvelles inscriptions (admin)
   - Notifications de validation de stage

2. **Génération de Badges Visuels**
   - Création automatique d'images de badges personnalisées
   - QR code pour vérification externe
   - Téléchargement des badges au format PDF/PNG

3. **Système de Messagerie**
   - Chat entre admin et stagiaires
   - Messagerie de groupe par programme
   - Notifications de nouveaux messages

4. **Évaluations et Feedback**
   - Formulaires d'évaluation pour les stagiaires
   - Notes et commentaires des superviseurs
   - Rapport de performance détaillé

5. **Tableau de Bord Analytique**
   - Graphiques de progression
   - Statistiques avancées
   - Exports de données (Excel/CSV)

### 🔄 Améliorations Techniques

6. **Vérification Externe des Badges**
   - Page publique de vérification par hash
   - API de vérification pour intégrations tierces
   - Partage sur LinkedIn/réseaux sociaux

7. **Système de Documents**
   - Upload de documents pour les stages
   - Bibliothèque de ressources pédagogiques
   - Stockage sécurisé dans Supabase Storage

8. **Calendrier et Planning**
   - Vue calendrier des stages
   - Gestion des échéances
   - Rappels automatiques

9. **Recherche et Filtres Avancés**
   - Recherche multi-critères de programmes
   - Filtres par domaine, durée, compétences
   - Système de tags

10. **Internationalisation**
    - Support multilingue (FR/EN)
    - Adaptation des contenus
    - Gestion des fuseaux horaires

### 🎨 Améliorations UX/UI

11. **Onboarding**
    - Tutorial interactif pour nouveaux utilisateurs
    - Guide de prise en main
    - Tooltips contextuels

12. **Profil Enrichi**
    - CV en ligne
    - Portfolio de projets
    - Compétences et certifications

13. **Gamification**
    - Système de points
    - Niveaux de progression
    - Récompenses et achievements

## 📱 Pages de l'Application

- `/` - Page d'accueil (Landing)
- `/auth` - Connexion/Inscription
- `/dashboard` - Tableau de bord stagiaire
- `/admin` - Interface administrateur (accès restreint)

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+
- Compte Lovable Cloud (automatique)

### Démarrage
```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Déploiement
Le déploiement est automatique via Lovable. Chaque modification pousse automatiquement vers la production.

## 📝 Notes Importantes

- **Configuration auto** : Les variables d'environnement Supabase sont gérées automatiquement
- **Sécurité** : Ne jamais commit les fichiers `.env` ou les secrets
- **RLS** : Toujours tester les politiques de sécurité lors de modifications DB
- **Admin** : L'utilisateur admin est créé automatiquement lors de l'inscription avec l'email `travail.apprentissage.2025@gmail.com`

## Project info

**URL**: https://lovable.dev/projects/7cdc8810-25e5-4b84-b785-fce791c5e32e

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7cdc8810-25e5-4b84-b785-fce791c5e32e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 📞 Support

Pour toute question technique ou fonctionnelle, contactez l'équipe de développement.

---

**© 2024 AGH Data Agency Holding SA - Tous droits réservés**

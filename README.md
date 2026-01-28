# BUD App

## Cahier des charges

### Objectif
Le client souhaite disposer d’un outil permettant un suivi budgétaire efficace et sécurisé pour ses budgets récurrents.

### Exigences fonctionnelles
- **Gestion des ressources** : Ajouter, modifier et supprimer des ressources financières (revenus, entrées d’argent).
- **Gestion des dépenses** : Ajouter, modifier et supprimer des dépenses.
- **Calcul automatique** : Calcul en temps réel des montants totaux des ressources, des dépenses et du solde restant.
- **Statistiques** : Affichage de statistiques claires sur les ressources et les dépenses existantes (graphiques, totaux, répartition).
- **Authentification** : Accès sécurisé à l’application, réservé uniquement au propriétaire du compte.

### Exigences techniques
- Application web moderne, responsive et intuitive.
- Backend sécurisé pour la gestion des données et de l’authentification.
- Technologies : Next.js (Frontend), Laravel (Backend), SQLite.

---

## Description
BUD App est une application de suivi budgétaire innovante conçue pour vous aider à gérer vos finances comme dans Excel. Créée avec Next.js et Laravel, elle offre une interface moderne et intuitive pour suivre vos dépenses et revenus.

## Fonctionnalités
- ✨ Suivi budgétaire en temps réel
- 🚀 Interface intuitive et réactive
- 💡 Export et gestion des données financières

## Installation

### Prérequis
- Node.js v14+
- PHP 8.0+
- Composer
    - **Windows:** Téléchargez depuis [getcomposer.org](https://getcomposer.org) et exécutez l'installateur
    - **macOS/Linux:** 
        ```bash
        curl -sS https://getcomposer.org/installer | php
        sudo mv composer.phar /usr/local/bin/composer
        ```
    - **Vérification de l'installation de Composer :**
        ```bash
        composer --version
        ```
        Si Composer est bien installé, cette commande affichera la version installée.
- npm ou yarn

### Étapes
```bash
git clone https://github.com/djenidisimple/bud-app.git
cd bud-app
```

### Configuration Frontend
```bash
cd frontend
npm install
npm run build
```

### Configuration Backend
```bash
cd ../backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --database=sqlite
```

## Utilisation

**Windows:**
```bash
run.bat
```

**Autres systèmes:**
```bash
npm run dev
php artisan serve
```

## Structure du projet
```
bud-app/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   └── composer.json
├── run.bat
└── README.md
```

## Technologies utilisées
- Next.js (Frontend)
- Laravel (Backend)
- JavaScript/TypeScript
- PHP
- SQLite

## Contribution
Les contributions sont bienvenues ! Veuillez créer une branche pour vos modifications.

## Licence
MIT

## Contact
Pour plus d'informations, veuillez nous contacter.
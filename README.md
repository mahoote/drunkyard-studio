# Drunkyard Studio

A custom studio for the Drunkyard project. Used for easy implementation of to the database.
Directly connected to the Supabase API through the use of the Supabase JS library.

## Getting Started

-   Clone the repository
-   Run `npm install` to install the dependencies
-   Run `npm run prepare` to prepare the project with husky.
-   Add the `.env.local` and `.env.prod` files to the root of the project. You can use the `.env.example` file as a template.
-   Run `npm run dev` to start the development server

## New Game

This feature is used to create a new game in the database.
There is a lot of information that needs to be filled in order to create a new game. The information is divided into 3 sections: New Game, Advanced Settings and Translations.

## Edit Game

This page displays a list of all the existing games in the database. You can select one and will be able to edit the content of that game.

## Notifications

The notifications page is an interface for adding in-app alerts. You can also set new app versions so that the app will display an in-app alert regarding updating the app.

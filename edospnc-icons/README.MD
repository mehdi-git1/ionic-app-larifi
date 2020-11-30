Pour ajouter une icône au projet, voici les étapes à suivre :
1. Ajouter le svg au répertoire courant (edospnc-icons)
    a. le svg doit être carré, avec des marges minimes et noir (la couleur est changée par le CSS)
    b. le fichier doit être nommé en snake case afin que les classes CSS générées respectent la norme
2. Lancer la commande "npm run generate:webfont"
3. Dans le fichier edospnc-icons.scss, remplacer les "\" par des "/" dans les chemins pointants vers les fonts
4. Utiliser impérativement des span lors de l'utilisation de la webfont dans le HTML
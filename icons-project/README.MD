Le fichier Edospnc.json est un projet IcoMoon App.
Il peut être importé dans la webapp IcoMoon afin de rajouter des icones à la webFont du projet

Pour ajouter une icône à dans le projet, voici les étapes à suivre.
0- Ajouter le svg de l'icone dans le dossier ioncs-project
1- Télécharger l'icone dans un format SVG
2- Aller sur le site https://icomoon.io/
3- Cliquer sur l'onglet "IcoMoonApp"
4- Dans le menu (burger) à gauche, Cliquer sur "Manage Projects"
5- Cliquer à nouveau sur le menu (burger) à gauche et cliquer sur "Import Project", importer le fichier "EdossierPNC.json" sité à la racine dans le dossier icons-project. Une fois importé, cliquer sur "load". Les icones figurant dans le projet devraient apparaitre.

6- cliquer sur le bouton "Import Icons". (NB: Idéalement, le SVG doit avoir une forme carré et un background noir)
7- Selectionner toutes les icones du projet (Elles sont en jaunes lorsqu'elles sont sélectionnées)
8- Sur l'onglet en bas en droite (Font), cliquer sur "Download".
9- Remplacer le contenu du dossier font de l'application par le contenu du dossier téléchargé
10- Sur la page de téléchargement, le nom et le code des icônes sont affichés. Inclure les noms et codes des icones que vous avez ajouté dans le fichier icons.scss // @include makeIcon(nom-icone, 'code');
11- Cliquer sur le menu (burger) à gauche ensuite sur "Manage Projects"
12- Télécharger le nouveau fichier json du projet en cliquant sur "Download" situé entre "Load" et "Remove"
13- Remplacer le contenu du fichier "EdossierPNC.json" par le contenu du fichier téléchargé.



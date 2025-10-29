// src/data/managerNames.js

export const managerNames = [
    "Alexandre Dubois",
    "Marie-Claire Laurent", 
    "Thomas Moreau",
    "Isabelle Renault",
    "Philippe Blanc",
    "Camille Leroy",
    "Antoine Girard",
    "Élodie Fontaine",
    "Julien Mercier",
    "Sophie Gauthier",
    "Nicolas Bernard",
    "Céline Roux",
    "David Perrin",
    "Valérie Lemoine",
    "Marc Chevalier"
  ];
  
  export const getRandomManagerName = () => {
    return managerNames[Math.floor(Math.random() * managerNames.length)];
  };
  
  // Miko-themed status messages
  export const mikoStatusMessages = [
    "Tout fonctionne parfaitement! 🚀",
    "Production en cours 🍦",
    "Usine opérationnelle ✅",
    "Crème glacée en production ❄️",
    "Tous systèmes actifs 🔄"
  ];
  
  export const getRandomStatusMessage = () => {
    return mikoStatusMessages[Math.floor(Math.random() * mikoStatusMessages.length)];
  };
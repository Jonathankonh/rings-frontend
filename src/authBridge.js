// src/authBridge.js
// api.js braucht das Auth0-Token, ist aber keine Vue-Komponente und kann
// useAuth0() nicht direkt aufrufen (das funktioniert nur "drinnen" in
// Komponenten). App.vue registriert hier beim Start die echte Funktion,
// api.js ruft sie danach einfach auf, ohne selbst etwas von Auth0 zu wissen.
export const authBridge = {
    getAccessTokenSilently: null, // wird von App.vue gesetzt, sobald Auth0 bereit ist
}
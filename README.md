# Joc de Memory - Desenvolupament Web

Aquest projecte és una versió ampliada del clàssic joc de Memory, desenvolupat amb HTML5, CSS3 i JavaScript.

## 1. Introducció
El joc permet als usuaris posar a prova la seva memòria girant cartes. Aquesta versió incorpora un **Menú Principal** des d'on es pot accedir a dos modes de joc diferents, un apartat d'opcions per personalitzar la partida i un sistema de puntuacions per fomentar la competitivitat.

## 2. Modes de Joc i Opcions
* **Mode 1 (Clàssic):** El jugador pot escollir des de la pantalla d'Opcions si vol jugar amb parelles, trios o quartets de cartes. També pot triar quantes cartes úniques vol en joc (de 2 a 6).
* **Mode 2 (Supervivència):** És un mode progressiu i infinit. Es comença al nivell 1 (o el que s'hagi triat a opcions) i, en guanyar, s'avança automàticament al següent nivell. A cada nivell augmenta la dificultat: s'afegeixen més cartes, s'amplia la mida dels grups a trobar (fins a quartets), es redueix el temps de memorització inicial i augmenta la penalització per error.

## 3. Disseny i Part Artística
La interfície s'ha dissenyat des de zero utilitzant CSS, amb un esquema de colors fosc (blau marí) i detalls en vermell (`#e94560`) que li donen un aspecte modern.
Per a la **part artística**, totes les cartes s'han generat internament utilitzant codi **SVG** dins del mateix arxiu JavaScript.

## 4. Implementació Tècnica
* **Emmagatzematge:** S'ha utilitzat tant `localStorage` com `sessionStorage` per gestionar l'estat del joc. `localStorage` s'utilitza per guardar les opcions globals, les partides guardades manualment i el rànquing del Mode 2. `sessionStorage` s'encarrega de mantenir vius l'àlies del jugador, el mode de joc actual i la progressió del Mode 2 entre recàrregues de pàgina.
* **Guardar i Carregar:** S'ha corregit i ampliat el sistema de guardar partida, assegurant que en carregar una sessió prèvia el joc respecti l'estat exacte de cada carta.

## 5. Reptes i Solucions
Durant el desenvolupament, un dels reptes més grans va ser el comportament del **cache** del navegador, que impedia que els canvis als arxius JavaScript i CSS es reflectissin a la pantalla. 
Per solucionar-ho, simplement em vaig informar per internet per buscar diverses solucions.

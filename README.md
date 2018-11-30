# Tomb of Echoes

**Tekijät:** Henri Mäkelä, Jussi Surma-Aho
**Kurssit:** TTMS0500, Web-ohjelmointi; TTMS0900, Web-palvelinohjelmointi
**Päivämäärä:** 30.11.2018

## 1.1. Yleisesti

Tomb of Echoes on prototyyppi lyhyestä kauhupelistä, jossa "voittamisen" tai pistemäärien tavoittelun sijaan koetaan lyhyt elämys. Pelissä päähahmo on joutunut tyhjään huoneeseen, josta ei ole pääsyä ulos. Huoneesta löytyy viestejä, joita muut pelaajat ovat jättäneet, ja pelaaja itse voi myös kirjoittaa viestejä. Peli suunniteltiin nimenomaan liittyvien kurssien arviointikriteerejä täyttäväksi.

## 1.2. Alkuperäinen suunnitelma

Pelin alkuperäinen suunnitelma löytyy [Wiki-sivulta](https://github.com/Sahoju/Tomb-of-Echoes/wiki/Alkuper%C3%A4inen-suunnitelma). Ajatus pelistä hieman kehittyi kehityksen aikana, joten tässä on kärjistetysti ideaa, minkälainen peli tällä hetkellä ajatellaan tulevan:
1. Aivan pelin alussa tehdään yhteys kaikkiin ääni-, kuva-, teksti- ja kooditiedostoihin sekä otetaan tietokannasta kaikki tarvittava tieto, ettei kesken pelin tarvitse ladata mitään. Kun peli on ladattu, pystyy pelaaja aloittamaan pelin painamalla Start-painiketta.
1. Ruudulla esitetään alkuvideo, jossa selitetään pelin tapahtumien taustaa. Videon suunniteltu pituus oli noin kaksi minuuttia, jonka aikana ilmestyy viisi kuvaa animointineen (kaikki animoinnit koodattu jQueryllä). Lisäksi taustalla soi musiikki ja kuuluu puhetta.
1. Videon jälkeen varsinainen peli alkaa. Huone on 3 * 3 ruutua suuri, ja pelaaja liikkuu ruutu kerrallaan painamalla nuolinäppäimiä tai näytössä oleviin nuoli-ikoneihin.
1. Peli jakautuu vaiheisiin. Eri vaiheiden aikana voi tehdä ja tapahtua seuraavia:
	1. Lukea satunnaisesti tietokannasta haettuja viestejä, jotka ilmestyvät satunnaisiin ruutuihin
	1. Kirjoittaa viestin johonkin ruutuun, joka tallentuu tietokantaan
	1. Kuulla satunnaisesti pelin aikana ääniä. Mitä pitemmällä pelissä ollaan, sitä useammin niitä kuuluu
	1. Aina, kun joku muu pelaaja kirjoittaa viestin, kuuluu siitä ääni toisille samaan aikaan pelaaville
	1. Kun peli jatkuu pitemmälle, tulee peliruudun eteen pikkuhiljaa enemmän ja enemmän noise-efektiä
1. Kun peli loppuu, eli tietyn verran aikaa on kulunut ja/tai tietyn verran viestejä on luettu, alkaa loppuvideo, jossa vilahtaa vain yksi kuva sankan noise-efektin takana.
1. Loppuvideon jälkeen pelaajalta kysytään nimi, pelille arvosana tähtinä ja sanallinen arvio. Arvio ei ole pakollinen.

## 2.1. Toteutus

Pelistä toteutettiin hyvä osa näiden aikarajoitusten puitteissa. Tiedostojen kansiorakenne on seuraava:

asdasd

Seuraavissa kappaleissa selitetään pelin toteutusta.

## 2.2. Pelin initialisointi

Kun sivu avataan, peli alkaa heti luomaan yhteyksiä tarvittavien tietojen välille. Tällä hetkellä yhteys luodaan kuviin ja tietokantaan, josta haetaan kolme tekstiä näytettäväksi tälle pelisessiolle.

### 2.2.1. Kuvien lataus

Sivun avautuessa käynnistetään loadfiles.php-skripti, joka hakee img-kansiosta kuvien nimet ja niiden määrän, ja palauttaa ne Json-muodossa (hupaisaa kyllä, mukaan lasketaan myös directions.txt, joka on vain dokumentointia varten tehty tiedosto). Jos tiedostoja on, käynnistetään funktio preload, johon viedään skriptistä saadut tiedostojen nimet.

preload-funktiossa lasketaan pois kaksi ensimmäistä json-tiedon hankkimaa "tiedostoa:" "." ja "..". Varmuutta ei ole, mutta ne lienevät jotain kansiorakenteeseen liittyviä "tiedostoja," joita ei kuitenkaan ole oikeasti olemassa; ne siis jätetään huomioimatta.

### 2.2.2. Tekstien lataus

Tekstit ladataan toisella Ajax-pyynnöllä, joka ajaa getmessages.php-skriptin. Kyseinen skripti taas kutsuu db_fns.php-tiedostosta getTexts-funktiota. db_fns.php-tiedostossa otetaan ensiksi yhteys tietokantaan PDO-luokan toiminnoilla, jonka onnistuessa siirrytään getTexts-funktioon.

getTexts-funktio kutsuu getLocations-funktiota, joka generoi kolme satunnaista ruutua, joille teksti tullaan asettamaan. Mihinkään ruutuun ei tule yhtä enempää viestiä. Sijaintien avulla tietokannassa suoritetaan kysely kaikista teksteistä kyseisillä sijainneilla, joista sitten satunnaisesti valitaan yksi jokaista sijaintia kohden. Sijaintien ja sisällön lisäksi pakettiin laitetaan mukaan pelin vaihe, jota ei ole vielä toteutettu. Toistaiseksi vaiheita oletetaan olevan kolme, joten yhteensä yhdeksän viestiä paketoidaan Json-muotoon ja palautetaan init.js-tiedostoon.

### 2.2.3. Latausprosentit

Pelissä oleva prosenttiluku viittaa latauksen edistystä. Luku alkaa nollasta, johon lisätään aina 1/(kuvien määrä) * 100, kun yksi kuva ladataan. Toiminto ei kuitenkaan pelitä kunnolla, sillä pelin alussa, kun otetaan yhteyttä palvelimeen ja tietokantaan, ruudussa ei näy mitään. Lisäksi tekstien latausta ei olla huomioitu ollenkaan, eikä ääni- ja tekstitiedostoja ole ladattavissa ollenkaan. Toimintoa tulee siis laajentaa pitemmälle myöhemmin.

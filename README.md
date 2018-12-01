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

**Tiedostot:** init.js, loadfiles.php, kaikki kuvat img-kansiossa

Sivun avautuessa käynnistetään loadfiles.php-skripti, joka hakee img-kansiosta kuvien nimet ja niiden määrän, ja palauttaa ne Json-muodossa (hupaisaa kyllä, mukaan lasketaan myös directions.txt, joka on vain dokumentointia varten tehty tiedosto). Jos tiedostoja on, käynnistetään funktio preload, johon viedään skriptistä saadut tiedostojen nimet.

preload-funktiossa lasketaan pois kaksi ensimmäistä json-tiedon hankkimaa "tiedostoa:" "." ja "..". Varmuutta ei ole, mutta ne lienevät jotain kansiorakenteeseen liittyviä "tiedostoja," joita ei kuitenkaan ole oikeasti olemassa; ne siis jätetään huomioimatta.

asdasd Henri muokkaa

### 2.2.2. Tekstien lataus

**Tiedostot:** init.js, getmessages.php, db_fns.php(, texts.txt)

Tekstit ladataan toisella Ajax-pyynnöllä, joka ajaa getmessages.php-skriptin. Kyseinen skripti taas kutsuu db_fns.php-tiedostosta getTexts-funktiota. db_fns.php-tiedostossa otetaan ensiksi yhteys tietokantaan PDO-luokan toiminnoilla, jonka onnistuessa siirrytään getTexts-funktioon.

getTexts-funktio kutsuu getLocations-funktiota, joka generoi kolme satunnaista ruutua, joille teksti tullaan asettamaan. Mihinkään ruutuun ei tule yhtä enempää viestiä. Sijaintien avulla tietokannassa suoritetaan kysely kaikista teksteistä kyseisillä sijainneilla, joista sitten satunnaisesti valitaan yksi jokaista sijaintia kohden. Sijaintien ja sisällön lisäksi pakettiin laitetaan mukaan pelin vaihe, jota ei ole vielä toteutettu. Toistaiseksi vaiheita oletetaan olevan kolme, joten yhteensä yhdeksän viestiä paketoidaan Json-muotoon ja palautetaan init.js-tiedostoon.

Alunperin tietokantaan tallennettiin vain tekstien indeksinumero, jonka avulla texts.txt-tiedostosta haettiin tekstit. Tämä toteutus koettiin hoopoksi, sillä koko kirjoitusmekanismista ei tulisi kovinkaan merkityksellinen, jos tekstit kuitenkin tulevat olemaan samankaltaisia kaikki. Nykyään kirjoitetut tekstit menevät tietokantaan sellaisenaan. Lisää asiasta kohdassa 2.4.

Tietokantayhteys tuli aluksi tehtyä mysqli-komennoilla, mutta opettajan suostuttelemisen myötä komennot vaihdettiin PDO:hon.

### 2.2.3. Latausprosentit

**Tiedostot:** init.js

Pelissä oleva prosenttiluku viittaa latauksen edistystä. Luku alkaa nollasta, johon lisätään aina 1/(kuvien määrä) * 100, kun yksi kuva ladataan. Toiminto ei kuitenkaan pelitä kunnolla, sillä pelin alussa, kun otetaan yhteyttä palvelimeen ja tietokantaan, ruudussa ei näy mitään. Lisäksi tekstien latausta ei olla huomioitu ollenkaan, eikä ääni- ja tekstitiedostoja ole ladattavissa ollenkaan. Toimintoa tulee siis laajentaa pitemmälle myöhemmin.

## 2.3. Pelissä liikkuminen ja pelaajan sijainnin määrittäminen

**Tiedostot:** game.js, tile.js, player.js
asdasd Henrin juttu

## 2.4. Teksti-ikkuna

**Tiedostot:** game.js

Teksti-ikkuna ilmestyy näyttöön, kun joko suurennuslasi- tai kynäikonia painetaan. Ikkuna ilmestyy pienellä animaatiolla, ja lähtee pois joko painamalla samaa ikonia uudestaan tai jonnekin muualle kuin ikoneihin tai ikkunaan itsessään. Jos painaa toista ikonia kuin millä ikkuna avattiin, ikkunan sisältö vaihtuu vastaavasti.

### 2.4.1. Tekstien luku

**Tiedostot:** game.js(, texts.txt)

Kohdassa 2.2.2. selitettiin tekstien hausta. Kun pelaaja siirtyy kohtaan, minkä koordinaatit ovat samat kuin jonkin viestin, suurennuslasi ilmestyy näytölle. Sitä painaessa ilmestyy pienellä animaatiolla teksti-ikkuna, jossa lukee kyseinen viesti.

### 2.4.2. Tekstien kirjoitus

**Tiedostot:** game.js, writemessages.php, db_fns.php

Edellisen kohdan teksti-ikkuna ilmestyy myös kynäikonia painaessa; ruutuun ilmestyy tekstikenttä ja nappi. Tekstikenttään kirjoittaessa jokaisella kirjaimella on 30 %:n mahdollisuus, että kirjain muuttuu joksikin muuksi merkiksi. Merkkilistalle on oma muuttujansa chars, josta satunnaisesti valitaan yksi aina, kun osutaan 30 %:n kohdalle.

Nappia painaessa tekstikentässä oleva teksti ja pelaajan koordinaatit viedään tietokantaan. Tekstin sisällölle ei ole toistaiseksi mitään tarkistuksia, joten pelin ja tietokannan voi helposti hajottaa.

Lisäksi funktiolle määriteltiin toiminnallisuus pastettuja tekstejä varten: jokaisen merkin lisäyksen yhteydessä päivitetään lengthbefore-muuttujaa vastaamaan nykyisen kirjoituksen pituutta. Kun muuttujan ja uuden kirjoituksen pituuden ero on enemmän kuin yksi, leikkaa funktio tekstin kahtia edellisen kirjoituksen viimeisestä merkistä. Tämän jälkeen jokainen uudella kirjaimella on jälleen 30 %:n mahdollisuus, että se muuttuu muuksi. Lopuksi lengthbefore-muuttujaa päivitetään jälleen.

Toiminnosta keskusteltiin jälkikäteen, ja olisi todennäköisesti fiksumpaa vain estää tekstin liittäminen. Lisäksi se ei edes toimi, tosin testitiedostossa se toimi ihan oikein.

## 2.5. Alku- ja loppuvideot

**Tiedostot:** moviebeginning.js, movieending.js, grained.min.js

Videoita lähdettiin alussa työstämään, mutta kunnollisen grafiikan puutteessa jätettiin hyvin laihaksi toteutukseksi.

moviebeginning.js-tiedostossa hieman testattiin, miten kuvia voidaan animoida jQueryn avulla. movieending.js-tiedostossa testattiin sekä ulkoista grained-kirjastoa sekä yhtäaikaista animointia. Tulos oli hieman yllättävä, sillä animointi jQueryn avulla on helpompaa kuin oletettua.

## 2.6. Reaaliaikatoiminnallisuus

Henri-cha~n

## 3. Ajan käyttö

Ajan mittaus aloitettiin rehdisti, mutta jossain vaiheessa se jäi. Hupsista. Kaikki ajat ovat viitteellisiä.

**Suunnittelu:** 3h
**Alullepano (index.htm ja yksinkertainen initialisaatio):** 4h
**Videot:** 2h
**Tietokanta ja sen toiminnallisuudet:** 13h
**Pelaajan liikkuminen ja kentän luominen:** 20h
**Teksti-ikkuna ja sen toiminnallisuudet:** 8h
**Reaaliaikatoiminnallisuus:** 2h
**Spagettikoodin korjaus:** 10h
**Kämäset graffat:** 4h
**Yhteensä:** 66h

Molemmat siis tekivät noin 33h. Tuntuu vähäiseltä.

## 4. Pohdinta ja jatkokehitys

Pelinteko alkoi hyvin. Paljon oli intoa suunnittelussa ja itse pelin tekoa varten, mutta tahoista riippumattomista syistä työtä päästiin aloittamaan vasta 19.11., eli kaksi viikkoa ennen palautusta. Jussi suunnitteli työn aluille, ja Henriltä tuli paljon ehdotuksia lisäyksiin tai muokkauksiin.

Jussille tämä oli ensimmäinen varsinainen kokemus tiimityöstä; kaikki aikaisemmat projektityöt olivat itsenäisesti tehtyjä. Hieno kokemus, toivottavasti tulevaisuudessa tulee lisää tiimitöitä. jQuery-PHP-kombinaatiolla oli mukava tehdä tätä. Sinänsä olisin halunnut käyttää Reactia ja Laravelia, mutta ajansäästösyistä ei kyennyt, ja ne eivät taida olla kovinkaan hyviä työkaluja tällaisen pelin tekemiseen.

Henri asdasd

Molemmat ovat erittäin halukkaita jatkamaan peliä eteenpäin omalla ajalla. Työhön ollaan saatu mukaan graafikko, joka luo paremmat grafiikat. Dokumentaatiossa mainittuihin heikkoja kohtia tullaan korjaamaan ja kehittämään eteenpäin. Lisäksi suunniteltuja toiminnallisuuksia, joita jäi toistaiseksi pois, tullaan lisäämään, kuten pelin vaiheet. Tietokanta tullaan siirtämään omalle vuokratulle palvelimelle ja itse peli omalle domainille. Tavoitteena on saada aikaan kokonaisuus, jota ihmiset mielellään pelaavat ja josta voimme olla ylpeitä.

# Tomb-of-Echoes

## yleisesti
- "kauhupeli", jonka tarkoituksena ei ole voittaa peli, vaan kokea lyhyt kokemus/elämys
- pelaajat voivat jättää ennalta määrättyjä viestejä, jotka jakautuvat muille pelaajille
- teoriassa jokaisen eri pelaajan pelikerta on erilainen, sillä pelin sisältö muuttuu hieman, kun pelaajat jättävät viestejä

## pelin avaus
- init: ladataan kaikki kuvat, tekstit (tarviiko muuta?)
- latauksen jälkeen odotetaan käyttäjältä varmistusta, että voidaan jatkaa

## alkuvideo
- 3-5 kuvaa, puhetta, musiikkia, mahdollisia ääniefektejä
- kuvasta toiseen siirrytään transition-efekteillä
- kuvia animoidaan pienellä liuku- ja zoomausefekteillä

## pelin ulkoasu
- ensimmäisen persoonan kuvakulma, mutta ei kuitenkaan 3D
- oikeassa alalaidassa nuolipainikkeet, joilla voidaan liikkua, mutta voi myös liikkua näppäimistön nuolinäppäimillä
- pelissä liikutaan dungeon crawler tyyliin: alue koostuu neliöistä, joihin liikutaan nuolinäppäintä painaessa
- jokaisessa neliössä voi katsoa neljään suuntaan
- jokaisessa neliössä näkyvä grafiikka on yksittäinen kuva, joka vaihtuu sitä mukaan, missä kohtaa pelaaja on ja mihin suuntaan hän katsoo
- pelikenttä on 3x3 neliötä, joista voi katsoa neljään eri suuntaan
- ylhäällä kolme painiketta "read," "write" ja "inspect" (riippuen pelin vaiheesta)
- tekstin ilmestyessä ruudulle sen alle tulee läpikuultava musta boksi
- pelin aikana taustalla kuuluu matalaa kohinaa

## pelin kulku
- pelissä on kolme "vaihetta," joka vaihtuu aina, kun pelaaja on käynyt jokaisella neliöllä ainakin kerran
- jokaisella neliöllä voidaan tehdä maksimissaan kolmea asiaa, riippuen pelin vaiheesta:
	- "read": pelaaja lukee lattiasta, seinistä ja/tai pilareista, mitä viestejä muut ovat jättäneet. mahdollista ensimmäisestä vaiheesta lähtien
		- kolmannessa vaiheessa kirjoitusten kirjaimet vaihtavat paikkaa keskenään ja niiden kapitaalisuus muuttuu satunnaisesti
	- "write": pelaaja jättää lattialle, seinälle tai pilarille viestin, joka näkyy muille pelaajille. viesti valitaan listalta ennalta määritetyistä vaihtoehdoista, jotka muuttuvat riippuen pelin vaiheesta. kirjoitus on mahdollista toisesta vaiheesta alkaen. kirjoitukset tallennetaan tietokantaan
	- "inspect": pelaaja tutkii ympäristöään (eli sitä neliötä, missä ollaan sinä hetkenä). ruutuun ilmestyy pelattavan hahmon ajatuksia.
		- mahdollista ensimmäisestä vaiheesta lähtien, mutta korvautuu "despair" vaihtoehdolla kolmannessa vaiheessa. toimii samalla tavalla kuin "inspect," mutta pelattava hahmo käyttäytyy epätoivoisemmin
		- "despair" toimintoa käytettäessä tietokantaan välittyy ilmestyvästä tapahtumasta viesti, jota levitetään muille pelaajille. näitä viestejä, esim. voihkintaa, seinään hakkaamista ym. voi kuulla pelin aikana satunnaisesti missä vaiheessa tahansa
- jokaisen vaiheen jälkeen pelin ylle lisätään noise-efektiä, jolla ilmaistaan pelattavan hahmon sekavan tilan vahvistumista
- jos samaan aikaan peliä pelaa kaksi tai useampi pelaaja, ja joku heistä jättää viestin, peliin ilmestyy lyhyt viesti tapahtumasta, esim. kuuluu raapimista, ja pelattava hahmo kommentoi sitä

## pelin lopetus
- pelaaja kuolee, kun kolmas vaihe päättyy
- kolmannen vaiheen päättyessä ruutu täyttyy miltei kokonaan noise-efektillä; vain vähän näkee enää läpi
- ruutuun tulee pelattavan hahmon viimeisiä ajatuksia
- efektin alle näytetään yksi kuva, sitten ruutu menee mustaksi
- roll the credits

## tietokanta
- jokainen jätetty viesti tallennetaan tietokantaan
- tietokannasta valitaan satunnaisesti 9 viestiä, mitkä annetaan jokaiselle pelin neliölle
- id
- sijainti
- viestin sisältö (teksti)

## tarvittavat assetit
- grafiikka
	- alkuvideo: 3 - 5 kuvaa
		- esim. stock photoja, screenshotteja elokuvista tai peleistä
		- lisätään efektejä päälle, esim. vahvaa blurria
	- neliöitä 9, jokaisesta voi katsoa neljään suuntaan: 9*4 = 36 kuvaa yhteensä
		- piirretään käsin; ei tarvitse olla kovinkaan yksityiskohtaisia
		- pitää kuitenkin saada sulautumaan ympäristöön
	- lopetus: 1 kuva
- ääni
	- alkuvideolle puhe ja musiikki
	- pelille:
		- ambient
		- kohinaa noise-efektille
		- askel neliöltä toiselle liikkumiselle
		- "despair" ääniefektejä

## kuvei
![Ilman tekstiä](https://student.labranet.jamk.fi/~L4929/ttms0500/ht/view_notext.png)

|||||||||||||||||||||||||||||||

![Tekstin kanssa](https://student.labranet.jamk.fi/~L4929/ttms0500/ht/view.png)

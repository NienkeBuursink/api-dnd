// MARK: LOTR
// https://the-one-api.dev/
const baseurlLOTR = "https://the-one-api.dev/v2"
const LOTRendPoint = "/character"
const LOTRurl = baseurlLOTR + LOTRendPoint

const responseLOTR = await fetch(LOTRurl, {
	headers: {
		Authorization: "Bearer R3RdrJt_7I3rzH3Pf7A8",
	},
})

const lotrCharacters = (await responseLOTR.json()).docs

const famousOnly = [
	"Legolas",
	"Aragorn II Elessar",
	"Frodo Baggins",
	"Samwise Gamgee",
	"Meriadoc Brandybuck",
	"Peregrin Took",
	"Gandalf",
	"Gollum",
	"Boromir",
	"Thranduil",
	"Gimli",
	"Thorin II Oakenshield",
	"Treebeard",
	"Elrond",
	"Smaug",
	"The King of the Dead",
]

// Handmatige mapping LOTR name → Wikia image URL
const characterImages = {
	Legolas:
		"https://preview.redd.it/did-anyone-bother-to-tell-thranduil-that-legolas-joined-the-v0-9m3fnvpjficf1.jpeg?width=640&crop=smart&auto=webp&s=9ec5258ad31eb3a68577a27ca203e8667171024d",
	"Aragorn II Elessar":
		"https://i.redd.it/what-might-have-been-the-reason-behind-aragorns-appearance-v0-gtvhitn24zif1.jpg?width=1500&format=pjpg&auto=webp&s=3054c4a34a2dac8cf987cfd7d83469f8cb94f967",
	"Frodo Baggins":
		"https://static.wikia.nocookie.net/lotr/images/3/32/Frodo_%28FotR%29.png/revision/latest?cb=20221006065757",
	"Samwise Gamgee":
		"https://www.theonering.net/torwp/wp-content/uploads/2013/05/samwise-gamgee.jpg",
	"Meriadoc Brandybuck":
		"https://i.pinimg.com/736x/49/79/7e/49797ef02fa77784578a794e5362be44.jpg",
	"Peregrin Took":
		"https://geekmom.com/wp-content/uploads/2018/03/pippinfeature.jpg",
	Gandalf:
		"https://variety.com/wp-content/uploads/2024/09/Gandalf.jpg",
	Gollum: "https://www.shutterstock.com/editorial/image-editorial/N9Tdk7y9NbjcEd11NDUzMg==/andy-serkis-440nw-5886036af.jpg",
	Boromir: "https://media.graphicpolicy.com/2021/10/OneDoesNotSimply.jpg",
	Thranduil:
		"https://static.wikia.nocookie.net/lotr/images/3/32/BOTFA_-_Promotional_for_Thranduil.jpg/revision/latest?cb=20150409044136",
	Gimli: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2024/05/gimli-rohan-lotr.jpeg?q=49&fit=contain&w=750&h=422&dpr=2",
	"Thorin II Oakenshield":
		"https://static.wikia.nocookie.net/ouatff/images/d/dc/ThorinOUAT.png/revision/latest?cb=20171114214540",
	Treebeard:
		"https://static0.gamerantimages.com/wordpress/wp-content/uploads/2021/08/lord-of-the-rings-ents-feature-treebeard-picture-bright.jpg?q=50&fit=crop&w=825&dpr=1.5",
	Elrond: "https://static.wikia.nocookie.net/tolkien-online/images/d/da/Elrond.jpg/revision/latest?cb=20170411084525&path-prefix=nl",
	Smaug: "https://blog.flametreepublishing.com/hs-fs/hubfs/smaug-the-hobbit-1.jpg?width=1131&height=566&name=smaug-the-hobbit-1.jpg",
	"The King of the Dead":
		"https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/05/dead-army-king.png?q=49&fit=contain&w=750&h=422&dpr=2",
}

const characterOverrides = {
	"The King of the Dead": { race: "Zombie" },
	Treebeard: { race: "Awakened Tree" },
	Smaug: { race: "Ancient Red Dragon" },
	Gandalf: { speed: 35 },
}

const famousCharacters = lotrCharacters
	.filter((character) => famousOnly.includes(character.name))
	.map((character) => ({
		...character, // kopieert alle properties van het originele karacter
		...characterOverrides[character.name],
		image: characterImages[character.name] ?? null,
	}))









// MARK: DnD
// https://5e-bits.github.io/docs/
const baseurlDND = "https://www.dnd5eapi.co/api/2014"

const DNDendPointRaces = "/races"
const DNDurlRaces = baseurlDND + DNDendPointRaces
const responseDNDraces = await fetch(DNDurlRaces)
const dndRaces = await responseDNDraces.json()

const DNDendPointMonsters = "/monsters"
const DNDurlMonsters = baseurlDND + DNDendPointMonsters
const responseDNDmonsters = await fetch(DNDurlMonsters)
const dndMonsters = await responseDNDmonsters.json()








//MARK: combine APIs
const dndValidNames = [
	...dndRaces.results.map((r) => r.name.toLowerCase()),
	...dndMonsters.results.map((m) => m.name.toLowerCase()),
	"maiar",
]
// console.log(dndValidNames)

const charactersWithRaceOrMonster = famousCharacters.filter((character) => {
	const race = (character.race ?? "").toLowerCase()
	const mappedRace = race === "hobbit" ? "halfling" : race
	return dndValidNames.includes(mappedRace)
})

// console.log(charactersWithRaceOrMonster)



async function addSpeedToCharacters(characters) {
  const charactersWithSpeed = []

  	for (const character of characters) {
		let race = (character.race ?? "").toLowerCase()
		if (race === "hobbit") race = "halfling"

		const speed = await getCharacterSpeeds(race) ?? character.speed

		const convertedSpeed = ((parseInt(speed) * 0.3048) * 10 * 60 / 1000).toFixed(1) + " Km/H" // ChatGPT prompt: Hoe zorg ik ervoor dat hij afrond naar decimalen

		charactersWithSpeed.push({
		...character,
		speed: convertedSpeed ?? character.speed ?? null,
		})
  	}

  return charactersWithSpeed
}



async function getCharacterSpeeds(race) {
	const raceEndpoint = dndRaces.results.find((r) => r.name.toLowerCase() === race)?.url
	const monsterEndpoint = dndMonsters.results.find((m) => m.name.toLowerCase() === race)?.url

	if (raceEndpoint) {
		const responseRace = await fetch("https://www.dnd5eapi.co" + raceEndpoint)
		const race = await responseRace.json()
		const raceSpeed = race.speed
		return raceSpeed
	}

	if (monsterEndpoint) {
		const responseMonster = await fetch("https://www.dnd5eapi.co" + monsterEndpoint)
		const monster = await responseMonster.json()
		const monsterSpeed = monster.speed.walk
		return monsterSpeed
	}

	return null
}






export const famousCharactersWithSpeed = await addSpeedToCharacters(charactersWithRaceOrMonster)
// console.log(famousCharactersWithSpeed)
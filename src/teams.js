const stats = [["hp", "hp"], ["attack", "atk"], ["defense","def"], ["specialAttack", "spAtk"], ["specialDefense", "spDef"], ["speed","spe"]]
let roster = {};

const pokemon_team_grid = document.querySelector(".pokemon_team_grid")
const pokemon_team_sheet = pokemon_team_grid.getElementsByTagName('section')
const teams_list = document.querySelector("#saved_teams");
document.querySelector("#load_team").addEventListener("click", () =>{
    loadTeam(teams_list.value);
})

document.querySelector(".pokemon_team_grid").addEventListener("change", ()=> {
    localStorage.setItem("CurrentTeam", JSON.stringify(saveTeam()))
})

document.querySelector("#clear").addEventListener("click", () => {
    localStorage.setItem("CurrentTeam", '')
    location.reload()
})

document.querySelector("#save_team").addEventListener("click", () => {
    const teamName = document.querySelector("#team_name").value.trim()
    if (!teamName || teamName == "Team Name") {alert("Please enter a team name"); return}
    localStorage.setItem(teamName, JSON.stringify(saveTeam()))
    localStorage.setItem("CurrentTeam", '')
    loadTeams();
    alert("Team Saved!")
})

function loadTeams(){
    teams_list.innerHTML = ""
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        teams_list.appendChild(new Option(key, key))
    }
}

async function loadRoster() {
    const response = await fetch("regM-C.json");
    if (!response.ok) throw new Error(`Roster request failed: ${response.status}`)
    let temp = await response.json();
    roster = temp[0]
    const pokemon_options = `<option value="none">Select a Pokemon</option>` + Object.keys(roster).map(name => `<option value="${name}">${name}</option>`)
    for (let i = 0; i < pokemon_team_sheet.length; i++){
        let selector = pokemon_team_sheet[i].querySelector("[data-field='pokemon']")
        selector.innerHTML = pokemon_options
        selector.addEventListener("change", () => {
            pokemonSelected(pokemon_team_sheet[i], selector.value)
            getPokemonPicture(pokemon_team_sheet[i], selector.value)
        })
    }
    loadTeams();
    if (localStorage.getItem("CurrentTeam") != null && localStorage.getItem("CurrentTeam") != ''){
        loadTeam("CurrentTeam");
    }
}

async function getPokemonPicture(teamNum, pokemonName){
    try {
        const formNames = {
            alolan: "alola",
            galarian: "galar",
            hisuian: "hisui",
            paldean: "paldea"
        };
        const nameParts = pokemonName.trim().split(/\s+/);
        const form = formNames[nameParts[0].toLowerCase()];
        const isRotomForm = nameParts.length > 1 && nameParts.at(-1).toLowerCase() === "rotom";
        const apiName = form
            ? `${nameParts.slice(1).join(" ")} ${form}`
            : isRotomForm
                ? `Rotom ${nameParts.slice(0, -1).join(" ")}`
                : pokemonName;
        const pokemonSlug = apiName.toLowerCase().replace(/\s+/g, "-");
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonSlug}`)
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const picture = data.sprites.other['official-artwork'].front_default;
        
        teamNum.querySelector("[data-field='pokemon_picture']").innerHTML = `<img src="${picture}" alt="${pokemonName}">`;

    } catch (error) {
        console.error("Failed to fetch Pokémon:", error);
        teamNum.querySelector("[data-field='pokemon_picture']").innerHTML = ""
    }
}

loadRoster();


function pokemonSelected(section, pkm){
    let evs = section.querySelector(".ev_pool")
    let moves = section.querySelector(".move_pool")
    let ability = section.querySelector(".ability")
    let nature = section.querySelector("[data-field='nature']")
    if (pkm != "none")
    {    
        const pokemon = roster[pkm]
        const stat_field_list = [evs.querySelector("[data-field='hp']"), evs.querySelector("[data-field='atk']"), 
            evs.querySelector("[data-field='def']"), evs.querySelector("[data-field='spAtk']"), evs.querySelector("[data-field='spDef']"),
            evs.querySelector("[data-field='spe']")]
        const stats_input_list = [evs.querySelector(`#pokemon_${section.id.at(-1)}_hp`), evs.querySelector(`#pokemon_${section.id.at(-1)}_atk`),
            evs.querySelector(`#pokemon_${section.id.at(-1)}_def`),evs.querySelector(`#pokemon_${section.id.at(-1)}_spAtk`),
            evs.querySelector(`#pokemon_${section.id.at(-1)}_spDef`),evs.querySelector(`#pokemon_${section.id.at(-1)}_spe`)
        ]
        for (let i=0; i < stats_input_list.length; i++){
            stats_input_list[i].addEventListener("change", (e) =>{
            if (e.currentTarget.value > 32){e.currentTarget.value = 32};
            applyStat(e.currentTarget, pokemon["baseStats"][`${stats[i][0]}`], stat_field_list[i], nature, stats[i][1])
        })
        }
        renderStats(stat_field_list, pokemon, stats_input_list, nature)

        nature.addEventListener("change", () =>{
            renderStats(stat_field_list, pokemon, stats_input_list, nature)
        })

        let available_moves = '<option value=""none>None</option>' +pokemon["movepool"].map(name => `<option value="${name}">${name}</option>`)
        moves.querySelector("[data-field='move1']").innerHTML = available_moves
        moves.querySelector("[data-field='move2']").innerHTML = available_moves
        moves.querySelector("[data-field='move3']").innerHTML = available_moves
        moves.querySelector("[data-field='move4']").innerHTML = available_moves

        let available_abilities = pokemon["abilities"].map(name => `<option value="${name}">${name}</option>`)
        ability.querySelector("[data-field='ability']").innerHTML = available_abilities


    }
}

function renderStats(stat_fields, pokemon, evs, nature){
    for (let i=0; i < stat_fields.length; i++){
        applyStat(evs[i], pokemon["baseStats"][`${stats[i][0]}`], stat_fields[i], nature, stats[i][1])
    }
}

function applyStat(input, base, element, nature, stat){
    let val = ""
    let nature_list = nature.value.split(",")
    if (stat == "hp"){
        val = statCalc(true, base, Number(input.value))
    }
    else if (stat == nature_list[0] && stat == nature_list[1]){
        val = statCalc(false, base, Number(input.value))
    }
    else if (stat == nature_list[0]){
        val = statCalc(false, base, Number(input.value), "+")
    }
    else if (stat == nature_list[1]){
        val = statCalc(false, base, Number(input.value), "-")
    }
    else{
        val = statCalc(false, base, Number(input.value))
    }
    element.textContent = val;
}

function statCalc(hp, base, points, alignment = ""){
    if (hp){
        return base + points + 75
    }
    if (alignment === "+"){
        return Math.floor((base + points + 20) * 1.1)
    }
    else if (alignment === "-"){
        return Math.floor((base + points + 20) * 0.9)
    }
    else{
        return (base + points + 20)
    }

}

function saveTeam (){
    const team = {}
    for (let i = 0; i < pokemon_team_sheet.length; i++){
        let currentSection = pokemon_team_sheet[i]
        team[`team_member_${i + 1}`] = {
            "name": currentSection.querySelector("[data-field='pokemon']").value,
            "stats": {
                "hp": currentSection.querySelector("[data-field='hp_input']").value,
                "atk": currentSection.querySelector("[data-field='atk_input']").value,
                "def": currentSection.querySelector("[data-field='def_input']").value,
                "spAtk": currentSection.querySelector("[data-field='spAtk_input']").value,
                "spDef": currentSection.querySelector("[data-field='spDef_input']").value,
                "spe": currentSection.querySelector("[data-field='spe_input']").value,
            },
            "moves": {
                "move1": currentSection.querySelector("[data-field='move1']").value,
                "move2": currentSection.querySelector("[data-field='move2']").value,
                "move3": currentSection.querySelector("[data-field='move3']").value,
                "move4": currentSection.querySelector("[data-field='move4']").value
            },
            "ability": currentSection.querySelector("[data-field='ability']").value,
            "nature": currentSection.querySelector("[data-field='nature']").value
        }
    }
    return team;
}

function loadTeam (teamName){
    const team = JSON.parse(localStorage.getItem(teamName))
    for (let i = 1; i < 7; i++){
        let currentSection = pokemon_team_sheet[i - 1]
        let currentMember = team[`team_member_${i}`]
        if (currentMember.name != "none"){
            const pokemon = roster[currentMember.name]
            
            currentSection.querySelector("[data-field='pokemon']").value = currentMember.name
            pokemonSelected(currentSection, currentMember.name)
            getPokemonPicture(currentSection, currentMember.name)


            currentSection.querySelector("[data-field='move1']").value = currentMember["moves"]["move1"]
            currentSection.querySelector("[data-field='move2']").value = currentMember["moves"]["move2"]
            currentSection.querySelector("[data-field='move3']").value = currentMember["moves"]["move3"]
            currentSection.querySelector("[data-field='move4']").value = currentMember["moves"]["move4"]

            currentSection.querySelector("[data-field='ability']").value = currentMember.ability
            const nature = currentSection.querySelector("[data-field='nature']")
            nature.value = currentMember.nature
            
            const stat_field_list = [currentSection.querySelector("[data-field='hp']"), currentSection.querySelector("[data-field='atk']"), 
                currentSection.querySelector("[data-field='def']"), currentSection.querySelector("[data-field='spAtk']"), currentSection.querySelector("[data-field='spDef']"),
                currentSection.querySelector("[data-field='spe']")]
            const stats_input_list = [currentSection.querySelector(`#pokemon_${i}_hp`), currentSection.querySelector(`#pokemon_${i}_atk`),
                currentSection.querySelector(`#pokemon_${i}_def`),currentSection.querySelector(`#pokemon_${i}_spAtk`),
                currentSection.querySelector(`#pokemon_${i}_spDef`),currentSection.querySelector(`#pokemon_${i}_spe`)
            ]
            for (let x=0; x < stats_input_list.length; x++){
                let target = currentSection.querySelector(`[data-field='${stats[x][1]}_input']`)
                target.value = currentMember["stats"][`${stats[x][1]}`]
                applyStat(target, pokemon["baseStats"][`${stats[x][0]}`], stat_field_list[x], nature, stats[x][1])
            }
        }

    }
}
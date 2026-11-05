let roster = {};

async function loadRoster() {
    const response = await fetch("regM-C.json");
    if (!response.ok) throw new Error(`Roster request failed: ${response.status}`)
    let temp = await response.json();
    roster = temp[0]
}

loadRoster();
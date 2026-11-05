const form = document.querySelector("#bracket_nums_submission")
const bracket = document.querySelector(".bracket")

form.addEventListener('submit', function (event) {
    event.preventDefault();
    bracket.classList.toggle("hidden");
    generateBracket(form.querySelector("#participants").value)
    form.classList.toggle("hidden");
})


function generateBracket(participants){
    let html = `<div class="bracket">`;
    let rounds = Math.ceil(Math.log(participants)/Math.log(2))
    for (let i = 0; i < rounds; i++){
        html += generateRounds(2 ** rounds, i + 1);
    }
    html += `</div>`
    bracket.innerHTML = html
}

function generateRounds(participants, round){
    let html = `<div class="round" id="round${round}">`
    let matches = participants / (2 ** round)
    for (let i = 0; i < matches; i++){
        html += `<div class="match" data-field="match${i+1}">
      <div class="team winner">
        <span class="name">Team A</span>
        <span class="score">3</span>
      </div>
      <div class="team">
        <span class="name">Team B</span>
        <span class="score">1</span>
      </div>
    </div>`
    }
    html += `</div>`
    return html;
}
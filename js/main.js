
let heroesSelected = [];
let cardsSelected = [];

function start()
{
    let heroesAvailable = selectorFunctions[0].func();
    populateSelector(heroesAvailable);
}


function populateSelector(cardsAvailable)
{
    let selector = document.getElementById("selector");

    for (let cardIdx=0; cardIdx < cardsAvailable.length; cardIdx++)
    {
        let cardData = cardsAvailable[cardIdx];
        let img = document.createElement("img");
        img.src = "https://digital.ringsdb.com" + cardData.imagesrc;
        img.classList.add("selectable_card");
        img.cardData = cardData;
        img.onclick = addCard;
        selector.appendChild(img);
    }

}


function addCard(e)
{
    let cardData = e.currentTarget.cardData;
}



selectorFunctions =
[
    {
        func:function()
        {
            let allHeroes = cardsData.filter(cardData => cardData.type_code === "hero");
            allHeroes = JSON.parse(JSON.stringify(allHeroes));

            let heroesAvailable = [];
            do
            {
                let rndIdx = Math.floor(Math.random() * allHeroes.length);
                heroesAvailable.push(allHeroes.splice(rndIdx, 1)[0]);
            }
            while(heroesAvailable.length < 2);

            return heroesAvailable;
        }
    }
];


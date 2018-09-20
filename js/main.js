
let heroesSelected = [];
let cardsSelected = [];

function start()
{
    selectorFunctions[0].func();
}


selectorFunctions =
[
    {
        func:function()
        {
            let allHeroes = cardsData.filter(cardData => cardData.type_code === "hero");
            allHeroes = JSON.parse(JSON.stringify(allHeroes));

            let pickupHeroes = [];
            do
            {
                let rndIdx = Math.floor(Math.random() * allHeroes.length);
                pickupHeroes.push(allHeroes.splice(rndIdx, 1));
            }
            while(pickupHeroes.length < 2);
        }
    }
];


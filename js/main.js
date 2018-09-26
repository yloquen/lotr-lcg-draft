let heroesSelected = [];
let cardsSelected = [];
let cardsSelectedById = [];

function start()
{
    populateSelector(getSelectableHeroes());
}


function populateSelector(cardsAvailable)
{
    let selector = document.getElementById("selector");

    while (selector.firstChild)
    {
        selector.removeChild(selector.firstChild);
    }

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

    if (heroesSelected.length < 2)
    {
        heroesSelected.push(cardData);
        populateSelector(getSelectableHeroes());
    }
    else if (cardsSelected.length < 30)
    {
        cardsSelected.push(cardData);
        populateSelector(getSelectableHeroes2());
    }

    console.log(heroesSelected);
}



selectorFunctions =
[
    {
        func:getSelectableHeroes
    }
];


function getSelectableHeroes()
{
    let p1 = { name : "type_code", value : "hero", compFunc : equal };

    let filterFunc = function(card)
    {
        return (testPredicate(p1, card));
    };

    return getSelectableCards(2, filterFunc);
}


function getSelectableHeroes2()
{
    let p1 = { name : "sphere_name", value : "Leadership", compFunc : equal };
    let p2 = { name : "type_code", value : "hero", compFunc : notEqual };
    let p3 = { name : "sphere_name", value : "Spirit", compFunc : equal };

    let filterFunc = function(card)
    {
        return (testPredicate(p1, card) && testPredicate(p2, card)) || testPredicate(p3, card);
    };

    return getSelectableCards(2, filterFunc);
}


function getSelectableCards(number, filterFunc)
{
    let filteredCards = cardsData.filter(filterFunc);

    let selectableCards = [];
    do
    {
        let rndIdx = Math.floor(Math.random() * filteredCards.length);
        let randomCard = filteredCards.splice(rndIdx, 1)[0];
        selectableCards.push(randomCard);
    }
    while(selectableCards.length < number);

    return selectableCards;
}



function testPredicate(predicate, card)
{
    return predicate.compFunc(card[predicate.name] , predicate.value);
}


function equal(op1, op2)
{
    return op1 === op2;
}


function notEqual(op1, op2)
{
    return op1 !== op2;
}
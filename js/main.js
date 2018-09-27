let heroesSelected = [];
let cardsSelected = [];
let cardsSelectedById = [];
let heroSpheres = {spirit:0, leadership:0, tactics:0, lore:0};

function start()
{
    populateSelector(getSelectableHeroes());
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

        if (cardData.imagesrc === undefined)
        {
            console.log("test");
        }
    }
}


function addCardToDiv(container, cardData, cardClass)
{
    let img = document.createElement("img");
    img.src = "https://digital.ringsdb.com" + cardData.imagesrc;
    img.classList.add(cardClass);
    container.appendChild(img);
}


function addCard(e)
{
    let selector = document.getElementById("selector");
    while (selector.firstChild)
    {
        selector.removeChild(selector.firstChild);
    }

    let cardData = e.currentTarget.cardData;

    if (cardData.type_code === "hero")
    {
        heroesSelected.push(cardData);
        addCardToDiv(document.getElementById("selected_heroes"), cardData, "selected_hero");
        cardsSelectedById[cardData.code] = 1;
    }
    else
    {
        cardsSelected.push(cardData);
        addCardToDiv(document.getElementById("selected_cards"), cardData, "selected_card");
        if (!cardsSelectedById[cardData.code])
        {
            cardsSelectedById[cardData.code] = 1;
        }
        else
        {
            cardsSelectedById[cardData.code]++;
        }
    }

    if (heroesSelected.length < 3)
    {
        populateSelector(getSelectableHeroes());
    }
    else if (cardsSelected.length < 30)
    {
        if (cardsSelected === 0)
        {
            for (let heroIdx=0; heroIdx < heroesSelected.length; heroIdx++)
            {
                heroSpheres[heroesSelected[heroIdx].sphere_code]++;
            }
        }

        populateSelector(getSelectableHeroes2());
    }
}



selectorFunctions =
[
    {
        func:getSelectableHeroes
    }
];


function getSelectableHeroes()
{
    let p1 = { name : "type_code", value : "hero" };

    let filterFunc = function(card)
    {
        return (testPredicate(p1, card));
    };

    return getSelectableCards(2, filterFunc);
}


function getSelectableHeroes2()
{
    let p1 = { name : "sphere_code", value : heroesSelected[0].sphere_code };
    let p2 = { name : "sphere_code", value : heroesSelected[1].sphere_code };
    let p3 = { name : "sphere_code", value : heroesSelected[2].sphere_code};
    let p4 = { name : "type_code", value : "hero"};
    let p5 = { name : "deck_limit", value : 0};

    let filterFunc = function(card)
    {
        return (testPredicate(p1, card) || testPredicate(p2, card) || testPredicate(p3, card)) && !testPredicate(p4, card) && !testPredicate(p5, card);
    };

    return getSelectableCards(3, filterFunc);
}


function getSelectableCards(number, filterFunc)
{
    let filteredCards = cardsData.filter(filterFunc);

    let selectableCards = [];
    do
    {
        let rndIdx = Math.floor(Math.random() * filteredCards.length);
        let randomCard = filteredCards.splice(rndIdx, 1)[0];

        if (!cardsSelectedById[randomCard.code])
        {
            selectableCards.push(randomCard);
        }
        else
        {
            if (randomCard.type_code !== "hero" && cardsSelectedById[randomCard.code] < 2)
            {
                selectableCards.push(randomCard);
            }
        }
    }
    while(selectableCards.length < number && filteredCards.length > 0);

    return selectableCards;
}



function testPredicate(predicate, card)
{
    return card[predicate.name] === predicate.value;
}

const heroesSelected = [];
const cardsSelected = [];
const cardsSelectedById = [];
const heroSpheres = {spirit:0, leadership:0, tactics:0, lore:0};

const raritiesEnum =
    {
        "Starter" : 0,
        "Common" : 1,
        "Uncommon" : 2,
        "Rare" : 3,
        "Legendary" : 4
    }


function start()
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange =
        function()
        {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            {
                cardsData = JSON.parse(xmlHttp.responseText);
                populateSelector(getSelectableHeroes());
            }

        };
    //xmlHttp.open("GET", "https://digital.ringsdb.com/api/public/cards/", true);
    //xmlHttp.send(null);

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
        if (cardsSelected.length === 0)
        {
            for (let heroIdx=0; heroIdx < heroesSelected.length; heroIdx++)
            {
                heroSpheres[heroesSelected[heroIdx].sphere_code]++;
            }
        }

        let numCards = 3;
        let cards;
        do
        {
            cards = getRandomCards(numCards);
        }
        while(cards.length < numCards);
        populateSelector(cards);
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


function getRarity()
{
    let rarity;
    let rnd = Math.random();
    if (rnd < .3)
    {
        rarity = "Starter";
    }
    else if (rnd < .65)
    {
        rarity = "Common"
    }
    else if (rnd < .85)
    {
        rarity = "Uncommon";
    }
    else
    {
        rarity = "Rare";
    }

    return rarity;
}


function getRandomCards(numCards)
{
    let rarity = getRarity();
    let additionalPredicates = generateAdditionalPredicates();

    let filterFunc = function(card)
    {
        return checkBasicRequirements(card) && checkRarity(rarity, card) && testPredicates(additionalPredicates,card);
    };

    return getSelectableCards(numCards, filterFunc);
}


function generateAdditionalPredicates()
{
    let predicates = [];
    let rnd = Math.random();

    if (rnd < .5)
    {
        let predicate = { name : "type_code" };
        let rnd2 = Math.random();
        if (rnd2 < .5)
        {
            predicate.value = "ally";
        }
        else if (rnd2 < .7)
        {
            predicate.value = "attachment";
        }
        else
        {
            predicate.value = "event";
        }
        predicates.push(predicate);

        console.log("Type : " + predicate.value);
    }

    return predicates;
}


function checkRarity(rarity, card)
{
    if (rarity === "Rare")
    {
        return raritiesEnum[rarity] <= raritiesEnum[card.rarity];
    }
    else
    {
        return raritiesEnum[rarity] === raritiesEnum[card.rarity];
    }
}


function checkBasicRequirements(card)
{
    let p1 = { name : "type_code", value : "hero"};
    let p2 = { name : "deck_limit", value : 0};

    let val;
    if (card.sphere_code === "neutral")
    {
        val = true;
    }
    else
    {
        val = heroSpheres[card.sphere_code] > 0 &&
            card.level <= heroSpheres[card.sphere_code] &&
            !testPredicate(p1, card) &&
            !testPredicate(p2, card);
    }

    return val;
}


function getSelectableCards(number, filterFunc)
{
    let filteredCards = cardsData.filter(filterFunc);

    let selectableCards = [];

    while(selectableCards.length < number && filteredCards.length > 0)
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


    return selectableCards;
}



function testPredicates(predicates, card)
{
    let val = true;
    for (let predIdx=0; predIdx < predicates.length; predIdx++)
    {
        val = val && testPredicate(predicates[predIdx], card);
    }
    return val;
}

function testPredicate(predicate, card)
{
    return card[predicate.name] === predicate.value;
}
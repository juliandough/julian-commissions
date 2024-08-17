// ------------------------------------------------------------------------------------------------
// #region Animate brushes
// Observe brush containers to have them appear when scrolled into view.
const observer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.intersectionRatio < 0.65) {
                continue;
            }
            const el = entry.target;
            el.classList.remove("brushContainerHidden");
        }
    },
    { threshold: 0.65 }
);

const hiddenBrushContainers = document.getElementsByClassName("brushContainerHidden");
for (const hiddenBrushContainer of hiddenBrushContainers) {
    observer.observe(hiddenBrushContainer);
}
// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Create emote container with a bunch of scrolling emotes
const emoteContainerEl = document.getElementById("scrollingEmoteContainer");
const emoteFilenames = [
    "1254323429692280873.png",
    "1239592043928485920.png",
    "1242180587029270619.png",
    "1242180696009605294.png",
    "1242181722800652328.png",
    "1243085937991352350.png",
    "1243098563479601183.png",
    "1243264863137038356.png",
    "1254323429692280873.png",
    "1257938134012919880.png",
    "1262669189697634315.png",
    "1263601914088652863.png",
];

for (let i = 0; i < 8; i++) {
    const emoteRowEl = document.createElement("div");
    emoteRowEl.className = "emoteRow";

    for (let a = 0; a < 2; a++) {
        for (let j = 0; j < emoteFilenames.length; j++) {
            const index = (j + i) % emoteFilenames.length;
            const emoteFilename = emoteFilenames[index];

            const emoteEl = document.createElement("img");
            emoteEl.src = "img/emotes/" + emoteFilename;
            emoteEl.alt = "Sample emote";
            emoteRowEl.appendChild(emoteEl);
        }
    }

    emoteContainerEl.appendChild(emoteRowEl);
}
// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Set copyright year to current year
const copyrightYearEl = document.getElementById("copyright-year");
copyrightYearEl.innerText = new Date().getFullYear().toString();
// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Set up active header
const headerElements = [
    ...document.getElementsByTagName("h1"),
    ...document.getElementsByTagName("h2"),
].filter((x) => !!x.id);
const navListEl = document.getElementById("nav-list");
document.addEventListener("scroll", (e) => {
    let toppestHeader = null;
    for (const headerEl of headerElements) {
        const headerPos = headerEl.getBoundingClientRect().top;
        // 360px above the top of the header element.
        // That way the section is active once a little of it is scrolled into view.
        if (headerPos <= 360) {
            toppestHeader = headerEl;
        }
    }

    toppestHeader ||= headerElements[0];
    const currentHeaderRef = toppestHeader.id;
    for (const navEl of navListEl.getElementsByTagName("li")) {
        const ref = navEl.getAttribute("data-ref");
        if (ref === currentHeaderRef) {
            if (!navEl.classList.contains("active")) {
                navEl.classList.add("active");
            }
        } else {
            if (navEl.classList.contains("active")) {
                navEl.classList.remove("active");
                navEl.onanimationiteration;
            }
        }
    }
});
// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Melonverse (tm)

// Load in random melons for the melon images.
let melonFilenames = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => "melon" + x + ".png");

/**
 * Picks a random melon from the list, removes it from the list, and returns it.
 */
function pluckRandomMelon() {
    const i = Math.floor(Math.random() * melonFilenames.length);
    const melonFilename = melonFilenames[i];
    melonFilenames = melonFilenames.filter((x) => x !== melonFilename);
    return melonFilename;
}

/**
 * Plucks a random melon and assigns it as the image of the element.
 *
 * @param {HTMLImageElement} melonEl
 */
function setRandomMelon(melonEl) {
    const melonFilename = pluckRandomMelon();
    melonEl.src = "img/melons/" + melonFilename;
    melonEl.setAttribute("data-melon-file", melonFilename);
}

const melonElements = document.getElementsByClassName("melon");
for (const melonEl of melonElements) {
    setRandomMelon(melonEl);

    melonEl.addEventListener("animationiteration", () => {
        // Get the currently assigned melon...
        const currentMelonFilename = melonEl.getAttribute("data-melon-file");

        // ...pluck a new one...
        setRandomMelon(melonEl);

        // ...then put the previous one back into the basket.
        melonFilenames.push(currentMelonFilename);
    });
}

// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Commission calculator

/**
 * @typedef {('character'|'emotes'|'something')} CommissionType
 * @typedef {('bw'|'color'|'shaded')} CharacterStyle
 */

/** @type {CommissionType} */
let commissionContext = "character";

/** @type {HTMLCollectionOf<HTMLButtonElement>} */
const commissionButtons = document.getElementsByClassName("calcButton");
const commissionFormContents = document.getElementsByClassName("calcFormContent");

/**
 * @param {CommissionType} context
 */
function setCommissionContext(context) {
    commissionContext = context;
    for (const el of commissionButtons) {
        const context = el.getAttribute("data-context");
        if (context === commissionContext && !el.classList.contains("active")) {
            el.classList.add("active");
        } else if (context !== commissionContext && el.classList.contains("active")) {
            el.classList.remove("active");
        }
    }
    for (const el of commissionFormContents) {
        const context = el.getAttribute("data-context");
        if (context === commissionContext && !el.classList.contains("active")) {
            el.classList.add("active");
        } else if (context !== commissionContext && el.classList.contains("active")) {
            el.classList.remove("active");
        }
    }
}

setCommissionContext("character");

/**
 * @param {HTMLButtonElement} buttonEl
 */
function handleClickCommissionType(buttonEl) {
    const context = buttonEl.getAttribute("data-context");
    setCommissionContext(context);
    updateCalculatorResults();
}

const commissionPricingEl = document.getElementById("commission-pricing");
const commissionDetailsEl = document.getElementById("commission-details");

const characterDraggerEl = document.getElementById("character-dragger");
const characterContainerEl = document.getElementById("character-container");
const characterForegroundContainerEl = document.getElementById("character-foreground-container");
const characterForegroundEl = document.getElementById("character-foreground");
const characterBackgroundEl = document.getElementById("character-background");
const characterPricings = [
    {
        name: "Headshot",
        description: "A headshot of your character, potentially with neck/collar",
        height: 23,
        price: 15,
    },
    {
        name: "Bust",
        description: "A bust of your character, including shirt collar and shoulders",
        height: 30,
        price: 20,
    },
    {
        name: "Half-body",
        description: "The upper body of your character up to waist, including arms",
        height: 50,
        price: 30,
    },
    {
        name: "Full-body",
        description: "A full-body of your character from head to toe",
        height: 100,
        price: 35,
    },
];
const characterSurcharges = {
    bw: 0,
    color: 10,
    shaded: 15,
};
let currentCharacterHeight = -1;
/** @type {(CharacterStyle|'')} */
let currentCharacterStyle = "";

window.addEventListener("DOMContentLoaded", () => {
    const initialPricing = characterPricings[1];
    setCharacterHeight(initialPricing.height);
    setCharacterStyle("color");
    updateCalculatorResults();
});

/**
 * @param {Number} height Height in percent (0-100)
 */
function findClosestCharacterPricing(height) {
    let closestPricing = characterPricings[0];

    for (let i = 1; i < characterPricings.length; i++) {
        const pricing = characterPricings[i];
        const oldDiff = Math.abs(closestPricing.height - height);
        const newDiff = Math.abs(pricing.height - height);
        if (newDiff < oldDiff) {
            closestPricing = pricing;
        }
    }

    return closestPricing;
}

function handleDragEnd() {
    characterForegroundContainerEl.style.transition = "height 0.25s ease";
    const closestPricing = findClosestCharacterPricing(currentCharacterHeight);
    setCharacterHeight(closestPricing.height);
    updateCalculatorResults();
}

/**
 * @param {Number} height Height in percent (0-100)
 */
function setCharacterHeight(height) {
    characterForegroundContainerEl.style.height = height + "%";
    currentCharacterHeight = height;
}

let isCharacterMouseDown = false;

/**
 * @param {MouseEvent} event
 */
function handleCharacterMouseDown(event) {
    if (event.button !== 0) {
        return;
    }
    isCharacterMouseDown = true;
    characterForegroundContainerEl.style.transition = undefined;
}

/**
 * @param {MouseEvent} event
 */
function handleCharacterMouseUp(event) {
    if (event.button !== 0 || !isCharacterMouseDown) {
        return;
    }
    isCharacterMouseDown = false;
    handleDragEnd();
}

function handleCharacterMouseLeave(event) {
    if (!isCharacterMouseDown) {
        return;
    }
    isCharacterMouseDown = false;
    handleDragEnd();
}

/**
 * @param {MouseEvent} event
 */
function handleCharacterMouseMove(event) {
    if (!isCharacterMouseDown) {
        return;
    }

    moveDraggerPosition(event.movementY);
}

let touchStart = { x: -1, y: -1 };
let isCharacterTouchDown = false;

/**
 * @param {TouchEvent} event
 */
function handleCharacterTouchStart(event) {
    event.preventDefault();
    touchStart = { x: event.touches[0].pageX, y: event.touches[0].pageY };
    isCharacterTouchDown = true;
    characterForegroundContainerEl.style.transition = undefined;
}

/**
 * @param {TouchEvent} event
 */
function handleCharacterTouchMove(event) {
    if (!isCharacterTouchDown) {
        return;
    }

    event.preventDefault();
    const movementY = event.touches[0].pageY - touchStart.y;
    moveDraggerPosition(movementY);
    touchStart = { x: event.touches[0].pageX, y: event.touches[0].pageY };
}

function handleCharacterTouchEnd(event) {
    if (!isCharacterTouchDown) {
        return;
    }
    isCharacterTouchDown = false;
    handleDragEnd();
}

/**
 * @param {Number} movementY
 */
function moveDraggerPosition(movementY) {
    if (movementY === 0) {
        return;
    }

    const containerBounds = characterContainerEl.getBoundingClientRect();

    const containerHeight = containerBounds.height;
    const currentPosition = characterDraggerEl.getBoundingClientRect().top - containerBounds.top;

    const newPosition = currentPosition + movementY;
    const newPositionPercent = Math.max(0, Math.min(1, newPosition / containerHeight));

    setCharacterHeight(newPositionPercent * 100);
}

/**
 *
 * @param {HTMLButtonElement} buttonEl
 */
function handleSetCharacterStyle(buttonEl) {
    const characterStyle = buttonEl.getAttribute("data-style");
    setCharacterStyle(characterStyle);
    updateCalculatorResults();
}

/**
 * @param {CharacterStyle} characterStyle
 */
function setCharacterStyle(characterStyle) {
    currentCharacterStyle = characterStyle;

    // Set style images.
    characterForegroundEl.src = "img/character/" + characterStyle + ".png";
    characterBackgroundEl.src = "img/character/" + characterStyle + ".png";

    // Activate style button.
    const buttonsContainerEl = document.getElementById("character-style-buttons");
    const buttons = buttonsContainerEl.getElementsByTagName("button");
    for (const button of buttons) {
        if (button.getAttribute("data-style") === currentCharacterStyle) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    }
}

function handleChangeCharacterMelonTax() {
    updateCalculatorResults();
}

let emoteCount = 1;

function handleEmotesAdd() {
    emoteCount = Math.min(15, emoteCount + 1);
    updateEmotesCount();
    updateCalculatorResults();
}

function handleEmotesRemove() {
    emoteCount = Math.max(1, emoteCount - 1);
    updateEmotesCount();
    updateCalculatorResults();
}

function updateEmotesCount() {
    const emotesCountEl = document.getElementById("emotes-count");
    emotesCountEl.innerText = emoteCount.toString();
}

function handleChangeEmotesMelonTax() {
    updateCalculatorResults();
}

function updateCalculatorResults() {
    if (commissionContext === "character") {
        updateCalculatorResultsCharacter();
    } else if (commissionContext === "emotes") {
        updateCalculatorResultsEmotes();
    } else if (commissionContext === "something") {
        updateCalculatorResultsSomething();
    }
}

function updateCalculatorResultsCharacter() {
    const closestPricing = findClosestCharacterPricing(currentCharacterHeight);

    let price = closestPricing.price;
    const surcharge = characterSurcharges[currentCharacterStyle];
    price += surcharge;

    const melonTaxEl = document.getElementById("character-melon-tax");
    price += melonTaxEl.checked ? 2 : 0;

    updatePriceDisplay(price);

    const styleDisplay =
        currentCharacterStyle === "bw"
            ? "Black & White"
            : currentCharacterStyle.charAt(0).toUpperCase() + currentCharacterStyle.slice(1);

    commissionDetailsEl.innerHTML =
        "<b>" +
        closestPricing.name +
        "</b> <small>(" +
        styleDisplay +
        ")</small><br><br>" +
        closestPricing.description +
        "<br><br>" +
        '<a href="img/character/example/' +
        closestPricing.name +
        '.png" target="_blank">Example <i class="bi bi-arrow-up-right-square-fill"></i></a>';
}

function updateCalculatorResultsEmotes() {
    let price = emoteCount * 8;

    const melonTaxEl = document.getElementById("emotes-melon-tax");
    price += melonTaxEl.checked ? 2 : 0;

    updatePriceDisplay(price);
    commissionDetailsEl.innerText = "";

    const melonPyramidEl = document.getElementById("melon-pyramid");
    melonPyramidEl.innerHTML = "";

    let row = 1;
    let total = 0;

    while (total < emoteCount) {
        const perRow = Math.min(emoteCount - total, row);
        total += perRow;

        if (perRow > 0) {
            const melonPyramidRowEl = document.createElement("div");
            melonPyramidRowEl.className = "melonPyramidRow";

            for (let i = 0; i < perRow; i++) {
                const melonEl = document.createElement("img");
                melonEl.src = "img/melons/melon5.png";
                melonEl.className = "melonPyramidMelon";
                // Random delay between 0 and 1s:
                melonEl.style.animationDelay = -Math.random() + "s";
                melonPyramidRowEl.appendChild(melonEl);
            }

            melonPyramidEl.appendChild(melonPyramidRowEl);
        }

        row++;
    }
}

function updateCalculatorResultsSomething() {
    updatePriceDisplay(0);

    commissionDetailsEl.innerText = "";
}

let currentPrice = null;
let targetPrice = null;

/**
 * @param {Number} price
 */
function updatePriceDisplay(price) {
    targetPrice = price;
    if (currentPrice === null) {
        currentPrice = targetPrice;
        commissionPricingEl.innerText = "$" + currentPrice;
    }
}

setInterval(() => {
    if (currentPrice === targetPrice) {
        return;
    }

    const diff = targetPrice - currentPrice;
    const sign = diff < 0 ? -1 : 1;
    const step = Math.max(1, Math.floor(Math.abs(diff) / 5));

    currentPrice += step * sign;

    if (currentPrice > 0) {
        commissionPricingEl.innerText = "$" + currentPrice;
    } else {
        commissionPricingEl.innerText = "$???";
    }
}, 25);

// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Commission details dialog

function handleOpenCommissionDetails() {
    const dialogEl = document.getElementById("detail-popover");
    dialogEl.showModal();

    // Disable scroll of page.
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", closeCommissionDetailsOnEsc);
}

function handleCloseCommissionDetails() {
    const dialogEl = document.getElementById("detail-popover");
    dialogEl.close();

    // Enable scroll of page.
    document.body.style.overflow = "auto";

    document.removeEventListener("keydown", closeCommissionDetailsOnEsc);
}

function closeCommissionDetailsOnEsc(event) {
    if (event.key === "Escape") {
        handleCloseCommissionDetails();
    }
}

// #endregion
// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------
// #region Julian happy animation

function handleJulianHappyAnim() {
    const julianEl = document.getElementById("julian-happy");
    julianEl.addEventListener("animationend", endJulianAnim);
    const surprisedEl = document.getElementById("julian-surprised");
    surprisedEl.addEventListener("animationend", endSurprisedAnim);

    julianEl.style.animationName = "bounce-anim";
    surprisedEl.style.animationName = "julianSurprised-anim";
}

function endJulianAnim() {
    const julianEl = document.getElementById("julian-happy");
    julianEl.style.animationName = "";
    julianEl.removeEventListener("animationend", endJulianAnim);
}

function endSurprisedAnim() {
    const surprisedEl = document.getElementById("julian-surprised");
    surprisedEl.style.animationName = "";
    surprisedEl.removeEventListener("animationend", endSurprisedAnim);
}

// #endregion
// ------------------------------------------------------------------------------------------------

/** @type {null|HTMLDivElement} */
let characterVisibleEl = null;
/** @type {null|HTMLDivElement} */
let characterImgEl = null;
/** @type {null|HTMLDivElement} */
let characterHiddenImgEl = null;
/** @type {null|HTMLDivElement} */
let pricingPriceEl = null;
/** @type {null|HTMLDivElement} */
let pricingNameEl = null;
/** @type {null|HTMLDivElement} */
let pricingDescEl = null;
/** @type {null|HTMLDivElement} */
let characterVariantSelectors = null;

const pricings = [
    {
        name: "Head",
        description: "Just a head, potentially with a neck/collar",
        height: 23,
        price: 15,
    },
    {
        name: "Bust",
        description: "The head, including neck, shirt collar and shoulders",
        height: 30,
        price: 20,
    },
    {
        name: "Upper Body",
        description: "Head, neck, shoulders, arms and upper body up to waist",
        height: 50,
        price: 25,
    },
    {
        name: "Full Body",
        description: "Entire character's body",
        height: 100,
        price: 35,
    },
];

const colorSurcharge = 10;
const shadedSurcharge = 20;

/** @type {'bw'|'color'|'shaded'} */
let selectedCharacterVariant = "color";
let currentHeight = 0;

window.addEventListener("DOMContentLoaded", () => {
    characterVisibleEl = document.getElementById("character-visible");
    characterImgEl = document.getElementById("character-img");
    characterHiddenImgEl = document.getElementById("character-hidden-img");
    pricingPriceEl = document.getElementById("character-pricing-price");
    pricingNameEl = document.getElementById("character-pricing-name");
    pricingDescEl = document.getElementById("character-pricing-description");
    characterVariantSelectors = document.getElementById("character-variant-selectors");

    const initialPricing = pricings[1];
    updatePricing(initialPricing.height);
    setHeight(initialPricing.height);
    setCharacterVariant("color");
});

/**
 * @param {'bw'|'color'|'shaded'} variant
 */
function setCharacterVariant(variant) {
    selectedCharacterVariant = variant;

    const imgFilename = "img/character-" + variant + ".png";
    characterImgEl.src = imgFilename;
    characterHiddenImgEl.src = imgFilename;

    for (const variantSelector of characterVariantSelectors.children) {
        const selectorVariant = variantSelector.getAttribute("data-variant");
        if (!selectorVariant) {
            continue;
        }

        if (selectorVariant === variant) {
            variantSelector.classList.add("character-version-selector-active");
        } else {
            variantSelector.classList.remove("character-version-selector-active");
        }
    }

    // Reflect updated pricing with surcharges.
    updatePricing(currentHeight);
}

/**
 * @param {DragEvent} e
 */
function handleDragStart(e) {
    characterVisibleEl.style.transition = undefined;
    e.dataTransfer.dropEffect = "copy";
}

/**
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
    characterVisibleEl.style.transition = "height 0.25s ease";

    const closestPricing = findClosestPricing(currentHeight);
    setHeight(closestPricing.height);
}

/**
 * @param {DragEvent} e
 */
function handleDragOver(e) {
    e.preventDefault();
    if (!characterVisibleEl || !characterImgEl) {
        return;
    }

    const topY = characterVisibleEl.getBoundingClientRect().y;
    const offset = e.clientY - topY;
    const maxHeight = characterImgEl.clientHeight;
    const newHeight = Math.min(100, (offset / maxHeight) * 100);

    updatePricing(newHeight);
    setHeight(newHeight);
}

/**
 * @param {Number} height
 */
function setHeight(height) {
    characterVisibleEl.style.height = height + "%";
    currentHeight = height;
}

/**
 * @param {Number} height
 */
function findClosestPricing(height) {
    let closestPricing = pricings[0];

    for (let i = 1; i < pricings.length; i++) {
        const pricing = pricings[i];
        const oldDiff = Math.abs(closestPricing.height - height);
        const newDiff = Math.abs(pricing.height - height);
        if (newDiff < oldDiff) {
            closestPricing = pricing;
        }
    }

    return closestPricing;
}

/**
 * @param {Number} height
 */
function updatePricing(height) {
    if (!pricingPriceEl || !characterVisibleEl || !pricingDescEl || !pricingNameEl) {
        return;
    }

    const closestPricing = findClosestPricing(height);
    let price = closestPricing.price;
    let nameText = closestPricing.name + ", ";

    switch (selectedCharacterVariant) {
        case "bw":
            nameText += "black and white";
            break;
        case "color":
            nameText += "flat colors";
            price += colorSurcharge;
            break;
        case "shaded":
            nameText += "shaded colors";
            price += shadedSurcharge;
            break;
    }

    pricingPriceEl.innerText = "$" + price;
    pricingNameEl.innerText = nameText;
    pricingDescEl.innerText = closestPricing.description;
}

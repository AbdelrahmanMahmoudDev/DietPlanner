const heightChoices = document.querySelectorAll("input[name='heightChoice']")
const age = document.getElementById("age")
const heightInputSection = document.getElementById("heightDynamicInput")

const numberRegex = /^-?\d+\.?\d*$/
const poundToKgFactor = 2.20462
const feetToCentiMetersFactor = 30.48
const inchToCentiMetersFactor = 2.54

function poundToKg(pound) {
    return pound / poundToKgFactor
}

function kgToPound(kg) {
    return kg * poundToKgFactor
}

const genderChoices = {
    male: "genderChoiceMale",
    maleMathVal: 5,
    female: "genderChoiceFemale",
    femaleMathVal: -161
}

const activityLevelChoices = {
    sedentary: "sedentary",
    sedentaryLevel: 1.2,
    lightlyActive: "lightlyActive",
    lightlyActiveLevel: 1.375,
    moderatelyActive: "moderatelyActive",
    moderatelyActiveLevel: 1.550,
    veryActive: "veryActive",
    veryActiveLevel: 1.725,
    extraActive: "extraActive",
    extraActiveLevel: 1.9
}

const goalChoices = {
    loseWeight: "loseWeight",
    caloricDeficitFactor: 0.8,
    gainWeight: "gainWeight",
    caloricSurplusValue: 500
}

let personCharacteristics = {
    weightKg: 0, 
    weightPound: 0, 
    heightCm: 0, 
    heightFeet: 0, 
    age: 0,
    basalMetabolicRate: 0,
    caloricRequirements: 0,
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0
}

let inputFieldMeters = document.createElement("input")
inputFieldMeters.setAttribute("type", "text")
inputFieldMeters.setAttribute("required", "")
inputFieldMeters.setAttribute("name", "heightInCm")
inputFieldMeters.setAttribute("id", "height")
inputFieldMeters.setAttribute("placeholder", "Your height")
inputFieldMeters.setAttribute("value", "178.4")
inputFieldMeters.style.display = "block"

heightInputSection.appendChild(inputFieldMeters) // default 

let inputContainerFeet = document.createElement("div")

let inputFieldFeet = document.createElement("input")
inputFieldFeet.setAttribute("type", "number")
inputFieldFeet.setAttribute("required", "")
inputFieldFeet.setAttribute("name", "heightPartFeet")
inputFieldFeet.setAttribute("id", "heightPartFeet")
inputFieldFeet.setAttribute("placeholder", "Feet")
inputFieldFeet.style.marginRight = "10px";
inputFieldFeet.style.marginBottom = "10px";
inputContainerFeet.appendChild(inputFieldFeet)

let inputFieldInches = document.createElement("input")
inputFieldInches.setAttribute("type", "number")
inputFieldInches.setAttribute("name", "heightPartInches")
inputFieldInches.setAttribute("id", "heightPartInches")
inputFieldInches.setAttribute("placeholder", "Inches")
inputContainerFeet.appendChild(inputFieldInches)

heightChoices.forEach((btn) => {
    btn.addEventListener('change', () => {
        let selected = document.querySelector("input[name='heightChoice']:checked").id
        if(selected == "heightChoiceMeters") {
            heightInputSection.appendChild(inputFieldMeters)
            if(heightInputSection.hasChildNodes()) {
                heightInputSection.removeChild(inputContainerFeet)
            }
        } else {
            heightInputSection.appendChild(inputContainerFeet)
            if(heightInputSection.hasChildNodes()) {
                heightInputSection.removeChild(inputFieldMeters)
            }
        }
    })
})

document.forms[0].onsubmit = (e) => {
    // We don't need to store this data
    e.preventDefault();

    /*
    Calculate basal metabolic rate (BMR), or the calories your body burns simply by being alive.
    For men:   10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) + 5 (kcal / day)
    For women: 10 x weight (kg) + 6.25 x height (cm) – 5 x age (y) -161 (kcal / day)
    */
    const weight = document.getElementById("weight").value
    const weightSelected = document.querySelector("input[name='weightChoice']:checked").id
    if(weightSelected == "weightChoiceKG") {
        personCharacteristics.weightKg    = parseFloat(weight)
        personCharacteristics.weightPound = kgToPound(personCharacteristics.weightKg)
    } else {
        personCharacteristics.weightPound = parseFloat(weight)
        personCharacteristics.weightKg    = poundToKg(personCharacteristics.weightPound)
    }
    console.log

    const heightSelected = document.querySelector("input[name='heightChoice']:checked").id
    personCharacteristics.height = document.getElementById("height")
    if(heightSelected == "heightChoiceFeet") {
        let heightFeet = parseFloat(document.getElementById("heightPartFeet").value)
        let heightInch = parseFloat(document.getElementById("heightPartInches").value)
        heightFeet *= feetToCentiMetersFactor
        heightInch *= inchToCentiMetersFactor

        personCharacteristics.height = heightFeet + heightInch
    } else {
        personCharacteristics.height = parseFloat(document.getElementById("height").value)
    }

    personCharacteristics.age = age.value;
    console.log(`Weight: ${personCharacteristics.weight}\n Height: ${personCharacteristics.height}\n Age: ${personCharacteristics.age}\n`)
    let basalMetabolicRate = (10 * personCharacteristics.weight) + (6.25 * personCharacteristics.height) - (5 * personCharacteristics.age) 
    personCharacteristics.basalMetabolicRate = basalMetabolicRate


    const genderSelected = document.querySelector("input[name='genderChoice']:checked").id
    if(genderSelected == genderChoices.male) {
        basalMetabolicRate += genderChoices.maleMathVal
    } else {
        basalMetabolicRate += genderChoices.femaleMathVal
    }



    const activityLevelSelected = document.querySelector("input[name='activityLevel']:checked").id
    switch(activityLevelSelected) {
        case activityLevelChoices.sedentary: 
            basalMetabolicRate *= activityLevelChoices.sedentaryLevel
            break;
        case activityLevelChoices.lightlyActive: 
            basalMetabolicRate *= activityLevelChoices.lightlyActiveLevel
            break;    
        case activityLevelChoices.moderatelyActive: 
            basalMetabolicRate *= activityLevelChoices.moderatelyActiveLevel
            break;   
        case activityLevelChoices.veryActive: 
            basalMetabolicRate *= activityLevelChoices.veryActiveLevel
            break;   
        case activityLevelChoices.extraActive: 
            basalMetabolicRate *= activityLevelChoices.extraActiveLevel
            break;  
    }



    const goalSelected = document.querySelector("input[name='goalChoice']:checked").id
    switch(goalSelected) {
        case goalChoices.loseWeight:
            basalMetabolicRate *= goalChoices.caloricDeficitFactor
            break;
        case gainWeight:
            basalMetabolicRate += goalChoices.caloricSurplusValue
    }
    basalMetabolicRate = basalMetabolicRate.toFixed(0)
    personCharacteristics.caloricRequirements = basalMetabolicRate

    console.log(`Basal Metabolic Rate(BMR): ${personCharacteristics.basalMetabolicRate},\nCaloric Requirements: ${personCharacteristics.caloricRequirements}`)



}
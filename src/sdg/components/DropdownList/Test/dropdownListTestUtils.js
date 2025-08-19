export function genericOptions() {
    let genericOptions = [];
    for (let i = 1; i < 16; i++) {
        console.log(i);
        genericOptions.push({
            value: i,
            label: `Option ${i}`,
            disabled: false,
            checked: false,
        });
    }

    return genericOptions;
}

export function restaurantsArray() {
    return [
        {
            label: "Pizzeria",
            value: "Pizzeria",
            checked: false,
            disabled: false,
        },
        {
            label: "Pâtisserie",
            value: "Pâtisserie",
            checked: false,
            disabled: false,
        },
        {
            label: "Steakhouse",
            value: "Steakhouse",
            checked: false,
            disabled: false,
        },
        {
            label: "Bar",
            value: "Bar",
            checked: false,
            disabled: false,
        },
        {
            label: "Casse-croûte",
            value: "Casse-croûte",
            checked: false,
            disabled: false,
        },
        {
            label: "Boîte à pâtes",
            value: "Boîte à pâtes",
            checked: false,
            disabled: false,
        },
        {
            label: "Restaurant à burgers",
            value: "Restaurant à burgers",
            checked: false,
            disabled: false,
        },
    ];
}

export function regionsArray() {
    return [
        {
            label: "Capitale-nationale",
            value: "Capitale-nationale",
            checked: false,
            disabled: false,
        },
        {
            label: "Centre-du-Québec",
            value: "Centre-du-Québec",
            checked: true,
            disabled: false,
        },
        {
            label: "Montérégie",
            value: "Montérégie",
            checked: true,
            disabled: false,
        },
        {
            label: "Outaouais",
            value: "Outaouais",
            checked: false,
            disabled: false,
        },
        {
            label: "Saguenay-Lac-Saint-Jean",
            value: "Saguenay-Lac-Saint-Jean",
            checked: false,
            disabled: false,
        },
        {
            label: "Gaspésie-Îles-de-la-Madeleine",
            value: "Gaspésie-Îles-de-la-Madeleine",
            checked: false,
            disabled: false,
        },
        {
            label: "Nord-du-Québec",
            value: "Nord-du-Québec",
            checked: false,
            disabled: false,
        },
        {
            label: "Bas-Saint-Laurent",
            value: "Bas-Saint-Laurent",
            checked: false,
            disabled: false,
        }
    ];
}
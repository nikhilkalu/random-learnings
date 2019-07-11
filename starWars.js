window.onload = () => controller.onLoadHandler();

let controller = {
    onLoadHandler: () => {
        // hide the next button till first data load
        let nextPage = document.getElementById("nextPage");
        nextPage.hidden = true;

        // setup the next-click listener
        nextPage.onclick = controller.onNextClickHandler;

        // finally trigger load and show people
        model.loadAndShowPeople();
    },

    onNextClickHandler: () => {
        model.loadAndShowPeople();
    },

    onHeaderClickHandler: (target) => {
        console.log(target);
        if (target.path[0]["innerHTML"] === "Name") {
            model.sortPeopleBy("name");
        } else if (target.path[0]["innerHTML"] === "Mass") {
            model.sortPeopleBy("mass");
        }
    }
}

let model = {
    people: [],
    nextUrl: "https://swapi.co/api/people/",
    sortOrder: {
        "name": -1,
        "mass": -1
    },

    getJson: (path) => fetch(path).then((response) => response.json()),

    getPeople: (url) => {
        // let people = [];
        return model.getJson(url)
            // .then(data => {
            //     model.nextUrl = data.next;

            //     let allRowsResolved = [];
            //     data.results.map((result, i) => {
            //         people[i] = {};
            //         people[i].name = result.name;
            //         people[i].mass = Number(result.mass);

            //         const promiseArr = result.starships.map(ship => model.getJson(ship)
            //             .then(shipData => shipData.name)
            //         );

            //         promiseArr.map(promise => allRowsResolved.push(promise));

            //         Promise.all(promiseArr)
            //             .then(shipNames => {
            //                 people[i].shipNames = shipNames.join(", ")
            //             });
            //     });

            //     return allRowsResolved;

            // })
            // .then(allRowsResolved => Promise.all(allRowsResolved).then(() => people))
            // model.getJson(url)
            .then(({ results }) => {
                const allPeoplePromises = results.map((person) => {
                    const shipNamesPromise = person.starships
                        .map(ship => model.getJson(ship)
                            .then(shipData => shipData.name)
                        );
                    const { name, mass } = person;
                    return new Promise((resolve) => {
                        Promise.all(shipNamesPromise).then(shipNames => ({
                            name,
                            mass,
                            shipNames
                        })).then(resolve)
                    })
                });
                return Promise.all(allPeoplePromises);
            })
    },

    loadAndShowPeople: () => {
        model.getPeople(model.nextUrl)
            .then((people) => {
                model.people = people;
                view.showPeople(people);
            })
            .then(view.enableNext)
    },

    sortPeopleBy: (key) => {
        if (model.people) {
            model.sortOrder[key] *= -1;
            model.people.sort((person1, person2) => {
                if (person1[key] > person2[key]) {
                    return model.sortOrder[key];
                } else if (person1[key] === person2[key]) {
                    return 0;
                } else {
                    return -model.sortOrder[key];
                }
            });

            view.showPeople(model.people);
        }
    }

}

let view = {
    setupHeader: (table) => {
        const headerRow = document.createElement("tr");
        ["Name", "Ship Names", "Mass"].map((key) => {
            const td = document.createElement("th");
            td.innerHTML = key;
            headerRow.appendChild(td);
        });
        table.appendChild(headerRow);
        headerRow.onclick = controller.onHeaderClickHandler;

    },

    showPeople: (people) => {
        let peopleTable = document.getElementById("peopleTable");

        // Clean old view
        let oldTables = peopleTable.getElementsByTagName("table");
        Array.prototype.map.call(oldTables, ((oldTable) => {
            peopleTable.removeChild(oldTable);
        }));

        // Prep to create new
        let containerTable = document.createElement("table");
        view.setupHeader(containerTable);

        people.map(value => {
            const tr = document.createElement("tr");

            ["name", "shipNames", "mass"].map((key) => {
                const td = document.createElement("td");
                td.innerHTML = value[key];
                tr.appendChild(td);
            });

            containerTable.appendChild(tr);
        });

        peopleTable.appendChild(containerTable);
    },

    enableNext: () => {
        document.getElementById("nextPage").hidden = false;
    }
}







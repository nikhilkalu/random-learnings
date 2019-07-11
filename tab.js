window.onload = (() => {

    // Set up the listener for the tab-list
    const tabList = document.getElementsByTagName("ul");
    tabList[0].onclick = controller.tabHeaderClickHandler;

    // populate the model's tab list
    const tabContainer = document.getElementById("tabs");
    tabBodies = tabContainer.getElementsByTagName("div");

    //Setup className for each tab & tab body
    const tabHeaders = tabList[0].getElementsByTagName("li");
    Array.prototype.map.call(tabHeaders, (tabHeader, i) => {
        const tabBody = tabBodies[i];
        model.tabs[i]= {tabHeader,tabBody};
        model.tabs[i].tabHeader.setAttribute("index",i);
    });

    //setup listener for tab selector
    const selectorButton = document.getElementsByClassName("selectorButton")[0];
    selectorButton.onclick = controller.selectorButtonHandler;

    // intiate the view
    view.initiateTabs();
});

const controller = {
    tabHeaderClickHandler: (event) => {
        model.updateActive(event.target.parentNode.getAttribute(index));
    },

    selectorButtonHandler: (event) => {
        console.log(event);
        //model.matchTabTitle();
    }
};

const model = {
    activeIndex: 0,
    tabs: [],
    updateActive: (selected) => {
        console.log("updateActive: selected is " + selected);
        if (model.activeIndex != selected) {
            model.activeIndex = selected;
            view.applyFilter(model.activeIndex);
        }
    },

    matchTabTitle: (title) => {
        return model.tabs.filter(tab => {
            const tabTitle = tab.getElementsByTagName("a").title;
            console.log(tabTitle);
            return (tabTitle == title);
        })
    }
};

const view = {
    hideTab: (index) => {
        model.tabs[index].tabBody.hidden = true;
    },

    unHideTab: (index) => {
        model.tabs[index].tabBody.hidden = false;
    },

    initiateTabs: () => {
        model.tabs.map((tab,i) => {
            tab.tabBody.hidden = (i != model.activeIndex);
        });
    }
};
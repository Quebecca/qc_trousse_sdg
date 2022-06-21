// run asynchronously
function deferInFn(fn) {
    if (typeof fn === "function") setTimeout(fn, 0);
}

/*
  Header
*/
(function () {
    "use strict";

    if (!("addEventListener" in window) || !document.documentElement.classList)
        return;

    var navPanelSelector = "ontario-application-navigation",
        isReadyClass = "ontario-application-navigation--is-ready",
        isActiveClass = "ontario-application-navigation--open",
        mobileMenuActiveClass = "ontario-application-navigation--open";

    var header = document.getElementById("ontario-application-header"),
        nav = document.getElementById(navPanelSelector),
        openBttnToggler = document.getElementById(
            "ontario-application-header-menu-toggler"
        ),
        closeBttnToggler = document.getElementById(
            "ontario-application-header-nav-toggler"
        ),
        body = document.getElementsByTagName("body")[0];

    if (!nav) return;

    var currentTogger = null,
        currentDomEl = null;

    function showNavPanel(navpanel) {
        body.classList.add(mobileMenuActiveClass);
        header.parentNode.classList.add(isActiveClass);
        navpanel.scrollTop = 0;

        navpanel.classList.add("ontario-navigation--open");

        addA11yVisiblity(navpanel, "application-header");

        focusUser({
            element: navpanel,
            callbackOnEscape: hideNavPanel,
        });
        deferInFn(unbindOpenBttnToggler);

        // bind clickables: document, closebttn - asynchronously
        deferInFn(bindDocumentKeydown);
        deferInFn(bindDocumentClick);
        deferInFn(bindCloseBttnToggler);
    }

    function hideNavPanel(navpanel, returnToToggler) {
        var navpanelDomEl = navpanel ? navpanel : currentDomEl;
        var returnFocusToToggler = returnToToggler !== undefined;

        body.classList.remove(mobileMenuActiveClass);
        header.parentNode.classList.remove(isActiveClass);

        var navigation = navpanelDomEl.querySelector(
            ".ontario-application-navigation"
        )
            ? navpanelDomEl.querySelector(".ontario-application-navigation")
            : navpanelDomEl;
        navpanelDomEl
            .querySelector(".ontario-application-navigation")
            .classList.remove("ontario-navigation--open");

        removeA11yVisiblity(navigation, "application-header");

        // unbind clickables: document, closebttn
        unbindCloseBttnToggler();
        unbindDocumentClick();
        unbindDocumentKeydown();

        bindOpenBttnToggler();

        // return focus to toggler
        if (returnFocusToToggler) {
            currentTogger.focus();
            currentTogger = null;
        }
    }

    function openMenu(e) {
        var navpanelId = e.currentTarget.getAttribute("aria-controls");
        var navpanel = document.getElementById(navpanelId);

        if (currentDomEl) {
            hideNavPanel(currentDomEl, false);
        }
        currentTogger = e.currentTarget;
        currentDomEl = document.querySelector(
            ".ontario-application-header__container"
        );
        showNavPanel(navpanel);
    }

    function closeMenu() {
        hideNavPanel(currentDomEl);
    }

    function onClickHandler(e) {
        var isNavPanel = e.target === currentDomEl;
        var isElementInsideNav = currentDomEl.contains(e.target);
        if (!isNavPanel && !isElementInsideNav) hideNavPanel();
    }

    function onKeyboardHandler(e) {
        if (e.key === "Escape" || e.keyCode === KEYCODE.ESCAPE) hideNavPanel();
    }

    //  bind-unbind events
    function bindOpenBttnToggler() {
        openBttnToggler.addEventListener("click", openMenu);
    }

    function unbindOpenBttnToggler() {
        openBttnToggler.removeEventListener("click", openMenu);
    }

    function bindCloseBttnToggler() {
        closeBttnToggler.addEventListener("click", closeMenu);
    }

    function unbindCloseBttnToggler() {
        closeBttnToggler.removeEventListener("click", closeMenu);
    }

    function bindDocumentClick() {
        document.addEventListener("click", onClickHandler);
    }

    function unbindDocumentClick() {
        document.removeEventListener("click", onClickHandler);
    }

    function bindDocumentKeydown() {
        document.addEventListener("keydown", onKeyboardHandler);
    }

    function unbindDocumentKeydown() {
        document.removeEventListener("keydown", onKeyboardHandler);
    }

    function init() {
        addA11y(nav);
        bindOpenBttnToggler(nav);
        nav.classList.add(isReadyClass);
    }

    init();
})();

/*
    Search
*/
(function () {
    "use strict";

    // review browser support
    if (!("addEventListener" in window) || !document.documentElement.classList)
        return;

    var header = document.getElementById("ontario-application-header");
})();

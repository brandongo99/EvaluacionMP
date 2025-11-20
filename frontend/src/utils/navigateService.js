let navigateFunction = null;

export const setNavigator = (navigate) => {
    navigateFunction = navigate;
}

export const navigateTo = (path) => {
    if (navigateFunction) {
        navigateFunction(path);
    }
}
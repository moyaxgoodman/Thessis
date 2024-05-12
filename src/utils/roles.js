export const isAdmin = (currentUser) => {
    return currentUser.role === 1;
};

export const isDonator = (currentUser) => {
    return currentUser.hasDonated === 1;
};


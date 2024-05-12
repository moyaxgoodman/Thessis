export const statusChecker = (currentUser) => {
    const currentUserStatus = currentUser.donationStatus; // Assuming currentUser.status is a string
    let statusClassName = "";

    switch (currentUserStatus) {
        case "Delivered":
            statusClassName = "bg-success text-white";
            break;
        case "Lost track":
            statusClassName = "bg-danger text-white";
            break;
        case "Processing":
            statusClassName = "bg-info text-white";
            break;
        case "Cancelled":
            statusClassName = "bg-danger text-white";
            break;
        case "Traveling":
            statusClassName = "bg-warning text-white";
            break;
        case "Ongoing":
            statusClassName = "bg-primary text-white";
            break;
        case "Progress":
            statusClassName = "bg-success text-white";
            break;
        case "In hub":
            statusClassName = "bg-secondary text-white";
            break;
        default:
            statusClassName = "";
    }

    return statusClassName;
};

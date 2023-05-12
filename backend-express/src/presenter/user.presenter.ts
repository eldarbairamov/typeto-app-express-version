import { User } from "../model";

export const userPresenter = ( document: User ) => {
    return {
        id: document.id,
        username: document.username,
        email: document.email,
        image: document.image
    };
};

export const allUserPresenter = ( documents: User[] ) => {
    return documents.map(doc => userPresenter(doc));
};


import"./config"
import "firebase/firestore"
import * as firebase from "firebase";

const collections = {
    favorites: "favorites"
}

const db = firebase.firestore();

export const read = () => {
    db.collection(collections.favorites)
    .get()
    .then(querySnapshot => {
        console.log(querySnapshot)
    })
    .catch(err => console.log(err))
}
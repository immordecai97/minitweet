
import { serverTimestamp } from "firebase/firestore";

export default class UserAccount {
    constructor({ uid = "", name = "", username = "", email = "", bio = null, photoURL = null, coverPhotoURL = null, followers = [], following = [], posts = [], createdAt = serverTimestamp(), updateAt = serverTimestamp() }) {
        //?--------------------------------------------------------------> Requeridos
        this.uid = uid;                     // --> uid requerido
        this.name = name;                   // --> name requerido
        this.username = username;           // --> username requerido
        this.email = email;                 // --> email requerido
        //?--------------------------------------------------------------> Opcionales
        this.bio = bio;                     // --> bio opcional
        this.photoURL = photoURL;           // --> photoURL opcional
        this.coverPhotoURL = coverPhotoURL; // --> coverPhotoURL opcional
        this.followers = followers;         // --> followers opcional
        this.following = following;         // --> following opcional
        this.posts = posts;                 // --> posts opcional
        this.createdAt = createdAt;         // --> createdAt opcional
        this.updateAt = updateAt;           // --> updateAt opcional
    }

    setUid(uid) {
        this.uid = uid;
    }

    setName(name) {
        this.name = name;
    }

    setUsername(username) {
        this.username = username;
    }

    setEmail(email) {
        this.email = email;
    }

    setBio(bio) {
        this.bio = bio;
    }

    setPhotoURL(photoURL) {
        this.photoURL = photoURL;
    }

    setCoverPhotoURL(coverPhotoURL) {
        this.coverPhotoURL = coverPhotoURL;
    }

    setFollowers(followers) {
        this.followers = followers;
    }

    setFollowing(following) {
        this.following = following;
    }

    setPosts(posts) {
        this.posts = posts;
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    setUpdateAt(updateAt) {
        this.updateAt = updateAt;
    }

    /**
     * Esta función filtra los metodos de la clase UserAccount y devuelve un objeto JSON
     * @returns {Object} user account data
     */
    toJSON() {
        return {
            uid: this.uid,
            name: this.name,
            username: this.username,
            email: this.email,
            bio: this.bio,
            photoURL: this.photoURL,
            coverPhotoURL: this.coverPhotoURL,
            followers: this.followers,
            following: this.following,
            posts: this.posts,
            createdAt: this.createdAt,
            updateAt: this.updateAt
        }
    }
}
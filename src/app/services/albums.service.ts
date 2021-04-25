import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Album } from '../interfaces/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  /**
   * Liste des albums
   */
  albums: Album[] = [];
  albumsToDelete = [];
  /**
   * Liste des albums
   */
  albumsKey = [];

  /**
   * RxJs le "sujet" (ce la chose ou on s'abonne)
   */
  albumsSubject = new Subject<Album[]>();

  albumsKeySubject = new Subject<any[]>();

  constructor() { }

  /**
   * Rend à la vue dès qu'il y a un changement
   */
  emitAlbums() {
    this.albumsSubject.next(this.albums);
    this.albumsKeySubject.next(this.albumsKey);
  }
  /**
   * Sauvegarde dans la base de donnée les albums
   */
  saveAlbums() {
    firebase.database().ref('albums').set(this.albums);
  }
  /**
   * Récupère toutes les albums de la base de donné et l'envoyes la vue
   */
  getAlbums(test = 'annee') {
    let i = 0;
    firebase.database().ref('albums').orderByChild(test).on('child_added', (data) => {
      this.albumsKey[i] = data.ref.key;
      this.albums[i++] = data.val() ? data.val() : [];
      this.emitAlbums();
    });
  }
  /**
   * Récupère un album de la base de donné et l'envoye la vue
   *  id
   */
  getSingleAlbum(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('albums/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }
        ).catch(
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  /**
   * Permet de créer un album dans la BD
   */
  createAlbum(album: Album) {
    album.prix_nom = album.prix + '_' + album.nom;
    this.albums.push(album);
    this.saveAlbums();
    this.emitAlbums();
  }
  /**
   * Permet de supprimer un album de la BD
   */
  deleteAlbum(index) {
    this.albums.splice(index, 1);
    this.saveAlbums();
    this.emitAlbums();
  }
  /**
   * Permet de modifier un album de la BD
   */
  updateAlbum(album: Album, index) {
    album.prix_nom = album.prix + '_' + album.nom;
    firebase.database().ref('/albums/' + index).update(album).catch(
      (error) => {
        console.error(error);
      }
    );
  }
  /**
   * Permet d'ajouter une image dans la BD
   *  file
   */
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const fileName = uniqueId + file.name;
        const upload = firebase.storage().ref().child('images/albums/' + fileName).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downloadUrl) => {
                resolve(downloadUrl);
              }
            );
          }
        );
      }
    );
  }
  /**
   * Permet de supprimer une image de la BD
   *  fileLink
   */
  removeFile(fileLink: string) {
    if (fileLink) {
      const storageRef = firebase.storage().refFromURL(fileLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      );
    }
  }

  deleteArtistAlbums(artistId) {
    console.log(artistId);
    // tslint:disable-next-line:radix
    firebase.database().ref('albums')?.orderByChild('artistId').equalTo(parseInt(artistId)).on('child_added', (data) => {
      const album = data.val();
      console.log(album);
      album.id = data.ref.key
      this.albumsToDelete[this.albumsToDelete.length] = album;
    })
    console.log(this.albumsToDelete);
    this.albumsToDelete.forEach(album => {
      album?.photos?.forEach(photo => {
        this.removeFile(photo);
      });
      // tslint:disable-next-line:radix
      this.deleteAlbum(parseInt(album?.id));
    });
  }
}

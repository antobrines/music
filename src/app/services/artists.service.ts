import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { Artist } from '../interfaces/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  /**
   * Liste des artists
   */
  artists: Artist[] = [];
  artistsKeys: any[] = [];
  albumsToDelete = [];
  /**
   * RxJs le "sujet" (ce la chose ou on s'abonne)
   */
  artistsSubject = new Subject<Artist[]>();
  artistsKeysSubject = new Subject<any[]>();

  constructor() { }

  /**
   * Rend à la vue dès qu'il y a un changement
   */
  emitArtists() {
    this.artistsSubject.next(this.artists);
    this.artistsKeysSubject.next(this.artistsKeys);
  }
  /**
   * Sauvegarde dans la base de donnée les artists
   */
  saveArtists() {
    firebase.database().ref('artists').set(this.artists);
  }
  /**
   * Récupère toutes les artists de la base de donné et l'envoyes la vue
   */
  getArtists(order = false) {
    let i = 0;
    firebase.database().ref('artists').orderByChild('nom').on('child_added', (data) => {
      this.artistsKeys[i] = data.ref.key;
      this.artists[this.artistsKeys[i++]] = data.val() ? data.val() : [];
      this.emitArtists();
    });
  }
  /**
   * Récupère un album de la base de donné et l'envoye la vue
   *  id
   */
  getSingleArtist(id) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('artists/' + id).once('value').then(
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
  createArtist(album: Artist) {
    this.artists.push(album);
    this.saveArtists();
    this.emitArtists();
  }
  /**
   * Permet de supprimer un album de la BD
   */
  deleteArtist(index) {
    this.artists.splice(index, 1);
    this.saveArtists();
    this.emitArtists();
  }
  /**
   * Permet de modifier un album de la BD
   */
  updateArtist(album: Artist, index) {
    firebase.database().ref('/artists/' + index).update(album).catch(
      (error) => {
        console.error(error);
      }
    );
  }
}

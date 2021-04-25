import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlbumsService } from '../services/albums.service';
import { Subscription } from 'rxjs';
import { ArtistsService } from './../services/artists.service';
import { Artist } from '../interfaces/artist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Liste des albums
   */
  albums = [];
  albumsKeys = [];

  artists = [];
  /**
   * Abonnement aux albums
   */
  albumsSubscription: Subscription;
  albumsKeysSubscription: Subscription;
  /**
   * Ajoute le service des albums
   *  albumsService
   */
  constructor(
    private albumsService: AlbumsService,
    private artistsService: ArtistsService
  ) { }
  /**
   * Récupère toutes les albums de la base de donné.
   */
  ngOnInit() {
    this.albumsSubscription = this.albumsService.albumsSubject.subscribe(
      (data: any) => {
        this.albums = data;
      }
    );
    this.albumsKeysSubscription = this.albumsService.albumsKeySubject.subscribe(
      (data: any[]) => {
        this.albumsKeys = data;
      }
    );

    this.artistsService.artistsSubject.subscribe(
      (data: Artist[]) => {
        this.artists = data;
      }
    );
    this.artistsService.getArtists();
    this.artistsService.emitArtists();
    this.albumsService.getAlbums('prix_nom');
    this.albumsService.emitAlbums();
  }
  /**
   * Permet de de désabonner lors de la fermeture de la page
   */
  ngOnDestroy() {
    this.albumsSubscription.unsubscribe();
  }

}

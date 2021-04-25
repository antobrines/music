import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlbumsService } from 'src/app/services/albums.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
import { Album } from '../../interfaces/album';
import { Artist } from '../../interfaces/artist';
import { ArtistsService } from '../../services/artists.service';

@Component({
  selector: 'app-admin-albums',
  templateUrl: './admin-albums.component.html',
  styleUrls: ['./admin-albums.component.css']
})
export class AdminAlbumsComponent implements OnInit {
  /**
   * Formulaire des propriétés
   */
  albumsForm: FormGroup;
  /**
   * Abonnement aux proprétés (RxJs)
   */
  albumsSubscription: Subscription;

  albumsKeysSubscription: Subscription;

  /**
   * Tableau des propriétés
   */
  albums: Album[] = [];

  albumsKey: any[] = [];
  /**
   * Sauvegarde de l'index à supprimer
   */
  indexToRemove;
  /**
   * Sauvegarde de l'index à mmodifier
   */
  indexToUpdate;
  /**
   * Permet de savoir si on est en mode édition ou non
   */
  editMode = false;
  /**
   * Permet de savoir si la photo est en train d'être uploader
   */
  photoUploading = false;
  /**
   * Permet de savoir si la photo à été uploader
   */
  photoUploaded = false;
  /**
   * Liste des photos uploader
   */
  photosAdded: any[] = [];

  artists: Artist[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private albumsService: AlbumsService,
    private artistsService: ArtistsService
  ) { }

  /**
   * Récupère toutes les albums de la base de donné en s'abonnant à l'aide de RxJs
   */
  ngOnInit() {
    this.initAlbumsForm();
    this.albumsSubscription = this.albumsService.albumsSubject.subscribe(
      (data: Album[]) => {
        this.albums = data;
      }
    );
    this.albumsKeysSubscription = this.albumsService.albumsKeySubject.subscribe(
      (data: any[]) => {
        this.albumsKey = data;
      }
    );
    this.artistsService.artistsSubject.subscribe(
      (data: Artist[]) => {
        this.artists = data;
      }
    );
    this.artistsService.getArtists();
    this.artistsService.emitArtists();
    this.albumsService.getAlbums();
    this.albumsService.emitAlbums();

  }
  /**
   * Initialise le formulaire des propriété
   */
  initAlbumsForm() {
    this.albumsForm = this.formBuilder.group({
      nom: ['', Validators.required],
      annee: ['', Validators.required],
      prix: ['', Validators.required],
      artistId: ['', Validators.required],
    });
  }
  /**
   * Ajoute ou modifie une property
   */
  onSubmitAlbumsForm() {
    const newAlbum: Album = this.albumsForm.value;
    newAlbum.photos = this.photosAdded ? this.photosAdded : [];
    if (this.editMode) {
      this.albumsService.updateAlbum(newAlbum, this.indexToUpdate);
    } else {
      this.albumsService.createAlbum(newAlbum);
    }
    this.albumsService.getAlbums();
    this.albumsService.emitAlbums();
    this.artistsService.getArtists();
    this.artistsService.emitArtists();
    $('#albumsFormModal').modal('hide');
  }
  /**
   * Permet de reset le formulaire des albums
   */
  resetForm() {
    this.editMode = false;
    this.albumsForm.reset();
    this.photosAdded = [];
  }
  /**
   * Permet d'initialiser l'index à supprimer lors de la selecter d'une property
   *  index
   */
  onDeleteAlbum(index) {
    $('#deleteAlbumModal').modal('show');
    this.indexToRemove = this.albumsKey[index];
  }
  /**
   * Supprime de la base de donné une property
   */
  onConfirmDeleteAlbum() {
    this.albums[this.indexToRemove]?.photos?.forEach(
      (photo) => {
        this.albumsService.removeFile(photo);
      }
    );
    this.albumsService.deleteAlbum(this.indexToRemove);
    this.albumsService.getAlbums();
    this.albumsService.emitAlbums();
    $('#deleteAlbumModal').modal('hide');
  }
  /**
   * Permet de savoir si on est en mode édition ou non et si on l'est, cela ajoute directement les valeurs de la bonne preperty
   *  property
   */
  onEditAlbum(property: Album, i) {
    this.editMode = true;
    $('#albumsFormModal').modal('show');
    this.albumsForm.get('nom').setValue(property.nom);
    this.albumsForm.get('annee').setValue(property.annee);
    this.albumsForm.get('prix').setValue(property.prix);
    this.albumsForm.get('artistId').setValue(property.artistId);
    this.photosAdded = property.photos ? property.photos : [];
    this.indexToUpdate = this.albumsKey[i];
  }
  /**
   * Permet d'ajouter une image lors d'un upload de fichier
   *  event
   */
  onUploadFile(event) {
    this.photoUploading = true;
    this.albumsService.uploadFile(event.target.files[0]).then(
      (url: string) => {
        this.photosAdded.push(url);
        this.photoUploading = false;
        this.photoUploaded = true;
        setTimeout(() => {
          this.photoUploaded = false;
        }, 5000);
      }
    );
  }
  /**
   * Supprime une image
   *  index
   */
  onRemoveAddedPhoto(index) {
    this.albumsService.removeFile(this.photosAdded[index]);
    this.photosAdded.splice(index, 1);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist';
import { ArtistsService } from 'src/app/services/artists.service';
import * as $ from 'jquery';
import { AlbumsService } from 'src/app/services/albums.service';
@Component({
  selector: 'app-admin-artists',
  templateUrl: './admin-artists.component.html',
  styleUrls: ['./admin-artists.component.css']
})
export class AdminArtistsComponent implements OnInit {

  /**
   * Formulaire des propriétés
   */
  artistsForm: FormGroup;
  /**
   * Abonnement aux proprétés (RxJs)
   */
  artistsSubscription: Subscription;

  artistsKeysSubscription: Subscription;
  /**
   * Tableau des propriétés
   */
  artists: Artist[] = [];
  artistsKey = [];

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

  types = [
    {
      nom: 'Groupe',
      value: 'G'
    },
    {
      nom: 'Solo',
      value: 'S'
    }
  ];

  pays = [
    {
      nom: 'France',
      value: 'FRA'
    },
    {
      nom: 'Angleterre',
      value: 'ANG'
    },
    {
      nom: 'Canada',
      value: 'CAN'
    },
    {
      nom: 'Etats-unis',
      value: 'USA'
    }
  ];

  genres = [
    {
      nom: 'Jazz',
      value: 'JAZ'
    },
    {
      nom: 'Roc & Roll',
      value: 'ROC'
    },
    {
      nom: 'Pop',
      value: 'POP'
    },
    {
      nom: 'Métal',
      value: 'HME'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService
  ) { }

  /**
   * Récupère toutes les artists de la base de donné en s'abonnant à l'aide de RxJs
   */
  ngOnInit() {
    this.initArtistsForm();
    this.artistsSubscription = this.artistsService.artistsSubject.subscribe(
      (data: Artist[]) => {
        this.artists = data;
      }
    );
    this.artistsKeysSubscription = this.artistsService.artistsKeysSubject.subscribe(
      (data: any[]) => {
        this.artistsKey = data;
        console.log(this.artistsKey);
      }
    );
    this.artistsService.getArtists();
    this.artistsService.emitArtists();
  }
  /**
   * Initialise le formulaire des propriété
   */
  initArtistsForm() {
    this.artistsForm = this.formBuilder.group({
      nom: ['', Validators.required],
      genre: ['', Validators.required],
      type: ['', Validators.required],
      pays: ['', Validators.required],
    });
  }
  /**
   * Ajoute ou modifie une artist
   */
  onSubmitArtistsForm() {
    const newArtist: Artist = this.artistsForm.value;
    if (this.editMode) {
      this.artistsService.updateArtist(newArtist, this.indexToUpdate);
    } else {
      this.artistsService.createArtist(newArtist);
    }
    this.artistsService.getArtists();
    this.artistsService.emitArtists();
    $('#artistsFormModal').modal('hide');
  }
  /**
   * Permet de reset le formulaire des artists
   */
  resetForm() {
    this.editMode = false;
    this.artistsForm.reset();
  }
  /**
   * Permet d'initialiser l'index à supprimer lors de la selecter d'une artist
   *  index
   */
  onDeleteArtist(index) {
    $('#deleteArtistModal').modal('show');
    this.indexToRemove = this.artistsKey[index];
  }
  /**
   * Supprime de la base de donné une artist
   */
  onConfirmDeleteArtist() {
    // Delete albums later
    this.albumsService.deleteArtistAlbums(this.indexToRemove);
    this.artistsService.deleteArtist(this.indexToRemove);
    $('#deleteArtistModal').modal('hide');
  }
  /**
   * Permet de savoir si on est en mode édition ou non et si on l'est, cela ajoute directement les valeurs de la bonne preperty
   *  artist
   */
  onEditArtist(artist: Artist, i) {
    this.editMode = true;
    $('#artistsFormModal').modal('show');
    this.artistsForm.get('nom').setValue(artist.nom);
    this.artistsForm.get('genre').setValue(artist.genre);
    this.artistsForm.get('pays').setValue(artist.pays);
    this.artistsForm.get('type').setValue(artist.type);
    this.indexToUpdate = this.artistsKey[i];
  }

}

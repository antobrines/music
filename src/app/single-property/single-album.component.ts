import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../services/albums.service';
import { Album } from '../interfaces/album';
import { Artist } from './../interfaces/artist';
import { ArtistsService } from 'src/app/services/artists.service';

@Component({
  selector: 'app-single-album',
  templateUrl: './single-album.component.html',
  styleUrls: ['./single-album.component.css']
})
export class SingleAlbumComponent implements OnInit {

  album: Album;
  artist: Artist;

  constructor(
    private route: ActivatedRoute,
    private albumsService: AlbumsService,
    private artistsService: ArtistsService
  ) { }
  /**
   * Récupère une seule album
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.albumsService.getSingleAlbum(id).then(
      (album: Album) => {
        this.album = album;
        this.artistsService.getSingleArtist(album.artistId).then((artist: Artist) => {
          this.artist = artist;
        }).catch((error) => { console.log(error); })
      }
    ).catch((error) => { console.error(error); });
  }

}

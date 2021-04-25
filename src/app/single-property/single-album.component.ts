import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../services/albums.service';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-single-album',
  templateUrl: './single-album.component.html',
  styleUrls: ['./single-album.component.css']
})
export class SingleAlbumComponent implements OnInit {

  album: Album;

  constructor(
    private route: ActivatedRoute,
    private albumsService: AlbumsService
  ) { }
  /**
   * Récupère une seule album
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.albumsService.getSingleAlbum(id).then(
      (album: Album) => {
        this.album = album;
      }
    ).catch(
      (error) => {
        console.error(error);
      }
    );
  }

}

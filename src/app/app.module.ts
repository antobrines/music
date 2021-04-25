import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminAlbumsComponent } from './admin/admin-albums/admin-albums.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SingleAlbumComponent } from './single-property/single-album.component';
import { AdminArtistsComponent } from './admin/admin-artists/admin-artists.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AdminDashboardComponent,
    AdminAlbumsComponent,
    SigninComponent,
    SingleAlbumComponent,
    AdminArtistsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Movies } from './pages/movies/movies';
import { MovieDetail } from './pages/movie-detail/movie-detail';
import { Seats } from './pages/seats/seats';
import { Checkout } from './pages/checkout/checkout';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { UserProfile } from './pages/user-profile/user-profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path : "",
    redirectTo : "home",
    pathMatch : "full"
  },
  {
    path : "home",
    component : Home
  },
  {
    path : "movies",
    component : Movies
  },
  {
    path : "movie/:movieId",
    component : MovieDetail
  },
  {
    path : "seats/:movieId/:showTimeId",
    component : Seats
  },
  {
    path : "checkout/:movieId/:showTimeId/:seatId",
    component : Checkout
  },
  {
    path : "sign-in",
    component : Signin
  },
  {
    path : "sign-up",
    component : Signup
  },
  {
    path : "profile",
    component : UserProfile
  },
  {
    path : "admin-panel",
    component : AdminPanel
  },
  {
    path : "**",
    component : NotFound
  }
];

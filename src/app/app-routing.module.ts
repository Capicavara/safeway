import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'socorro', loadChildren: './socorro/socorro.module#SocorroPageModule' },
  { path: 'cad-email', loadChildren: './pages/cad-email/cad-email.module#CadEmailPageModule' },
  { path: 'cad-foto', loadChildren: './pages/cad-foto/cad-foto.module#CadFotoPageModule' },
  { path: 'cadastro', loadChildren: './pages/cadastro/cadastro.module#CadastroPageModule' },
  { path: 'map', loadChildren: './pages/map/map.module#MapPageModule' },
  { path: 'perfil', loadChildren: './pages/perfil/perfil.module#PerfilPageModule' },
  { path: 'dados', loadChildren: './pages/dados/dados.module#DadosPageModule' },
  { path: 'convite', loadChildren: './pages/convite/convite.module#ConvitePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

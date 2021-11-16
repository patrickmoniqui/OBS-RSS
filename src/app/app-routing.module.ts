import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RssComponent } from './rss/rss.component';
import { InlineTextComponent } from './rss/inline-text/inline-text.component';

const routes: Routes = [
  {path:'rss', component:RssComponent},
  {path:'rss/inline-text', component:InlineTextComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

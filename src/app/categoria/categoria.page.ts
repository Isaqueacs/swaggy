import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Produto } from '../model/produto';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  categoria: string;
  listaDeProdutos : Produto[] = [];

  constructor(public activatedRoute: ActivatedRoute) {

    this.categoria = this.activatedRoute.snapshot.paramMap.get('categoria');
    
  }

  ngOnInit() {
    this.obterCategoria();
  }

  obterCategoria() {
    
    var ref = firebase.firestore().collection('produto').where("categoria","==",this.categoria)
    ref.get().then(query => {
      query.forEach(doc => {
        let c = new Produto();
        c.setDados(doc.data());
        c.id = doc.id;
        this.listaDeProdutos.push(c);
        
      });
      
    }).catch(err => {
      console.log(err);
    })

}
}

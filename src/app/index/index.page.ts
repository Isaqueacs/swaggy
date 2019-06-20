import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, LoadingController } from '@ionic/angular';
import { Produto } from '../model/produto';
import * as firebase from 'firebase';
import { StorageService } from '../service/storage.service';
import { Pedido } from '../model/pedido';
import { FormGroup } from '@angular/forms';
import { Item } from '../model/item';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  listaDeProdutos: Produto[] = [];
  id: string;


  pedido : Pedido = new Pedido();
  formGroup : FormGroup;

  constructor(public loadingController: LoadingController,
              public storageServ : StorageService,
              public router : Router) { }

  ngOnInit() {
    this.getList();
  }


  att(nomeCategoria : string){
    this.router.navigate(['/categoria', {'categoria' : nomeCategoria}]);
  }

  slideOpts = {
    initialSlide: 0,
    speed: 20,
    autoplay: true,
    loop: true,
    slidesPerView: 1,
  };

  slideOpts1 = {
    initialSlide: 0,
    speed: 20,
    autoplay: false,
    loop: false,
    slidesPerView: 3,
  }

  carrinho(){
    this.router.navigate(['carrinho']);
  }

  addCarrinho(produto : Produto){
    this.pedido = this.storageServ.getCart();
    let add = true;

    let i = new Item();
    i.produto = produto;
    i.quantidade = 1;

    if(this.pedido==null){ // Caso pedido esteja vazio
      this.pedido = new Pedido(); //cria umm novo pedido  
      this.pedido.itens = []; //cria uma lista de itens
    }

    this.pedido.itens.forEach(p => {
      if(p.produto.id == produto.id){
        add = false;
      }
    });

    if(add==true) this.pedido.itens.push(i);

    this.storageServ.setCart(this.pedido);
  }

  getList() {
    var ref = firebase.firestore().collection("produto");
    ref.get().then(query => {
      query.forEach(doc => {
        let c = new Produto();
        c.setDados(doc.data());
        c.id = doc.id;


        let ref = firebase.storage().ref().child(`produtos/${doc.id}.jpg`).getDownloadURL().then(url => {
          c.foto = url;

          this.listaDeProdutos.push(c);
        })
      });
      console.log(this.listaDeProdutos)
      this.loadingController.dismiss();
    });
  };
}
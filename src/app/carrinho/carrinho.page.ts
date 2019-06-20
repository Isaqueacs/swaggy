import { Pedido } from './../model/pedido';
import { StorageService } from './../service/storage.service';
import { Produto } from './../model/produto';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {

    pedido : Pedido = new Pedido();
    total : number = 0;

  constructor(public storageServ : StorageService) {
  
   }

  ngOnInit() {
    this.pedido = this.storageServ.getCart();

    this.pedido.itens.forEach(item=>{
      
      firebase.storage().ref().child(`produtos/${item.produto.id}.jpg`).getDownloadURL().then(url => {
        item.produto.foto = url;
      })

      this.total += parseFloat(item.produto.preco);

    })

    console.log(this.pedido);
  }



  removeCar(produto : Produto){
    this.storageServ.setRemoveCart(produto);
    this.pedido = this.storageServ.getCart();
  }
}

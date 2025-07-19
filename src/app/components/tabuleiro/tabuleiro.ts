import { Component } from '@angular/core';
import { Vertice } from '../../interfaces/vertice';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabuleiro',
  imports: [CommonModule, RouterModule],
  templateUrl: './tabuleiro.html',
  styleUrl: './tabuleiro.css'
})
export class Tabuleiro {

  constructor(){
    this.gerarVertices();
    console.log(this.listaDeVertices);
    this.iniciarCronometro();
    this.iniciarTurno();
  }

  tigreVenceu:boolean = false;
  loboVenceu:boolean = false;

  mapaMovimentoPadrao: { [key: string]: string[] } = {
      a1: ['a2', 'b1', 'b2'],
      a2: ['a1', 'a2', 'b1', 'b2', 'b3'],
      a3: ['a2', 'a4', 'b2', 'b3', 'b4'],
      a4: ['a3', 'a5', 'b3', 'b4', 'b5'],
      a5: ['a4', 'b4', 'b5'],

      b1: ['a1', 'a2', 'b2', 'c1', 'c2'],
      b2: ['a1', 'a2', 'a3', 'b1', 'b3', 'c1', 'c2', 'c3'],
      b3: ['a2', 'a3', 'a4', 'b2', 'b4', 'c2', 'c3', 'c4'],
      b4: ['a3', 'a4', 'a5', 'b3', 'b5', 'c3', 'c4', 'c5'],
      b5: ['a4', 'a5', 'b4', 'c4', 'c5'],

      c1: ['b1', 'b2', 'c2', 'd1', 'd2'],
      c2: ['b1', 'b2', 'b3', 'c1', 'c3', 'd1', 'd2', 'd3'],
      c3: ['b2', 'b3', 'b4', 'c2', 'c4', 'd2', 'd3', 'd4'],
      c4: ['b3', 'b4', 'b5', 'c3', 'c5', 'd3', 'd4', 'd5'],
      c5: ['b4', 'b5', 'c4', 'd4', 'd5'],

      d1: ['c1', 'c2', 'd2', 'e1', 'e2'],
      d2: ['c1', 'c2', 'c3', 'd1', 'd3', 'e1', 'e2', 'e3'],
      d3: ['c2', 'c3', 'c4', 'd2', 'd4', 'e2', 'e3', 'e4'],
      d4: ['c3', 'c4', 'c5', 'd3', 'd5', 'e3', 'e4', 'e5'],
      d5: ['c4', 'c5', 'd4', 'e4', 'e5'],

      e1: ['d1', 'd2', 'e2'],
      e2: ['d1', 'd2', 'd3', 'e1', 'e3'],
      e3: ['d2', 'd3', 'd4', 'e2', 'e4', 'f1', 'f2', 'f3'],
      e4: ['d3', 'd4', 'd5', 'e3', 'e5'],
      e5: ['d4', 'd5', 'e4'],

      f1: ['e3', 'f2', 'g1'],
      f2: ['e3', 'f1', 'f3', 'g2'],
      f3: ['e3', 'f2', 'g3'],

      g1: ['f1', 'g2'],
      g2: ['f2', 'g1', 'g3'],
      g3: ['f3', 'g2'],
    };

    mapaMovimentoAtaquetigre: { [key: string]: string[] } = {
      a1: ['a3', 'c1', 'c3'],
      a2: ['a4', 'c2', 'c4'],
      a3: ['a1', 'a5', 'c1', 'c3', 'c5'],
      a4: ['a2', 'c2', 'c4'],
      a5: ['a3', 'c3', 'c5'],

      b1: ['b3', 'd1', 'd3'],
      b2: ['b4', 'd2', 'd4'],
      b3: ['b1', 'b5', 'd1', 'd3', 'd5'],
      b4: ['b2', 'd2', 'd4'],
      b5: ['b3', 'd3', 'd5'],

      c1: ['a1', 'a3', 'c3', 'e1', 'e3'],
      c2: ['a2', 'a4', 'c4', 'e2', 'e4'],
      c3: ['a1', 'a3', 'a5', 'c1', 'c5', 'e1', 'e3', 'e5'],
      c4: ['a2', 'a4', 'c2', 'e2', 'e4'],
      c5: ['a3', 'a5', 'c3', 'e3', 'e5'],

      d1: ['b1', 'b3', 'd3'],
      d2: ['b2', 'b4', 'd4'],
      d3: ['b1', 'b3', 'b5', 'd1', 'd5', 'f2'],
      d4: ['b2', 'b4', 'd2'],
      d5: ['b3', 'b5', 'd3'],

      e1: ['c1', 'c3', 'e3'],
      e2: ['c2', 'c4', 'e4'],
      e3: ['c1', 'c3', 'c5', 'e1', 'e5', 'g2'],
      e4: ['c2', 'c4', 'e2'],
      e5: ['c3', 'c5', 'e3'],

      f1: ['d4', 'f3'],
      f2: ['d3'],
      f3: ['d2', 'f1'],

      g1: ['e3', 'g3'],
      g2: ['e3'],
      g3: ['e3', 'g1'],
    };

    mapaDeMortesPossiveis: { [key: string]: string } = {
      a1a3: 'a2',
      a1c1: 'b1',
      a1c3: 'b2',

      a2a4: 'a3',
      a2c2: 'b2',
      a2c4: 'b3',

      a3a1: 'a2',
      a3a5: 'a4',
      a3c1: 'b2',
      a3c3: 'b3',
      a3c5: 'b4',

      a4a2: 'a3',
      a4c2: 'b3',
      a4c4: 'b4',

      a5a3: 'a4',
      a5c3: 'b4',
      a5c5: 'b5',

      b1b3: 'b2',
      b1d1: 'c1',
      b1d3: 'c2',

      b2b4: 'b3',
      b2d2: 'c2',
      b2d4: 'c3',

      b3b1: 'b2',
      b3b5: 'b4',
      b3d1: 'c2',
      b3d3: 'c3',
      b3d5: 'c4',

      b4b2: 'b3',
      b4d2: 'c3',
      b4d4: 'c4',

      b5b3: 'b4',
      b5d3: 'c4',
      b5d5: 'c5',

      c1a1: 'b1',
      c1a3: 'b2',
      c1c3: 'c2',
      c1e1: 'd1',
      c1e3: 'd2',

      c2a2: 'b2',
      c2a4: 'b3',
      c2c4: 'c3',
      c2e2: 'd2',
      c2e4: 'd3',

      c3a1: 'b2',
      c3a3: 'b3',
      c3a5: 'b4',
      c3c1: 'c2',
      c3c5: 'c4',
      c3e1: 'd2',
      c3e3: 'd3',
      c3e5: 'd4',

      c4a2: 'b3',
      c4a4: 'b4',
      c4c2: 'c3',
      c4e2: 'd3',
      c4e4: 'd4',

      c5a3: 'b4',
      c5a5: 'b5',
      c5c3: 'c4',
      c5e3: 'd4',
      c5e5: 'd5',

      d1b1: 'c1',
      d1b3: 'c2',
      d1d3: 'd2',

      
      d2b2: 'c2',
      d2b4: 'c3',
      d2d4: 'd3',
      d2f3: 'e3',


      d3b1: 'c2',
      d3b3: 'c3',
      d3b5: 'c4',
      d3d1: 'd2',
      d3d5: 'd4',
      d3f2: 'e3',

      d4b2: 'c3',
      d4b4: 'c4',
      d4d2: 'd3',
      d4f1: 'e3',

      d5b3: 'c4',
      d5b5: 'c5',
      d5d3: 'd4',

      e1c1: 'd1',
      e1c3: 'd2',
      e1e3: 'e2',

      e2c2: 'd2',
      e2c4: 'd3',
      e2e4: 'e3',

      e3c1: 'd2',
      e3c3: 'd3',
      e3c5: 'd4',
      e3e1: 'e2',
      e3e5: 'e4',
      e3g2: 'f2',

      e4c2: 'd3',
      e4c4: 'd4',
      e4e2: 'e3',

      e5c3: 'd4',
      e5c5: 'd5',
      e5e3: 'e4',

      f1d4: 'e3',
      f1f3: 'f2',

      f2d3: 'e3',

      f3d2: 'e3',
      f3f1: 'f2',

      g1e3: 'f1',
      g1g3: 'g2',

      g2e3: 'f2',

      g3e3: 'f3',
      g3g1: 'g2'
    }

    listaDeVertices: Vertice[] = [];

    gerarVertices(){
      //gera o mapa de vértices com as posições iniciais das peças
      let index = 0
      for (const nomeChave in this.mapaMovimentoPadrao) {
        //caso seja lobo
        if((index>=0 && index<=11) || index==13 || index==14){
          this.listaDeVertices.push({
          identificador: nomeChave,
          ocupado: true,
          lobo:true
        });
        }
        //gera a onça
        else if(index==12){
          this.listaDeVertices.push({
          identificador: nomeChave,
          ocupado: true,
          lobo:false
        });
        }
        //gera os demais vértices vazios
        else{
          this.listaDeVertices.push({
          identificador: nomeChave,
          ocupado: false,
          lobo:true
        });
        }
        index++;
     }
     
    }

    //variáveis de controle da jogada atual
    verticeAtual!:Vertice | null;
    verticeFuturo!:Vertice | null;
    vezDoLobo:boolean = true;

    selecionarVertice(vertice:Vertice){
      console.log(vertice);
      //impede selecionar o vértice caso o jogador que controla os lobos tente mover a onça
      if(this.vezDoLobo && vertice.lobo == false){
        return;
      }
      //impede selecionar o vértice caso o jogador que controla a onça tente mover um lobo
      if(!this.vezDoLobo && vertice.lobo ==true && vertice.ocupado == true){
        return;
      }
      //verifica se é o primeiro vertice a ser selecionado (verticeAtual)
      if(this.verticeAtual == null){
         //verifica se o vértice selecionado está ocupado e finaliza a função
        if(vertice.ocupado == false){
            return;
          }
        //se não estiver ocupado ele seleciona o vértice
        this.verticeAtual = vertice;
      }
      //verifica se o verticeAtual é igual ao vertice clicado para remover a seleção
      else if(this.verticeAtual == vertice){
        this.verticeAtual = null;
      }
      //verifica se o verticeFuturo é igual ao vertice clicado para remover a seleção
      else if(this.verticeFuturo == vertice){
        this.verticeFuturo = null;
      }
      else{
        //atribui o vértice clicado ao vértice futuro
        this.verticeFuturo = vertice;
      }
      //verifica se os dois vértices estão selecionados para chamar a realização do movimento
      if(this.verticeAtual && this.verticeFuturo){
        this.movimentar();
        //retira a seleção dos vértices após a jogada
        this.verticeAtual = null;
        this.verticeFuturo = null;
        //verifica se após a jogada algum dos jogadores venceu
        this.verificarVitoriatigre();
        this.verificarVitorialobo();
      }
    }


    movimentar(){
      //verifica se o vértice futuro está ocupado e impede o movimento
      if(this.verticeFuturo!.ocupado){
          return;
        }
      //mapa de movimentos possíveis
      const movimentosPermitidos = this.mapaMovimentoPadrao[this.verticeAtual!.identificador];
      //verifica se no mapa de movimento padrão há a possibilidade de movimentar
      if(movimentosPermitidos.includes(this.verticeFuturo!.identificador)){
        const indexVerticeAtual = this.listaDeVertices.findIndex(
            vertice => vertice.identificador === this.verticeAtual!.identificador
        );
        const indexVerticeFuturo = this.listaDeVertices.findIndex(
          vertice => vertice.identificador === this.verticeFuturo!.identificador
        );
        //troca os valores para realizar a movimentação no tabuleiro
          this.listaDeVertices[indexVerticeAtual].ocupado = false;
          this.listaDeVertices[indexVerticeAtual].lobo = true;
          if(this.vezDoLobo){
            this.listaDeVertices[indexVerticeFuturo].lobo = true;
          }
          else{
            this.listaDeVertices[indexVerticeFuturo].lobo = false;
          }
            this.listaDeVertices[indexVerticeFuturo].ocupado = true;
            this.vezDoLobo = !this.vezDoLobo;
      }
      //caso não há a possibilidade de movimentar no primeiro mapa, verifica se a jogada é da onça e se há possibilidade de movimento no mapa de ataque 
      else{
        if(!this.vezDoLobo){
          const movimentosPermitidos = this.mapaMovimentoAtaquetigre[this.verticeAtual!.identificador];
          if(movimentosPermitidos.includes(this.verticeFuturo!.identificador)){
            //ctigretenação dos valores das chaves dos vértices atual e futuro
            const chaveDoAtaque = this.verticeAtual!.identificador + this.verticeFuturo!.identificador;
            //busca no mapa de mortes possíveis a posição no tabuleiro da peça atacada
            const verticeAtacado = this.buscarChave(chaveDoAtaque);
            //procura o indice do vértice atacado
            const indexVerticeAtacado = this.listaDeVertices.findIndex(
              vertice => vertice.identificador === verticeAtacado
            );
            if(this.listaDeVertices[indexVerticeAtacado].ocupado == true){
              this.listaDeVertices[indexVerticeAtacado].ocupado = false;
              //mover a onça de lugar
              const indexVerticeFuturo = this.listaDeVertices.findIndex(
                  vertice => vertice.identificador === this.verticeFuturo!.identificador
               );
               this.listaDeVertices[indexVerticeFuturo].lobo = false;
               this.listaDeVertices[indexVerticeFuturo].ocupado = true;
               const indexVerticeAtual = this.listaDeVertices.findIndex(
                  vertice => vertice.identificador === this.verticeAtual!.identificador
               );
               this.listaDeVertices[indexVerticeAtual].lobo = true;
               this.listaDeVertices[indexVerticeAtual].ocupado = false;
               this.vezDoLobo = !this.vezDoLobo;
            }
          }
        }
      }
    }

    verificaSePodeMover(origem: string, destino: string) {
      const movimentosPermitidos = this.mapaMovimentoPadrao[this.verticeAtual!.identificador];
      if (!movimentosPermitidos) {

        
      }
    }

    verificarVitoriatigre(){
      let ocupados = 0;
      for (const vertice of this.listaDeVertices) {
        if (vertice.ocupado) {
          ocupados++;
        }
      }
      if(ocupados==1){
        this.tigreVenceu = true;
      }
    }

    verificarVitorialobo(){
        //encontra onde a onça está posicionada no tabuleiro
        const indexVerticetigre = this.listaDeVertices.findIndex(
                  vertice => vertice.lobo === false
        );
        this.listaDeVertices[indexVerticetigre].identificador;
        //guarda quais os movimentos que a onça pode realizar
        let movimentosPermitidos: string[] = this.mapaMovimentoPadrao[this.listaDeVertices[indexVerticetigre].identificador];
        
        let ePossivelMovimentar = false;

        //passa por cada vértice que é possivel movimentar para ver se está ocupado
        for (const identificador of movimentosPermitidos) {
          const indexVertice = this.listaDeVertices.findIndex(
                  vertice => vertice.identificador === identificador
          );
        //se houver um vértice vazio então é possível movimentar a onça e os lobos não ganharam
        if(this.listaDeVertices[indexVertice].ocupado==false){
          ePossivelMovimentar = true;
          return;
        }
        }
        this.loboVenceu = true;
    }

      buscarChave(chave: string): string | undefined {
          return this.mapaDeMortesPossiveis[chave];
      }

  segundos: number = 1000;
  intervalo: any;

  iniciarCronometro(){
    //define um intervalo de 1010 segundos executando uma função
    this.intervalo = setInterval(() => {
        this.segundos--;
        //se os segundos chegarem a 0 os lobos ganham
        if(this.segundos==0){
          this.loboVenceu = true;
        }
      }, 1000);
  }

  //controla o valor em segundos de cada turno dos jogadores
  segundosTurno: number = 0;

  //método com a lógica de mudança de turno a cada 10s ou após a jogada
  iniciarTurno(){
    let controleDeJogada = this.vezDoLobo;
    this.intervalo = setInterval(() => {
      if(controleDeJogada !== this.vezDoLobo){
        controleDeJogada=this.vezDoLobo;
        clearInterval(this.intervalo);// Cancela o setInterval
        this.iniciarTurno();
        console.log("troca");
        this.verticeAtual = null;
        this.segundosTurno = 0;
      }
      else if(this.segundosTurno == 10){
        this.vezDoLobo = !this.vezDoLobo;
        controleDeJogada=this.vezDoLobo;
        this.verticeAtual = null;
        console.log("troca");
        this.segundosTurno = 0;
        clearInterval(this.intervalo); // Cancela o setInterval
        this.iniciarTurno();
      }
      this.segundosTurno++;
      }, 1000);
  }
}
